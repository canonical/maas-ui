import { useState } from "react";

import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import VirshDetailsHeader from "./VirshDetailsHeader";
import VirshResources from "./VirshResources";
import VirshSettings from "./VirshSettings";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const VirshDetails = (): JSX.Element => {
  const id = useGetURLId(PodMeta.PK);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const loading = useSelector(podSelectors.loading);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  useActivePod(id);
  const redirectURL = useKVMDetailsRedirect(id);

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
  if (!isId(id) || (!loading && !pod)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={kvmURLs.virsh.index}
        modelName="Virsh host"
      />
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
          <Route
            exact
            path={kvmURLs.virsh.details.resources(null, true)}
            component={() => <VirshResources id={id} />}
          />
          <Route
            exact
            path={kvmURLs.virsh.details.edit(null, true)}
            component={() => <VirshSettings id={id} />}
          />
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
