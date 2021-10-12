import { useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import VirshDetailsHeader from "./VirshDetailsHeader";
import VirshResources from "./VirshResources";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import KVMSettings from "app/kvm/components/KVMSettings";
import { useActivePod } from "app/kvm/hooks";
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
  const podsLoaded = useSelector(podSelectors.loaded);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  useActivePod(id);

  // If KVM has been deleted, redirect to KVM list.
  if (podsLoaded && !pod) {
    return <Redirect to={kvmURLs.kvm} />;
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
      headerClassName="u-no-padding--bottom"
    >
      {pod && (
        <Switch>
          <Route exact path={kvmURLs.virsh.details.resources(null, true)}>
            <VirshResources id={id} />
          </Route>
          <Route exact path={kvmURLs.virsh.details.edit(null, true)}>
            <KVMSettings id={id} setHeaderContent={setHeaderContent} />
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
