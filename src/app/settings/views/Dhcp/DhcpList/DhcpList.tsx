import { useEffect, useState } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import {
  Button,
  Code,
  Col,
  MainTable,
  Row,
  Spinner,
  Link as VanillaLink,
} from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import ColumnToggle from "@/app/base/components/ColumnToggle";
import DhcpSnippetType from "@/app/base/components/DhcpSnippetType";
import SearchBox from "@/app/base/components/SearchBox";
import TableActions from "@/app/base/components/TableActions";
import TableDeleteConfirm from "@/app/base/components/TableDeleteConfirm";
import docsUrls from "@/app/base/docsUrls";
import { useWindowTitle } from "@/app/base/hooks";
import type { SidePanelActions } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import DhcpAdd from "@/app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "@/app/settings/views/Dhcp/DhcpEdit";
import DhcpTarget from "@/app/settings/views/Dhcp/DhcpTarget";
import { controllerActions } from "@/app/store/controller";
import controllerSelectors from "@/app/store/controller/selectors";
import type { Controller } from "@/app/store/controller/types";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import type { Device } from "@/app/store/device/types";
import { dhcpsnippetActions } from "@/app/store/dhcpsnippet";
import dhcpsnippetSelectors from "@/app/store/dhcpsnippet/selectors";
import type {
  DHCPSnippet,
  DHCPSnippetMeta,
  DHCPSnippetState,
} from "@/app/store/dhcpsnippet/types";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet } from "@/app/store/subnet/types";
import { formatUtcDatetime } from "@/app/utils/time";

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
  openSidePanel: SidePanelActions["openSidePanel"],
  dhcpsnippets: DHCPSnippet[],
  expandedId: DHCPSnippet[DHCPSnippetMeta.PK] | null,
  setExpandedId: (expandedId: DHCPSnippet[DHCPSnippetMeta.PK] | null) => void,
  expandedType: "delete" | "details" | null,
  setExpandedType: (expandedType: "delete" | "details" | null) => void,
  controllers: Controller[],
  devices: Device[],
  machines: Machine[],
  subnets: Subnet[],
  hideExpanded: () => void,
  dispatch: Dispatch,
  saved: DHCPSnippetState["saved"],
  saving: DHCPSnippetState["saving"]
) =>
  dhcpsnippets.map((dhcpsnippet) => {
    const expanded = expandedId === dhcpsnippet.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const updated = dhcpsnippet.updated
      ? formatUtcDatetime(dhcpsnippet.updated)
      : "Never";
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    const showDelete = expandedType === "delete";
    const type =
      (dhcpsnippet.node && "Node") ||
      (dhcpsnippet.subnet && "Subnet") ||
      (dhcpsnippet.iprange && "IP Range") ||
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
              ipRangeId={dhcpsnippet.iprange}
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
          content: (
            <TableActions
              onDelete={() => {
                setExpandedId(dhcpsnippet.id);
                setExpandedType("delete");
              }}
              onEdit={() => {
                openSidePanel({
                  component: DhcpEdit,
                  title: "Edit DHCP snippet",
                  props: {
                    id: dhcpsnippet.id,
                  },
                });
              }}
            />
          ),
          className: "u-align--right",
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

const DhcpList = (): React.ReactElement => {
  const { openSidePanel } = useSidePanel();
  const [expandedId, setExpandedId] = useState<
    DHCPSnippet[DHCPSnippetMeta.PK] | null
  >(null);
  const [expandedType, setExpandedType] = useState<"delete" | "details" | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

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
  }, [dispatch]);

  return (
    <ContentSection>
      <ContentSection.Content>
        <div className="settings-table">
          <MainToolbar>
            <MainToolbar.Title>DHCP snippets</MainToolbar.Title>
            <MainToolbar.Controls>
              <SearchBox
                onChange={setSearchText}
                placeholder="Search DHCP snippets"
                value={searchText}
              />
              <Button
                onClick={() => {
                  openSidePanel({
                    component: DhcpAdd,
                    title: "Add DHCP snippet",
                  });
                }}
              >
                Add snippet
              </Button>
            </MainToolbar.Controls>
          </MainToolbar>
          {dhcpsnippetLoading && (
            <div className="settings-table__loader">
              <Spinner />
            </div>
          )}
          <MainTable
            className={classNames(
              "p-table-expanding--light u-nudge-down",
              "dhcp-list",
              {
                "u-no-padding--bottom":
                  dhcpsnippetLoading && !dhcpsnippetLoaded,
              }
            )}
            defaultSortDirection="ascending"
            emptyStateMsg="No DHCP snippets available."
            expanding={true}
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
            paginate={20}
            rows={
              dhcpsnippetLoaded
                ? generateRows(
                    openSidePanel,
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
                    saved,
                    saving
                  )
                : undefined
            }
            sortable
          />
          {dhcpsnippetLoading && !dhcpsnippetLoaded && (
            <div className="settings-table__lines"></div>
          )}
          <p className="u-no-margin--bottom settings-table__help">
            <VanillaLink
              href={docsUrls.dhcp}
              rel="noopener noreferrer"
              target="_blank"
            >
              About DHCP
            </VanillaLink>
          </p>
        </div>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default DhcpList;
