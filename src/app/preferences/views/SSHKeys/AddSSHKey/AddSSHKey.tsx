import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router";

import urls from "@/app/base/urls";
import SSHKeyForm from "@/app/preferences/views/SSHKeys/SSHKeyForm";

export enum Label {
  Title = "Add SSH key",
  FormLabel = "Add SSH key form",
}

export const AddSSHKey = (): React.ReactElement => {
  const navigate = useNavigate();
  const onCancel = () => {
    navigate({ pathname: urls.preferences.sshKeys.index });
  };
  useOnEscapePressed(() => {
    onCancel();
  });

  return (
    <SSHKeyForm
      aria-label={Label.FormLabel}
      cols={12}
      onCancel={onCancel}
      onSaveAnalytics={{
        action: "Saved",
        category: "SSH keys preferences",
        label: "Import SSH key form",
      }}
      savedRedirect={urls.preferences.sshKeys.index}
    />
  );
};

export default AddSSHKey;
