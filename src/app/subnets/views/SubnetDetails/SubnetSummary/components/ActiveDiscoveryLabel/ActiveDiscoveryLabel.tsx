import TooltipButton from "app/base/components/TooltipButton";

const ActiveDiscoveryLabel = (): JSX.Element => (
  <>
    Active discovery{" "}
    <TooltipButton
      message={`When enabled, MAAS will scan this subnet to discover hosts
        that have not been discovered passively.`}
      position="btm-right"
      positionElementClassName="u-display--inline"
    />
  </>
);

export default ActiveDiscoveryLabel;
