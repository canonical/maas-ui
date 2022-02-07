import { useCallback } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange } from "app/store/iprange/types";
import { IPRangeType, IPRangeMeta } from "app/store/iprange/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

type Props = {
  id?: IPRange[IPRangeMeta.PK] | null;
  onClose: () => void;
};

export type FormValues = {
  comment: IPRange["comment"];
  end_ip: IPRange["end_ip"];
  start_ip: IPRange["start_ip"];
};

const Schema = Yup.object().shape({
  comment: Yup.string(),
  end_ip: Yup.string().required("Start IP is required"),
  start_ip: Yup.string().required("End IP is required"),
});

const ReservedRangeForm = ({
  id,
  onClose,
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
    <FormikForm<FormValues>
      aria-label={`${isEditing ? "Edit" : "Create"} reserved range`}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        comment: initialComment,
        end_ip: ipRange?.end_ip ?? "",
        start_ip: ipRange?.start_ip ?? "",
      }}
      onSaveAnalytics={{
        action: "Save reserved range",
        category: "Reserved ranges table",
        label: `${isEditing ? "Edit" : "Create"} reserved range form`,
      }}
      onCancel={onClose}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        if (isEditing && ipRange) {
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
        <Col size={6}>
          <FormikField
            label="Start IP address"
            name="start_ip"
            required
            type="text"
          />
          <FormikField
            disabled={showDynamicComment}
            label="Purpose"
            name="comment"
            placeholder="IP range purpose (optional)"
            type="text"
          />
        </Col>
        <Col size={6}>
          <FormikField
            label="End IP address"
            name="end_ip"
            required
            type="text"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default ReservedRangeForm;
