import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import type { PackageRepository } from "@/app/store/packagerepository/types";

type Props = {
  id: PackageRepository["id"];
};

const DeleteRepository = ({ id }: Props) => {
  const dispatch = useDispatch();
  const errors = useSelector(repositorySelectors.errors);
  const saving = useSelector(repositorySelectors.saving);
  const saved = useSelector(repositorySelectors.saved);
  const { setSidePanelContent } = useSidePanel();

  return (
    <ModelActionForm
      aria-label="Confirm repository deletion"
      errors={errors}
      initialValues={{}}
      modelType="repository"
      onCancel={() => {
        setSidePanelContent(null);
      }}
      onSubmit={() => {
        dispatch(repositoryActions.delete(id));
      }}
      onSuccess={() => {
        setSidePanelContent(null);
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteRepository;
