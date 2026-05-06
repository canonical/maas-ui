import { useState, type ReactElement } from "react";

import SwitchesListHeader from "@/app/switches/components/SwitchesListHeader";
import SwitchesTable from "@/app/switches/components/SwitchesTable";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

const SwitchesList = (): ReactElement => {
  useWindowTitle("Switches");

  const [searchFilter, setSearchFilter] = useState("");

  return (
    <PageContent
      header={
        // TODO: Pass searchFilter to SwitchesTable when the switches endpoint supports search.
        <SwitchesListHeader
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <SwitchesTable />
    </PageContent>
  );
};

export default SwitchesList;
