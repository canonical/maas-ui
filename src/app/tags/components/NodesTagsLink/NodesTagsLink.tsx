import pluralize from "pluralize";
import { Link } from "react-router-dom-v5-compat";

import urls from "app/base/urls";
import { ControllerMeta } from "app/store/controller/types";
import { DeviceMeta } from "app/store/device/types";
import { MachineMeta } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import type { Tag } from "app/store/tag/types";
import type { NodeModel } from "app/store/types/node";

type Props = {
  count: number;
  nodeType: NodeModel;
  tags: Tag["name"][];
};

const NodesTagsLink = ({
  count,
  nodeType,
  tags,
}: Props): JSX.Element | null => {
  let url: string | null = null;
  let nodeName: string | null = null;
  switch (nodeType) {
    case MachineMeta.MODEL:
      url = urls.machines.index;
      nodeName = "machine";
      break;
    case ControllerMeta.MODEL:
      url = urls.controllers.index;
      nodeName = "controller";
      break;
    case DeviceMeta.MODEL:
      url = urls.devices.index;
      nodeName = "device";
      break;
  }
  if (!url || !nodeName) {
    return null;
  }
  const filters = FilterMachines.filtersToQueryString({
    tags: [`=${tags.join(",")}`],
  });
  return (
    <Link className="u-display--block" to={`${url}${filters}`}>
      {pluralize(nodeName, count, true)}
    </Link>
  );
};

export default NodesTagsLink;
