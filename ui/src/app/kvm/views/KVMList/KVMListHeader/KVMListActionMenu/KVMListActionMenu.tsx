import React from "react";

import ContextualMenu from "app/base/components/ContextualMenu";

const KVMListActionMenu = (): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="u-no-margin--bottom"
      toggleDisabled
      toggleLabel="Take action"
    />
  );
};

export default KVMListActionMenu;
