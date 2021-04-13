import { useEffect, useState } from "react";

import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import ScriptDetails from "../ScriptDetails";

import ColumnToggle from "app/base/components/ColumnToggle";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import { useWindowTitle, useAddMessage } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import type { RootState } from "app/store/root/types";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import type { Script } from "app/store/script/types";

type Props = {
  type?: "commissioning" | "testing";
};

const generateRows = (
  scripts: Script[],
  expandedId: Script["id"],
  setExpandedId: (id: Script["id"]) => void,
  expandedType: "delete" | null,
  setExpandedType: (expandedType: "delete" | "details") => void,
  hideExpanded: () => void,
  dispatch: Dispatch,
  setDeleting: (id: Script["name"]) => void
) =>
  scripts.map((script) => {
    const expanded = expandedId === script.id;
    const showDelete = expandedType === "delete";
    // history timestamps are in the format: Mon, 02 Sep 2019 02:02:39 -0000
    let uploadedOn: string;
    try {
      uploadedOn = format(
        parse(script.created, "EEE, dd LLL yyyy HH:mm:ss xxxx", new Date()),
        "yyyy-LL-dd H:mm"
      );
    } catch (error) {
      uploadedOn = "Never";
    }

    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <ColumnToggle
              isExpanded={expanded && !showDelete}
              label={script.name}
              onClose={hideExpanded}
              onOpen={() => {
                setExpandedId(script.id);
                setExpandedType("details");
              }}
            />
          ),
          role: "rowheader",
        },
        {
          content: script.description,
        },
        { content: uploadedOn },
        {
          content: (
            <TableActions
              deleteDisabled={script.default}
              deleteTooltip={
                script.default && "Default scripts cannot be deleted."
              }
              onDelete={() => {
                setExpandedId(script.id);
                setExpandedType("delete");
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: expanded,
      expandedContent:
        expanded &&
        (showDelete ? (
          <TableDeleteConfirm
            modelName={script.name}
            modelType="Script"
            onCancel={hideExpanded}
            onConfirm={() => {
              dispatch(scriptActions.delete(script.id));
              setDeleting(script.name);
              hideExpanded();
            }}
          />
        ) : (
          <ScriptDetails id={script.id} />
        )),
      key: script.id,
      sortData: {
        name: script.name,
        description: script.description,
        uploaded_on: uploadedOn,
      },
    };
  });

const ScriptsList = ({ type = "commissioning" }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [deletingScript, setDeleting] = useState(null);

  const scriptsLoading = useSelector(scriptSelectors.loading);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);

  const userScripts = useSelector((state: RootState) =>
    scriptSelectors.search(state, searchText, type)
  );

  useWindowTitle(`${type[0].toUpperCase()}${type.slice(1)} scripts`);

  useAddMessage(
    saved,
    scriptActions.cleanup,
    `${deletingScript} removed successfully.`,
    () => setDeleting(null)
  );

  useAddMessage(
    hasErrors,
    scriptActions.cleanup,
    `Error removing ${deletingScript}: ${errors}`,
    null,
    "negative"
  );

  const hideExpanded = () => {
    setExpandedId(null);
    setExpandedType(null);
  };

  useEffect(() => {
    if (!scriptsLoaded) {
      // scripts are fetched via http, so we explicitly check if they're already
      // loaded here.
      dispatch(scriptActions.fetch());
    }
  }, [dispatch, scriptsLoaded, type]);

  return (
    <SettingsTable
      buttons={[
        { label: "Upload script", url: `/settings/scripts/${type}/upload` },
      ]}
      defaultSort="name"
      headers={[
        {
          content: "Script name",
          sortKey: "name",
        },
        {
          content: "Description",
          sortKey: "description",
        },
        {
          content: "Uploaded on",
          sortKey: "uploaded_on",
        },
        {
          content: "Actions",
          className: "u-align--right",
        },
      ]}
      loaded={scriptsLoaded}
      loading={scriptsLoading}
      rows={generateRows(
        userScripts,
        expandedId,
        setExpandedId,
        expandedType,
        setExpandedType,
        hideExpanded,
        dispatch,
        setDeleting
      )}
      searchOnChange={setSearchText}
      searchPlaceholder={`Search ${type} scripts`}
      searchText={searchText}
      tableClassName="scripts-list"
    />
  );
};

ScriptsList.propTypes = {
  type: PropTypes.string,
};

export default ScriptsList;
