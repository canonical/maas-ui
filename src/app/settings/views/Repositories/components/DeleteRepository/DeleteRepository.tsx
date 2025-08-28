import { useQueryClient } from "@tanstack/react-query";

import { useDeletePackageRepository } from "@/app/api/query/packageRepositories";
import type { PackageRepositoryResponse } from "@/app/apiclient";
import { getPackageRepositoryQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type Props = {
  id: PackageRepositoryResponse["id"];
};

const DeleteRepository = ({ id }: Props) => {
  const { closeSidePanel } = useSidePanel();
  const deleteRepo = useDeletePackageRepository();
  const queryClient = useQueryClient();

  return (
    <ModelActionForm
      aria-label="Confirm repository deletion"
      errors={deleteRepo.error}
      initialValues={{}}
      modelType="repository"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteRepo.mutate(
          { path: { package_repository_id: id } },
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
      onSuccess={closeSidePanel}
      saved={deleteRepo.isSuccess}
      saving={deleteRepo.isPending}
    />
  );
};

export default DeleteRepository;
