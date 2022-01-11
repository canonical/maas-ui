import { useDispatch, useSelector } from "react-redux";

import DeleteForm from "app/base/components/node/DeleteForm";
import FieldlessForm from "app/base/components/node/FieldlessForm";
import NodeActionFormWrapper from "app/base/components/node/NodeActionFormWrapper";
import SetZoneForm from "app/base/components/node/SetZoneForm";
import TestForm from "app/base/components/node/TestForm";
import type { HardwareType } from "app/base/enum";
import type { ClearHeaderContent } from "app/base/types";
import controllerURLs from "app/controllers/urls";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors, {
  statusSelectors,
} from "app/store/controller/selectors";
import { ACTIONS } from "app/store/controller/slice";
import type { Controller, ControllerActions } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import { kebabToCamelCase } from "app/utils";

type Props = {
  action: ControllerActions;
  applyConfiguredNetworking?: boolean;
  clearHeaderContent: ClearHeaderContent;
  hardwareType?: HardwareType;
  controllers: Controller[];
  viewingDetails: boolean;
};

const getProcessingCount = (
  selectedControllers: Controller[],
  processingControllers: Controller[]
) => {
  return processingControllers.reduce<number>((count, processingController) => {
    const controllerInSelection = selectedControllers.some(
      (controller) => controller.system_id === processingController.system_id
    );
    return controllerInSelection ? count + 1 : count;
  }, 0);
};

export const ControllerActionFormWrapper = ({
  action,
  applyConfiguredNetworking,
  clearHeaderContent,
  hardwareType,
  controllers,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const actionStatus = ACTIONS.find(({ name }) => name === action)?.status;
  const processingControllers = useSelector(
    actionStatus ? statusSelectors[actionStatus] : () => []
  );
  // The form expects one error, so we only show the latest error with the
  // assumption that all selected controllers fail in the same way.
  const errors = useSelector((state: RootState) =>
    controllerSelectors.eventErrorsForControllers(
      state,
      controllers.map(({ system_id }) => system_id),
      kebabToCamelCase(action)
    )
  )[0]?.error;
  const processingCount = getProcessingCount(
    controllers,
    processingControllers
  );
  const commonNodeFormProps = {
    cleanup: controllerActions.cleanup,
    clearHeaderContent,
    errors,
    modelName: "controller",
    nodes: controllers,
    processingCount,
    viewingDetails,
  };

  const getFormComponent = () => {
    switch (action) {
      case NodeActions.DELETE:
        return (
          <DeleteForm
            onSubmit={() => {
              controllers.forEach((controller) => {
                dispatch(controllerActions.delete(controller.system_id));
              });
            }}
            redirectURL={controllerURLs.controllers.index}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.OVERRIDE_FAILED_TESTING:
        // TODO: Add override failed testing form.
        // https://github.com/canonical-web-and-design/app-tribe/issues/618
        return null;
      case NodeActions.SET_ZONE:
        return (
          <SetZoneForm
            onSubmit={(zoneID) => {
              dispatch(controllerActions.cleanup());
              controllers.forEach((controller) => {
                dispatch(
                  controllerActions.setZone({
                    systemId: controller.system_id,
                    zoneId: zoneID,
                  })
                );
              });
            }}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.TEST:
        return (
          <TestForm
            applyConfiguredNetworking={applyConfiguredNetworking}
            hardwareType={hardwareType}
            onTest={(args) => {
              dispatch(controllerActions.test(args));
            }}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.IMPORT_IMAGES:
      case NodeActions.OFF:
      case NodeActions.ON:
        return (
          <FieldlessForm
            action={action}
            actions={controllerActions}
            {...commonNodeFormProps}
          />
        );
    }
  };

  return (
    <NodeActionFormWrapper
      action={action}
      clearHeaderContent={clearHeaderContent}
      nodes={controllers}
      nodeType="controller"
      processingCount={processingCount}
      onUpdateSelected={(controllerIDs) =>
        dispatch(controllerActions.setSelected(controllerIDs))
      }
      viewingDetails={viewingDetails}
    >
      {getFormComponent()}
    </NodeActionFormWrapper>
  );
};

export default ControllerActionFormWrapper;
