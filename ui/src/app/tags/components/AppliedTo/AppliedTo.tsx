import { useSelector } from "react-redux";

import NodesTagsLink from "../NodesTagsLink";

import Definition from "app/base/components/Definition";
import { ControllerMeta } from "app/store/controller/types";
import { DeviceMeta } from "app/store/device/types";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";

type Props = {
  id: Tag[TagMeta.PK];
};

export enum Label {
  AppliedTo = "Applied to",
}

const AppliedTo = ({ id }: Props): JSX.Element | null => {
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );

  if (!tag) {
    return null;
  }
  return (
    <Definition label={Label.AppliedTo}>
      {tag.machine_count > 0 ? (
        <NodesTagsLink
          count={tag.machine_count}
          nodeType={MachineMeta.MODEL}
          tags={[tag.name]}
        />
      ) : null}
      {tag.controller_count > 0 ? (
        <NodesTagsLink
          count={tag.controller_count}
          nodeType={ControllerMeta.MODEL}
          tags={[tag.name]}
        />
      ) : null}
      {tag.device_count > 0 ? (
        <NodesTagsLink
          count={tag.device_count}
          nodeType={DeviceMeta.MODEL}
          tags={[tag.name]}
        />
      ) : null}
    </Definition>
  );
};

export default AppliedTo;
