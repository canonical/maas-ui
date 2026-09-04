import type { ReactElement } from "react";

import type {
  ButtonAppearance,
  ButtonProps,
  Position,
  ValueOf,
} from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";
import { useSelector } from "react-redux";

import {
  useMachineActionMenus,
  useLifecycleActionEntitlements,
} from "../hooks";
import type { MachineActionsProps } from "../types";

import type { DataTestElement } from "@/app/base/types";
import machineSelectors from "@/app/store/machine/selectors";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { canOpenActionForm } from "@/app/store/utils";
import "./_index.scss";

type MachineActionMenuProps = MachineActionsProps & {
  appearance?: ValueOf<typeof ButtonAppearance>;
  disabled?: boolean;
  label?: string;
  position?: Position;
};

type ActionLink = DataTestElement<ButtonProps>;

const MachineActionMenu = ({
  appearance = "base",
  disabled = false,
  disabledActions,
  excludeActions,
  isViewingDetails = false,
  label = "Menu",
  position,
  systemId,
}: MachineActionMenuProps): ReactElement => {
  const actionMenus = useMachineActionMenus(isViewingDetails, systemId);

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  const { actionsDisabled, deployDisabled } = useLifecycleActionEntitlements(
    isViewingDetails,
    systemId
  );

  return (
    <ContextualMenu
      hasToggleIcon
      links={actionMenus.reduce<ActionLink[][]>((links, group) => {
        const groupLinks = group.items.reduce<ActionLink[]>((actions, item) => {
          if (
            excludeActions &&
            excludeActions.some((action) => action === item.action)
          ) {
            return actions;
          }

          const isDisabledAction =
            disabledActions &&
            disabledActions.some((action) => action === item.action);

          const isVisible =
            isDisabledAction ||
            !machine ||
            canOpenActionForm(machine, item.action);
          if (!isVisible) {
            return actions;
          }

          const isGated =
            item.action === NodeActions.DEPLOY
              ? deployDisabled
              : actionsDisabled;

          actions.push({
            children: <span>{item.label}...</span>,
            disabled: isDisabledAction || isGated || undefined,
            onClick: item.onClick,
          });

          return actions;
        }, []);
        links.push(groupLinks);
        return links;
      }, [])}
      position={position}
      toggleAppearance={appearance}
      toggleClassName="p-action-menu"
      toggleDisabled={disabled}
      toggleLabel={label}
    />
  );
};

export default MachineActionMenu;
