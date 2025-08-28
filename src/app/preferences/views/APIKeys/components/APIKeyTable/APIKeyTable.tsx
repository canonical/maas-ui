import { GenericTable } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import useAPIKeyTableColumns from "./useAPIKeyTableColumns/useAPIKeyTableColumns";

import { useFetchActions } from "@/app/base/hooks";
import { tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";

export enum Label {
  Title = "API keys",
  EmptyList = "No API keys available.",
}

const APIKeyList = (): React.ReactElement => {
  const errors = useSelector(tokenSelectors.errors);
  const loading = useSelector(tokenSelectors.loading);
  const tokens = useSelector(tokenSelectors.all);

  useFetchActions([tokenActions.fetch]);
  const columns = useAPIKeyTableColumns();

  return (
    <>
      {errors && typeof errors === "string" && (
        <Notification severity="negative" title="Error:">
          {errors}
        </Notification>
      )}
      <GenericTable
        aria-label={Label.Title}
        className="apikey-list"
        columns={columns}
        data={tokens}
        isLoading={loading}
        noData={Label.EmptyList}
      />
    </>
  );
};

export default APIKeyList;
