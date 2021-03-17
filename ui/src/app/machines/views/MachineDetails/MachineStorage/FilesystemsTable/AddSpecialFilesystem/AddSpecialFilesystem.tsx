import { Col, Row, Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { usesStorage } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

const AddSpecialFilesystemSchema = Yup.object().shape({
  fstype: Yup.string().required(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string()
    .matches(/^\//, "Mount point must start with /")
    .required("Mount point is required"),
});

type Props = {
  closeForm: () => void;
  systemId: Machine["system_id"];
};

export const AddSpecialFilesystem = ({
  closeForm,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "mountingSpecial",
    "mountSpecial",
    () => closeForm()
  );

  if (machine && "supported_filesystems" in machine) {
    const fsOptions = machine.supported_filesystems
      .filter((fs) => !usesStorage(fs.key))
      .map((fs) => ({
        label: fs.ui,
        value: fs.key,
      }));

    return (
      <FormCard data-test="confirmation-form" sidebar={false}>
        <FormikForm
          buttons={FormCardButtons}
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
              systemId,
            };
            dispatch(machineActions.mountSpecial(params));
          }}
          saved={saved}
          saving={saving}
          submitLabel="Mount"
          validationSchema={AddSpecialFilesystemSchema}
        >
          <Row>
            <Col size="6">
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
      </FormCard>
    );
  }
  return null;
};

export default AddSpecialFilesystem;
