import { useDeletePackageRepository } from "@/app/api/query/packageRepositories";
import type { PackageRepositoryResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type Props = {
  id: PackageRepositoryResponse["id"];
};

const DeleteRepository = ({ id }: Props) => {
  const { setSidePanelContent } = useSidePanel();
  const deleteRepo = useDeletePackageRepository();

  return (
    <ModelActionForm
      aria-label="Confirm repository deletion"
      errors={deleteRepo.error}
      initialValues={{}}
      modelType="repository"
      onCancel={() => {
        setSidePanelContent(null);
      }}
      onSubmit={() => {
        deleteRepo.mutate({ path: { package_repository_id: id } });
      }}
      onSuccess={() => {
        setSidePanelContent(null);
      }}
      saved={deleteRepo.isSuccess}
      saving={deleteRepo.isPending}
    />
  );
};

export default DeleteRepository;
