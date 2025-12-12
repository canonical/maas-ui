import { useDispatch, useSelector } from "react-redux";

import SetControllerZoneForm from "../SetControllerZoneForm";

import DeleteForm from "@/app/base/components/node/DeleteForm";
import FieldlessForm from "@/app/base/components/node/FieldlessForm";
import NodeActionFormWrapper from "@/app/base/components/node/NodeActionFormWrapper";
import TestForm from "@/app/base/components/node/TestForm";
import type { HardwareType } from "@/app/base/enum";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import urls from "@/app/base/urls";
import { getProcessingCount } from "@/app/controllers/utils";
import { controllerActions } from "@/app/store/controller";
import controllerSelectors, {
  statusSelectors,
} from "@/app/store/controller/selectors";
import { ACTIONS } from "@/app/store/controller/slice";
import type {
  Controller,
  ControllerActions,
} from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { kebabToCamelCase } from "@/app/utils";

type Props = {
  action: ControllerActions;
  applyConfiguredNetworking?: boolean;
  hardwareType?: HardwareType;
  controllers: Controller[];
  viewingDetails: boolean;
};

export const ControllerActionFormWrapper = ({
  action,
  applyConfiguredNetworking,
  hardwareType,
  controllers,
  viewingDetails,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const actionStatus = ACTIONS.find(({ name }) => name === action)?.status;
  const processingControllers = useSelector(
    actionStatus ? statusSelectors[actionStatus] : () => []
  );
  const { closeSidePanel } = useSidePanel();
  const controllerSystemIds = controllers.map(({ system_id }) => system_id);
  // The form expects one error, so we only show the latest error with the
  // assumption that all selected controllers fail in the same way.
  const errors = useSelector((state: RootState) =>
    controllerSelectors.eventErrorsForControllers(
      state,
      controllerSystemIds,
      kebabToCamelCase(action)
    )
  )[0]?.error;
  const processingCount = getProcessingCount(
    controllers,
    processingControllers
  );
  const commonNodeFormProps = {
    cleanup: controllerActions.cleanup,
    clearSidePanelContent: closeSidePanel,
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
                dispatch(
                  controllerActions.delete({ system_id: controller.system_id })
                );
              });
            }}
            redirectURL={urls.controllers.index}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.SET_ZONE:
        return (
          <SetControllerZoneForm
            controllers={controllers}
            isViewingDetails={viewingDetails}
          />
        );
      case NodeActions.TEST:
        return (
          <TestForm
            applyConfiguredNetworking={applyConfiguredNetworking}
            hardwareType={hardwareType}
            onTest={(args) => {
              dispatch(
                controllerActions.test({
                  enable_ssh: args.enableSSH,
                  script_input: args.scriptInputs,
                  system_id: args.systemId as string,
                  testing_scripts: args.scripts.map((script) => script.name),
                })
              );
            }}
            {...commonNodeFormProps}
          />
        );
      case NodeActions.IMPORT_IMAGES:
      case NodeActions.OFF:
      case NodeActions.ON:
      case NodeActions.OVERRIDE_FAILED_TESTING:
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
      clearSidePanelContent={closeSidePanel}
      nodeType="controller"
      nodes={controllers}
      onUpdateSelected={(controllerIDs) =>
        dispatch(controllerActions.setSelected(controllerIDs))
      }
      processingCount={processingCount}
      viewingDetails={viewingDetails}
    >
      {getFormComponent()}
    </NodeActionFormWrapper>
  );
};

export default ControllerActionFormWrapper;
