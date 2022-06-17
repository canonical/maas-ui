import pluralize from "pluralize";
import { Link } from "react-router-dom";

import TestResults from "app/base/components/node/TestResults";
import { HardwareType } from "app/base/enum";
import controllerURLs from "app/controllers/urls";
import type { MachineSetHeaderContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
  setHeaderContent?: MachineSetHeaderContent;
};

const StorageCard = ({ node, setHeaderContent }: Props): JSX.Element => (
  <>
    <div className="overview-card__storage">
      <strong className="p-muted-heading">Storage</strong>
      <h4>
        <span>{node.storage ? `${node.storage} GB` : "Unknown"}</span>
        {node.storage && node.physical_disk_count ? (
          <small className="u-text--muted">
            &nbsp;over {pluralize("disk", node.physical_disk_count, true)}
          </small>
        ) : null}
      </h4>
    </div>
    {nodeIsMachine(node) && setHeaderContent ? (
      <TestResults
        hardwareType={HardwareType.Storage}
        machine={node}
        setHeaderContent={setHeaderContent}
      />
    ) : (
      <div className="overview-card__storage-tests">
        <Link to={controllerURLs.controller.storage({ id: node.system_id })}>
          See storage
        </Link>
      </div>
    )}
  </>
);

export default StorageCard;
