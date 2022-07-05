import TooltipButton from "app/base/components/TooltipButton";
import type { Subnet } from "app/store/subnet/types";

type Props = {
  managed: Subnet["managed"];
};

const ManagedAllocationLabel = ({ managed }: Props): JSX.Element => (
  <>
    Managed allocation{" "}
    {managed ? null : (
      <TooltipButton
        message={`MAAS allocates IP addresses from this subnet, excluding the
        reserved and dynamic ranges.`}
        position="btm-right"
        positionElementClassName="u-display--inline"
      />
    )}
  </>
);

export default ManagedAllocationLabel;
