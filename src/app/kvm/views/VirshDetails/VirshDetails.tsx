import { useEffect } from "react";

import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Route, Routes, useNavigate } from "react-router-dom";

import VirshDetailsHeader from "./VirshDetailsHeader";
import VirshResources from "./VirshResources";
import VirshSettings from "./VirshSettings";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent/PageContent";
import { useGetURLId } from "@/app/base/hooks/urls";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import KVMForms from "@/app/kvm/components/KVMForms";
import { useActivePod, useKVMDetailsRedirect } from "@/app/kvm/hooks";
import { getFormTitle } from "@/app/kvm/utils";
import podSelectors from "@/app/store/pod/selectors";
import { PodMeta } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";
import { isId, getRelativeRoute } from "@/app/utils";

export enum Label {
  Title = "Virsh details",
}

const VirshDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const id = useGetURLId(PodMeta.PK);

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const loading = useSelector(podSelectors.loading);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  useActivePod(id);
  const redirectURL = useKVMDetailsRedirect(id);

  useEffect(() => {
    if (redirectURL) {
      navigate(redirectURL, { replace: true });
    }
  }, [navigate, redirectURL]);

  if (!isId(id) || (!loading && !pod)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={urls.kvm.virsh.index}
        modelName="Virsh host"
      />
    );
  }
  const base = urls.kvm.virsh.details.index(null);
  return (
    <PageContent
      aria-label={Label.Title}
      header={
        <VirshDetailsHeader id={id} setSidePanelContent={setSidePanelContent} />
      }
      sidePanelContent={
        sidePanelContent ? (
          <KVMForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={sidePanelContent ? getFormTitle(sidePanelContent) : ""}
    >
      {pod && (
        <Routes>
          <Route
            element={<VirshResources id={id} />}
            path={getRelativeRoute(
              urls.kvm.virsh.details.resources(null),
              base
            )}
          />
          <Route
            element={<VirshSettings id={id} />}
            path={getRelativeRoute(urls.kvm.virsh.details.edit(null), base)}
          />
          <Route
            element={<Redirect to={urls.kvm.virsh.details.resources({ id })} />}
            path="/"
          />
        </Routes>
      )}
    </PageContent>
  );
};

export default VirshDetails;
