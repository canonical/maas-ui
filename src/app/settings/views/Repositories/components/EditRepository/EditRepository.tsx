import { Notification, Spinner } from "@canonical/react-components";

import RepositoryForm from "../RepositoryForm";

import { useGetPackageRepository } from "@/app/api/query/packageRepositories";
import type { PackageRepositoryResponse } from "@/app/apiclient";

type Props = {
  id: PackageRepositoryResponse["id"];
  type: "ppa" | "repository" | undefined;
};

export const EditRepository = ({ id, type }: Props): React.ReactElement => {
  const { isPending, isError, data, error } = useGetPackageRepository({
    path: { package_repository_id: id },
  });

  if (isPending) {
    return <Spinner text="Loading..." />;
  }

  if (isError) {
    return (
      <Notification
        severity="negative"
        title="Error while fetching package repository"
      >
        {error.message}
      </Notification>
    );
  }

  if (!type) {
    return <h4>Repository not found</h4>;
  }
  return <RepositoryForm repository={data} type={type} />;
};

export default EditRepository;
