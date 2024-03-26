import { useState } from "react";

import { Col, NotificationSeverity, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteTagFormWarnings from "./DeleteTagFormWarnings";

import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage, useScrollToTop } from "@/app/base/hooks";
import type { EmptyObject } from "@/app/base/types";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";

type Props = {
  fromDetails?: boolean;
  id: Tag[TagMeta.PK];
  onClose: () => void;
};

export const DeleteTagForm = ({
  fromDetails = false,
  id,
  onClose,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector(tagSelectors.saved);
  const saving = useSelector(tagSelectors.saving);
  const errors = useSelector(tagSelectors.errors);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const [deletedTag, setDeletedTag] = useState<Tag["name"] | null>(
    tag?.name || null
  );
  useScrollToTop();
  useAddMessage(
    saved && !errors,
    tagActions.cleanup,
    `Deleted ${deletedTag || "tag"} from tag list.`,
    onClose,
    NotificationSeverity.POSITIVE
  );
  const onCancel = () => {
    onClose();
    if (fromDetails) {
      // Explicitly return to the page they user came from in case they have opened
      // the list of machines.
      navigate({ pathname: urls.tags.tag.index({ id: id }) });
    } else {
      navigate({ pathname: urls.tags.index });
    }
  };
  if (!tag) {
    return null;
  }
  return (
    <FormikForm<EmptyObject>
      aria-label="Delete tag"
      cleanup={tagActions.cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={onCancel}
      onSaveAnalytics={{
        action: "Delete",
        category: "Delete tag form",
        label: "Delete tag",
      }}
      onSubmit={() => {
        setDeletedTag(tag.name);
        dispatch(tagActions.cleanup());
        dispatch(tagActions.delete(tag.id));
      }}
      onSuccess={() => {
        onClose();
      }}
      saved={saved}
      savedRedirect={urls.tags.index}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    >
      <Row>
        <Col size={12}>
          <p className="u-nudge-down--small">
            {`${tag.name} will be deleted${
              tag.machine_count > 0
                ? " and unassigned from every tagged machine"
                : ""
            }. Are you sure?`}
          </p>
        </Col>
        <Col size={12}>
          <DeleteTagFormWarnings id={id} />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default DeleteTagForm;
