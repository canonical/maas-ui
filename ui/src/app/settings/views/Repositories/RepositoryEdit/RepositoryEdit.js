import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { packagerepository as repositoryActions } from "app/base/actions";
import repositorySelectors from "app/store/packagerepository/selectors";
import RepositoryForm from "../RepositoryForm";

export const RepositoryEdit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(repositoryActions.fetch());
  }, [dispatch]);

  const { id, type } = useParams();
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const repository = useSelector((state) =>
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
