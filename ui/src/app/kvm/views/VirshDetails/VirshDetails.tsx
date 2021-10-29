import { useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import VirshDetailsHeader from "./VirshDetailsHeader";
import VirshResources from "./VirshResources";
import VirshSettings from "./VirshSettings";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const VirshDetails = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const id = Number(params.id);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const loaded = useSelector(podSelectors.loaded);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  useActivePod(id);
  const redirectURL = useKVMDetailsRedirect(id);

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
  if (loaded && !pod) {
    return (
      <Section
        header={<SectionHeader title="Virsh host not found" />}
        data-test="not-found"
      >
        <p>
          Unable to find a Virsh host with id "{id}".{" "}
          <Link to={kvmURLs.kvm}>View all KVMs</Link>.
        </p>
      </Section>
    );
  }
  return (
    <Section
      header={
        <VirshDetailsHeader
          id={id}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      {pod && (
        <Switch>
          <Route exact path={kvmURLs.virsh.details.resources(null, true)}>
            <VirshResources id={id} />
          </Route>
          <Route exact path={kvmURLs.virsh.details.edit(null, true)}>
            <VirshSettings id={id} />
          </Route>
          <Redirect
            from={kvmURLs.virsh.details.index(null, true)}
            to={kvmURLs.virsh.details.resources(null, true)}
          />
        </Switch>
      )}
    </Section>
  );
};

export default VirshDetails;
