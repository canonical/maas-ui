import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikForm from "@/app/base/components/FormikForm";
import type { APIError } from "@/app/base/types";
import {
  getDownloadableImages,
  getSyncedImages,
} from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesForm";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import {
  BootResourceSourceType,
  type BootResourceUbuntuSource,
} from "@/app/store/bootresource/types";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const ChangeSourceSchema = Yup.object()
  .shape({
    keyring_data: Yup.string(),
    keyring_filename: Yup.string(),
    source_type: Yup.string().required("Source type is required"),
    url: Yup.string().when("source_type", {
      is: (val: string) => val === BootResourceSourceType.CUSTOM,
      then: Yup.string().required("URL is required for custom sources"),
    }),
    autoSync: Yup.boolean(),
  })
  .defined();

export type ChangeSourceValues = {
  keyring_data: string;
  keyring_filename: string;
  source_type: BootResourceSourceType;
  url: string;
  autoSync: boolean;
};

const ChangeSource = (): ReactElement => {
  const dispatch = useDispatch();
  const resources = useSelector(bootResourceSelectors.resources);
  const sources = useSelector(bootResourceSelectors.ubuntu);
  const otherImages = useSelector(bootResourceSelectors.otherImages);
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const pollingSources = useSelector(bootResourceSelectors.polling);
  const errors = useSelector(bootResourceSelectors.fetchError);
  const saving = useSelector(bootResourceSelectors.fetching);
  const previousSaving = usePrevious(saving);
  const cleanup = useCallback(() => {
    configActions.cleanup();
    return bootResourceActions.cleanup();
  }, []);
  const saved = !saving && previousSaving && !errors;

  const canChangeSource = resources.every((resource) => !resource.downloading);
  const source: BootResourceUbuntuSource =
    sources !== null &&
    sources.sources[0].source_type === BootResourceSourceType.CUSTOM
      ? sources.sources[0]
      : {
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.MAAS_IO,
          url: "",
        };

  const [ubuntuSystems, setUbuntuSystems] = useState<
    {
      arches: string[];
      osystem: string;
      release: string;
    }[]
  >([]);
  const [otherSystems, setOtherSystems] = useState<
    {
      arch: string;
      os: string;
      release: string;
      subArch: string;
    }[]
  >([]);

  useEffect(() => {
    if (sources && resources && otherImages) {
      const downloadableImages = getDownloadableImages(
        sources.releases,
        sources.arches,
        otherImages
      );
      const syncedImages = getSyncedImages(downloadableImages, resources);

      const ubuntuList: {
        arches: string[];
        osystem: string;
        release: string;
      }[] = [];
      const otherList: {
        arch: string;
        os: string;
        release: string;
        subArch: string;
      }[] = [];
      Object.entries(
        syncedImages as Record<string, { label: string; value: string }[]>
      ).forEach(([key, images]) => {
        const [osystem] = key.split("-", 1);

        if (osystem === "Ubuntu" || osystem === "Centos") {
          const arches = images.map((image) => image.label);
          const release = images[0].value.split("-")[1];
          ubuntuList.push({
            arches,
            osystem: osystem.toLowerCase(),
            release,
          });
        } else {
          const [os, release, arch, subArch] = images[0].value.split("-");
          otherList.push({
            arch,
            os,
            release,
            subArch,
          });
        }
      });
      setUbuntuSystems(ubuntuList);
      setOtherSystems(otherList);
    }
  }, [sources, resources, otherImages]);

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: false }));
    dispatch(configActions.fetch());
    return () => {
      dispatch(bootResourceActions.pollStop());
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Source
      </ContentSection.Title>
      <ContentSection.Content>
        {!canChangeSource && (
          <Notification
            data-testid="cannot-change-source-warning"
            severity="caution"
          >
            Image import is in progress, cannot change source settings.
          </Notification>
        )}
        {!pollingSources && (
          <FormikForm<ChangeSourceValues>
            allowUnchanged
            aria-label="Choose source"
            cleanup={cleanup}
            errors={errors as APIError}
            initialValues={{
              ...source,
              autoSync: autoImport || false,
            }}
            onSubmit={(values) => {
              dispatch(cleanup());
              dispatch(bootResourceActions.fetch(values));
              dispatch(
                configActions.update({
                  boot_images_auto_import: values.autoSync,
                })
              );
              dispatch(
                bootResourceActions.saveUbuntu({
                  keyring_data: values.keyring_data,
                  keyring_filename: values.keyring_filename,
                  source_type: values.source_type,
                  url: values.url,
                  osystems: ubuntuSystems,
                })
              );
              dispatch(bootResourceActions.saveUbuntuSuccess());
              dispatch(
                bootResourceActions.saveOther({
                  images: otherSystems.map(
                    ({ arch, os, release, subArch = "" }) =>
                      `${os}/${arch}/${subArch}/${release}`
                  ),
                })
              );
              dispatch(bootResourceActions.saveOtherSuccess());
            }}
            saved={saved}
            saving={saving}
            submitDisabled={!canChangeSource}
            submitLabel="Save"
            validationSchema={ChangeSourceSchema}
          >
            <ChangeSourceFields />
          </FormikForm>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default ChangeSource;
