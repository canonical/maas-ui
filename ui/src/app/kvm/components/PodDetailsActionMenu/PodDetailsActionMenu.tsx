import { ContextualMenu } from "@canonical/react-components";

type Props = { setSelectedAction: (action: string | null) => void };

const PodDetailsActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
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
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
