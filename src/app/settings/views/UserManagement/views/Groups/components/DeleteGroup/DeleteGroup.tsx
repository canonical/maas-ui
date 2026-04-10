import ModelActionForm from "@/app/base/components/ModelActionForm";

type Props = {
  id: number;
};

const DeleteGroup = ({ id }: Props) => {
  return (
    <ModelActionForm
      aria-label="Delete group"
      initialValues={{}}
      modelType="group"
      onSubmit={() => {}}
    />
  );
};

export default DeleteGroup;
