import type { ReactElement } from "react";
import { useState } from "react";

import SubnetsTable from "../../components/SubnetsTable";

import PageContent from "@/app/base/components/PageContent/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useQuery } from "@/app/base/hooks/urls";
import SubnetsListHeader from "@/app/subnets/views/Subnets/components/SubnetsListHeader/SubnetsListHeader";
import type { GroupByKey } from "@/app/subnets/views/Subnets/components/SubnetsTable/types";

export const SubnetsUrlParams = {
  By: "by",
  Q: "q",
};

const SubnetsList = (): ReactElement => {
  useWindowTitle("Subnets");
  const query = useQuery();
  const [searchText, setSearchText] = useState<string>(
    query.get(SubnetsUrlParams.Q) || ""
  );
  const grouping = query.get(SubnetsUrlParams.By);

  const hasValidGroupBy = grouping && ["fabric", "space"].includes(grouping);

  return (
    <PageContent
      header={
        <SubnetsListHeader
          grouping={grouping}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      }
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {hasValidGroupBy ? (
        <SubnetsTable
          groupBy={grouping as GroupByKey}
          searchText={searchText}
        />
      ) : null}
    </PageContent>
  );
};

export default SubnetsList;
