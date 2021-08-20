import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import RepositoryForm from "../RepositoryForm";

import { actions as repositoryActions } from "app/store/packagerepository";
import repositorySelectors from "app/store/packagerepository/selectors";
import type { RootState } from "app/store/root/types";

export const RepositoryEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(repositoryActions.fetch());
  }, [dispatch]);

  const { id, type } = useParams<{
    id: string;
    type: "ppa" | "repository";
  }>();
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const repository = useSelector((state: RootState) =>
    repositorySelectors.getById(state, parseInt(id))
  );

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (loaded && !repository) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm type={type} repository={repository} />;
};

export default RepositoryEdit;
