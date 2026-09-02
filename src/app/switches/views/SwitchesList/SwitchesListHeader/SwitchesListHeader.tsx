import { useEffect, useState } from "react";

import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import DebounceSearchBox from "@/app/base/components/DebounceSearchBox";
import { useHasEntitlements } from "@/app/base/hooks";
import type { SetSearchFilter } from "@/app/base/types";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import AddSwitch from "@/app/switches/components/AddSwitch";

type Props = {
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
};

const SwitchesListHeader = ({ searchFilter, setSearchFilter }: Props) => {
  const { openSidePanel } = useSidePanel();
  const [searchText, setSearchText] = useState(searchFilter);
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

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
          disabled={!canEdit}
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
