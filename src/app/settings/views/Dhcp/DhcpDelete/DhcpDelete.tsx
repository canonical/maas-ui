import { useSidePanel } from "@canonical/maas-react-components";
import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { dhcpsnippetActions } from "@/app/store/dhcpsnippet";

type Props = {
  id: number;
};

const DhcpDelete = ({ id }: Props) => {
  const { closeSidePanel } = useSidePanel();
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
      onCancel={closeSidePanel}
      onSubmit={() => {
        dispatch(dhcpsnippetActions.delete(id));
        closeSidePanel();
      }}
      onSuccess={closeSidePanel}
      submitAppearance="negative"
    />
  );
};

export default DhcpDelete;
