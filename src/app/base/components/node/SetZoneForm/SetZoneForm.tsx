import { Col, Row } from "@canonical/react-components";
import * as Yup from "yup";

import type { NodeActionFormProps } from "../types";

import type { ZoneResponse } from "@/app/apiclient";
import ActionForm from "@/app/base/components/ActionForm";
import ZoneSelect from "@/app/base/components/ZoneSelect";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { Node } from "@/app/store/types/node";
import { NodeActions } from "@/app/store/types/node";
import { nodeIsDevice, nodeIsMachine } from "@/app/store/utils";
import { capitaliseFirst } from "@/app/utils";

type Props<E = null> = Omit<NodeActionFormProps<E>, "viewingDetails"> & {
  onSubmit: (zoneID: ZoneResponse["id"]) => void;
  selectedCount?: number | null;
  isViewingDetails: boolean;
};

export type SetZoneFormValues = {
  zone: ZoneResponse["id"] | "";
};

const getInitialZoneValue = (nodes: Node[]): SetZoneFormValues["zone"] => {
  if (
    nodes.length === 1 &&
    (nodeIsDevice(nodes[0]) || nodeIsMachine(nodes[0]))
  ) {
    return nodes[0].zone.id;
  }
  return "";
};

const SetZoneSchema = Yup.object().shape({
  zone: Yup.number().required("Zone is required"),
});

export const SetZoneForm = <E,>({
  cleanup,
  errors,
  actionStatus,
  nodes,
  modelName,
  onSubmit,
  processingCount,
  isViewingDetails,
  selectedCount,
}: Props<E>): React.ReactElement => {
  const { closeSidePanel } = useSidePanel();
  return (
    <ActionForm<SetZoneFormValues, E>
      actionName={NodeActions.SET_ZONE}
      actionStatus={actionStatus}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        zone: nodes ? getInitialZoneValue(nodes) : "",
      }}
      modelName={modelName}
      onCancel={closeSidePanel}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst(modelName)} ${
          isViewingDetails ? "details" : "list"
        } action form`,
        label: "Set zone",
      }}
      onSubmit={(values) => {
        if (values.zone || values.zone === 0) {
          onSubmit(values.zone);
        }
      }}
      onSuccess={closeSidePanel}
      processingCount={processingCount}
      selectedCount={nodes ? nodes.length : (selectedCount ?? 0)}
      validationSchema={SetZoneSchema}
    >
      <Row>
        <Col size={12}>
          <ZoneSelect name="zone" required valueKey="id" />
        </Col>
      </Row>
    </ActionForm>
  );
};

export default SetZoneForm;
