import { useEffect } from "react";

import { Button, Col, Icon, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TagUpdate from "../TagUpdate";

import ModelNotFound from "app/base/components/ModelNotFound";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { TagMeta } from "app/store/tag/types";
import BaseTagDetails from "app/tags/components/TagDetails";
import tagURLs from "app/tags/urls";
import { isId } from "app/utils";

export enum Label {
  AppliedTo = "Applied to",
  Comment = "Comment",
  Definition = "Definition (automatic tag)",
  Name = "Tag name",
  Options = "Kernel options",
  Update = "Last update",
}

type Props = {
  isEditing?: boolean;
  onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
};

const TagDetails = ({ isEditing, onDelete }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);

  useWindowTitle(tag ? `Tag: ${tag.name}` : "Tag");

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (!isId(id) || (!tagsLoading && !tag)) {
    return (
      <ModelNotFound id={id} linkURL={tagURLs.tags.index} modelName="tag" />
    );
  }

  if (!tag || tagsLoading) {
    return (
      <span data-testid="Spinner">
        <Spinner />
      </span>
    );
  }

  if (isEditing) {
    return <TagUpdate id={id} />;
  }

  return (
    <>
      <Row>
        <Col size={6}>
          <Link to={tagURLs.tags.index}>&lsaquo; Back to all tags</Link>
        </Col>
        <Col className="u-align--right" size={6}>
          <Button
            element={Link}
            hasIcon
            to={{
              pathname: tagURLs.tag.update({ id: tag.id }),
              state: { canGoBack: true },
            }}
          >
            <Icon className="is-light" name="edit" /> <span>Edit</span>
          </Button>
          <Button
            appearance="negative"
            hasIcon
            onClick={() => onDelete(tag[TagMeta.PK], true)}
          >
            <Icon className="is-light" name="delete" /> <span>Delete</span>
          </Button>
        </Col>
      </Row>
      <hr />
      <BaseTagDetails id={id} />
    </>
  );
};

export default TagDetails;
