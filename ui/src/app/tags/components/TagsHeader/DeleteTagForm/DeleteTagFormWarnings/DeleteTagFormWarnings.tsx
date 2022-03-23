import { Notification } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";

type Props = {
  id: Tag[TagMeta.PK];
};

const generateWarning = (nodeType: string, count: number) => (
  <Notification
    className="delete-tag-form-warnings__notification"
    severity="caution"
  >
    There {count === 1 ? "is" : "are"} {pluralize(nodeType, count, true)} with
    this tag.
  </Notification>
);

export const DeleteTagFormWarnings = ({ id }: Props): JSX.Element | null => {
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  if (!tag) {
    return null;
  }
  return (
    <div className="delete-tag-form-warnings">
      {!!tag.kernel_opts && tag.machine_count > 0 ? (
        <Notification
          className="delete-tag-form-warnings__notification"
          severity="caution"
        >
          You are deleting a tag with kernel options. There{" "}
          {tag.machine_count === 1 ? "is" : "are"}{" "}
          {pluralize("machine", tag.machine_count, true)} with this tag and they
          will not be affected until they are redeployed.
        </Notification>
      ) : null}
      {tag.device_count > 0
        ? generateWarning("device", tag.device_count)
        : null}
      {tag.controller_count > 0
        ? generateWarning("controller", tag.controller_count)
        : null}
    </div>
  );
};

export default DeleteTagFormWarnings;
