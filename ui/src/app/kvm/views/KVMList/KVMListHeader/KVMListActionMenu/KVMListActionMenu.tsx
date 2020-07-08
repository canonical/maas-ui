import React from "react";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";
import ContextualMenu from "app/base/components/ContextualMenu";
import Tooltip from "app/base/components/Tooltip";

type Props = { setSelectedAction: (action: string) => void };

const KVMListActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const actionMenuDisabled = selectedPodIDs.length === 0;

  return (
    <Tooltip
      message={
        actionMenuDisabled
          ? "Select KVMs below to perform an action."
          : undefined
      }
      position="left"
    >
      <ContextualMenu
        data-test="action-dropdown"
        hasToggleIcon
        links={[
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
        toggleDisabled={actionMenuDisabled}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

export default KVMListActionMenu;
