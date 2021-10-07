import { useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import Section from "app/base/components/Section";
import type { RouteParams, SetSearchFilter } from "app/base/types";
import KVMResources from "app/kvm/components/KVMResources";
import KVMSettings from "app/kvm/components/KVMSettings";
import LxdProject from "app/kvm/components/LxdProject";
import { useActivePod } from "app/kvm/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const LXDSingleDetails = (): JSX.Element => {
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
  useActivePod(id);

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
        <LXDSingleDetailsHeader
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
          <Route exact path={kvmURLs.lxd.single.vms(null, true)}>
            <LxdProject
              id={id}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setHeaderContent={setHeaderContent}
            />
          </Route>
          <Route exact path={kvmURLs.lxd.single.resources(null, true)}>
            <KVMResources id={id} />
          </Route>
          <Route exact path={kvmURLs.lxd.single.edit(null, true)}>
            <KVMSettings id={id} setHeaderContent={setHeaderContent} />
          </Route>
          <Redirect
            from={kvmURLs.lxd.single.index(null, true)}
            to={kvmURLs.lxd.single.vms(null, true)}
          />
        </Switch>
      )}
    </Section>
  );
};

export default LXDSingleDetails;
