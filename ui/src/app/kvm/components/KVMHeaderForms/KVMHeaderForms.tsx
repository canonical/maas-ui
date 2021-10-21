import { useCallback } from "react";

import AddLxd from "./AddLxd";
import AddVirsh from "./AddVirsh";
import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import type { MachineHeaderContent } from "app/machines/types";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter?: SetSearchFilter;
};

const getFormComponent = (
  headerContent: KVMHeaderContent,
  setHeaderContent: KVMSetHeaderContent,
  clearHeaderContent: ClearHeaderContent,
  setSearchFilter?: SetSearchFilter
) => {
  if (!headerContent) {
    return null;
  }

  if (headerContent.view === KVMHeaderViews.ADD_LXD_HOST) {
    return <AddLxd clearHeaderContent={clearHeaderContent} />;
  }

  if (headerContent.view === KVMHeaderViews.ADD_VIRSH_HOST) {
    return <AddVirsh clearHeaderContent={clearHeaderContent} />;
  }

  if (
    headerContent.extras &&
    "hostId" in headerContent.extras &&
    headerContent.extras.hostId !== undefined
  ) {
    // The following forms require that a host id be passed to it.
    const { hostId } = headerContent.extras;
    switch (headerContent.view) {
      case KVMHeaderViews.COMPOSE_VM:
        return (
          <ComposeForm
            clearHeaderContent={clearHeaderContent}
            hostId={hostId}
          />
        );
      case KVMHeaderViews.DELETE_KVM:
        return (
          <DeleteForm clearHeaderContent={clearHeaderContent} hostId={hostId} />
        );
      default:
        return null;
    }
  }

  if (
    headerContent.view === KVMHeaderViews.REFRESH_KVM &&
    headerContent.extras &&
    "hostIds" in headerContent.extras &&
    headerContent.extras.hostIds?.length
  ) {
    return (
      <RefreshForm
        clearHeaderContent={clearHeaderContent}
        hostIds={headerContent.extras.hostIds}
      />
    );
  }
  // We need to explicitly cast headerContent here - TypeScript doesn't
  // seem to be able to infer remaining object tuple values as with string
  // values.
  // https://github.com/canonical-web-and-design/maas-ui/issues/3040
  const machineHeaderContent = headerContent as MachineHeaderContent;
  return (
    <MachineHeaderForms
      headerContent={machineHeaderContent}
      setHeaderContent={setHeaderContent}
      setSearchFilter={setSearchFilter}
    />
  );
};

const KVMHeaderForms = ({
  headerContent,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  if (!headerContent) {
    return null;
  }
  return (
    <div ref={onRenderRef}>
      {getFormComponent(
        headerContent,
        setHeaderContent,
        clearHeaderContent,
        setSearchFilter
      )}
    </div>
  );
};

export default KVMHeaderForms;
