import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import APIKeyForm from "../APIKeyForm";

import { useGetURLId } from "app/base/hooks/urls";
import type { RootState } from "app/store/root/types";
import { actions as tokenActions } from "app/store/token";
import tokenSelectors from "app/store/token/selectors";
import { TokenMeta } from "app/store/token/types";

export enum Label {
  NotFound = "API key not found",
}

export const APIKeyEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(tokenActions.fetch());
  }, [dispatch]);

  const id = useGetURLId(TokenMeta.PK);
  const loading = useSelector(tokenSelectors.loading);
  const token = useSelector((state: RootState) =>
    tokenSelectors.getById(state, id)
  );
  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!token) {
    return <h4>{Label.NotFound}</h4>;
  }
  return <APIKeyForm token={token} />;
};

export default APIKeyEdit;
