import { MainTable, Spinner } from "@canonical/react-components";

import StatusColumn from "./StatusColumn";
import VLANsColumn from "./VLANsColumn";
import VersionColumn from "./VersionColumn";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import LegacyLink from "app/base/components/LegacyLink";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import baseURLs from "app/base/urls";
import ImageStatus from "app/controllers/components/ImageStatus";
import type { Controller, ControllerMeta } from "app/store/controller/types";
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

const generateRows = (
  controllers: Controller[],
  selectedIDs: Controller[ControllerMeta.PK][],
  handleRowCheckbox: CheckboxHandlers<
    Controller[ControllerMeta.PK]
  >["handleRowCheckbox"]
) =>
  controllers.map((controller) => {
    const {
      domain: { name: domainName },
      fqdn,
      hostname,
      system_id,
    } = controller;

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
                    <LegacyLink route={baseURLs.controller({ id: system_id })}>
                      <strong>{hostname}</strong>
                      <span>.{domainName}</span>
                    </LegacyLink>
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
            <span className="u-truncate">{controller.node_type_display}</span>
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

  return (
    <MainTable
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
      rows={generateRows(sortedControllers, selectedIDs, handleRowCheckbox)}
    />
  );
};

export default ControllerListTable;
