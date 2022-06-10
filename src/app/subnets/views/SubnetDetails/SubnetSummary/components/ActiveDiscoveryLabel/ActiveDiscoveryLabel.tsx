import TooltipButton from "app/base/components/TooltipButton";
import type { Subnet } from "app/store/subnet/types";

type Props = {
  managed: Subnet["managed"];
};

const ActiveDiscoveryLabel = ({ managed }: Props): JSX.Element => (
  <>
    Active discovery{" "}
    {managed ? (
      <TooltipButton
        message={`When enabled, MAAS will scan this subnet to discover hosts
        that have not been discovered passively.`}
        position="btm-right"
      />
    ) : null}
  </>
);

export default ActiveDiscoveryLabel;
