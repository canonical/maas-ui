import { useEffect, useState } from "react";

import { Code, Col, Row } from "@canonical/react-components";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import ColumnToggle from "app/base/components/ColumnToggle";
import DhcpSnippetType from "app/base/components/DhcpSnippetType";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import docsUrls from "app/base/docsUrls";
import { useWindowTitle, useAddMessage } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import settingsURLs from "app/settings/urls";
import DhcpTarget from "app/settings/views/Dhcp/DhcpTarget";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { Device } from "app/store/device/types";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type {
  DHCPSnippet,
  DHCPSnippetMeta,
  DHCPSnippetState,
} from "app/store/dhcpsnippet/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";

const getTargetName = (
  controllers: Controller[],
  devices: Device[],
  machines: Machine[],
  subnets: Subnet[],
  { node, subnet: subnetId }: DHCPSnippet
) => {
  let target;
  if (subnetId) {
    target = subnets.find((subnet) => subnet.id === subnetId);
  } else if (node) {
    const controllerItem = controllers.find(
      (controller) => controller.system_id === node
    );
    const deviceItem = devices.find((device) => device.system_id === node);
    const machineItem = machines.find((machine) => machine.system_id === node);
    target = controllerItem || deviceItem || machineItem;
  }
  return (
    target &&
    (("name" in target && target.name) ||
      ("hostname" in target && target.hostname))
  );
};

const generateRows = (
  dhcpsnippets: DHCPSnippet[],
  expandedId: DHCPSnippet[DHCPSnippetMeta.PK] | null,
  setExpandedId: (expandedId: DHCPSnippet[DHCPSnippetMeta.PK] | null) => void,
  expandedType: "details" | "delete" | null,
  setExpandedType: (expandedType: "details" | "delete" | null) => void,
  controllers: Controller[],
  devices: Device[],
  machines: Machine[],
  subnets: Subnet[],
  hideExpanded: () => void,
  dispatch: Dispatch,
  setDeleting: (deletingName: DHCPSnippet["name"] | null) => void,
  saved: DHCPSnippetState["saved"],
  saving: DHCPSnippetState["saving"]
) =>
  dhcpsnippets.map((dhcpsnippet) => {
    const expanded = expandedId === dhcpsnippet.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const updated = dhcpsnippet.updated
      ? format(
          parse(dhcpsnippet.updated, "E, dd LLL. yyyy HH:mm:ss", new Date()),
          "yyyy-LL-dd H:mm"
        )
      : "Never";
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    const showDelete = expandedType === "delete";
    const type =
      (dhcpsnippet.node && "Node") ||
      (dhcpsnippet.subnet && "Subnet") ||
      "Global";
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <ColumnToggle
              isExpanded={expanded && !showDelete}
              label={dhcpsnippet.name}
              onClose={hideExpanded}
              onOpen={() => {
                setExpandedId(dhcpsnippet.id);
                setExpandedType("details");
              }}
            />
          ),
          role: "rowheader",
        },
        {
          content: (
            <DhcpSnippetType
              nodeId={dhcpsnippet.node}
              subnetId={dhcpsnippet.subnet}
            />
          ),
        },
        {
          content: (dhcpsnippet.node || dhcpsnippet.subnet) && (
            <DhcpTarget
              nodeId={dhcpsnippet.node}
              subnetId={dhcpsnippet.subnet}
            />
          ),
        },
        { content: dhcpsnippet.description },
        { content: enabled },
        { content: updated },
        {
          className: "u-align--right",
          content: (
            <TableActions
              editPath={settingsURLs.dhcp.edit({ id: dhcpsnippet.id })}
              onDelete={() => {
                setExpandedId(dhcpsnippet.id);
                setExpandedType("delete");
              }}
            />
          ),
        },
      ],
      "data-testid": "dhcp-row",
      expanded: expanded,
      expandedContent:
        expanded &&
        (showDelete ? (
          <TableDeleteConfirm
            deleted={saved}
            deleting={saving}
            modelName={dhcpsnippet.name}
            modelType="DHCP snippet"
            onClose={hideExpanded}
            onConfirm={() => {
              dispatch(dhcpsnippetActions.delete(dhcpsnippet.id));
              setDeleting(dhcpsnippet.name);
            }}
          />
        ) : (
          <Row>
            <Col size={10}>
              <Code className="u-no-margin--bottom">{dhcpsnippet.value}</Code>
            </Col>
          </Row>
        )),
      key: dhcpsnippet.id,
      sortData: {
        description: dhcpsnippet.description,
        enabled,
        name: dhcpsnippet.name,
        target: getTargetName(
          controllers,
          devices,
          machines,
          subnets,
          dhcpsnippet
        ),
        type,
        updated,
      },
    };
  });

const DhcpList = (): JSX.Element => {
  const [expandedId, setExpandedId] = useState<
    DHCPSnippet[DHCPSnippetMeta.PK] | null
  >(null);
  const [expandedType, setExpandedType] = useState<"details" | "delete" | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [deletingName, setDeleting] = useState<DHCPSnippet["name"] | null>(
    null
  );
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippetLoaded = useSelector(dhcpsnippetSelectors.loaded);
  const dhcpsnippets = useSelector((state: RootState) =>
    dhcpsnippetSelectors.search(state, searchText)
  );
  const saved = useSelector(dhcpsnippetSelectors.saved);
  const saving = useSelector(dhcpsnippetSelectors.saving);
  const subnets = useSelector(subnetSelectors.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const dispatch = useDispatch();

  useWindowTitle("DHCP snippets");

  useAddMessage(
    saved && !!deletingName,
    dhcpsnippetActions.cleanup,
    `${deletingName} removed successfully.`,
    () => setDeleting(null)
  );

  const hideExpanded = () => {
    setExpandedId(null);
    setExpandedType(null);
  };

  useEffect(() => {
    dispatch(dhcpsnippetActions.fetch());
    // The following models are used in DhcpTarget, but they are requested here
    // to prevent every DhcpTarget having to dispatch the actions.
    dispatch(subnetActions.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  return (
    <SettingsTable
      buttons={[{ label: "Add snippet", url: settingsURLs.dhcp.add }]}
      headers={[
        {
          content: "Snippet name",
          sortKey: "name",
        },
        {
          content: "Type",
          sortKey: "type",
        },
        {
          content: "Applies to",
          sortKey: "target",
        },
        {
          content: "Description",
          sortKey: "description",
        },
        {
          content: "Enabled",
          sortKey: "enabled",
        },
        {
          content: "Last edited",
          sortKey: "updated",
        },
        {
          className: "u-align--right",
          content: "Actions",
        },
      ]}
      helpLabel="About DHCP"
      helpLink={docsUrls.dhcp}
      loaded={dhcpsnippetLoaded}
      loading={dhcpsnippetLoading}
      rows={generateRows(
        dhcpsnippets,
        expandedId,
        setExpandedId,
        expandedType,
        setExpandedType,
        controllers,
        devices,
        machines,
        subnets,
        hideExpanded,
        dispatch,
        setDeleting,
        saved,
        saving
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search DHCP snippets"
      searchText={searchText}
      tableClassName="dhcp-list"
    />
  );
};

export default DhcpList;
