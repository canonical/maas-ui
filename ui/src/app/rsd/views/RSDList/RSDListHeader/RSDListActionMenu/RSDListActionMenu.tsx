import { Tooltip } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";
import ContextualMenu from "app/base/components/ContextualMenu";

type Props = { setSelectedAction: (action: string) => void };

const RSDListActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  const selectedRSDs = useSelector(podSelectors.selectedRSDs);
  const actionMenuDisabled = selectedRSDs.length === 0;

  return (
    <Tooltip
      message={
        actionMenuDisabled
          ? "Select RSDs below to perform an action."
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
        toggleDisabled={actionMenuDisabled}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

export default RSDListActionMenu;
