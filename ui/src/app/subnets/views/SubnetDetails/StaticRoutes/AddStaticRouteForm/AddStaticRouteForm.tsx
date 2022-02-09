import { useEffect } from "react";

import { Col, Row, Select, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Labels } from "../StaticRoutes";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import { actions as staticRouteActions } from "app/store/staticroute";
import staticRouteSelectors from "app/store/staticroute/selectors";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { toFormikNumber } from "app/utils";

export type AddStaticRouteValues = {
  source: Subnet[SubnetMeta.PK];
  destination: string;
  metric: string;
  gateway_ip: string;
};

export enum AddStaticRouteFormLabels {
  AddStaticRoute = "Add static route",
  Save = "Save",
  Cancel = "Cancel",
}

const addStaticRouteSchema = Yup.object().shape({
  gateway_ip: Yup.string().required("Gateway IP is required"),
  destination: Yup.string().required("Destination is required"),
  metric: Yup.number().required("Metric is required"),
});

const getDestinationsForSource = (subnets: Subnet[], source: Subnet | null) => {
  const filtered: Subnet[] = [];
  if (source) {
    subnets.forEach((subnet) => {
      if (subnet.id !== source.id && subnet.version === source.version) {
        filtered.push(subnet);
      }
    });
  }

  return filtered;
};

export type Props = {
  subnetId: Subnet[SubnetMeta.PK];
  handleDismiss: () => void;
};
const AddStaticRouteForm = ({
  subnetId,
  handleDismiss,
}: Props): JSX.Element | null => {
  const staticRouteErrors = useSelector(staticRouteSelectors.errors);
  const saving = useSelector(staticRouteSelectors.saving);
  const saved = useSelector(staticRouteSelectors.saved);
  const dispatch = useDispatch();
  const staticRoutesLoading = useSelector(staticRouteSelectors.loading);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const staticRoutesLoaded = useSelector(staticRouteSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const loading = staticRoutesLoading || subnetsLoading;
  const subnets = useSelector(subnetSelectors.all);
  const source = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const destinationSubnets = getDestinationsForSource(subnets, source);

  useEffect(() => {
    if (!staticRoutesLoaded) dispatch(staticRouteActions.fetch());
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
  }, [dispatch, staticRoutesLoaded, subnetsLoaded]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormikForm<AddStaticRouteValues>
      aria-label={AddStaticRouteFormLabels.AddStaticRoute}
      cleanup={staticRouteActions.cleanup}
      errors={staticRouteErrors}
      initialValues={{
        source: subnetId,
        gateway_ip: "",
        destination: "",
        metric: "0",
      }}
      onSaveAnalytics={{
        action: AddStaticRouteFormLabels.Save,
        category: "Subnet",
        label: AddStaticRouteFormLabels.AddStaticRoute,
      }}
      onSubmit={({ gateway_ip, destination, metric }) => {
        dispatch(staticRouteActions.cleanup());
        dispatch(
          staticRouteActions.create({
            source: subnetId,
            gateway_ip,
            destination: toFormikNumber(destination) as number,
            metric: toFormikNumber(metric),
          })
        );
      }}
      onSuccess={() => {
        handleDismiss();
      }}
      resetOnSave
      saving={saving}
      saved={saved}
      submitLabel={AddStaticRouteFormLabels.Save}
      onCancel={handleDismiss}
      validationSchema={addStaticRouteSchema}
    >
      <Row>
        <Col size={4}>
          <FormikField label={Labels.GatewayIp} name="gateway_ip" type="text" />
        </Col>
        <Col size={4}>
          <FormikField
            component={Select}
            label={Labels.Destination}
            name="destination"
            options={[
              { label: "Select destination", value: "", disabled: true },
              ...destinationSubnets.map((subnet) => ({
                label: subnet.cidr,
                value: subnet.id,
              })),
            ]}
          />
        </Col>
        <Col size={4}>
          <FormikField label={Labels.Metric} name="metric" type="text" />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddStaticRouteForm;
