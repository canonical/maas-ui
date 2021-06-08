import { Input } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions } from "app/store/zone";

type Props = {
  closeForm: () => void;
};

export type CreateZone = {
  name: string;
};

const ZonesListForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <FormikForm<CreateZone>
      buttonsBordered={false}
      className="u-flex--between"
      initialValues={{
        name: "",
      }}
      inline={true}
      onCancel={closeForm}
      onSubmit={(values: CreateZone) => {
        dispatch(
          actions.create({
            name: values.name,
          })
        );
      }}
      resetOnSave={true}
      submitLabel="Add AZ"
    >
      <FormikField
        component={Input}
        label="Name"
        placeholder="Name"
        type="text"
        name="name"
        required
      />
    </FormikForm>
  );
};

export default ZonesListForm;
