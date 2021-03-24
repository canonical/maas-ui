import { ContextualMenu } from "@canonical/react-components";
import fileDownload from "js-file-download";

import { useGetInstallationOutput } from "../hooks";

import type { Machine } from "app/store/machine/types";
type Props = { systemId: Machine["system_id"] };
export const DownloadMenu = ({ systemId }: Props): JSX.Element => {
  const installationOutput = useGetInstallationOutput(systemId);
  return (
    <div>
      <ContextualMenu
        className="download-menu"
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
          ...(installationOutput.log
            ? [
                {
                  children: "Installation output",
                  onClick: () => {
                    if (installationOutput.log) {
                      fileDownload(
                        installationOutput.log,
                        "installation-output.txt"
                      );
                    }
                  },
                },
              ]
            : []),
        ]}
        position="right"
        toggleAppearance="neutral"
        toggleLabel="Download"
      />
    </div>
  );
};

export default DownloadMenu;
