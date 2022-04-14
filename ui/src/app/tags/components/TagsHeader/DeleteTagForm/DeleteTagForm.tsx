import { useState } from "react";

import { Col, NotificationSeverity, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import DeleteTagFormWarnings from "./DeleteTagFormWarnings";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage, useScrollToTop } from "app/base/hooks";
import type { EmptyObject } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";

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
  const history = useHistory();
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
      history.push({ pathname: tagsURLs.tag.index({ id: id }) });
    } else {
      history.push({ pathname: tagsURLs.tags.index });
    }
  };
  if (!tag) {
    return null;
  }
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        setDeletedTag(tag.name);
        dispatch(tagActions.cleanup());
        dispatch(tagActions.delete(tag.id));
      }}
    >
      <FormikFormContent<EmptyObject>
        aria-label="Delete tag"
        buttonsAlign="right"
        buttonsBordered={true}
        cleanup={tagActions.cleanup}
        errors={errors}
        onCancel={onCancel}
        onSaveAnalytics={{
          action: "Delete",
          category: "Delete tag form",
          label: "Delete tag",
        }}
        onSuccess={() => {
          onClose();
        }}
        saved={saved}
        savedRedirect={tagsURLs.tags.index}
        saving={saving}
        submitAppearance="negative"
        submitLabel="Delete"
      >
        <Row>
          <Col size={6}>
            <h4 className="u-nudge-down--small">
              {`${tag.name} will be deleted${
                tag.machine_count > 0
                  ? " and unassigned from every tagged machine"
                  : ""
              }. Are you sure?`}
            </h4>
          </Col>
          <Col size={6}>
            <DeleteTagFormWarnings id={id} />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default DeleteTagForm;
