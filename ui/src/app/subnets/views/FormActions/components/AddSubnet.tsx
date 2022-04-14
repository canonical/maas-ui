import { Row, Col, Input } from "@canonical/react-components";
import { Formik, useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { FormActionProps } from "../FormActions";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import VLANSelect from "app/base/components/VLANSelect";
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

const AddSubnetFields = ({ isSaving }: { isSaving: boolean }) => {
  const { values } = useFormikContext<AddSubnetValues>();

  return (
    <>
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
          <FormikField
            type="text"
            name="name"
            component={Input}
            disabled={isSaving}
            label="Name"
          />
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          <FabricSelect
            name="fabric"
            defaultOption={null}
            required
            disabled={isSaving}
          />
        </Col>
        <Col size={6}>
          <VLANSelect
            name="vlan"
            required
            setDefaultValueFromFabric
            defaultOption={null}
            fabric={toFormikNumber(values?.fabric)}
            includeDefaultVlan={true}
            disabled={isSaving}
          />
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          <FormikField
            type="text"
            name="dns_servers"
            component={Input}
            disabled={isSaving}
            label="DNS servers"
            help="Use IPv4 or IPv6 format"
          />
        </Col>
        <Col size={6}>
          <FormikField
            type="text"
            name="gateway_ip"
            component={Input}
            disabled={isSaving}
            label="Gateway IP"
            help="Use IPv4 or IPv6 format"
          />
        </Col>
      </Row>
    </>
  );
};

const addSubnetSchema = Yup.object()
  .shape({
    cidr: Yup.string().required("CIDR is required"),
    name: Yup.string(),
    fabric: Yup.number(),
    vlan: Yup.number(),
    dns_servers: Yup.string(),
    gateway_ip: Yup.string(),
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
    <Formik
      initialValues={{
        vlan: "",
        name: "",
        cidr: "",
        gateway_ip: "",
        dns_servers: "",
        fabric: "",
      }}
      onSubmit={({ cidr, name, fabric, vlan, dns_servers, gateway_ip }) => {
        dispatch(
          subnetActions.create({
            cidr,
            name,
            fabric: toFormikNumber(fabric),
            vlan: toFormikNumber(vlan),
            dns_servers,
            gateway_ip,
          })
        );
      }}
      validationSchema={addSubnetSchema}
    >
      <FormikFormContent<AddSubnetValues>
        aria-label="Add subnet"
        buttonsBordered={false}
        allowAllEmpty
        onSaveAnalytics={{
          action: "Add Subnet",
          category: "Subnets form actions",
          label: "Add Subnet",
        }}
        cleanup={subnetActions.cleanup}
        submitLabel={`Add ${activeForm}`}
        onCancel={() => setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
        saving={isSaving}
        saved={isSaved}
        errors={errors}
      >
        <AddSubnetFields isSaving={isSaving} />
      </FormikFormContent>
    </Formik>
  );
};

export default AddSubnet;
