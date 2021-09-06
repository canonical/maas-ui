import { useCallback } from "react";

import AddKVM from "./AddKVM";
import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import { KVMHeaderNames } from "app/kvm/constants";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import MachineActionForms from "app/machines/components/ActionFormWrapper";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const getFormComponent = (
  headerContent: KVMHeaderContent,
  setHeaderContent: KVMSetHeaderContent,
  clearHeaderContent: ClearHeaderContent
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
        />
      );
  }
};

const KVMHeaderForms = ({
  headerContent,
  setHeaderContent,
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
      {getFormComponent(headerContent, setHeaderContent, clearHeaderContent)}
    </div>
  );
};

export default KVMHeaderForms;
