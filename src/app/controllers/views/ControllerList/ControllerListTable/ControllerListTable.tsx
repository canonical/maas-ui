import { ExternalLink } from "@canonical/maas-react-components";
import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import StatusColumn from "./StatusColumn";
import VLANsColumn from "./VLANsColumn";
import VersionColumn from "./VersionColumn";

import ControllerLink from "@/app/base/components/ControllerLink";
import DoubleRow from "@/app/base/components/DoubleRow";
import GroupCheckbox from "@/app/base/components/GroupCheckbox";
import RowCheckbox from "@/app/base/components/RowCheckbox";
import TableHeader from "@/app/base/components/TableHeader";
import TooltipButton from "@/app/base/components/TooltipButton";
import docsUrls from "@/app/base/docsUrls";
import { useFetchActions, useTableSort } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import { controllerActions } from "@/app/store/controller";
import controllerSelectors from "@/app/store/controller/selectors";
import type { Controller, ControllerMeta } from "@/app/store/controller/types";
import { generalActions } from "@/app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "@/app/store/general/selectors";
import type { RootState } from "@/app/store/root/types";
import { NodeType } from "@/app/store/types/node";
import {
  generateEmptyStateMsg,
  generateCheckboxHandlers,
  isComparable,
  getTableStatus,
} from "@/app/utils";
import type { CheckboxHandlers } from "@/app/utils/generateCheckboxHandlers";

type Props = {
  readonly controllers: Controller[];
  readonly hasFilter?: boolean;
  readonly loading?: boolean;
  readonly onSelectedChange: (
    newSelectedIDs: Controller[ControllerMeta.PK][]
  ) => void;
  readonly selectedIDs: Controller[ControllerMeta.PK][];
};

type SortKey = keyof Controller | "version";

export enum Label {
  NoResults = "No controllers match the search criteria.",
  EmptyList = "No controllers available.",
}

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
  configuredControllers,
  selectedIDs,
  handleRowCheckbox,
  vaultEnabled,
}: {
  controllers: Controller[];
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
                  <TooltipButton
                    aria-label="security"
                    iconName="security-tick"
                    iconProps={{
                      "data-testid": "vault-icon",
                      "aria-describedby": "tooltip-description-tick",
                    }}
                    message={
                      <p id="tooltip-description-tick">
                        Vault is configured on this region controller for secret
                        storage.
                        <br />
                        <ExternalLink
                          className="is-on-dark"
                          to={docsUrls.vaultIntegration}
                        >
                          Read more about Vault integration
                        </ExternalLink>
                      </p>
                    }
                  />
                ) : controller.vault_configured === true ? (
                  <TooltipButton
                    aria-label="security"
                    iconName="security"
                    iconProps={{
                      "data-testid": "vault-icon",
                      "aria-describedby": "tooltip-description",
                    }}
                    message={
                      <p id="tooltip-description">
                        Vault is configured on this controller. <br />
                        Once all controllers are configured, migrate the
                        secrets. <br />
                        <ExternalLink
                          className="is-on-dark"
                          to={docsUrls.vaultIntegration}
                        >
                          Read more about Vault integration
                        </ExternalLink>
                      </p>
                    }
                  />
                ) : (
                  configuredControllers >= 1 && (
                    <TooltipButton
                      aria-label="security"
                      iconName="security-warning"
                      iconProps={{
                        "data-testid": "vault-icon",
                        "aria-describedby": "tooltip-description-warning",
                      }}
                      message={
                        <p id="tooltip-description-warning">
                          Missing Vault configuration.
                          <br />
                          <ExternalLink
                            className="is-on-dark"
                            to={docsUrls.vaultIntegration}
                          >
                            Read more about Vault integration
                          </ExternalLink>
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
}: Props): React.ReactElement => {
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
  const { configuredControllers } = useSelector((state: RootState) =>
    controllerSelectors.getVaultConfiguredControllers(state)
  );

  const vaultEnabled = useSelector(vaultEnabledSelectors.get);

  useFetchActions([generalActions.fetchVaultEnabled, controllerActions.fetch]);
  const tableStatus = getTableStatus({ isLoading: loading, hasFilter });

  return (
    <MainTable
      aria-label="controllers list"
      className="controller-list-table"
      emptyStateMsg={generateEmptyStateMsg(tableStatus, {
        default: Label.EmptyList,
        filtered: Label.NoResults,
      })}
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
                onClick={() => {
                  updateSort("fqdn");
                }}
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
              onClick={() => {
                updateSort("node_type_display");
              }}
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
                onClick={() => {
                  updateSort("version");
                }}
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
      ]}
      rows={generateRows({
        controllers: sortedControllers,
        configuredControllers: configuredControllers.length,
        selectedIDs,
        handleRowCheckbox,
        vaultEnabled,
      })}
    />
  );
};

export default ControllerListTable;
