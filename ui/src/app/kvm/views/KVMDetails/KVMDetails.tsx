import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

import KVMDetailsHeader from "./KVMDetailsHeader";
import KVMResources from "./KVMResources";
import KVMSettings from "./KVMSettings";
import LxdProject from "./LxdProject";

import Section from "app/base/components/Section";
import type { RouteParams, SetSearchFilter } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const KVMDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const params = useParams<RouteParams>();
  const id = Number(params.id);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podsLoaded = useSelector(podSelectors.loaded);
  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  useEffect(() => {
    dispatch(podActions.get(id));
    // Set KVM as active to ensure all KVM data is sent from the server.
    dispatch(podActions.setActive(id));

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
          id={id}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      {pod && (
        <Switch>
          {pod.type === PodType.LXD && (
            <Route exact path={kvmURLs.project(null, true)}>
              <LxdProject
                id={id}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                setHeaderContent={setHeaderContent}
              />
            </Route>
          )}
          <Route exact path={kvmURLs.resources(null, true)}>
            <KVMResources id={id} />
          </Route>
          <Route exact path={kvmURLs.edit(null, true)}>
            <KVMSettings id={id} setHeaderContent={setHeaderContent} />
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
