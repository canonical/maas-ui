import { Code, Col, Row } from "@canonical/react-components";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useWindowTitle } from "app/base/hooks";
import React, { useEffect, useState } from "react";

import {
  controller as controllerActions,
  dhcpsnippet as dhcpsnippetActions,
  machine as machineActions,
  subnet as subnetActions,
} from "app/base/actions";
import controllerSelectors from "app/store/controller/selectors";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import machineSelectors from "app/store/machine/selectors";
import subnetSelectors from "app/store/subnet/selectors";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import { useAddMessage } from "app/base/hooks";
import ColumnToggle from "app/base/components/ColumnToggle";
import DhcpTarget from "app/settings/views/Dhcp/DhcpTarget";
import SettingsTable from "app/settings/components/SettingsTable";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const getTargetName = (
  controllers,
  devices,
  machines,
  subnets,
  { node, subnet: subnetId }
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
  return target && (target.name || target.hostname);
};

const generateRows = (
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
  setDeleting
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
          content: type,
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
          content: (
            <TableActions
              editPath={`/settings/dhcp/${dhcpsnippet.id}/edit`}
              onDelete={() => {
                setExpandedId(dhcpsnippet.id);
                setExpandedType("delete");
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: expanded,
      expandedContent:
        expanded &&
        (showDelete ? (
          <TableDeleteConfirm
            modelName={dhcpsnippet.name}
            modelType="DHCP snippet"
            onCancel={hideExpanded}
            onConfirm={() => {
              dispatch(dhcpsnippetActions.delete(dhcpsnippet.id));
              setDeleting(dhcpsnippet.name);
              hideExpanded();
            }}
          />
        ) : (
          <Row>
            <Col size="10">
              <Code className="u-no-margin--bottom">{dhcpsnippet.value}</Code>
            </Col>
          </Row>
        )),
      key: dhcpsnippet.id,
      sortData: {
        name: dhcpsnippet.name,
        enabled,
        description: dhcpsnippet.description,
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

const DhcpList = () => {
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const [deletingName, setDeleting] = useState();
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippetLoaded = useSelector(dhcpsnippetSelectors.loaded);
  const dhcpsnippets = useSelector((state) =>
    dhcpsnippetSelectors.search(state, searchText)
  );
  const saved = useSelector(dhcpsnippetSelectors.saved);
  const subnets = useSelector(subnetSelectors.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const dispatch = useDispatch();

  useWindowTitle("DHCP snippets");

  useAddMessage(
    saved && deletingName,
    dhcpsnippetActions.cleanup,
    `${deletingName} removed successfully.`,
    setDeleting
  );

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
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
      buttons={[{ label: "Add snippet", url: "/settings/dhcp/add" }]}
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
          content: "Actions",
          className: "u-align--right",
        },
      ]}
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
        setDeleting
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search DHCP snippets"
      searchText={searchText}
      tableClassName="dhcp-list"
    />
  );
};

export default DhcpList;
