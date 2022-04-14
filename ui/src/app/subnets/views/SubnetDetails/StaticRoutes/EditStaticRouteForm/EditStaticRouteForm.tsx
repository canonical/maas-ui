import { useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Labels } from "../StaticRoutes";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import SubnetSelect from "app/base/components/SubnetSelect";
import type { RootState } from "app/store/root/types";
import { actions as staticRouteActions } from "app/store/staticroute";
import staticRouteSelectors from "app/store/staticroute/selectors";
import type { StaticRoute, StaticRouteMeta } from "app/store/staticroute/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { getIsDestinationForSource } from "app/store/subnet/utils";
import { toFormikNumber } from "app/utils";

export type EditStaticRouteValues = Pick<
  StaticRoute,
  "source" | "destination" | "metric" | "gateway_ip"
>;

export enum EditStaticRouteFormLabels {
  EditStaticRoute = "Edit static route",
  Save = "Save",
  Cancel = "Cancel",
}

const editStaticRouteSchema = Yup.object().shape({
  gateway_ip: Yup.string().required("Gateway IP is required"),
  destination: Yup.string().required("Destination is required"),
  metric: Yup.number().required("Metric is required"),
});

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
  const staticRoute = useSelector((state: RootState) =>
    staticRouteSelectors.getById(state, staticRouteId)
  );
  const source = useSelector((state: RootState) =>
    subnetSelectors.getById(state, staticRoute?.source)
  );

  useEffect(() => {
    dispatch(staticRouteActions.fetch());
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  if (!staticRoute || loading) {
    return (
      <Spinner data-testid="edit-static-route-form-loading" text="Loading..." />
    );
  }

  return (
    <Formik
      initialValues={{
        source: staticRoute.source,
        gateway_ip: staticRoute.gateway_ip,
        destination: staticRoute.destination,
        metric: staticRoute.metric,
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
      validationSchema={editStaticRouteSchema}
    >
      <FormikFormContent<EditStaticRouteValues>
        aria-label={EditStaticRouteFormLabels.EditStaticRoute}
        cleanup={staticRouteActions.cleanup}
        errors={staticRouteErrors}
        onSaveAnalytics={{
          action: EditStaticRouteFormLabels.Save,
          category: "Subnet",
          label: EditStaticRouteFormLabels.EditStaticRoute,
        }}
        onSuccess={() => {
          handleDismiss();
        }}
        resetOnSave
        saving={saving}
        saved={saved}
        submitLabel={EditStaticRouteFormLabels.Save}
        onCancel={handleDismiss}
      >
        <Row>
          <Col size={4}>
            <FormikField
              label={Labels.GatewayIp}
              name="gateway_ip"
              type="text"
            />
          </Col>
          <Col size={4}>
            <SubnetSelect
              label={Labels.Destination}
              name="destination"
              filterFunction={(destination) =>
                getIsDestinationForSource(destination, source)
              }
              defaultOption={{
                label: "Select destination",
                value: "",
                disabled: true,
              }}
            />
          </Col>
          <Col size={4}>
            <FormikField label={Labels.Metric} name="metric" type="text" />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default EditStaticRouteForm;
