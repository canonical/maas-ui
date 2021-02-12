import { Col, Notification, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { ReleaseFormValues } from "../ReleaseForm";

import FormikField from "app/base/components/FormikField";
import type { Machine } from "app/store/machine/types";

type Props = {
  machines: Machine[];
};

export const ReleaseFormFields = ({ machines }: Props): JSX.Element => {
  const {
    handleChange,
    setFieldValue,
    values,
  } = useFormikContext<ReleaseFormValues>();
  // Count the number of selected machines that have at least one workload.
  const workloadMachines = machines.reduce((count, machine) => {
    const workloads = Object.keys(machine.workload_annotations || {});
    return workloads.length > 0 ? count + 1 : count;
  }, 0);

  return (
    <Row>
      <Col size="6">
        {workloadMachines > 0 && (
          <Notification data-test="workloads-warning" type="caution">
            {machines.length === 1 && workloadMachines === 1
              ? "MAAS will remove workload annotations when this machine is released."
              : `${workloadMachines} of the selected machines have workload annotations. MAAS will remove them when the machines are released.`}
          </Notification>
        )}
        <FormikField
          label="Erase disks before releasing"
          name="enableErase"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            if (e.target.checked === false) {
              setFieldValue("quickErase", false);
              setFieldValue("secureErase", false);
            }
          }}
          type="checkbox"
        />
        <FormikField
          disabled={!values.enableErase}
          label="Use secure erase"
          name="secureErase"
          type="checkbox"
        />
        <FormikField
          disabled={!values.enableErase}
          label="Use quick erase (not secure)"
          name="quickErase"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default ReleaseFormFields;
