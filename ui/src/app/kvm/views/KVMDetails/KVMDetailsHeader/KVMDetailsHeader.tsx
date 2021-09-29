import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import KVMHeaderForms from "app/kvm/components/KVMHeaderForms";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { getHeaderTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const KVMDetailsHeader = ({
  id,
  headerContent,
  setHeaderContent,
  setSearchFilter,
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
      setHeaderContent(null);
    }
  }, [pathname, previousPathname, setHeaderContent]);

  return (
    <SectionHeader
      buttons={
        pod?.type !== PodType.LXD
          ? [
              <PodDetailsActionMenu
                key="action-dropdown"
                setHeaderContent={setHeaderContent}
              />,
            ]
          : undefined
      }
      headerContent={
        headerContent ? (
          <KVMHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        ) : null
      }
      subtitle={`${vmCount} VM${vmCount === 1 ? "" : "s"} available`}
      tabLinks={[
        ...(pod?.type === PodType.LXD
          ? [
              {
                active: location.pathname.endsWith(kvmURLs.project({ id })),
                component: Link,
                "data-test": "projects-tab",
                label: "Project",
                to: kvmURLs.project({ id }),
              },
            ]
          : []),
        {
          active: location.pathname.endsWith(kvmURLs.resources({ id })),
          component: Link,
          label: "Resources",
          to: kvmURLs.resources({ id }),
        },
        {
          active: location.pathname.endsWith(kvmURLs.edit({ id })),
          component: Link,
          label: "Settings",
          to: kvmURLs.edit({ id }),
        },
      ]}
      title={
        pod ? (
          <div className={headerContent ? undefined : "kvm-details-header"}>
            <h1
              className="p-heading--four u-no-margin--bottom"
              data-test="kvm-details-title"
            >
              {getHeaderTitle(pod.name, headerContent)}
            </h1>
            {!headerContent && (
              <p
                className="u-text--muted u-no-margin--bottom u-no-padding--top"
                data-test="pod-address"
              >
                {pod.power_parameters.power_address}
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
