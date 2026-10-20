import type { ReactElement } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useMachineActionMenus, useIsMachineActionDisabled } from "../hooks";
import type { MachineActionsProps } from "../types";

import machineSelectors from "@/app/store/machine/selectors";
import type { RootState } from "@/app/store/root/types";
import { canOpenActionForm } from "@/app/store/utils";

import "./_index.scss";

type MachineActionMenuBarProps = MachineActionsProps;

const MachineActionMenuBar = ({
  disabledActions,
  excludeActions,
  isViewingDetails = false,
  systemId,
}: MachineActionMenuBarProps): ReactElement => {
  const actionMenus = useMachineActionMenus(isViewingDetails, systemId);
  const isActionDisabled = useIsMachineActionDisabled(
    isViewingDetails,
    systemId
  );

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  return (
    <span className="p-node-action-menu-group">
      {actionMenus.map((menu) => {
        const links = menu.items.reduce<ButtonProps[]>((links, item) => {
          if (
            excludeActions &&
            excludeActions.some((action) => action === item.action)
          ) {
            return links;
          }

          const isDisabledAction =
            disabledActions &&
            disabledActions.some((action) => action === item.action);

          const isVisible =
            isDisabledAction ||
            !machine ||
            canOpenActionForm(machine, item.action);
          if (!isVisible) {
            return links;
          }

          links.push({
            children: (
              <div className="u-flex--between">
                <span>{item.label}...</span>
              </div>
            ),
            disabled:
              isDisabledAction || isActionDisabled(item.action) || undefined,
            onClick: item.onClick,
          });

          return links;
        }, []);

        return (
          <span className="p-action-button--wrapper" key={menu.title}>
            {menu.render ? (
              menu.render(
                menu.items.every((item) => isActionDisabled(item.action))
              )
            ) : (
              <ContextualMenu
                dropdownProps={{ "aria-label": `${menu.title} submenu` }}
                hasToggleIcon
                links={links}
                position="left"
                toggleDisabled={links.every((link) => link.disabled)}
                toggleLabel={
                  !menu.icon ? (
                    menu.title
                  ) : (
                    <>
                      <Icon name={menu.icon} />
                      {menu.title}
                    </>
                  )
                }
              />
            )}
          </span>
        );
      })}
    </span>
  );
};

export default MachineActionMenuBar;
