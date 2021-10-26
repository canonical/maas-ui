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
import LXDSingleResources from "./LXDSingleResources";
import LXDSingleSettings from "./LXDSingleSettings";
import LXDSingleVMs from "./LXDSingleVMs";

import Section from "app/base/components/Section";
import type { RouteParams, SetSearchFilter } from "app/base/types";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
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
  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  useActivePod(id);
  const redirectURL = useKVMDetailsRedirect(id);

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = FilterMachines.getCurrentFilters(searchFilter);
    history.push({ search: FilterMachines.filtersToQueryString(filters) });
  };

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
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
    >
      {pod && (
        <Switch>
          <Route exact path={kvmURLs.lxd.single.vms(null, true)}>
            <LXDSingleVMs
              id={id}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setHeaderContent={setHeaderContent}
            />
          </Route>
          <Route exact path={kvmURLs.lxd.single.resources(null, true)}>
            <LXDSingleResources id={id} />
          </Route>
          <Route exact path={kvmURLs.lxd.single.edit(null, true)}>
            <LXDSingleSettings id={id} setHeaderContent={setHeaderContent} />
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
