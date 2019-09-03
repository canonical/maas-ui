import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import Button from "app/base/components/Button";
import Code from "app/base/components/Code";
import Col from "app/base/components/Col";
import VanillaLink from "app/base/components/Link";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Pagination from "app/base/components/Pagination";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";
import selectors from "app/settings/selectors";

const generateURL = url => `${process.env.REACT_APP_MAAS_URL}/${url}`;

const getNode = (controllers, devices, machines, nodeId) => {
  const controllerItem = controllers.find(
    controller => controller.system_id === nodeId
  );
  const deviceItem = devices.find(device => device.system_id === nodeId);
  const machineItem = machines.find(machine => machine.system_id === nodeId);
  return {
    category:
      (controllerItem && "controller") ||
      (deviceItem && "device") ||
      (machineItem && "machine"),
    node: controllerItem || deviceItem || machineItem
  };
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
  machineLoaded
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
    let type = "Global";
    let target = null;
    let url;
    if (dhcpsnippet.node) {
      type = "Node";
      const { node, category } = getNode(
        controllers,
        devices,
        machines,
        dhcpsnippet.node
      );
      target = node;
      url = generateURL(`#/${category}/${dhcpsnippet.node}`);
    } else if (dhcpsnippet.subnet) {
      type = "Subnet";
      target = subnets.find(subnet => subnet.id === dhcpsnippet.subnet);
      url = generateURL(`#/subnet/${dhcpsnippet.subnet}`);
    }
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    const showDelete = expandedType === "delete";
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
        { content: type },
        {
          content: target ? (
            <VanillaLink href={url}>
              {target.name || target.hostname}{" "}
              {target.domain && target.domain.name && (
                <small>.{target.domain.name}</small>
              )}
            </VanillaLink>
          ) : (
            dhcpsnippet.node &&
            !machineLoaded && (
              <Loader inline className="u-no-margin u-no-padding" />
            )
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
              <Button appearance="negative" onClick={hideExpanded}>
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
        target: target && target.name,
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
  const [itemsPerPage] = useState(initialCount);
  const dhcpsnippetLoading = useSelector(selectors.dhcpsnippet.loading);
  const dhcpsnippetLoaded = useSelector(selectors.dhcpsnippet.loaded);
  const dhcpsnippets = useSelector(
    state => selectors.dhcpsnippet.search(state, searchText),
    // Without this method of the comparing the state then the dispatches are
    // not received by the websocket saga. See:
    // https://github.com/canonical-web-and-design/maas-ui/issues/172
    shallowEqual
  );
  const dhcpsnippetCount = useSelector(selectors.dhcpsnippet.count);
  const subnetLoading = useSelector(selectors.subnet.loading);
  const subnetLoaded = useSelector(selectors.subnet.loaded);
  const subnets = useSelector(selectors.subnet.all);
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const controllers = useSelector(controllerSelectors.all);
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const devices = useSelector(deviceSelectors.all);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const machines = useSelector(machineSelectors.all);
  const dispatch = useDispatch();
  const isLoading =
    dhcpsnippetLoading || subnetLoading || controllerLoading || deviceLoading;
  const hasLoaded =
    dhcpsnippetLoaded && subnetLoaded && controllerLoaded && deviceLoaded;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  useEffect(() => {
    dispatch(actions.dhcpsnippet.fetch());
    dispatch(actions.subnet.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (isLoading) {
    return <Loader text="Loading..." />;
  }

  return (
    <>
      {isLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to="/dhcp/add">
          Add snippet
        </Button>
      </div>
      {hasLoaded && (
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
            machineLoaded
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
