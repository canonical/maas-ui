import DhcpForm from "@/app/base/components/DhcpForm";
import type { DHCPSnippet } from "@/app/store/dhcpsnippet/types";

type Props = {
  readonly close: () => void;
  readonly id: DHCPSnippet["id"];
};

const EditDHCP = ({ close, id }: Props): React.ReactElement | null => {
  return (
    <div className="u-flex--grow">
      <DhcpForm
        analyticsCategory="DHCP snippet table"
        id={id}
        onCancel={close}
        onSave={close}
      />
    </div>
  );
};

export default EditDHCP;
