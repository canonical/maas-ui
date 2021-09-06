import { useCallback } from "react";

import AddKVM from "./AddKVM";
import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { KVMHeaderNames } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import MachineActionForms from "app/machines/components/ActionFormWrapper";

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
  switch (headerContent.name) {
    case KVMHeaderNames.ADD_KVM:
      return <AddKVM clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderNames.COMPOSE_VM:
      return <ComposeForm clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderNames.DELETE_KVM:
      return <DeleteForm clearHeaderContent={clearHeaderContent} />;
    case KVMHeaderNames.REFRESH_KVM:
      return <RefreshForm clearHeaderContent={clearHeaderContent} />;
    default:
      return (
        <MachineActionForms
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      );
  }
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
