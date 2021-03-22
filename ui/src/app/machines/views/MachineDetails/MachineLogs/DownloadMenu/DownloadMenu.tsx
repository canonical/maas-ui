import { ContextualMenu } from "@canonical/react-components";
export const DownloadMenu = (): JSX.Element => {
  return (
    <div>
      <ContextualMenu
        className="download-menu"
        data-test="take-action-dropdown"
        hasToggleIcon
        links={[
          {
            children: "Machine output (YAML)",
          },
          {
            children: "Machine output (XML)",
          },
          {
            children: "curtin-logs.tar",
          },
          {
            children: "Installation output",
          },
        ]}
        position="right"
        toggleAppearance="neutral"
        toggleLabel="Download"
      />
    </div>
  );
};

export default DownloadMenu;
