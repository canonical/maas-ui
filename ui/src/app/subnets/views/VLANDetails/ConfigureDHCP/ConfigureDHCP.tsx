import { useCallback, useEffect } from "react";

import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ConfigureDHCPFields from "./ConfigureDHCPFields";

import FormikForm from "app/base/components/FormikForm";
import TitledSection from "app/base/components/TitledSection";
import { useCycled } from "app/base/hooks";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { ConfigureDHCPParams, VLAN, VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

type Props = {
  closeForm: () => void;
  id?: VLAN[VLANMeta.PK] | null;
};

export type ConfigureDHCPValues = {
  primaryRack: string;
  relayVLAN: number | "";
  secondaryRack: string;
};

const Schema = Yup.object().shape({
  primaryRack: Yup.string(),
  relayVLAN: Yup.string(),
  secondaryRack: Yup.string(),
});

const ConfigureDHCP = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const controllersLoading = useSelector(controllerSelectors.loading);
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const vlansLoading = useSelector(vlanSelectors.loading);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const configuringDHCP = useSelector((state: RootState) =>
    vlanSelectors.getStatusForVLAN(state, id, "configuringDHCP")
  );
  const configureDHCPError = useSelector((state: RootState) =>
    vlanSelectors.eventErrorsForVLANs(state, id, "configureDHCP")
  )[0]?.error;
  const [configuredDHCP] = useCycled(!configuringDHCP && !configureDHCPError);
  const cleanup = useCallback(() => vlanActions.cleanup(), []);
  const loading = !vlan || controllersLoading || fabricsLoading || vlansLoading;

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(fabricActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  return (
    <Card>
      <TitledSection className="u-no-padding" title="Configure DHCP">
        {loading ? (
          <span data-testid="loading-data">
            <Spinner text="Loading..." />
          </span>
        ) : (
          <FormikForm<ConfigureDHCPValues>
            allowUnchanged
            cleanup={cleanup}
            errors={configureDHCPError}
            buttonsHelp={
              <a className="p-link--external" href="https://maas.io/docs/dhcp">
                About DHCP
              </a>
            }
            initialValues={{
              primaryRack: vlan.primary_rack || "",
              relayVLAN: vlan.relay_vlan || "",
              secondaryRack: vlan.secondary_rack || "",
            }}
            onSaveAnalytics={{
              action: "Configure DHCP",
              category: "VLAN details",
              label: "Configure DHCP form",
            }}
            onCancel={closeForm}
            onSubmit={(values) => {
              dispatch(cleanup());
              const { primaryRack, relayVLAN, secondaryRack } = values;
              const params: ConfigureDHCPParams = {
                controllers: [],
                id: vlan.id,
                relay_vlan: null,
              };
              if (primaryRack) {
                params.controllers.push(primaryRack);
              }
              if (secondaryRack) {
                params.controllers.push(secondaryRack);
              }
              if (isId(relayVLAN)) {
                params.relay_vlan = Number(relayVLAN);
              }
              dispatch(vlanActions.configureDHCP(params));
            }}
            onSuccess={() => closeForm()}
            saved={configuredDHCP}
            saving={configuringDHCP}
            submitLabel="Configure DHCP"
            validationSchema={Schema}
          >
            <ConfigureDHCPFields vlan={vlan} />
          </FormikForm>
        )}
      </TitledSection>
    </Card>
  );
};

export default ConfigureDHCP;
