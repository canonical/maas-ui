import { useEffect, useState } from "react";

import {
  ContentSection,
  GenericTable,
  MainToolbar,
} from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import useScriptsTableColumns from "./hooks/useScriptsTableColumns/useScriptsTableColumns";

import SearchBox from "@/app/base/components/SearchBox";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import ScriptsUpload from "@/app/settings/views/Scripts/ScriptsUpload";
import type { RootState } from "@/app/store/root/types";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";

export enum Labels {
  EmptyList = "No scripts available.",
  NoResults = "No scripts match the search criteria.",
}

type Props = {
  type?: "commissioning" | "deployment" | "testing";
};

const ScriptsList = ({ type = "commissioning" }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const { openSidePanel } = useSidePanel();
  const [searchText, setSearchText] = useState("");

  const scriptsLoading = useSelector(scriptSelectors.loading);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);

  const userScripts = useSelector((state: RootState) =>
    scriptSelectors.search(state, searchText, type)
  );

  const columns = useScriptsTableColumns();

  useWindowTitle(`${type[0].toUpperCase()}${type.slice(1)} scripts`);

  useEffect(() => {
    if (!scriptsLoaded) {
      dispatch(scriptActions.fetch());
    }
  }, [dispatch, scriptsLoaded, type]);

  const noDataMessage = searchText ? Labels.NoResults : Labels.EmptyList;

  return (
    <ContentSection>
      <ContentSection.Content>
        <div className="settings-table">
          <MainToolbar>
            <MainToolbar.Title>
              {`${type === "commissioning" ? "Commissioning" : type === "testing" ? "Testing" : "Deployment"} scripts`}
            </MainToolbar.Title>
            <MainToolbar.Controls>
              <SearchBox
                onChange={setSearchText}
                placeholder={`Search ${type} scripts`}
                value={searchText}
              />
              <Button
                onClick={() => {
                  openSidePanel({
                    component: ScriptsUpload,
                    title: `Upload ${type} script`,
                    props: {
                      type,
                    },
                  });
                }}
              >
                Upload script
              </Button>
            </MainToolbar.Controls>
          </MainToolbar>
          <GenericTable
            columns={columns}
            data={scriptsLoaded ? userScripts : []}
            isLoading={scriptsLoading && !scriptsLoaded}
            noData={noDataMessage}
            sorting={[{ id: "name", desc: false }]}
          />
        </div>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default ScriptsList;
