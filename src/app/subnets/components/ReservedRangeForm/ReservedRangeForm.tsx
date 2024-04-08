import { useCallback } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import {
  useSidePanel,
  type SetSidePanelContent,
} from "@/app/base/side-panel-context";
import { ipRangeActions } from "@/app/store/iprange";
import ipRangeSelectors from "@/app/store/iprange/selectors";
import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType, IPRangeMeta } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";
import { isId } from "@/app/utils";

type Props = {
  createType?: IPRangeType;
  ipRangeId?: IPRange[IPRangeMeta.PK] | null;
  setSidePanelContent: SetSidePanelContent;
  subnetId?: Subnet[SubnetMeta.PK] | null;
};

export type FormValues = {
  comment: IPRange["comment"];
  end_ip: IPRange["end_ip"];
  start_ip: IPRange["start_ip"];
};

export enum Labels {
  CreateRange = "Create reserved range",
  EditRange = "Edit reserved range",
  EndIp = "End IP address",
  Comment = "Purpose",
  StartIp = "Start IP address",
}

const Schema = Yup.object().shape({
  comment: Yup.string(),
  start_ip: Yup.string().required("Start IP is required"),
  end_ip: Yup.string().required("End IP is required"),
});

const ReservedRangeForm = ({
  createType,
  ipRangeId,
  setSidePanelContent,
  subnetId,
  ...props
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { sidePanelContent } = useSidePanel();
  let computedIpRangeId = ipRangeId;
  if (!ipRangeId) {
    computedIpRangeId =
      sidePanelContent?.extras && "ipRangeId" in sidePanelContent.extras
        ? sidePanelContent?.extras?.ipRangeId
        : undefined;
  }
  const ipRange = useSelector((state: RootState) =>
    ipRangeSelectors.getById(state, computedIpRangeId)
  );
  const saved = useSelector(ipRangeSelectors.saved);
  const saving = useSelector(ipRangeSelectors.saving);
  const errors = useSelector(ipRangeSelectors.errors);
  const cleanup = useCallback(() => ipRangeActions.cleanup(), []);
  const isEditing = isId(computedIpRangeId);
  const onClose = () => setSidePanelContent(null);
  let computedCreateType = createType;
  if (!createType) {
    computedCreateType =
      sidePanelContent?.extras && "createType" in sidePanelContent.extras
        ? sidePanelContent?.extras?.createType
        : undefined;
  }

  if (isEditing && !ipRange) {
    return (
      <span data-testid="Spinner">
        <Spinner text="Loading..." />
      </span>
    );
  }
  let initialComment = "";
  const showDynamicComment = isEditing && ipRange?.type === IPRangeType.Dynamic;
  if (showDynamicComment) {
    initialComment = "Dynamic";
  } else if (isEditing) {
    initialComment = ipRange?.comment ?? "";
  }

  return (
    <FormikForm<FormValues>
      aria-label={isEditing ? Labels.EditRange : Labels.CreateRange}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        comment: initialComment,
        end_ip: ipRange?.end_ip ?? "",
        start_ip: ipRange?.start_ip ?? "",
      }}
      onCancel={onClose}
      onSaveAnalytics={{
        action: "Save reserved range",
        category: "Reserved ranges table",
        label: `${isEditing ? "Edit" : "Create"} reserved range form`,
      }}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        if (!isEditing && computedCreateType) {
          dispatch(
            ipRangeActions.create({
              subnet: subnetId,
              type: computedCreateType,
              ...values,
            })
          );
        } else if (isEditing && ipRange) {
          dispatch(
            ipRangeActions.update({
              [IPRangeMeta.PK]: ipRange[IPRangeMeta.PK],
              ...values,
              // Reset the value of the comment field so that "Dynamic" isn't stored.
              comment: showDynamicComment ? ipRange?.comment : values.comment,
            })
          );
        }
      }}
      onSuccess={() => onClose()}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel={isEditing ? "Save" : "Reserve"}
      validationSchema={Schema}
      {...props}
    >
      <Row>
        <Col size={12}>
          <FormikField
            label={Labels.StartIp}
            name="start_ip"
            required
            type="text"
          />
        </Col>
        <Col size={12}>
          <FormikField
            label={Labels.EndIp}
            name="end_ip"
            required
            type="text"
          />
        </Col>
        {isEditing || computedCreateType === IPRangeType.Reserved ? (
          <Col size={12}>
            <FormikField
              disabled={showDynamicComment}
              label={Labels.Comment}
              name="comment"
              placeholder="IP range purpose (optional)"
              type="text"
            />
          </Col>
        ) : null}
      </Row>
    </FormikForm>
  );
};

export default ReservedRangeForm;
