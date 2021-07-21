import { useHistory } from "react-router-dom";

import FormCard from "app/base/components/FormCard";
import SSHKeyForm from "app/base/components/SSHKeyForm";
import { useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";

export const AddSSHKey = (): JSX.Element => {
  const history = useHistory();
  useWindowTitle("Add SSH key");

  return (
    <FormCard title="Add SSH key">
      <SSHKeyForm
        onCancel={() => history.push({ pathname: prefsURLs.sshKeys.index })}
        onSaveAnalytics={{
          action: "Saved",
          category: "SSH keys preferences",
          label: "Import SSH key form",
        }}
        savedRedirect={prefsURLs.sshKeys.index}
      />
    </FormCard>
  );
};

export default AddSSHKey;
