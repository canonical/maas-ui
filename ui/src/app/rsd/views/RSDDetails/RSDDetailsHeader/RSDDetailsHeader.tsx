import { useEffect, useState } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import RSDActionFormWrapper from "app/rsd/components/RSDActionFormWrapper";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const RSDDetailsHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/rsd/<pod.id>" close the form.
  useEffect(() => {
    if (location.pathname !== `/rsd/${id}`) {
      setSelectedAction("");
    }
  }, [id, location.pathname]);

  return (
    <SectionHeader
      buttons={
        !selectedAction && location.pathname.endsWith(`/rsd/${id}`)
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
          <RSDActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )) ||
        undefined
      }
      loading={!pod}
      subtitle={pluralize(
        "composed machine",
        pod?.composed_machines_count,
        true
      )}
      tabLinks={[
        {
          active: location.pathname.endsWith(`/rsd/${id}`),
          component: Link,
          label: "Resources",
          to: `/rsd/${id}`,
        },
        {
          active: location.pathname.endsWith(`/rsd/${id}/edit`),
          component: Link,
          label: "Configuration",
          to: `/rsd/${id}/edit`,
        },
      ]}
      title={pod?.name || ""}
    />
  );
};

export default RSDDetailsHeader;
