import { useDeleteGroup, useGetGroup } from "@/app/api/query/groups";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type Props = {
  id: number;
};

const DeleteGroup = ({ id }: Props) => {
  const { closeSidePanel } = useSidePanel();
  const deleteGroup = useDeleteGroup();
  const group = useGetGroup({ path: { group_id: id } });
  const eTag = group.data?.headers?.get("ETag");
  return (
    <ModelActionForm
      aria-label="Delete group"
      initialValues={{}}
      modelType="group"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteGroup.mutate({ path: { group_id: id }, headers: { ETag: eTag } });
      }}
      onSuccess={closeSidePanel}
      saved={deleteGroup.isSuccess}
      saving={deleteGroup.isPending}
      submitAppearance="negative"
    />
  );
};

export default DeleteGroup;
