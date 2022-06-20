import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import ChangeStorageLayout from "./ChangeStorageLayout";

import StorageTables from "app/base/components/node/StorageTables";
import docsUrls from "app/base/docsUrls";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import settingsURLs from "app/settings/urls";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import { isMachineDetails, useCanEditStorage } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const MachineStorage = (): JSX.Element => {
  const id = useGetURLId(MachineMeta.PK);
  const sendAnalytics = useSendAnalytics();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const canEditStorage = useCanEditStorage(machine);

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} storage`);

  if (isId(id) && isMachineDetails(machine)) {
    return (
      <>
        {canEditStorage && <ChangeStorageLayout systemId={id} />}
        <StorageTables canEditStorage={canEditStorage} node={machine} />
        <Strip shallow>
          <p>
            Learn more about deploying{" "}
            <a
              data-testid="docs-footer-link"
              href={docsUrls.images}
              onClick={() =>
                sendAnalytics(
                  "Machine storage",
                  "Click link to MAAS docs",
                  "Windows"
                )
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              Windows
            </a>
          </p>
          <p>
            Change the default layout in{" "}
            <Link to={settingsURLs.storage}>Settings &rsaquo; Storage</Link>
          </p>
        </Strip>
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineStorage;
