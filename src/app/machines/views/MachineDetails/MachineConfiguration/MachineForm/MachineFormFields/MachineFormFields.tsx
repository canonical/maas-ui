import { Col, Row, Textarea } from "@canonical/react-components";

import ArchitectureSelect from "@/app/base/components/ArchitectureSelect";
import FormikField from "@/app/base/components/FormikField";
import MinimumKernelSelect from "@/app/base/components/MinimumKernelSelect";
import ResourcePoolSelect from "@/app/base/components/ResourcePoolSelect";
import ZoneSelect from "@/app/base/components/ZoneSelect";

const MachineFormFields = (): React.ReactElement => {
  return (
    <Row>
      <Col size={6}>
        <ArchitectureSelect name="architecture" />
        <MinimumKernelSelect name="minHweKernel" />
        <ZoneSelect name="zone" />
        <ResourcePoolSelect name="pool" />
        {/* TODO: Remove feature flag https://warthogs.atlassian.net/browse/MAASENG-4186 */}
        {import.meta.env.VITE_APP_DPU_PROVISIONING === "true" && (
          <FormikField label="Register as DPU" name="is_dpu" type="checkbox" />
        )}
        <FormikField component={Textarea} label="Note" name="description" />
      </Col>
    </Row>
  );
};

export default MachineFormFields;
