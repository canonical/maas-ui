import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  useGetConfiguration,
  useSetConfiguration,
} from "@/app/api/query/configurations";
import {
  getConfigurationQueryKey,
  getConfigurationsQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import type { APIError } from "@/app/base/types";
import {
  getDownloadableImages,
  getSyncedImages,
} from "@/app/images/components/SelectUpstreamImagesForm/SelectUpstreamImagesForm";
import ChangeSourceFields from "@/app/settings/views/Images/ChangeSource/ChangeSourceFields";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import {
  BootResourceSourceType,
  type BootResourceUbuntuSource,
} from "@/app/store/bootresource/types";
import { ConfigNames } from "@/app/store/config/types";

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
  const pollingSources = useSelector(bootResourceSelectors.polling);
  const errors = useSelector(bootResourceSelectors.fetchError);
  const saving = useSelector(bootResourceSelectors.fetching);
  const previousSaving = usePrevious(saving);
  const cleanup = useCallback(() => {
    return bootResourceActions.cleanup();
  }, []);

  const queryClient = useQueryClient();
  const { data, isPending: loadingSyncConfig } = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const configETag = data?.headers?.get("ETag");
  const autoImport = data?.value as boolean;
  const updateConfig = useSetConfiguration();

  const saved = !saving && previousSaving && !errors;

  useWindowTitle("Source");
  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: false }));
    return () => {
      dispatch(bootResourceActions.pollStop());
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

  const canChangeSource = resources.every((resource) => !resource.downloading);
  const source: BootResourceUbuntuSource =
    sources !== null &&
    !!sources.sources[0].source_type &&
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

  return (
    <PageContent sidePanelContent={null} sidePanelTitle={null}>
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
          {!pollingSources && !loadingSyncConfig && (
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
                updateConfig.mutate({
                  headers: {
                    ETag: configETag,
                  },
                  body: {
                    value: values.autoSync,
                  },
                  path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
                });
              }}
              onSuccess={async (values) => {
                dispatch(
                  bootResourceActions.saveUbuntu({
                    keyring_data: values.keyring_data,
                    keyring_filename: values.keyring_filename,
                    source_type: values.source_type,
                    url: values.url,
                    osystems: ubuntuSystems,
                  })
                );
                dispatch(
                  bootResourceActions.saveOther({
                    images: otherSystems.map(
                      ({ arch, os, release, subArch = "" }) =>
                        `${os}/${arch}/${subArch}/${release}`
                    ),
                  })
                );
                await queryClient.invalidateQueries({
                  queryKey: getConfigurationsQueryKey(),
                });
                await queryClient.invalidateQueries({
                  queryKey: getConfigurationQueryKey({
                    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
                  }),
                });
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
    </PageContent>
  );
};

export default ChangeSource;
