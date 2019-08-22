import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import { useParams } from "app/base/hooks";
import Loader from "app/base/components/Loader";
import RepositoryForm from "../RepositoryForm";

export const RepositoryEdit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.repositories.fetch());
  }, [dispatch]);

  const { id, type } = useParams();
  const loaded = useSelector(selectors.repositories.loaded);
  const loading = useSelector(selectors.repositories.loading);
  const repository = useSelector(state =>
    selectors.repositories.getById(state, parseInt(id))
  );

  if (loading) {
    return <Loader text="Loading..." />;
  }
  if (loaded && !repository) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm type={type} repository={repository} />;
};

export default RepositoryEdit;
