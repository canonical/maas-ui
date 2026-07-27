import { useEffect, useState } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import AddSwitch from "../AddSwitch";

import DebounceSearchBox from "@/app/base/components/DebounceSearchBox";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { SetSearchFilter } from "@/app/base/types";

type Props = {
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
};

const SwitchesListHeader = ({ searchFilter, setSearchFilter }: Props) => {
  const { openSidePanel } = useSidePanel();
  const [searchText, setSearchText] = useState(searchFilter);

  useEffect(() => {
    setSearchText(searchFilter);
  }, [searchFilter]);

  return (
    <MainToolbar>
      <MainToolbar.Title>Switches</MainToolbar.Title>
      <MainToolbar.Controls>
        {/* TODO: Wire up search to the switches endpoint when it becomes available. */}
        <DebounceSearchBox
          onDebounced={(debouncedText) => {
            setSearchFilter(debouncedText);
          }}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Button
          data-testid="add-switch"
          onClick={() => {
            openSidePanel({ component: AddSwitch, title: "Add switch" });
          }}
        >
          Add switch
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default SwitchesListHeader;
