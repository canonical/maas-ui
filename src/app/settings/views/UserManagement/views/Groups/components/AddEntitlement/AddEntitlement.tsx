import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import * as Yup from "yup";

import { Entitlement } from "../../constants";

import { useAddGroupEntitlement } from "@/app/api/query/groups";
import { usePools } from "@/app/api/query/pools";
import type {
  AddGroupEntitlementError,
  UserGroupResponse,
} from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type AddEntitlementValues = {
  entitlement: string;
  isGlobal: boolean;
  pool_id: string;
};

type AddEntitlementProps = {
  group_id: UserGroupResponse["id"];
};

const AddEntitlementSchema = Yup.object().shape({
  entitlement: Yup.string().required("Entitlement is required"),
  isGlobal: Yup.boolean(),
  pool_id: Yup.string().when("isGlobal", {
    is: false,
    then: (schema) => schema.required("Pool is required"),
    otherwise: (schema) => schema,
  }),
});

const AddEntitlement = ({ group_id }: AddEntitlementProps) => {
  const { closeSidePanel } = useSidePanel();
  const pools = usePools();
  const addEntitlement = useAddGroupEntitlement();

  const entitlementOptions = [
    { label: "Select entitlement", value: "", disabled: true },
    ...Object.values(Entitlement).map((value) => ({
      label: value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    })),
  ];

  const poolOptions = [
    { label: "Select pool", value: "", disabled: true },
    ...(pools.data?.items ?? []).map((pool) => ({
      label: pool.name,
      value: String(pool.id),
    })),
  ];

  return (
    <FormikForm<AddEntitlementValues, AddGroupEntitlementError>
      aria-label="Add group entitlement"
      errors={addEntitlement.error}
      initialValues={{
        entitlement: "",
        isGlobal: true,
        pool_id: "",
      }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        addEntitlement.mutate({
          body: {
            entitlement: values.entitlement,
            resource_type: values.isGlobal ? "maas" : "pool",
            resource_id: values.isGlobal ? 0 : Number(values.pool_id),
          },
          path: { group_id },
        });
      }}
      onSuccess={closeSidePanel}
      resetOnSave
      saved={addEntitlement.isSuccess}
      saving={addEntitlement.isPending}
      submitLabel="Add entitlement"
      validationSchema={AddEntitlementSchema}
    >
      {({ values }: FormikContextType<AddEntitlementValues>) => (
        <>
          <FormikField
            component={Select}
            label="Entitlement"
            name="entitlement"
            options={entitlementOptions}
            required
          />
          <FormikField
            label="Global entitlement"
            name="isGlobal"
            type="checkbox"
          />
          {!values.isGlobal && (
            <FormikField
              component={Select}
              disabled={!pools.isSuccess}
              label="Pool"
              name="pool_id"
              options={poolOptions}
              required
            />
          )}
        </>
      )}
    </FormikForm>
  );
};

export default AddEntitlement;
