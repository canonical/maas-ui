import { useGetGroup } from "@/app/api/query/groups";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type Props = {
  id: number;
};

const EditGroup = ({ id }: Props) => {
  const { closeSidePanel } = useSidePanel();
  const group = useGetGroup({ path: { group_id: id } });

  return (
    <ModelActionForm
      aria-label="Edit group"
      initialValues={{
        name: group.data?.name ?? "",
        description: group.data?.description ?? "",
      }}
      modelType="group"
      onCancel={closeSidePanel}
      onSubmit={() => {
        console.log(id);
      }}
      submitAppearance="positive"
    />
  );
};

export default EditGroup;
