import { useEffect } from "react";

import {
  Button,
  CodeSnippet,
  Col,
  Icon,
  Row,
  Spinner,
} from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Definition from "app/base/components/Definition";
import ModelNotFound from "app/base/components/ModelNotFound";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { TagMeta } from "app/store/tag/types";
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

const TagDetails = (): JSX.Element => {
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

  return (
    <>
      <Row>
        <Col size={6}>
          <Link to={tagURLs.tags.index}>&lsaquo; Back to all tags</Link>
        </Col>
        <Col className="u-align--right" size={6}>
          <Button hasIcon>
            <Icon className="is-light" name="edit" /> <span>Edit</span>
          </Button>
          <Button appearance="negative" hasIcon>
            <Icon className="is-light" name="delete" /> <span>Delete</span>
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col size={2}>
          <Definition description={tag.name} label={Label.Name} />
        </Col>
        <Col size={2}>
          <Definition description={tag.updated} label={Label.Update} />
        </Col>
        <Col size={2}>
          <Definition label={Label.AppliedTo}>
            <>
              {tag.machine_count > 0 ? (
                <Link
                  className="u-block"
                  to={`${machineURLs.machines.index}?tags=${tag.name}`}
                >
                  {pluralize("machine", tag.machine_count, true)}
                </Link>
              ) : null}
              {tag.controller_count > 0 ? (
                <Link
                  className="u-block"
                  to={`${controllerURLs.controllers.index}?tags=${tag.name}`}
                >
                  {pluralize("controller", tag.controller_count, true)}
                </Link>
              ) : null}
              {tag.device_count > 0 ? (
                <Link
                  className="u-block"
                  to={`${deviceURLs.devices.index}?tags=${tag.name}`}
                >
                  {pluralize("device", tag.device_count, true)}
                </Link>
              ) : null}
            </>
          </Definition>
        </Col>
        <Col size={6}>
          <Definition description={tag.comment} label={Label.Comment} />
        </Col>
      </Row>
      <hr className="u-sv1" />
      <Row>
        <Col size={6}>
          <p className="u-text--muted">{Label.Options}</p>
          {tag.kernel_opts ? (
            <CodeSnippet
              blocks={[
                {
                  code: tag.kernel_opts,
                },
              ]}
            />
          ) : (
            "None"
          )}
        </Col>
        <Col size={6}>
          <p className="u-text--muted">{Label.Definition}</p>
          {tag.definition ? (
            <CodeSnippet
              blocks={[
                {
                  code: tag.definition,
                },
              ]}
            />
          ) : (
            "None"
          )}
        </Col>
      </Row>
    </>
  );
};

export default TagDetails;
