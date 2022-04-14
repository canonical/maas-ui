import { useCallback } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange } from "app/store/iprange/types";
import { IPRangeType, IPRangeMeta } from "app/store/iprange/types";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { isId } from "app/utils";

type Props = {
  createType?: IPRangeType;
  id?: IPRange[IPRangeMeta.PK] | null;
  onClose: () => void;
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
  end_ip: Yup.string().required("Start IP is required"),
  start_ip: Yup.string().required("End IP is required"),
});

const ReservedRangeForm = ({
  createType,
  id,
  onClose,
  subnetId,
  ...props
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const ipRange = useSelector((state: RootState) =>
    ipRangeSelectors.getById(state, id)
  );
  const saved = useSelector(ipRangeSelectors.saved);
  const saving = useSelector(ipRangeSelectors.saving);
  const errors = useSelector(ipRangeSelectors.errors);
  const cleanup = useCallback(() => ipRangeActions.cleanup(), []);
  const isEditing = isId(id);

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
    <Formik
      initialValues={{
        comment: initialComment,
        end_ip: ipRange?.end_ip ?? "",
        start_ip: ipRange?.start_ip ?? "",
      }}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        if (!isEditing && createType) {
          dispatch(
            ipRangeActions.create({
              subnet: subnetId,
              type: createType,
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
      validationSchema={Schema}
    >
      <FormikFormContent<FormValues>
        aria-label={isEditing ? Labels.EditRange : Labels.CreateRange}
        cleanup={cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: "Save reserved range",
          category: "Reserved ranges table",
          label: `${isEditing ? "Edit" : "Create"} reserved range form`,
        }}
        onCancel={onClose}
        onSuccess={() => onClose()}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel={isEditing ? "Save" : "Reserve"}
        {...props}
      >
        <Row>
          <Col size={4}>
            <FormikField
              label={Labels.StartIp}
              name="start_ip"
              required
              type="text"
            />
          </Col>
          <Col size={4}>
            <FormikField
              label={Labels.EndIp}
              name="end_ip"
              required
              type="text"
            />
          </Col>
          {isEditing || createType === IPRangeType.Reserved ? (
            <Col size={4}>
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
      </FormikFormContent>
    </Formik>
  );
};

export default ReservedRangeForm;
