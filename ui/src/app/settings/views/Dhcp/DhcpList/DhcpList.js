import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import "./DhcpList.scss";
import actions from "app/settings/actions";
import {
  controller as controllerActions,
  device as deviceActions,
  machine as machineActions
} from "app/base/actions";
import {
  controller as controllerSelectors,
  device as deviceSelectors,
  machine as machineSelectors
} from "app/base/selectors";
import { messages } from "app/base/actions";
import Button from "app/base/components/Button";
import Code from "app/base/components/Code";
import Col from "app/base/components/Col";
import DhcpTarget from "app/settings/views/Dhcp/DhcpTarget";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Pagination from "app/base/components/Pagination";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";
import selectors from "app/settings/selectors";

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
            <Button
              appearance="link"
              className={classNames("dhcp-list__toggle", {
                "is-active": expanded && !showDelete
              })}
              inline
              onClick={() => {
                if (expandedId && !showDelete) {
                  hideExpanded();
                } else {
                  setExpandedId(dhcpsnippet.id);
                  setExpandedType("details");
                }
              }}
            >
              <span className="dhcp-list__toggle-name">{dhcpsnippet.name}</span>
            </Button>
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
                to={`/dhcp/${dhcpsnippet.id}/edit`}
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
          <Row>
            <Col size="7">
              Are you sure you want to delete DHCP snippet "{dhcpsnippet.name}"?{" "}
              <span className="u-text--light">
                This action is permanent and can not be undone.
              </span>
            </Col>
            <Col size="3" className="u-align--right">
              <Button onClick={hideExpanded}>Cancel</Button>
              <Button
                appearance="negative"
                onClick={() => {
                  dispatch(actions.dhcpsnippet.delete(dhcpsnippet.id));
                  setDeleting(dhcpsnippet.name);
                  hideExpanded();
                }}
              >
                Delete
              </Button>
            </Col>
          </Row>
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

const DhcpList = ({ initialCount = 20 }) => {
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingName, setDeleting] = useState();
  const [itemsPerPage] = useState(initialCount);
  const dhcpsnippetLoading = useSelector(selectors.dhcpsnippet.loading);
  const dhcpsnippetLoaded = useSelector(selectors.dhcpsnippet.loaded);
  const dhcpsnippets = useSelector(state =>
    selectors.dhcpsnippet.search(state, searchText)
  );
  const dhcpsnippetCount = useSelector(selectors.dhcpsnippet.count);
  const saved = useSelector(selectors.dhcpsnippet.saved);
  const subnets = useSelector(selectors.subnet.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const dispatch = useDispatch();
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  useEffect(() => {
    dispatch(actions.dhcpsnippet.fetch());
    // The following models are used in DhcpTarget, but they are requested here
    // to prevent every DhcpTarget having to dispatch the actions.
    dispatch(actions.subnet.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (saved && deletingName) {
      dispatch(
        messages.add(`${deletingName} removed successfully.`, "information")
      );
      setDeleting();
      dispatch(actions.dhcpsnippet.cleanup());
    }
  }, [deletingName, dispatch, saved]);

  return (
    <>
      {dhcpsnippetLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to="/dhcp/add">
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
          rowLimit={itemsPerPage}
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
          rowStartIndex={indexOfFirstItem}
          sortable={true}
        />
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={dhcpsnippetCount}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

DhcpList.propTypes = {
  initialCount: PropTypes.number
};

export default DhcpList;
