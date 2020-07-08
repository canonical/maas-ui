import React from "react";

import ContextualMenu from "app/base/components/ContextualMenu";

type Props = { setSelectedAction: (action: string | null) => void };

const KVMDetailsActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setSelectedAction("compose"),
        },
        {
          children: "Refresh",
          onClick: () => setSelectedAction("refresh"),
        },
        {
          children: "Delete",
          onClick: () => setSelectedAction("delete"),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleClassName="u-no-margin--bottom"
      toggleLabel="Take action"
    />
  );
};

export default KVMDetailsActionMenu;
