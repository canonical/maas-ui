import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./DhcpList.scss";
import {
  controller as controllerActions,
  device as deviceActions,
  dhcpsnippet as dhcpsnippetActions,
  machine as machineActions,
  subnet as subnetActions
} from "app/base/actions";
import {
  controller as controllerSelectors,
  device as deviceSelectors,
  dhcpsnippet as dhcpsnippetSelectors,
  machine as machineSelectors,
  subnet as subnetSelectors
} from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import Button from "app/base/components/Button";
import Code from "app/base/components/Code";
import Col from "app/base/components/Col";
import ColumnToggle from "app/base/components/ColumnToggle";
import DhcpTarget from "app/settings/views/Dhcp/DhcpTarget";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";
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
    target = subnets.find(subnet => subnet.id === subnetId);
  } else if (node) {
    const controllerItem = controllers.find(
      controller => controller.system_id === node
    );
    const deviceItem = devices.find(device => device.system_id === node);
    const machineItem = machines.find(machine => machine.system_id === node);
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
  dhcpsnippets.map(dhcpsnippet => {
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
          role: "rowheader"
        },
        {
          content: type
        },
        {
          content: (dhcpsnippet.node || dhcpsnippet.subnet) && (
            <DhcpTarget
              nodeId={dhcpsnippet.node}
              subnetId={dhcpsnippet.subnet}
            />
          )
        },
        { content: dhcpsnippet.description },
        { content: enabled },
        { content: updated },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/settings/dhcp/${dhcpsnippet.id}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>

              <span className="p-tooltip p-tooltip--left">
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => {
                    setExpandedId(dhcpsnippet.id);
                    setExpandedType("delete");
                  }}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </span>
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
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
              <Code>{dhcpsnippet.value}</Code>
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
        updated
      }
    };
  });

const DhcpList = () => {
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const [deletingName, setDeleting] = useState();
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippetLoaded = useSelector(dhcpsnippetSelectors.loaded);
  const dhcpsnippets = useSelector(state =>
    dhcpsnippetSelectors.search(state, searchText)
  );
  const saved = useSelector(dhcpsnippetSelectors.saved);
  const subnets = useSelector(subnetSelectors.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const dispatch = useDispatch();
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
    <>
      {dhcpsnippetLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to="/settings/dhcp/add">
          Add snippet
        </Button>
      </div>
      {dhcpsnippetLoaded && (
        <MainTable
          className="p-table-expanding--light dhcp-list"
          expanding={true}
          headers={[
            {
              content: "Snippet name",
              sortKey: "name"
            },
            {
              content: "Type",
              sortKey: "type"
            },
            {
              content: "Applies to",
              sortKey: "target"
            },
            {
              content: "Description",
              sortKey: "description"
            },
            {
              content: "Enabled",
              sortKey: "enabled"
            },
            {
              content: "Last edited",
              sortKey: "updated"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          paginate={20}
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
          sortable={true}
        />
      )}
    </>
  );
};

export default DhcpList;
