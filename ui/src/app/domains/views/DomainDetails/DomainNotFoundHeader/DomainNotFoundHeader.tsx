import { Button } from "@canonical/react-components";
import { useHistory } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import domainsURLs from "app/domains/urls";
import type { Domain } from "app/store/domain/types";

type Props = {
  id: Domain["id"];
};

const DomainNotFoundHeader = ({ id }: Props): JSX.Element => {
  const history = useHistory();
  const buttons = [
    <Button
      key="reload-domains"
      onClick={() => {
        history.go(0);
      }}
    >
      Reload
    </Button>,
    <Button
      key="back-to-domains-list"
      onClick={() => {
        history.push({ pathname: domainsURLs.domains });
      }}
    >
      Go back
    </Button>,
  ];

  return <SectionHeader buttons={buttons} title={`No item with pk: ${id}`} />;
};

export default DomainNotFoundHeader;
