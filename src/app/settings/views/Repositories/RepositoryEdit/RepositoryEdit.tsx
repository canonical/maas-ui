import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import RepositoryForm from "../RepositoryForm";

import { useGetURLId } from "app/base/hooks/urls";
import { actions as repositoryActions } from "app/store/packagerepository";
import repositorySelectors from "app/store/packagerepository/selectors";
import { ResourcePoolMeta } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";

export const RepositoryEdit = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(repositoryActions.fetch());
  }, [dispatch]);
  const id = useGetURLId(ResourcePoolMeta.PK);
  const { type } = useParams<{
    type: "ppa" | "repository";
  }>();
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const repository = useSelector((state: RootState) =>
    repositorySelectors.getById(state, id)
  );

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (loaded && !repository) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm repository={repository} type={type} />;
};

export default RepositoryEdit;
