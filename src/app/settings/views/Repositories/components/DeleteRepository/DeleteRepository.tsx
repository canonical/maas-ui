import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";

const RepositoryDelete = () => {
  const dispatch = useDispatch();
  const errors = useSelector(repositorySelectors.errors);
  const saving = useSelector(repositorySelectors.saving);
  const saved = useSelector(repositorySelectors.saved);

  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const id =
    sidePanelContent?.extras && "repositoryId" in sidePanelContent.extras
      ? sidePanelContent.extras.repositoryId
      : null;

  if (!id) {
    return (
      <Notification severity="negative">
        A package repository with this ID could not be found.
      </Notification>
    );
  }

  return (
    <ModelActionForm
      aria-label="Confirm repository deletion"
      errors={errors}
      initialValues={{}}
      modelType="repository"
      onCancel={() => setSidePanelContent(null)}
      onSubmit={() => {
        dispatch(repositoryActions.delete(id));
      }}
      onSuccess={() => setSidePanelContent(null)}
      saved={saved}
      saving={saving}
    />
  );
};

export default RepositoryDelete;
