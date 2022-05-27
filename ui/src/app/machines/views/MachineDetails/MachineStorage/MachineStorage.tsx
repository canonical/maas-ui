import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import AvailableStorageTable from "./AvailableStorageTable";
import CacheSetsTable from "./CacheSetsTable";
import ChangeStorageLayout from "./ChangeStorageLayout";
import DatastoresTable from "./DatastoresTable";
import FilesystemsTable from "./FilesystemsTable";
import UsedStorageTable from "./UsedStorageTable";

import docsUrls from "app/base/docsUrls";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import settingsURLs from "app/settings/urls";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import { isMachineDetails, useCanEditStorage } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { isCacheSet, isVMWareLayout } from "app/store/utils";
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
    const showDatastores = isVMWareLayout(machine.detected_storage_layout);
    const showCacheSets = machine.disks.some((disk) => isCacheSet(disk));

    return (
      <>
        {canEditStorage && <ChangeStorageLayout systemId={id} />}
        <Strip shallow>
          {showDatastores ? (
            <>
              <h4 className="machine-storage__subtitle">Datastores</h4>
              <DatastoresTable canEditStorage={canEditStorage} systemId={id} />
            </>
          ) : (
            <>
              <h4 className="machine-storage__subtitle">Filesystems</h4>
              <FilesystemsTable canEditStorage={canEditStorage} systemId={id} />
            </>
          )}
        </Strip>
        {showCacheSets && (
          <Strip shallow>
            <h4 className="machine-storage__subtitle">Available cache sets</h4>
            <CacheSetsTable canEditStorage={canEditStorage} systemId={id} />
          </Strip>
        )}
        <Strip shallow>
          <h4 className="machine-storage__subtitle">
            Available disks and partitions
          </h4>
          <AvailableStorageTable
            canEditStorage={canEditStorage}
            systemId={id}
          />
        </Strip>
        <Strip shallow>
          <h4 className="machine-storage__subtitle">
            Used disks and partitions
          </h4>
          <UsedStorageTable systemId={id} />
        </Strip>
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
              target="_blank"
              rel="noopener noreferrer"
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
