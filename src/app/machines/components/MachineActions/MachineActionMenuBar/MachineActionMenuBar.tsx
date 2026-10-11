import type { ReactElement } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import {
  useMachineActionMenus,
  useLifecycleActionEntitlements,
} from "../hooks";
import type { MachineActionsProps } from "../types";

import machineSelectors from "@/app/store/machine/selectors";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
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
  const { actionsDisabled, deployDisabled } =
    useLifecycleActionEntitlements(isViewingDetails);

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const detailsMachine = isViewingDetails ? machine : null;
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

          // Deploy is permitted with either an edit or deploy
          // entitlement; all other actions require edit.
          const isEntitlementGated =
            item.action === NodeActions.DEPLOY
              ? deployDisabled
              : actionsDisabled;

          links.push({
            children: (
              <div className="u-flex--between">
                <span>{item.label}...</span>
              </div>
            ),
            disabled: isDisabledAction || isEntitlementGated || undefined,
            onClick: item.onClick,
          });

          return links;
        }, []);

        let toggleDisabled: boolean;
        if (detailsMachine) {
          toggleDisabled = links.every((link) => link.disabled);
        } else if (menu.name === "lifecycle") {
          // The lifecycle submenu stays available for deploy-only users so
          // they can reach the Deploy action.
          toggleDisabled = actionsDisabled && deployDisabled;
        } else {
          toggleDisabled = actionsDisabled;
        }

        return (
          <span className="p-action-button--wrapper" key={menu.title}>
            {menu.render ? (
              menu.render(
                detailsMachine
                  ? !menu.items.some((item) =>
                      canOpenActionForm(detailsMachine, item.action)
                    )
                  : actionsDisabled
              )
            ) : (
              <ContextualMenu
                dropdownProps={{ "aria-label": `${menu.title} submenu` }}
                hasToggleIcon
                links={links}
                position="left"
                toggleDisabled={toggleDisabled}
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
