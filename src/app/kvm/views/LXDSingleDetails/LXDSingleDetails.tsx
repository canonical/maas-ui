import { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";
import LXDSingleResources from "./LXDSingleResources";
import LXDSingleSettings from "./LXDSingleSettings";
import LXDSingleVMs from "./LXDSingleVMs";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import type { SetSearchFilter } from "app/base/types";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import podSelectors from "app/store/pod/selectors";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const LXDSingleDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = useGetURLId(PodMeta.PK);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const loading = useSelector(podSelectors.loading);
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

  const setSearchFilter: SetSearchFilter = useCallback(
    (searchFilter: string) => {
      setFilter(searchFilter);
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [setFilter, navigate]
  );

  useEffect(() => {
    if (redirectURL) {
      navigate(redirectURL, { replace: true });
    }
  }, [navigate, redirectURL]);

  if (!isId(id) || (!loading && !pod)) {
    return (
      <ModelNotFound id={id} linkURL={kvmURLs.lxd.index} modelName="LXD host" />
    );
  }
  return (
    <Section
      header={
        <LXDSingleDetailsHeader
          headerContent={headerContent}
          id={id}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      {pod && (
        <Switch>
          <Route
            exact
            path={kvmURLs.lxd.single.vms(null, true)}
            render={() => (
              <LXDSingleVMs
                id={id}
                searchFilter={searchFilter}
                setHeaderContent={setHeaderContent}
                setSearchFilter={setSearchFilter}
              />
            )}
          />
          <Route
            exact
            path={kvmURLs.lxd.single.resources(null, true)}
            render={() => <LXDSingleResources id={id} />}
          />
          <Route
            exact
            path={kvmURLs.lxd.single.edit(null, true)}
            render={() => (
              <LXDSingleSettings id={id} setHeaderContent={setHeaderContent} />
            )}
          />
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
