import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import RepositoryForm from "../RepositoryForm";

import { useFetchActions } from "@/app/base/hooks";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import type { PackageRepository } from "@/app/store/packagerepository/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  id: PackageRepository["id"];
  type: "ppa" | "repository" | undefined;
};

export const EditRepository = ({ id, type }: Props): React.ReactElement => {
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const repository = useSelector((state: RootState) =>
    repositorySelectors.getById(state, id)
  );

  useFetchActions([repositoryActions.fetch]);

  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if ((loaded && !repository) || !type) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm repository={repository} type={type} />;
};

export default EditRepository;
