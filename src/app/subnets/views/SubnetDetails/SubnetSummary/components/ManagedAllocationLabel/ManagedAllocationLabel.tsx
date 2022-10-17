import TooltipButton from "app/base/components/TooltipButton";

const ManagedAllocationLabel = (): JSX.Element => (
  <>
    Managed allocation{" "}
    <TooltipButton
      message={`When enabled, MAAS allocates IP addresses from this subnet, excluding the
        reserved and dynamic ranges.`}
      position="btm-right"
      positionElementClassName="u-display--inline"
    />
  </>
);

export default ManagedAllocationLabel;
