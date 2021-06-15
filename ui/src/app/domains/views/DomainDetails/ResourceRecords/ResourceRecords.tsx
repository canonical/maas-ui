import { Col, MainTable, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import machineURLs from "app/machines/urls";
import domainsSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";
import { NodeType } from "app/store/types/node";

type Props = {
  id: Domain["id"];
};

const ResourceRecords = ({ id }: Props): JSX.Element | null => {
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );

  if (!domain || !domain.rrsets || domain.rrsets.length === 0) {
    return null;
  }

  const headers = [
    {
      content: "Name",
    },
    {
      content: "Type",
    },
    {
      content: "TTL",
    },
    {
      content: "Data",
    },
    {
      content: "Actions",
      className: "u-align--right",
    },
  ];

  const rows = domain.rrsets.map((resource) => {
    const nodeType: NodeType = resource.node_type;
    let nameCell: JSX.Element;

    switch (nodeType) {
      case NodeType.MACHINE:
        nameCell = (
          <Link to={machineURLs.machine.index({ id: resource.system_id })}>
            {resource.name}
          </Link>
        );
        break;
      case NodeType.DEVICE:
        nameCell = (
          <LegacyLink route={baseURLs.device({ id: resource.system_id })}>
            {resource.name}
          </LegacyLink>
        );
        break;
      case NodeType.RACK_CONTROLLER:
      case NodeType.REGION_CONTROLLER:
      case NodeType.REGION_AND_RACK_CONTROLLER:
        nameCell = (
          <LegacyLink route={baseURLs.controller({ id: resource.system_id })}>
            {resource.name}
          </LegacyLink>
        );
        break;
      default:
        nameCell = <>{resource.name}</>;
    }

    return {
      columns: [
        {
          content: nameCell,
        },
        {
          content: resource.rrtype,
        },
        {
          content: resource.ttl || "(default)",
        },
        {
          content: resource.rrdata,
        },
        {
          content: "",
        },
      ],
    };
  });

  return (
    <Strip>
      <Row>
        <Col size="12">
          <h3 className="p-heading--4">Resource records</h3>
          <MainTable headers={headers} rows={rows} />
        </Col>
      </Row>
    </Strip>
  );
};

export default ResourceRecords;
