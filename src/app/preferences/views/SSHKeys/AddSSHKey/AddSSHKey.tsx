import { useNavigate } from "react-router-dom-v5-compat";

import FormCard from "app/base/components/FormCard";
import SSHKeyForm from "app/base/components/SSHKeyForm";
import { COL_SIZES } from "app/base/constants";
import { useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";

export enum Label {
  Title = "Add SSH key",
  FormLabel = "Add SSH key form",
}

const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;

export const AddSSHKey = (): JSX.Element => {
  const navigate = useNavigate();
  useWindowTitle(Label.Title);

  return (
    <FormCard title={Label.Title}>
      <SSHKeyForm
        aria-label={Label.FormLabel}
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
