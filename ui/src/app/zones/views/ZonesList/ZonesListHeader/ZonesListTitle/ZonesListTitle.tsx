import { Tooltip, Icon, Button } from "@canonical/react-components";

const ZonesListTitle = (): JSX.Element => {
  return (
    <>
      Availability zones
      <span className="u-nudge-right">
        <Tooltip
          message="A representation of a grouping of nodes, typically by physical
            location."
        >
          <Button className="p-button--base u-no-margin--bottom u-no-padding u-match-h3">
            <Icon name="help">About availability zones</Icon>
          </Button>
        </Tooltip>
      </span>
    </>
  );
};

export default ZonesListTitle;
