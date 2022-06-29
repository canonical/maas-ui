import { useNavigate } from "react-router-dom-v5-compat";

import FormCard from "app/base/components/FormCard";
import SSHKeyForm from "app/base/components/SSHKeyForm";
import { COL_SIZES } from "app/base/constants";
import { useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";

const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;

export const AddSSHKey = (): JSX.Element => {
  const navigate = useNavigate();
  useWindowTitle("Add SSH key");

  return (
    <FormCard title="Add SSH key">
      <SSHKeyForm
        cols={TOTAL - SIDEBAR - CARD_TITLE}
        onCancel={() => navigate({ pathname: urls.preferences.sshKeys.index })}
        onSaveAnalytics={{
          action: "Saved",
          category: "SSH keys preferences",
          label: "Import SSH key form",
        }}
        savedRedirect={urls.preferences.sshKeys.index}
      />
    </FormCard>
  );
};

export default AddSSHKey;
