import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import DhcpFormFields from "../DhcpFormFields";

import type { DHCPFormValues } from "./types";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import { useDhcpTarget } from "app/settings/hooks";
import { DhcpSnippetShape } from "app/settings/proptypes";
import { actions as controllerActions } from "app/store/controller";
import { actions as deviceActions } from "app/store/device";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import { actions as machineActions } from "app/store/machine";
import { actions as subnetActions } from "app/store/subnet";

const DhcpSchema = Yup.object().shape({
  description: Yup.string(),
  enabled: Yup.boolean(),
  entity: Yup.string().when("type", {
    is: (val: string) => val && val.length > 0,
    then: Yup.string().required(
      "You must choose an entity for this snippet type"
    ),
  }),
  name: Yup.string().required("Snippet name is required"),
  value: Yup.string().required("DHCP snippet is required"),
  type: Yup.string(),
});

type Props = {
  dhcpSnippet?: DHCPSnippet;
};

export const DhcpForm = ({ dhcpSnippet }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savingDhcp, setSaving] = useState<DHCPSnippet["name"] | null>();
  const [name, setName] = useState();
  const errors = useSelector(dhcpsnippetSelectors.errors);
  const saved = useSelector(dhcpsnippetSelectors.saved);
  const saving = useSelector(dhcpsnippetSelectors.saving);
  const editing = !!dhcpSnippet;
  const { loading, loaded, type } = useDhcpTarget(
    editing ? dhcpSnippet?.node : null,
    editing ? dhcpSnippet?.subnet : null
  );
  const title = editing ? `Editing \`${name}\`` : "Add DHCP snippet";

  useWindowTitle(title);

  useAddMessage(
    saved,
    dhcpsnippetActions.cleanup,
    `${savingDhcp} ${editing ? "updated" : "added"} successfully.`,
    () => setSaving(null)
  );

  useEffect(() => {
    dispatch(subnetActions.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (
    editing &&
    (dhcpSnippet?.node || dhcpSnippet?.subnet) &&
    (loading || !loaded)
  ) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormCard title={title}>
      <FormikForm
        buttons={FormCardButtons}
        cleanup={dhcpsnippetActions.cleanup}
        errors={errors}
        initialValues={{
          description: dhcpSnippet ? dhcpSnippet.description : "",
          enabled: dhcpSnippet ? dhcpSnippet.enabled : false,
          entity: dhcpSnippet
            ? dhcpSnippet.node || dhcpSnippet.subnet || ""
            : "",
          name: dhcpSnippet ? dhcpSnippet.name : "",
          type: (dhcpSnippet && type) || "",
          value: dhcpSnippet ? dhcpSnippet.value : "",
        }}
        onCancel={() => history.push({ pathname: "/settings/dhcp" })}
        onSaveAnalytics={{
          action: "Saved",
          category: "DHCP snippet settings",
          label: `${editing ? "Edit" : "Add"} form`,
        }}
        onSubmit={(values) => {
          const params: {
            description: DHCPFormValues["description"];
            enabled: DHCPFormValues["enabled"];
            id?: DHCPSnippet["id"];
            name: DHCPFormValues["name"];
            node?: DHCPSnippet["node"];
            subnet?: DHCPSnippet["subnet"];
            value: DHCPFormValues["value"];
          } = {
            description: values.description,
            enabled: values.enabled,
            name: values.name,
            value: values.value,
          };
          if (values.type === "subnet") {
            params.subnet = values.entity;
          } else if (values.type) {
            params.node = values.entity;
          }
          if (editing) {
            params.id = dhcpSnippet?.id;
            dispatch(dhcpsnippetActions.update(params));
          } else {
            dispatch(dhcpsnippetActions.create(params));
          }
          setSaving(params.name);
        }}
        onValuesChanged={(values) => {
          setName(values.name);
        }}
        saving={saving}
        saved={saved}
        savedRedirect="/settings/dhcp"
        submitLabel="Save snippet"
        validationSchema={DhcpSchema}
      >
        <DhcpFormFields editing={editing} />
      </FormikForm>
    </FormCard>
  );
};

DhcpForm.propTypes = {
  dhcpSnippet: DhcpSnippetShape,
};

export default DhcpForm;
