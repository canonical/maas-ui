import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

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
import type { RouteParams } from "app/base/types";
import {
  filtersToQueryString,
  filtersToString,
  getCurrentFilters,
  queryStringToFilters,
} from "app/machines/search";
import type { SelectedAction as MachineAction } from "app/machines/views/MachineDetails/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

export enum KVMAction {
  COMPOSE = "compose",
  DELETE = "delete",
  REFRESH = "refresh",
}
export type SelectedAction = KVMAction | MachineAction | null;
export type SetSelectedAction = Dispatch<SetStateAction<SelectedAction>>;
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
  const currentFilters = queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    filtersToString(currentFilters)
  );
  const [selectedAction, setSelectedAction] = useState<SelectedAction>(null);

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
    return <Redirect to="/kvm" />;
  }

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = getCurrentFilters(searchFilter);
    history.push({ search: filtersToQueryString(filters) });
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
            <Route exact path="/kvm/:id/project">
              <LxdProject
                id={pod.id}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                setSelectedAction={setSelectedAction}
              />
            </Route>
          )}
          <Route exact path="/kvm/:id/resources">
            <KVMResources id={pod.id} />
          </Route>
          <Route exact path="/kvm/:id/edit">
            <KVMConfiguration
              id={pod.id}
              setSelectedAction={setSelectedAction}
            />
          </Route>
          <Redirect
            from="/kvm/:id"
            to={
              pod.type === PodType.LXD
                ? "/kvm/:id/project"
                : "/kvm/:id/resources"
            }
          />
        </Switch>
      )}
    </Section>
  );
};

export default KVMDetails;
