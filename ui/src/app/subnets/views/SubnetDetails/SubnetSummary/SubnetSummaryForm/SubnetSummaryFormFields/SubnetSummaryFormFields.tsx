import { Textarea, Row, Col } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { SubnetSummaryFormValues } from "../types";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import VLANSelect from "app/base/components/VLANSelect";

const SubnetSummaryFormFields = (): JSX.Element => {
  const { values } = useFormikContext<SubnetSummaryFormValues>();

  return (
    <Row>
      <Col size={6}>
        <FormikField label="Name" name="name" type="text" />
        <FormikField label="CIDR" name="cidr" type="text" />
        <FormikField label="Gateway IP" name="gateway_ip" type="text" />
        <FormikField
          label="DNS"
          name="dns_servers"
          type="text"
          placeholder="DNS nameservers for subnet"
        />
        <FormikField
          label="Description"
          name="description"
          component={Textarea}
          placeholder="Subnet description"
        />
      </Col>
      <Col size={6}>
        <FormikField
          label="Managed allocation"
          name="managed"
          type="checkbox"
        />
        <FormikField
          label="Active discovery"
          name="active_discovery"
          type="checkbox"
        />
        <FormikField label="Proxy access" name="allow_proxy" type="checkbox" />
        <FormikField
          label="Allow DNS resolution"
          name="allow_dns"
          type="checkbox"
        />
        <FabricSelect name="fabric" />
        <VLANSelect
          fabric={Number(values.fabric)}
          name="vlan"
          setDefaultValueFromFabric
          showSpinnerOnLoad
        />
      </Col>
    </Row>
  );
};

export default SubnetSummaryFormFields;
