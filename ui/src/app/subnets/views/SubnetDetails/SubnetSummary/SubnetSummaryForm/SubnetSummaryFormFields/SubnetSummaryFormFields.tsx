import { useEffect } from "react";

import { Textarea, Row, Col } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { SubnetSummaryFormValues } from "../types";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import VLANSelect from "app/base/components/VLANSelect";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { RootState } from "app/store/root/types";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { getVLANDisplay } from "app/store/vlan/utils";

const SubnetSummaryFormFields = ({
  subnet,
}: {
  subnet: Subnet;
}): JSX.Element => {
  const { values } = useFormikContext<SubnetSummaryFormValues>();
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, subnet?.vlan)
  );
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, vlan?.fabric)
  );

  useEffect(() => {
    dispatch(vlanActions.fetch());
    dispatch(fabricActions.fetch());
  }, [dispatch]);

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
        {values.fabric && (
          <FabricSelect
            name="Fabric"
            defaultOption={{
              label: getFabricDisplay(fabric) || "",
              value: values?.fabric.toString() || "",
            }}
          />
        )}
        <VLANSelect
          name="vlan"
          showSpinnerOnLoad
          fabric={vlan?.fabric}
          defaultOption={{
            label: getVLANDisplay(vlan) || "",
            value: values?.vlan.toString(),
          }}
        />
      </Col>
    </Row>
  );
};

export default SubnetSummaryFormFields;
