import { useDispatch, useSelector } from "react-redux";

import { SetZoneForm as BaseSetZoneForm } from "@/app/base/components/node/SetZoneForm/SetZoneForm";
import { getProcessingCount } from "@/app/controllers/utils";
import { controllerActions } from "@/app/store/controller";
import controllerSelectors, {
  statusSelectors,
} from "@/app/store/controller/selectors";
import { ACTIONS } from "@/app/store/controller/slice";
import type { Controller } from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { kebabToCamelCase } from "@/app/utils";

type Props = {
  controllers: Controller[];
  isViewingDetails: boolean;
};

const SetZoneForm = ({ controllers, isViewingDetails }: Props) => {
  const dispatch = useDispatch();
  const actionStatus = ACTIONS.find(
    ({ name }) => name === NodeActions.SET_ZONE
  )?.status;
  const systemIds = controllers.map((controller) => controller.system_id);
  const errors = useSelector((state: RootState) =>
    controllerSelectors.eventErrorsForControllers(
      state,
      systemIds,
      kebabToCamelCase(NodeActions.SET_ZONE)
    )
  )[0]?.error;
  const processingControllers = useSelector(
    actionStatus ? statusSelectors[actionStatus] : () => []
  );
  const processingCount = getProcessingCount(
    controllers,
    processingControllers
  );

  return (
    <BaseSetZoneForm
      cleanup={controllerActions.cleanup}
      errors={errors}
      isViewingDetails={isViewingDetails}
      modelName="controller"
      nodes={controllers}
      onSubmit={(zoneId) => {
        systemIds.forEach((systemId) => {
          dispatch(
            controllerActions.setZone({ system_id: systemId, zone_id: zoneId })
          );
        });
      }}
      processingCount={processingCount}
    />
  );
};

export default SetZoneForm;
