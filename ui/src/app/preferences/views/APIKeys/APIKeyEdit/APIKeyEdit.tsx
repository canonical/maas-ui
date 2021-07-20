import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import APIKeyForm from "../APIKeyForm";

import type { RouteParams } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as tokenActions } from "app/store/token";
import tokenSelectors from "app/store/token/selectors";

export const APIKeyEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(tokenActions.fetch());
  }, [dispatch]);

  const { id } = useParams<RouteParams>();
  const loading = useSelector(tokenSelectors.loading);
  const token = useSelector((state: RootState) =>
    tokenSelectors.getById(state, parseInt(id))
  );
  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!token) {
    return <h4>API key not found</h4>;
  }
  return <APIKeyForm token={token} />;
};

export default APIKeyEdit;
