import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import type { KVMSelectedAction, KVMSetSelectedAction } from "../KVMDetails";

import SectionHeader from "app/base/components/SectionHeader";
import KVMActionFormWrapper from "app/kvm/components/KVMActionFormWrapper";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import { getActionTitle as getPodActionTitle } from "app/kvm/utils";
import { getActionTitle as getMachineActionTitle } from "app/machines/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
  selectedAction: KVMSelectedAction | null;
  setSelectedAction: KVMSetSelectedAction;
};

const getActionTitle = (selectedAction: KVMSelectedAction) => {
  // This is a reliable of differentiating a machine action from a pod action,
  // but we should eventually try to have a consistent shape between them.
  // https://github.com/canonical-web-and-design/maas-ui/issues/3017
  if (
    selectedAction &&
    typeof selectedAction === "object" &&
    "name" in selectedAction
  ) {
    return getMachineActionTitle(selectedAction.name);
  }
  return getPodActionTitle(selectedAction);
};

const KVMDetailsHeader = ({
  id,
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const pathname = location.pathname;
  const previousPathname = usePrevious(pathname);
  const vmCount = pod?.resources?.vm_count?.tracked || 0;

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // Close the action form if the pathname changes.
  useEffect(() => {
    if (previousPathname && pathname !== previousPathname) {
      setSelectedAction(null);
    }
  }, [pathname, previousPathname, setSelectedAction]);

  return (
    <SectionHeader
      buttons={
        !selectedAction && pod?.type !== PodType.LXD
          ? [
              <PodDetailsActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : undefined
      }
      formWrapper={
        (selectedAction && (
          <KVMActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )) ||
        undefined
      }
      subtitle={`${vmCount} VM${vmCount === 1 ? "" : "s"} available`}
      tabLinks={[
        ...(pod?.type === PodType.LXD
          ? [
              {
                active: location.pathname.endsWith(`/kvm/${id}/project`),
                component: Link,
                "data-test": "projects-tab",
                label: "Project",
                to: `/kvm/${id}/project`,
              },
            ]
          : []),
        {
          active: location.pathname.endsWith(`/kvm/${id}/resources`),
          component: Link,
          label: "Resources",
          to: `/kvm/${id}/resources`,
        },
        {
          active: location.pathname.endsWith(`/kvm/${id}/edit`),
          component: Link,
          label: "Settings",
          to: `/kvm/${id}/edit`,
        },
      ]}
      title={
        pod ? (
          <div className="kvm-details-header">
            <h1
              className="p-heading--four u-no-margin--bottom"
              data-test="kvm-details-title"
            >
              {selectedAction ? getActionTitle(selectedAction) : pod.name}
            </h1>
            {!selectedAction && (
              <p
                className="u-text--muted u-no-margin--bottom u-no-padding--top"
                data-test="pod-address"
              >
                {pod.power_address}
              </p>
            )}
          </div>
        ) : (
          <Spinner text="Loading..." />
        )
      }
    />
  );
};

export default KVMDetailsHeader;
