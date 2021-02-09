import { useState } from "react";

import { useHistory } from "react-router-dom";

import BaseDhcpForm from "app/base/components/DhcpForm";
import FormCard from "app/base/components/FormCard";
import { useWindowTitle } from "app/base/hooks";
import { DhcpSnippetShape } from "app/settings/proptypes";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";

type Props = {
  dhcpSnippet?: DHCPSnippet;
};

export const DhcpForm = ({ dhcpSnippet }: Props): JSX.Element => {
  const history = useHistory();
  const [name, setName] = useState();
  const editing = !!dhcpSnippet;
  const title = editing ? `Editing \`${name}\`` : "Add DHCP snippet";

  useWindowTitle(title);

  return (
    <FormCard title={title}>
      <BaseDhcpForm
        analyticsCategory="DHCP snippet settings"
        id={dhcpSnippet?.id}
        onCancel={() => history.push({ pathname: "/settings/dhcp" })}
        onValuesChanged={(values) => {
          setName(values.name);
        }}
        savedRedirect="/settings/dhcp"
      />
    </FormCard>
  );
};

DhcpForm.propTypes = {
  dhcpSnippet: DhcpSnippetShape,
};

export default DhcpForm;
