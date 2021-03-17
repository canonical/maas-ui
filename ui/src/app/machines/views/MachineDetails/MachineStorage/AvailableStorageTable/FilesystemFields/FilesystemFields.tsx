import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import machineSelectors from "app/store/machine/selectors";
import type { Filesystem, Machine } from "app/store/machine/types";
import { usesStorage } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type FilesystemValues = {
  fstype: Filesystem["fstype"];
  mountOptions: Filesystem["mount_options"];
  mountPoint: Filesystem["mount_point"];
};

type Props = {
  systemId: Machine["system_id"];
};

export const FilesystemFields = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { values } = useFormikContext<FilesystemValues>();

  if (machine && "supported_filesystems" in machine) {
    const fsOptions = machine.supported_filesystems
      .filter((fs) => usesStorage(fs.key))
      .map((fs) => ({
        label: fs.ui,
        value: fs.key,
      }));
    const disableOptions = !values.fstype;
    const swapSelected = values.fstype === "swap";

    return (
      <>
        <FormikField
          component={Select}
          label="Filesystem"
          name="fstype"
          options={[
            {
              label: "Select filesystem type",
              value: null,
              disabled: true,
            },
            {
              label: "Unformatted",
              value: "",
            },
            ...fsOptions,
          ]}
        />
        <FormikField
          disabled={disableOptions || swapSelected}
          label="Mount point"
          name="mountPoint"
          placeholder={swapSelected ? "none" : "/path/to/filesystem"}
          type="text"
        />
        <FormikField
          disabled={disableOptions}
          help={
            disableOptions
              ? undefined
              : 'Comma-separated list without spaces, e.g. "noexec,size=1024k".'
          }
          label="Mount options"
          name="mountOptions"
          type="text"
        />
      </>
    );
  }
  return null;
};

export default FilesystemFields;
