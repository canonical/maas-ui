import React, { useEffect } from "react";

import { Col, Row, Select } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const AddSpecialFilesystemSchema = Yup.object().shape({
  filesystemType: Yup.string().required(),
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
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { mountingSpecial } = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, systemId)
  );
  const previousMountingSpecial = usePrevious(mountingSpecial);
  const saved = !mountingSpecial && previousMountingSpecial;

  // Close the form when special filesystem has successfully mounted.
  // TODO: Check for machine-specific error, in which case keep form open.
  // https://github.com/canonical-web-and-design/maas-ui/issues/1842
  useEffect(() => {
    if (saved) {
      closeForm();
    }
  }, [closeForm, saved]);

  return (
    <FormCard data-test="confirmation-form" sidebar={false}>
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        initialValues={{
          filesystemType: "",
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
          const params = {
            filesystemType: values.filesystemType,
            mountOptions: values.mountOptions,
            mountPoint: values.mountPoint,
            systemId,
          };
          dispatch(machineActions.mountSpecial(params));
        }}
        saved={saved}
        saving={mountingSpecial}
        submitLabel="Mount"
        validationSchema={AddSpecialFilesystemSchema}
      >
        <Row>
          <Col size="6">
            <FormikField
              component={Select}
              label="Type"
              name="filesystemType"
              options={[
                { label: "Select filesystem type", value: "", disabled: true },
                { label: "tmpfs", value: "tmpfs" },
                { label: "ramfs", value: "ramfs" },
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
};

export default AddSpecialFilesystem;
