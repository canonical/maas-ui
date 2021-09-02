import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

import KVMConfiguration from "./KVMConfiguration";
import KVMDetailsHeader from "./KVMDetailsHeader";
import KVMResources from "./KVMResources";
import LxdProject from "./LxdProject";

import Section from "app/base/components/Section";
import type { RouteParams, SetSelectedAction } from "app/base/types";
import kvmURLs from "app/kvm/urls";
import type { MachineSelectedAction } from "app/machines/views/types";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { PodFormNames } from "app/store/ui/types";

export type KVMSelectedAction =
  | ValueOf<typeof PodFormNames>
  | MachineSelectedAction;

export type KVMSetSelectedAction = SetSelectedAction<KVMSelectedAction>;
export type SetSearchFilter = (searchFilter: string) => void;

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podsLoaded = useSelector(podSelectors.loaded);
  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );
  const [selectedAction, setSelectedAction] =
    useState<KVMSelectedAction | null>(null);

  useEffect(() => {
    dispatch(podActions.get(Number(id)));
    // Set KVM as active to ensure all KVM data is sent from the server.
    dispatch(podActions.setActive(Number(id)));

    // Unset active KVM on cleanup.
    return () => {
      dispatch(podActions.setActive(null));
    };
  }, [dispatch, id]);

  // If KVM has been deleted, redirect to KVM list.
  if (podsLoaded && !pod) {
    return <Redirect to={kvmURLs.kvm} />;
  }

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = FilterMachines.getCurrentFilters(searchFilter);
    history.push({ search: FilterMachines.filtersToQueryString(filters) });
  };

  return (
    <Section
      header={
        <KVMDetailsHeader
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      {pod && (
        <Switch>
          {pod.type === PodType.LXD && (
            <Route exact path={kvmURLs.project(null, true)}>
              <LxdProject
                id={pod.id}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                setSelectedAction={setSelectedAction}
              />
            </Route>
          )}
          <Route exact path={kvmURLs.resources(null, true)}>
            <KVMResources id={pod.id} />
          </Route>
          <Route exact path={kvmURLs.edit(null, true)}>
            <KVMConfiguration
              id={pod.id}
              setSelectedAction={setSelectedAction}
            />
          </Route>
          <Redirect
            from={kvmURLs.details(null, true)}
            to={
              pod.type === PodType.LXD
                ? kvmURLs.project(null, true)
                : kvmURLs.resources(null, true)
            }
          />
        </Switch>
      )}
    </Section>
  );
};

export default KVMDetails;
