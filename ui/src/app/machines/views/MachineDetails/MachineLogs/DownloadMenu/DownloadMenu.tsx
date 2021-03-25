import { ContextualMenu } from "@canonical/react-components";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import { useSelector } from "react-redux";

import { useGetInstallationOutput } from "../hooks";

import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
type Props = { systemId: Machine["system_id"] };
export const DownloadMenu = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const installationOutput = useGetInstallationOutput(systemId);
  if (!machine) {
    return null;
  }
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
                      const today = format(new Date(), "yyyy-MM-dd");
                      fileDownload(
                        installationOutput.log,
                        `${machine.fqdn}-installation-output-${today}.txt`
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
