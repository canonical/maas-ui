import type { ControllerDetails } from "app/store/controller/types";

type Props = {
  controller: ControllerDetails;
};

const ControllerStatusCard = ({ controller }: Props): JSX.Element => {
  // TODO: Build controller status card
  return (
    <>
      <div className="overview-card__status" data-testid="controller-status">
        <strong className="p-muted-heading">regiond + rackd status</strong>
        <h4 className="u-no-margin--bottom">{controller.hostname}</h4>
      </div>
      <div className="overview-card__test-warning" />
    </>
  );
};

export default ControllerStatusCard;
