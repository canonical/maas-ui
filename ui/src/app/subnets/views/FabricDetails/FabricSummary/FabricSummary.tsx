import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ControllerLink from "app/base/components/ControllerLink";
import Definition from "app/base/components/Definition";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { BaseController } from "app/store/controller/types/base";
import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";

const FabricSummary = ({ fabric }: { fabric: Fabric }): JSX.Element => {
  const dispatch = useDispatch();
  const controllers: (BaseController | undefined)[] = useSelector(
    (state: RootState) => controllerSelectors.getByFabricId(state, fabric.id)
  );

  useEffect(() => {
    dispatch(vlanActions.fetch());
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  return (
    <>
      <h2 className="p-heading--4">Fabric summary</h2>
      <Definition label="Name" description={fabric.name} />
      <Definition label="Rack controllers">
        {controllers.map((controller) =>
          controller ? (
            <ControllerLink key={controller.id} {...controller} />
          ) : null
        )}
      </Definition>
      <Definition label="Description" description={fabric.description} />
    </>
  );
};

export default FabricSummary;
