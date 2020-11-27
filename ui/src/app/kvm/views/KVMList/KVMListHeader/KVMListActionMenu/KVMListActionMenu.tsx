import { ContextualMenu, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";

type Props = { setSelectedAction: (action: string) => void };

const KVMListActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  const selectedKVMs = useSelector(podSelectors.selectedKVMs);
  const actionMenuDisabled = selectedKVMs.length === 0;

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
        toggleDisabled={actionMenuDisabled}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

export default KVMListActionMenu;
