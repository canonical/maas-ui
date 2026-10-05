import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import {
  useDeletePackageRepository,
  useGetPackageRepository,
} from "@/app/api/query/packageRepositories";
import type { PackageRepositoryResponse } from "@/app/apiclient";
import { getPackageRepositoryQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type Props = {
  id: PackageRepositoryResponse["id"];
};

const DeleteRepository = ({ id }: Props) => {
  const { closeModal } = useModal();
  const {
    isPending,
    isError,
    data: repository,
    error,
  } = useGetPackageRepository({
    path: { package_repository_id: id },
  });
  const eTag = repository?.headers?.get("ETag");
  const deleteRepo = useDeletePackageRepository();
  const queryClient = useQueryClient();

  if (isPending) {
    return <Spinner text="Loading..." />;
  }

  if (isError) {
    return (
      <NotificationBanner
        severity="negative"
        title="Error while fetching package repository"
      >
        {error.message}
      </NotificationBanner>
    );
  }

  if (!repository) {
    return <h4>Repository not found</h4>;
  }

  return (
    <ModelActionForm
      aria-label="Confirm repository deletion"
      errors={deleteRepo.error}
      initialValues={{}}
      modelType="repository"
      onCancel={closeModal}
      onSubmit={() => {
        deleteRepo.mutate(
          { headers: { ETag: eTag }, path: { package_repository_id: id } },
          {
            onSuccess: () => {
              return queryClient.invalidateQueries({
                queryKey: getPackageRepositoryQueryKey({
                  path: { package_repository_id: id },
                }),
              });
            },
          }
        );
      }}
      onSuccess={closeModal}
      saved={deleteRepo.isSuccess}
      saving={deleteRepo.isPending}
    />
  );
};

export default DeleteRepository;
