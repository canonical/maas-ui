import type { ReactElement } from "react";
import { useState } from "react";

import SubnetsTable from "./SubnetsTable";
import type { GroupByKey } from "./SubnetsTable/types";

import PageContent from "@/app/base/components/PageContent/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useQuery } from "@/app/base/hooks/urls";
import { SubnetsUrlParams } from "@/app/subnets/constants";
import SubnetsListHeader from "@/app/subnets/views/SubnetsList/SubnetsListHeader/SubnetsListHeader";

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
