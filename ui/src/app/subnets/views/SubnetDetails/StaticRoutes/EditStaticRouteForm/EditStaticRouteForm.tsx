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
import type { StaticRoute, StaticRouteMeta } from "app/store/staticroute/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { toFormikNumber } from "app/utils";

export type AddStaticRouteValues = Pick<
  StaticRoute,
  "source" | "destination" | "metric" | "gateway_ip"
>;

export enum EditStaticRouteFormLabels {
  EditStaticRoute = "Edit static route",
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
  staticRouteId: StaticRoute[StaticRouteMeta.PK];
  handleDismiss: () => void;
};
const EditStaticRouteForm = ({
  staticRouteId,
  handleDismiss,
}: Props): JSX.Element | null => {
  const staticRouteErrors = useSelector(staticRouteSelectors.errors);
  const saving = useSelector(staticRouteSelectors.saving);
  const saved = useSelector(staticRouteSelectors.saved);
  const dispatch = useDispatch();
  const staticRoutesLoading = useSelector(staticRouteSelectors.loading);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const loading = staticRoutesLoading || subnetsLoading;
  const subnets = useSelector(subnetSelectors.all);
  const staticRoute = useSelector((state: RootState) =>
    staticRouteSelectors.getById(state, staticRouteId)
  );
  const source = useSelector((state: RootState) =>
    subnetSelectors.getById(state, staticRoute?.source)
  );
  const destinationSubnets = getDestinationsForSource(subnets, source);

  useEffect(() => {
    dispatch(staticRouteActions.fetch());
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  if (!staticRoute || loading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormikForm<AddStaticRouteValues>
      aria-label={EditStaticRouteFormLabels.EditStaticRoute}
      cleanup={staticRouteActions.cleanup}
      errors={staticRouteErrors}
      initialValues={{
        source: staticRoute.source,
        gateway_ip: staticRoute.gateway_ip,
        destination: staticRoute.destination,
        metric: staticRoute.metric,
      }}
      onSaveAnalytics={{
        action: EditStaticRouteFormLabels.Save,
        category: "Subnet",
        label: EditStaticRouteFormLabels.EditStaticRoute,
      }}
      onSubmit={({ gateway_ip, destination, metric }) => {
        dispatch(staticRouteActions.cleanup());
        dispatch(
          staticRouteActions.update({
            id: staticRouteId,
            source: staticRoute.source,
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
      submitLabel={EditStaticRouteFormLabels.Save}
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

export default EditStaticRouteForm;
