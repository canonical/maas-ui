import { useEffect } from "react";

import { Button, Col, Icon, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

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
import { TagViewState } from "app/tags/types";
import tagURLs from "app/tags/urls";
import { isId } from "app/utils";

export enum Label {
  Title = "Tag details",
  AppliedTo = "Applied to",
  Comment = "Comment",
  Definition = "Definition (automatic tag)",
  DeleteButton = "Delete",
  EditButton = "Edit",
  Name = "Tag name",
  Options = "Kernel options",
  Update = "Last update",
}

export type Props = {
  onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
  tagViewState?: TagViewState | null;
};

const TagDetails = ({ onDelete, tagViewState }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  // Don't show the buttons when any of the forms are visible.
  const showButtons = !tagViewState;

  useWindowTitle(tag ? `Tag: ${tag.name}` : "Tag");

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (!isId(id) || (!tagsLoading && !tag)) {
    return <ModelNotFound id={id} linkURL={tagURLs.index} modelName="tag" />;
  }

  if (!tag || tagsLoading) {
    return (
      <span data-testid="Spinner">
        <Spinner />
      </span>
    );
  }

  if (tagViewState === TagViewState.Updating) {
    return <TagUpdate id={id} />;
  }

  return (
    <div aria-label={Label.Title}>
      <Row>
        <Col size={6}>
          <Link className="u-sv3" to={tagURLs.index}>
            &lsaquo; Back to all tags
          </Link>
        </Col>
        <Col className="u-align--right" size={6}>
          {showButtons ? (
            <>
              <Button
                element={Link}
                hasIcon
                state={{ canGoBack: true }}
                to={{
                  pathname: tagURLs.tag.update({ id: tag.id }),
                }}
              >
                <Icon name="edit" /> <span>{Label.EditButton}</span>
              </Button>
              <Button
                appearance="negative"
                hasIcon
                onClick={() => onDelete(tag[TagMeta.PK], true)}
              >
                <Icon className="is-light" name="delete" />{" "}
                <span>{Label.DeleteButton}</span>
              </Button>
            </>
          ) : null}
        </Col>
      </Row>
      <hr />
      <BaseTagDetails id={id} />
    </div>
  );
};

export default TagDetails;
