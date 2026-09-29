import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { dhcpsnippetActions } from "@/app/store/dhcpsnippet";

type Props = {
  id: number;
};

const DhcpDelete = ({ id }: Props) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  return (
    <ModelActionForm
      aria-label="Confirm DHCP deletion"
      errors={dhcpsnippetActions.deleteError}
      initialValues={{}}
      message={
        <>
          Are you sure you want to delete this DHCP snippet? <br />
          <span className="u-text--light">
            This action is permanent and cannot be undone.
          </span>
        </>
      }
      modelType="DHCP snippet"
      onCancel={closeModal}
      onSubmit={() => {
        dispatch(dhcpsnippetActions.delete(id));
        closeModal();
      }}
      onSuccess={closeModal}
      submitAppearance="negative"
    />
  );
};

export default DhcpDelete;
