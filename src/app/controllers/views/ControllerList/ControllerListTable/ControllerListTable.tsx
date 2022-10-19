import { useEffect } from "react";

import { MainTable, Spinner, Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import StatusColumn from "./StatusColumn";
import VLANsColumn from "./VLANsColumn";
import VersionColumn from "./VersionColumn";

import ControllerLink from "app/base/components/ControllerLink";
import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableHeader from "app/base/components/TableHeader";
import docsUrls from "app/base/docsUrls";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import ImageStatus from "app/controllers/components/ImageStatus";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import { actions as generalActions } from "app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import { NodeType } from "app/store/types/node";
import { generateCheckboxHandlers, isComparable } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type Props = {
  controllers: Controller[];
  hasFilter?: boolean;
  loading?: boolean;
  onSelectedChange: (newSelectedIDs: Controller[ControllerMeta.PK][]) => void;
  selectedIDs: Controller[ControllerMeta.PK][];
};

type SortKey = keyof Controller | "version";

const getSortValue = (sortKey: SortKey, controller: Controller) => {
  switch (sortKey) {
    case "version":
      return controller.versions?.origin || null;
  }
  const value = controller[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = ({
  controllers,
  unconfiguredControllers,
  configuredControllers,
  selectedIDs,
  handleRowCheckbox,
  vaultEnabled,
}: {
  controllers: Controller[];
  unconfiguredControllers: number;
  configuredControllers: number;
  selectedIDs: Controller[ControllerMeta.PK][];
  handleRowCheckbox: CheckboxHandlers<
    Controller[ControllerMeta.PK]
  >["handleRowCheckbox"];
  vaultEnabled: boolean;
}) =>
  controllers.map((controller) => {
    const { fqdn, system_id } = controller;

    return {
      columns: [
        {
          "aria-label": "Name",
          className: "fqdn-col",
          content: (
            <DoubleRow
              primary={
                <RowCheckbox
                  data-testid="controller-checkbox"
                  handleRowCheckbox={handleRowCheckbox}
                  inputLabel={
                    <ControllerLink systemId={controller.system_id} />
                  }
                  item={controller.system_id}
                  items={selectedIDs}
                />
              }
              primaryTitle={fqdn}
            />
          ),
        },
        {
          "aria-label": "Status",
          className: "status-col u-align--center",
          content: <StatusColumn systemId={controller.system_id} />,
        },
        {
          "aria-label": "Type",
          className: "type-col",
          content: (
            <span className="u-truncate">
              {controller.node_type === NodeType.REGION_CONTROLLER ||
              controller.node_type === NodeType.REGION_AND_RACK_CONTROLLER ? (
                vaultEnabled ? (
                  <Tooltip
                    children={<Icon name="security-tick" />}
                    message={
                      <p>
                        Vault is configured on this region controller for secret
                        storage.
                        <br />
                        <a href={docsUrls.vaultIntegration}>
                          Read more about Vault integration
                        </a>
                      </p>
                    }
                  />
                ) : controller.vault_configured === true ? (
                  unconfiguredControllers >= 1 && (
                    <Tooltip
                      children={<Icon name="security" />}
                      message={
                        <p>
                          Vault is configured on this controller. <br />
                          Once all controllers are configured, migrate the
                          secrets. <br />
                          <a href={docsUrls.vaultIntegration}>
                            Read more about Vault integration
                          </a>
                        </p>
                      }
                    />
                  )
                ) : (
                  configuredControllers >= 1 && (
                    <Tooltip
                      children={<Icon name="security-warning" />}
                      message={
                        <p>
                          Missing Vault configuration.
                          <br />
                          <a href={docsUrls.vaultIntegration}>
                            Read more about Vault integration
                          </a>
                        </p>
                      }
                    />
                  )
                )
              ) : null}
              {` ${controller.node_type_display}`}
            </span>
          ),
        },
        {
          "aria-label": "# of VLANs",
          className: "vlans-col",
          content: <VLANsColumn systemId={controller.system_id} />,
        },
        {
          "aria-label": "Version & Channel",
          className: "version-col",
          content: <VersionColumn systemId={controller.system_id} />,
        },
        {
          "aria-label": "Available upgrade",
          className: "upgrade-col",
          content: controller.versions?.up_to_date
            ? "Up-to-date"
            : controller.versions?.update?.version || null,
        },
        {
          "aria-label": "Last image sync",
          className: "images-col",
          content: (
            <DoubleRow
              primary={controller.last_image_sync || "Never"}
              primaryTitle={controller.last_image_sync || "Never"}
              secondary={<ImageStatus systemId={system_id} />}
            />
          ),
        },
      ],
      "data-testid": `controller-${system_id}`,
    };
  });

const ControllerListTable = ({
  controllers,
  hasFilter = false,
  loading = false,
  onSelectedChange,
  selectedIDs,
}: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort<
    Controller,
    SortKey
  >(getSortValue, {
    key: "fqdn",
    direction: SortDirection.DESCENDING,
  });
  const sortedControllers = sortRows(controllers);
  const { handleGroupCheckbox, handleRowCheckbox } =
    generateCheckboxHandlers<Controller[ControllerMeta.PK]>(onSelectedChange);
  const controllerIDs = controllers.map((controller) => controller.system_id);
  const { unconfiguredControllers, configuredControllers } = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );
  const dispatch = useDispatch();
  const vaultEnabled = useSelector(vaultEnabledSelectors.get);

  useEffect(() => {
    dispatch(generalActions.fetchVaultEnabled());
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  return (
    <MainTable
      aria-label="controllers list"
      className="controller-list-table"
      emptyStateMsg={
        loading ? (
          <Spinner text="Loading..." />
        ) : hasFilter ? (
          "No controllers match the search criteria."
        ) : null
      }
      headers={[
        {
          className: "fqdn-col",
          content: (
            <div className="u-flex">
              <GroupCheckbox
                aria-label="all controllers"
                data-testid="all-controllers-checkbox"
                handleGroupCheckbox={handleGroupCheckbox}
                items={controllerIDs}
                selectedItems={selectedIDs}
              />
              <TableHeader
                currentSort={currentSort}
                data-testid="fqdn-header"
                onClick={() => updateSort("fqdn")}
                sortKey="fqdn"
              >
                Name
              </TableHeader>
            </div>
          ),
        },
        {
          className: "status-col u-align--center",
          content: (
            <TableHeader data-testid="status-header">Status</TableHeader>
          ),
        },
        {
          className: "type-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="type-header"
              onClick={() => updateSort("node_type_display")}
              sortKey="node_type_display"
            >
              Type
            </TableHeader>
          ),
        },
        {
          className: "vlans-col",
          content: (
            <TableHeader data-testid="vlans-header"># of VLANs</TableHeader>
          ),
        },
        {
          className: "version-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="version-header"
                onClick={() => updateSort("version")}
                sortKey="version"
              >
                Version
              </TableHeader>
              <TableHeader>Channel</TableHeader>
            </>
          ),
        },
        {
          className: "upgrade-col",
          content: (
            <TableHeader data-testid="upgrade-header">
              Available upgrade
            </TableHeader>
          ),
        },
        {
          className: "images-col",
          content: (
            <>
              <TableHeader data-testid="images-header">
                Last Image Sync
              </TableHeader>
              <TableHeader>Images Status</TableHeader>
            </>
          ),
        },
      ]}
      rows={generateRows({
        controllers: sortedControllers,
        unconfiguredControllers: unconfiguredControllers.length,
        configuredControllers: configuredControllers.length,
        selectedIDs,
        handleRowCheckbox,
        vaultEnabled,
      })}
    />
  );
};

export default ControllerListTable;
