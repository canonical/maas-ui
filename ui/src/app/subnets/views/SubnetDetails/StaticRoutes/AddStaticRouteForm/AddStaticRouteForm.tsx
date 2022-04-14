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
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { getIsDestinationForSource } from "app/store/subnet/utils";
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
  const loading = staticRoutesLoading || subnetsLoading;
  const source = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );

  useEffect(() => {
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <Formik
      initialValues={{
        source: subnetId,
        gateway_ip: "",
        destination: "",
        metric: "0",
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
      validationSchema={addStaticRouteSchema}
    >
      <FormikFormContent<AddStaticRouteValues>
        aria-label={AddStaticRouteFormLabels.AddStaticRoute}
        cleanup={staticRouteActions.cleanup}
        errors={staticRouteErrors}
        onSaveAnalytics={{
          action: AddStaticRouteFormLabels.Save,
          category: "Subnet",
          label: AddStaticRouteFormLabels.AddStaticRoute,
        }}
        onSuccess={() => {
          handleDismiss();
        }}
        resetOnSave
        saving={saving}
        saved={saved}
        submitLabel={AddStaticRouteFormLabels.Save}
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
              defaultOption={{
                label: "Select destination",
                value: "",
                disabled: true,
              }}
              filterFunction={(destination) =>
                getIsDestinationForSource(destination, source)
              }
              label={Labels.Destination}
              name="destination"
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

export default AddStaticRouteForm;
