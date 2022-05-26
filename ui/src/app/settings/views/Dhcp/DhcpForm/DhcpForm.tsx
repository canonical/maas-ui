import { useState } from "react";

import { useNavigate } from "react-router-dom-v5-compat";

import BaseDhcpForm from "app/base/components/DhcpForm";
import type { DHCPFormValues } from "app/base/components/DhcpForm/types";
import FormCard from "app/base/components/FormCard";
import { useWindowTitle } from "app/base/hooks";
import settingsURLs from "app/settings/urls";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";

type Props = {
  dhcpSnippet?: DHCPSnippet;
};

export const DhcpForm = ({ dhcpSnippet }: Props): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState<DHCPFormValues["name"]>();
  const editing = !!dhcpSnippet;
  const title = editing ? `Editing \`${name}\`` : "Add DHCP snippet";

  useWindowTitle(title);

  return (
    <FormCard title={title}>
      <BaseDhcpForm
        analyticsCategory="DHCP snippet settings"
        id={dhcpSnippet?.id}
        onCancel={() => navigate({ pathname: settingsURLs.dhcp.index })}
        onValuesChanged={(values) => {
          setName(values.name);
        }}
        savedRedirect={settingsURLs.dhcp.index}
      />
    </FormCard>
  );
};

export default DhcpForm;
