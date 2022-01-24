import Definition from "app/base/components/Definition";
import type { Fabric } from "app/store/fabric/types";

const FabricSummary = ({ fabric }: { fabric: Fabric }): JSX.Element => {
  return (
    <>
      <h2 className="p-heading--4">Fabric summary</h2>
      <Definition label="Name" description={fabric.name} />
      <Definition label="Rack controllers" />
      <Definition label="Description" description={fabric.description} />
    </>
  );
};

export default FabricSummary;
