import { useCallback } from "react";

import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import MachineActionForms from "app/machines/components/ActionFormWrapper";
import { PodAction } from "app/store/pod/types";

type Props = {
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const getFormComponent = (
  headerContent: KVMHeaderContent,
  setHeaderContent: KVMSetHeaderContent,
  clearHeaderContent: ClearHeaderContent
) => {
  // This is a reliable of differentiating a machine action from a pod action,
  // but we should eventually try to have a consistent shape between them.
  // https://github.com/canonical-web-and-design/maas-ui/issues/3017
  if (
    headerContent &&
    typeof headerContent === "object" &&
    "name" in headerContent
  ) {
    return (
      <MachineActionForms
        headerContent={headerContent}
        setHeaderContent={setHeaderContent}
      />
    );
  }

  switch (headerContent) {
    case PodAction.COMPOSE:
      return <ComposeForm clearHeaderContent={clearHeaderContent} />;
    case PodAction.DELETE:
      return <DeleteForm clearHeaderContent={clearHeaderContent} />;
    case PodAction.REFRESH:
      return <RefreshForm clearHeaderContent={clearHeaderContent} />;
    default:
      return null;
  }
};

const KVMActionFormWrapper = ({
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

export default KVMActionFormWrapper;
