import { Row, Col, Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { FormActionProps } from "../FormActions";

import FabricAndVlanSelect from "app/base/components/FabricAndVlanSelect";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { toFormikNumber } from "app/utils";

type AddSubnetValues = {
  vlan: string;
  name: string;
  cidr: string;
  gateway_ip: string;
  dns_servers: string;
  fabric: string;
};

const addSubnetSchema = Yup.object()
  .shape({
    vlan: Yup.number(),
    name: Yup.string(),
    cidr: Yup.string().required("CIDR is required"),
    gateway_ip: Yup.number(),
    dns_servers: Yup.number(),
    fabric: Yup.number(),
    description: Yup.string(),
  })
  .defined();

const AddSubnet = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const dispatch = useDispatch();
  const isSaving = useSelector(subnetSelectors.saving);
  const isSaved = useSelector(subnetSelectors.saved);
  const errors = useSelector(subnetSelectors.errors);

  return (
    <FormikForm<AddSubnetValues>
      validationSchema={addSubnetSchema}
      buttonsBordered={false}
      allowAllEmpty
      initialValues={{
        vlan: "",
        name: "",
        cidr: "",
        gateway_ip: "",
        dns_servers: "",
        fabric: "",
      }}
      onSaveAnalytics={{
        action: "Add Subnet",
        category: "Subnets form actions",
        label: "Add Subnet",
      }}
      submitLabel={`Add ${activeForm}`}
      onSubmit={({ vlan, name, cidr, gateway_ip, dns_servers }) => {
        dispatch(
          subnetActions.create({
            vlan: toFormikNumber(vlan),
            name: name,
            cidr,
            gateway_ip,
            dns_servers,
            description: "",
          })
        );
      }}
      onCancel={() => setActiveForm(null)}
      onSuccess={() => setActiveForm(null)}
      saving={isSaving}
      saved={isSaved}
      errors={errors}
    >
      <Row>
        <Col size={6}>
          <FormikField
            takeFocus
            type="text"
            name="cidr"
            required
            component={Input}
            disabled={isSaving}
            label="CIDR"
            help="Use IPv4 or IPv6 format"
          />
        </Col>
        <Col size={6}>
          <FabricAndVlanSelect required name="vlan" />
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          <FormikField
            type="text"
            name="name"
            component={Input}
            disabled={isSaving}
            label="Name"
          />
        </Col>
        <Col size={6}>
          <FormikField
            type="text"
            name="dns_servers"
            component={Input}
            disabled={isSaving}
            label="DNS servers"
          />
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          <FormikField
            type="text"
            name="gateway_ip"
            component={Input}
            disabled={isSaving}
            label="Gateway IP"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddSubnet;
