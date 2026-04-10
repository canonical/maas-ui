import ModelActionForm from "@/app/base/components/ModelActionForm";

type Props = {
  id: number;
};

const EditGroup = ({ id }: Props) => {
  return (
    <ModelActionForm
      aria-label="Edit group"
      initialValues={{}}
      modelType="group"
      onSubmit={() => {}}
    />
  );
};

export default EditGroup;
