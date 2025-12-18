import type { ReactElement } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useMachineActionMenus } from "../hooks";
import type { MachineActionsProps } from "../types";

import type { DataTestElement } from "@/app/base/types";
import machineSelectors from "@/app/store/machine/selectors";
import type { RootState } from "@/app/store/root/types";
import { canOpenActionForm } from "@/app/store/utils";

type MachineActionMenuProps = MachineActionsProps;

type ActionLink = DataTestElement<ButtonProps>;

const MachineActionMenu = ({
  disabledActions,
  isMachineLocked,
  isViewingDetails = false,
  systemId,
}: MachineActionMenuProps): ReactElement => {
  const actionMenus = useMachineActionMenus(
    isMachineLocked ?? false,
    isViewingDetails,
    systemId
  );

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  return (
    <ContextualMenu
      className="is-maas-select"
      hasToggleIcon
      links={actionMenus.reduce<ActionLink[][]>((links, group) => {
        const groupLinks = group.items.reduce<ActionLink[]>((actions, item) => {
          if (
            disabledActions &&
            disabledActions.some((action) => action === item.action)
          ) {
            actions.push({
              children: <span>{item.label}</span>,
              disabled: true,
              onClick: item.onClick,
            });

            return actions;
          }

          if (!machine) {
            actions.push({
              children: <span>{item.label}</span>,
              onClick: item.onClick,
            });
          } else if (canOpenActionForm(machine, item.action)) {
            actions.push({
              children: <span>{item.label}</span>,
              onClick: item.onClick,
            });
          }

          return actions;
        }, []);
        links.push(groupLinks);
        return links;
      }, [])}
      toggleAppearance=""
      toggleClassName="p-action-menu"
      toggleLabel={"Menu"}
    />
  );
};

export default MachineActionMenu;
