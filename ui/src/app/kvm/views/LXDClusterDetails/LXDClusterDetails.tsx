import { useState } from "react";

import { useParams } from "react-router";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";

const LXDClusterDetails = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const id = Number(params.id);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  return (
    <Section
      header={
        <LXDClusterDetailsHeader
          headerContent={headerContent}
          id={id}
          setHeaderContent={setHeaderContent}
        />
      }
      headerClassName="u-no-padding--bottom"
    />
  );
};

export default LXDClusterDetails;
