import { Button, Col, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import domainsSelectors from "app/store/domain/selectors";
import type { Domain } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Domain["id"];
};

const DomainSummary = ({ id }: Props): JSX.Element | null => {
  const domain = useSelector((state: RootState) =>
    domainsSelectors.getById(state, Number(id))
  );

  if (!domain) {
    return null;
  }

  return (
    <Strip>
      <Row>
        <Col size="8">
          <h3 className="p-heading--4">Domain Summary</h3>
        </Col>
        <Col size="4" className="u-align--right">
          <Button disabled>Edit</Button>
        </Col>
      </Row>
      <Row>
        <Col size="2">
          <p className="u-text--muted">Name</p>
        </Col>
        <Col size="4">
          <p>{domain.name}</p>
        </Col>
        <Col size="2">
          <p className="u-text--muted">Authoritative</p>
        </Col>
        <Col size="4">
          <p>{domain.authoritative ? "Yes" : "No"}</p>
        </Col>
      </Row>
      <Row>
        <Col size="2">
          <p className="u-text--muted">TTL</p>
        </Col>
        <Col size="4">
          <p>{domain.ttl}</p>
        </Col>
      </Row>
    </Strip>
  );
};

export default DomainSummary;
