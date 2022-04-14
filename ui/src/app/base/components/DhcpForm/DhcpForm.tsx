import { useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import type { FormikErrors } from "formik";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { DHCPFormValues } from "./types";

import DhcpFormFields from "app/base/components/DhcpFormFields";
import FormikFormContent from "app/base/components/FormikFormContent";
import type { Props as FormikFormContentProps } from "app/base/components/FormikFormContent";
import { useAddMessage } from "app/base/hooks";
import { useDhcpTarget } from "app/settings/hooks";
import { actions as controllerActions } from "app/store/controller";
import { actions as deviceActions } from "app/store/device";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";

const DhcpSchema = Yup.object()
  .shape({
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
  })
  .defined();

type Props = {
  analyticsCategory: string;
  id?: DHCPSnippet["id"];
  onSave?: () => void;
} & Partial<
  FormikFormContentProps<DHCPFormValues, FormikErrors<DHCPFormValues>>
>;

export const DhcpForm = ({
  analyticsCategory,
  id,
  onSave,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [savingDhcp, setSaving] = useState<DHCPSnippet["name"] | null>();
  const dhcpSnippet = useSelector((state: RootState) =>
    dhcpsnippetSelectors.getById(state, id)
  );
  const errors = useSelector(dhcpsnippetSelectors.errors);
  const saved = useSelector(dhcpsnippetSelectors.saved);
  const saving = useSelector(dhcpsnippetSelectors.saving);
  const editing = !!dhcpSnippet;
  const {
    loading,
    loaded,
    type: targetType,
  } = useDhcpTarget(
    editing ? dhcpSnippet?.node : null,
    editing ? dhcpSnippet?.subnet : null
  );

  useAddMessage(
    saved && !errors,
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
    <Formik
      initialValues={{
        description: dhcpSnippet ? dhcpSnippet.description : "",
        enabled: dhcpSnippet ? dhcpSnippet.enabled : false,
        entity: dhcpSnippet
          ? dhcpSnippet.node || `${dhcpSnippet.subnet}` || ""
          : "",
        name: dhcpSnippet ? dhcpSnippet.name : "",
        type: (dhcpSnippet && targetType) || "",
        value: dhcpSnippet ? dhcpSnippet.value : "",
      }}
      onSubmit={(values) => {
        const params: {
          description: DHCPFormValues["description"];
          enabled: DHCPFormValues["enabled"];
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
          params.subnet = parseInt(values.entity, 10);
        } else if (values.type) {
          params.node = values.entity;
        }
        if (editing) {
          if (dhcpSnippet) {
            dispatch(
              dhcpsnippetActions.update({
                id: dhcpSnippet.id,
                ...params,
              })
            );
          }
        } else {
          dispatch(dhcpsnippetActions.create(params));
        }
        setSaving(params.name);
      }}
      validationSchema={DhcpSchema}
    >
      <FormikFormContent<DHCPFormValues>
        cleanup={dhcpsnippetActions.cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: "Saved",
          category: analyticsCategory,
          label: `${editing ? "Edit" : "Add"} form`,
        }}
        onSuccess={() => onSave && onSave()}
        saving={saving}
        saved={saved}
        submitLabel="Save snippet"
        {...props}
      >
        <DhcpFormFields editing={editing} />
      </FormikFormContent>
    </Formik>
  );
};

export default DhcpForm;
