import { useRemoveGroupMember } from "@/app/api/query/groups";
import type { UserGroupResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type RemoveGroupMemberProps = {
  group_id: UserGroupResponse["id"];
  user_id: number;
};

const RemoveGroupMember = ({ group_id, user_id }: RemoveGroupMemberProps) => {
  const { closeSidePanel } = useSidePanel();
  const removeMember = useRemoveGroupMember();

  return (
    <ModelActionForm
      aria-label="Remove group member"
      errors={removeMember.error}
      initialValues={{}}
      message="Are you sure you want to remove this member from the group?"
      modelType="group member"
      onCancel={closeSidePanel}
      onSubmit={() => {
        removeMember.mutate({
          path: {
            group_id,
            user_id,
          },
        });
      }}
      onSuccess={closeSidePanel}
      saved={removeMember.isSuccess}
      saving={removeMember.isPending}
      submitAppearance="negative"
      submitLabel="Remove member"
    />
  );
};

export default RemoveGroupMember;
