import { useCallback } from "react";

import { useSelector } from "react-redux";

import AddLxd from "./AddLxd";
import AddVirsh from "./AddVirsh";
import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { SidePanelContextType } from "app/base/side-panel-context";
import type { ClearSidePanelContent, SetSearchFilter } from "app/base/types";
import { KVMSidePanelViews } from "app/kvm/constants";
import type {
  KVMSidePanelContent,
  KVMSetSidePanelContent,
} from "app/kvm/types";
import MachineForms from "app/machines/components/MachineForms";
import type { MachineSidePanelContent } from "app/machines/types";
import machineSelectors from "app/store/machine/selectors";
import type { SelectedMachines } from "app/store/machine/types";
import { useMachineSelectedCount } from "app/store/machine/utils/hooks";

type Props = SidePanelContextType<KVMSidePanelContent | null> & {
  // sidePanelContent: KVMSidePanelContent | null;
  // setSidePanelContent: KVMSetSidePanelContent;
  searchFilter?: string;
  setSearchFilter?: SetSearchFilter;
};

const getFormComponent = ({
  sidePanelContent,
  setSidePanelContent,
  clearSidePanelContent,
  selectedMachines,
  selectedCount,
  searchFilter,
  setSearchFilter,
}: {
  sidePanelContent: KVMSidePanelContent;
  setSidePanelContent: KVMSetSidePanelContent;
  clearSidePanelContent: ClearSidePanelContent;
  selectedMachines: SelectedMachines | null;
  selectedCount: number;
  searchFilter?: string;
  setSearchFilter?: SetSearchFilter;
}) => {
  if (!sidePanelContent) {
    return null;
  }

  if (sidePanelContent.view === KVMSidePanelViews.ADD_LXD_HOST) {
    return <AddLxd clearSidePanelContent={clearSidePanelContent} />;
  }

  if (sidePanelContent.view === KVMSidePanelViews.ADD_VIRSH_HOST) {
    return <AddVirsh clearSidePanelContent={clearSidePanelContent} />;
  }

  // The following forms require that a host or cluster id be passed to it.
  const hostId =
    sidePanelContent.extras && "hostId" in sidePanelContent.extras
      ? sidePanelContent.extras.hostId
      : null;
  const clusterId =
    sidePanelContent.extras && "clusterId" in sidePanelContent.extras
      ? sidePanelContent.extras.clusterId
      : null;
  if (
    sidePanelContent.view === KVMSidePanelViews.COMPOSE_VM &&
    (hostId || hostId === 0)
  ) {
    return (
      <ComposeForm
        clearSidePanelContent={clearSidePanelContent}
        hostId={hostId}
      />
    );
  }
  if (
    sidePanelContent.view === KVMSidePanelViews.DELETE_KVM &&
    (hostId || hostId === 0 || clusterId || clusterId === 0)
  ) {
    return (
      <DeleteForm
        clearSidePanelContent={clearSidePanelContent}
        clusterId={clusterId}
        hostId={hostId}
      />
    );
  }

  if (
    sidePanelContent.view === KVMSidePanelViews.REFRESH_KVM &&
    sidePanelContent.extras &&
    "hostIds" in sidePanelContent.extras &&
    sidePanelContent.extras.hostIds?.length
  ) {
    return (
      <RefreshForm
        clearSidePanelContent={clearSidePanelContent}
        hostIds={sidePanelContent.extras.hostIds}
      />
    );
  }
  // We need to explicitly cast sidePanelContent here - TypeScript doesn't
  // seem to be able to infer remaining object tuple values as with string
  // values.
  // https://github.com/canonical/maas-ui/issues/3040
  const machineSidePanelContent = sidePanelContent as MachineSidePanelContent;
  return (
    <MachineForms
      searchFilter={searchFilter}
      selectedCount={selectedCount}
      selectedMachines={selectedMachines}
      setSearchFilter={setSearchFilter}
      setSidePanelContent={setSidePanelContent}
      sidePanelContent={machineSidePanelContent}
      viewingDetails={false}
    />
  );
};

const KVMForms = ({
  sidePanelContent,
  setSidePanelContent,
  searchFilter,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const selectedMachines = useSelector(machineSelectors.selectedMachines);
  const { selectedCount } = useMachineSelectedCount();
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }
  return (
    <div ref={onRenderRef}>
      {getFormComponent({
        sidePanelContent,
        setSidePanelContent,
        clearSidePanelContent,
        selectedMachines,
        selectedCount,
        searchFilter,
        setSearchFilter,
      })}
    </div>
  );
};

export default KVMForms;
