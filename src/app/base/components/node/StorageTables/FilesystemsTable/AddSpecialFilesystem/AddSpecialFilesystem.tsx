import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { machineActions } from "@/app/store/machine";
import type { MachineDetails } from "@/app/store/machine/types";
import type { MachineEventErrors } from "@/app/store/machine/types/base";
import { usesStorage } from "@/app/store/utils";

const AddSpecialFilesystemSchema = Yup.object().shape({
  fstype: Yup.string().required(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string()
    .matches(/^\//, "Mount point must start with /")
    .required("Mount point is required"),
});

type AddSpecialFilesystemValues = {
  fstype: string;
  mountOptions: string;
  mountPoint: string;
};

type Props = {
  closeForm: () => void;
  machine: MachineDetails;
};

export const AddSpecialFilesystem = ({
  closeForm,
  machine,
}: Props): React.ReactElement | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    machine.system_id,
    "mountingSpecial",
    "mountSpecial",
    () => {
      closeForm();
    }
  );

  const fsOptions = machine.supported_filesystems
    .filter((fs) => !usesStorage(fs.key))
    .map((fs) => ({
      label: fs.ui,
      value: fs.key,
    }));

  return (
    <FormikForm<AddSpecialFilesystemValues, MachineEventErrors>
      aria-label="Add special filesystem"
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        fstype: "",
        mountOptions: "",
        mountPoint: "",
      }}
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Add special filesystem",
        category: "Machine storage",
        label: "Mount",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const params = {
          fstype: values.fstype,
          mountOptions: values.mountOptions,
          mountPoint: values.mountPoint,
          systemId: machine.system_id,
        };
        dispatch(machineActions.mountSpecial(params));
      }}
      saved={saved}
      saving={saving}
      submitLabel="Mount"
      validationSchema={AddSpecialFilesystemSchema}
    >
      <Row>
        <Col size={12}>
          <FormikField
            component={Select}
            label="Type"
            name="fstype"
            options={[
              {
                label: "Select filesystem type",
                value: "",
                disabled: true,
              },
              ...fsOptions,
            ]}
            required
          />
          <FormikField
            help="Absolute path to filesystem"
            label="Mount point"
            name="mountPoint"
            placeholder="/path/to/filesystem"
            required
            type="text"
          />
          <FormikField
            help='Comma-separated list without spaces, e.g. "noexec,size=1024k"'
            label="Mount options"
            name="mountOptions"
            type="text"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddSpecialFilesystem;
