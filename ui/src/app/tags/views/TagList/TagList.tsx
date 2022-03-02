import { useEffect } from "react";

import { Icon, MainTable, Tooltip } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TableActions from "app/base/components/TableActions";
import { useWindowTitle } from "app/base/hooks";
import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import tagURLs from "app/tags/urls";
import { breakLines, unindentString } from "app/utils";

export enum Label {
  Actions = "Actions",
  AppliedTo = "Applied to",
  Auto = "Auto",
  Name = "Tag name",
  Options = "Kernel options",
  Updated = "Last update",
}

const generateRows = (tags: Tag[]) =>
  tags.map((tag) => {
    return {
      key: `tag-row-${tag.id}`,
      columns: [
        {
          "aria-label": Label.Name,
          content: (
            <Link to={tagURLs.tag.index({ id: tag.id })}>{tag.name}</Link>
          ),
        },
        {
          "aria-label": Label.Updated,
          content: tag.updated,
        },
        {
          "aria-label": Label.Auto,
          content: !!tag.definition ? <Icon name="success-grey" /> : null,
        },
        {
          "aria-label": Label.AppliedTo,
          content: (
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
          ),
        },
        {
          "aria-label": Label.Options,
          content: !!tag.kernel_opts ? <Icon name="success-grey" /> : null,
        },
        {
          "aria-label": Label.Actions,
          content: (
            <TableActions
              onDelete={() => {
                // TODO: Implement the delete form:
                // https://github.com/canonical-web-and-design/app-tribe/issues/701
              }}
              onEdit={() => {
                // TODO: Implement tag edit form:
                // https://github.com/canonical-web-and-design/app-tribe/issues/706
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      sortData: {
        name: tag.name,
        updated: tag.updated,
      },
    };
  });

const TagList = (): JSX.Element => {
  const dispatch = useDispatch();
  const tags = useSelector(tagSelectors.all);

  useWindowTitle("Tags");

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <MainTable
      className="p-table-expanding--light"
      headers={[
        {
          content: Label.Name,
          sortKey: "name",
        },
        {
          content: Label.Updated,
          sortKey: "updated",
        },
        {
          content: (
            <>
              {Label.Auto}{" "}
              <Tooltip
                // TODO: add a link to the docs:
                // https://github.com/canonical-web-and-design/app-tribe/issues/739
                message={
                  <>
                    {breakLines(
                      unindentString(
                        `Automatic tags are automatically applied to every 
                        machine that matches their definition.`
                      )
                    )}
                    <br />
                    <a href="#todo">
                      Check the documentation about automatic tags.
                    </a>
                  </>
                }
                position="top-center"
              >
                <Icon name="information" />
              </Tooltip>
            </>
          ),
        },
        {
          content: Label.AppliedTo,
        },
        {
          content: Label.Options,
        },
        {
          content: Label.Actions,
          className: "u-align--right",
        },
      ]}
      rows={generateRows(tags)}
      paginate={50}
      sortable
      defaultSort="name"
      defaultSortDirection="ascending"
    />
  );
};

export default TagList;
