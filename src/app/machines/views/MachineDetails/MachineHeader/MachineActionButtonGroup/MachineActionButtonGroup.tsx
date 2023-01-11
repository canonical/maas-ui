import { Button, Icon } from "@canonical/react-components";

import PowerIcon from "app/base/components/PowerIcon";
import { PowerState } from "app/store/types/enum";

export const MachineActionButtonGroup = (): JSX.Element => {
  return (
    <div className="p-button-group">
      <div>
        <div className="u-sv1 p-muted-heading">Actions</div>
        <div className="p-button-group__subgroup">
          <Button>Commission</Button>
          <Button>Allocate</Button>
          <Button>Deploy</Button>
          <Button>Release</Button>
          <Button>Abort</Button>
          <Button>Clone from</Button>
        </div>
      </div>
      <div>
        <div className="u-sv1 p-muted-heading">Power cycle</div>
        <div className="p-button-group__subgroup">
          <Button>
            <PowerIcon powerState={PowerState.ON}>On</PowerIcon>
          </Button>
          <Button>
            <PowerIcon powerState={PowerState.ERROR}>Off</PowerIcon>
          </Button>
          <Button>Check</Button>
        </div>
      </div>
      <div>
        <div className="u-sv1 p-muted-heading">Troubleshoot</div>
        <div className="p-button-group__subgroup">
          <Button>Test</Button>
          <Button>Rescue</Button>
          <Button>Mark broken</Button>
        </div>
      </div>
      <div>
        <div className="u-sv1 p-muted-heading">Categorize</div>
        <div className="p-button-group__subgroup">
          <Button>Tag</Button>
          <Button>Set zone</Button>
          <Button>Set pool</Button>
        </div>
      </div>
      <div>
        <div className="u-sv1 p-muted-heading">Lock/Unlock</div>
        <div className="p-button-group__subgroup">
          <Button>
            <Icon name="lock" />
          </Button>
          <Button>
            <Icon name="unlock" />
          </Button>
        </div>
      </div>
      <div>
        <div className="u-sv1 p-muted-heading">Delete</div>
        <div className="p-button-group__subgroup">
          <Button>
            <Icon name="delete" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MachineActionButtonGroup;
