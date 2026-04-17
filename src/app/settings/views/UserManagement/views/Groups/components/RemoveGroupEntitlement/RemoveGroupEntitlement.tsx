import { useRemoveGroupEntitlement } from "@/app/api/query/groups";
import type {
  OpenFgaEntitlementResourceType,
  UserGroupResponse,
} from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type RemoveGroupEntitlementProps = {
  group_id: UserGroupResponse["id"];
  entitlement: string;
  resource_id: number;
  resource_type: string;
};

const RemoveGroupEntitlement = ({
  group_id,
  entitlement,
  resource_id,
  resource_type,
}: RemoveGroupEntitlementProps) => {
  const { closeSidePanel } = useSidePanel();
  const removeEntitlement = useRemoveGroupEntitlement();

  return (
    <ModelActionForm
      aria-label="Remove group entitlement"
      errors={removeEntitlement.error}
      initialValues={{}}
      modelType="group entitlement"
      onCancel={closeSidePanel}
      onSubmit={() => {
        removeEntitlement.mutate({
          path: { group_id },
          query: {
            resource_type: resource_type as OpenFgaEntitlementResourceType,
            resource_id,
            entitlement,
          },
        });
      }}
      onSuccess={closeSidePanel}
      saved={removeEntitlement.isSuccess}
      saving={removeEntitlement.isPending}
      submitAppearance="negative"
    />
  );
};

export default RemoveGroupEntitlement;
