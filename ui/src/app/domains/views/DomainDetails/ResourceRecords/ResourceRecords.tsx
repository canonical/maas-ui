import { Col, MainTable, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import domainsSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Domain["id"];
};

const ResourceRecords = ({ id }: Props): JSX.Element => {
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );

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
    },
  ];

  const rows = domain.rrsets
    ? domain.rrsets.map((resource) => {
        return {
          columns: [
            {
              content: resource.name,
            },
            {
              content: resource.rrtype,
            },
            {
              content: resource.ttl,
            },
            {
              content: resource.rrdata,
            },
            {
              content: "",
            },
          ],
        };
      })
    : null;

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <Strip>
      <Row>
        <Col size={12}>
          <h3 className="p-heading--4">Resource records</h3>
          <MainTable headers={headers} rows={rows} />
        </Col>
      </Row>
    </Strip>
  );
};

export default ResourceRecords;
