import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ControllerLink from "app/base/components/ControllerLink";
import Definition from "app/base/components/Definition";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

const FabricSummary = ({ fabric }: { fabric: Fabric }): JSX.Element => {
  const dispatch = useDispatch();
  const controllers = useSelector((state: RootState) =>
    controllerSelectors.getByFabricId(state, fabric.id)
  );
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const controllersLoaded = useSelector(controllerSelectors.loaded);

  useEffect(() => {
    if (!vlansLoaded) dispatch(vlanActions.fetch());
    if (!controllersLoaded) dispatch(controllerActions.fetch());
  }, [dispatch, vlansLoaded, controllersLoaded]);

  return (
    <Strip shallow>
      <h2 className="p-heading--4">Fabric summary</h2>
      <Definition label="Name" description={fabric.name} />
      <Definition label="Rack controllers">
        {!controllersLoaded || !vlansLoaded ? (
          <Spinner aria-label="loading" />
        ) : (
          controllers.map((controller) =>
            controller ? (
              <ControllerLink key={controller.id} {...controller} />
            ) : null
          )
        )}
      </Definition>
      <Definition label="Description" description={fabric.description} />
    </Strip>
  );
};

export default FabricSummary;
