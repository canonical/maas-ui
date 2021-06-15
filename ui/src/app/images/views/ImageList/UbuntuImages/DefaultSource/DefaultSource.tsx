import { useCallback } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikForm from "app/base/components/FormikForm";
import UbuntuImageSelect from "app/images/components/UbuntuImageSelect";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import type { OsystemParam } from "app/store/bootresource/types";
import { BootResourceSourceType } from "app/store/bootresource/types";
import { splitResourceName } from "app/store/bootresource/utils";

const DefaultSourceSchema = Yup.object()
  .shape({
    osystems: Yup.array().of(
      Yup.object().shape({
        arches: Yup.array().of(Yup.string()),
        release: Yup.string(),
      })
    ),
  })
  .defined();

export type DefaultSourceValues = {
  osystems: OsystemParam[];
};

const DefaultSource = (): JSX.Element => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.ubuntuResources);
  const saving = useSelector(bootResourceSelectors.savingUbuntu);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  if (!ubuntu) {
    return <Spinner text="Fetching image data..." />;
  }

  const initialOsystems = resources.reduce<OsystemParam[]>(
    (osystems, resource) => {
      // Resources come in the form "<os-name>/<release>" e.g. "ubuntu/bionic".
      const { release: resourceRelease } = splitResourceName(resource.name);
      // We check that the release and arch of the resource are known by the
      // source(s).
      const releaseExists = ubuntu.releases.some(
        (release) => release.name === resourceRelease
      );
      const archExists = ubuntu.arches.some(
        (arch) => arch.name === resource.arch
      );
      // If resource details are known, we either add a new osystem object to
      // the osystem list, or add a new arch to an existing osystem object.
      if (releaseExists && archExists) {
        const osystem = osystems.find((os) => os.release === resourceRelease);
        if (osystem) {
          const newArch = osystem.arches.every(
            (arch) => arch !== resource.arch
          );
          if (newArch) {
            osystem.arches.push(resource.arch);
          }
        } else {
          osystems.push({
            arches: [resource.arch],
            osystem: "ubuntu",
            release: resourceRelease,
          });
        }
      }
      return osystems;
    },
    []
  );

  return (
    <FormikForm<DefaultSourceValues>
      buttonsBordered={false}
      cleanup={cleanup}
      editable={false}
      initialValues={{
        osystems: initialOsystems,
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        const params = {
          osystems: values.osystems,
          source_type: BootResourceSourceType.MAAS_IO,
        };
        dispatch(bootResourceActions.saveUbuntu(params));
      }}
      saving={saving}
      submitLabel="Update selection"
      validationSchema={DefaultSourceSchema}
    >
      <UbuntuImageSelect arches={ubuntu.arches} releases={ubuntu.releases} />
    </FormikForm>
  );
};

export default DefaultSource;
