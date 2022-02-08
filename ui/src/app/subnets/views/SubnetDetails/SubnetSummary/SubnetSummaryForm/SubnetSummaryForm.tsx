import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import SubnetSummaryFormFields from "./SubnetSummaryFormFields";
import type { SubnetSummaryFormValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import { actions as fabricActions } from "app/store/fabric";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

const subnetSummaryFormSchema = Yup.object().shape({
  name: Yup.string(),
  cidr: Yup.string(),
  gateway_ip: Yup.string(),
  dns_servers: Yup.string(),
  description: Yup.string(),
  managed: Yup.boolean(),
  active_discovery: Yup.boolean(),
  allow_proxy: Yup.boolean(),
  allow_dns: Yup.boolean(),
  vlan: Yup.number(),
});

const SubnetSummaryForm = ({
  subnet,
  handleDismiss,
}: {
  subnet: Subnet;
  handleDismiss: () => void;
}): JSX.Element => {
  const subnetErrors = useSelector(subnetSelectors.errors);
  const saving = useSelector(subnetSelectors.saving);
  const saved = useSelector(subnetSelectors.saved);
  const dispatch = useDispatch();

  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, subnet?.vlan)
  );

  useEffect(() => {
    dispatch(vlanActions.fetch());
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  return (
    <FormikForm<SubnetSummaryFormValues>
      aria-label="Edit space summary"
      cleanup={subnetActions.cleanup}
      errors={subnetErrors}
      initialValues={{
        name: subnet?.name || "",
        cidr: subnet?.cidr || "",
        gateway_ip: subnet?.gateway_ip || "",
        dns_servers: subnet?.dns_servers || "",
        description: subnet?.description || "",
        managed: subnet?.managed || false,
        active_discovery: subnet?.active_discovery || false,
        allow_proxy: subnet?.allow_proxy || false,
        allow_dns: subnet?.allow_dns || false,
        vlan: subnet?.vlan,
        fabric: vlan?.fabric,
      }}
      onSaveAnalytics={{
        action: "Save",
        category: "Subnet",
        label: "Subnet summary form",
      }}
      onSubmit={({
        name,
        cidr,
        gateway_ip,
        dns_servers,
        description,
        managed,
        active_discovery,
        allow_proxy,
        allow_dns,
        vlan,
        fabric,
      }) => {
        dispatch(
          subnetActions.update({
            id: subnet.id,
            name,
            cidr,
            gateway_ip,
            dns_servers,
            description,
            managed,
            active_discovery,
            allow_proxy,
            allow_dns,
            vlan,
            fabric,
          })
        );
      }}
      onSuccess={() => {
        handleDismiss();
      }}
      resetOnSave
      saving={saving}
      saved={saved}
      submitLabel="Save"
      onCancel={handleDismiss}
      validationSchema={subnetSummaryFormSchema}
    >
      <SubnetSummaryFormFields subnet={subnet} />
    </FormikForm>
  );
};

export default SubnetSummaryForm;
