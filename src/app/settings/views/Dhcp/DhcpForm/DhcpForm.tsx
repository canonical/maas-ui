import { useState } from "react";

import { useNavigate } from "react-router-dom";

import BaseDhcpForm from "@/app/base/components/DhcpForm";
import type { DHCPFormValues } from "@/app/base/components/DhcpForm/types";
import settingsURLs from "@/app/settings/urls";
import type { DHCPSnippet } from "@/app/store/dhcpsnippet/types";

type Props = {
  dhcpSnippet?: DHCPSnippet;
};

export const DhcpForm = ({ dhcpSnippet }: Props): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState<DHCPFormValues["name"]>();
  const editing = !!dhcpSnippet;
  const title = editing ? `Editing \`${name}\`` : "Add DHCP snippet";

  return (
    <BaseDhcpForm
      analyticsCategory="DHCP snippet settings"
      aria-label={title}
      id={dhcpSnippet?.id}
      onCancel={() => navigate({ pathname: settingsURLs.dhcp.index })}
      onValuesChanged={(values) => {
        setName(values.name);
      }}
      savedRedirect={settingsURLs.dhcp.index}
    />
  );
};

export default DhcpForm;
