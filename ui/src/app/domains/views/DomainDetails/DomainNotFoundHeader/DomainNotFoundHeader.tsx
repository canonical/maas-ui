import { Button } from "@canonical/react-components";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
import domainsURLs from "app/domains/urls";
const DomainDetailsHeader = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const buttons = [
    <Button
      onClick={() => {
        history.go(0);
      }}
    >
      Reload
    </Button>,
    <Button
      onClick={() => {
        history.push({ pathname: domainsURLs.domains });
      }}
    >
      Go back
    </Button>,
  ];

  return <SectionHeader buttons={buttons} title={`No item with pk: ${id}`} />;
};

export default DomainDetailsHeader;
