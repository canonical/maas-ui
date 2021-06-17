import { Tooltip, Icon } from "@canonical/react-components";

const ZonesListTitle = (): JSX.Element => {
  return (
    <>
      <span className="p-heading--four">Availability zones</span>
      <span>
        <Tooltip
          message="A representation of a grouping of nodes, typically by physical
            location."
          className="u-nudge-right"
        >
          <Icon name="help" />
        </Tooltip>
      </span>
    </>
  );
};

export default ZonesListTitle;
