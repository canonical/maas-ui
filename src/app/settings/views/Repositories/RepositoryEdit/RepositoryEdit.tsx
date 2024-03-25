import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import RepositoryForm from "../RepositoryForm";

import { useFetchActions } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import { ResourcePoolMeta } from "@/app/store/resourcepool/types";
import type { RootState } from "@/app/store/root/types";

export const RepositoryEdit = (): JSX.Element => {
  useFetchActions([repositoryActions.fetch]);
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
  if ((loaded && !repository) || !type) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm repository={repository} type={type} />;
};

export default RepositoryEdit;
