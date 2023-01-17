import { Col, Row } from "@canonical/react-components";
import * as Yup from "yup";

import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { nodeIsDevice, nodeIsMachine } from "app/store/utils";
import type { Zone } from "app/store/zone/types";
import { capitaliseFirst } from "app/utils";

type Props<E = null> = NodeActionFormProps<E> & {
  onSubmit: (zoneID: Zone["id"]) => void;
};

export type SetZoneFormValues = {
  zone: Zone["id"] | "";
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
  clearHeaderContent,
  cleanup,
  errors,
  nodes,
  modelName,
  onSubmit,
  processingCount,
  viewingDetails,
  selectedCount,
}: Props<E>): JSX.Element => {
  return (
    <ActionForm<SetZoneFormValues, E>
      actionName={NodeActions.SET_ZONE}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        zone: nodes ? getInitialZoneValue(nodes) : "",
      }}
      modelName={modelName}
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst(modelName)} ${
          viewingDetails ? "details" : "list"
        } action form`,
        label: "Set zone",
      }}
      onSubmit={(values) => {
        if (values.zone || values.zone === 0) {
          onSubmit(values.zone);
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={nodes ? nodes.length : selectedCount ?? 0}
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
