import type { ReactElement } from "react";

import FormikForm from "@/app/base/components/FormikForm";
import { useModal } from "@/app/base/modal-context";
import type { EmptyObject } from "@/app/base/types";

type Props = {
  logout: () => void;
};

export const LogoutConfirm = ({ logout }: Props): ReactElement => {
  const { closeModal } = useModal();

  return (
    <FormikForm<EmptyObject>
      aria-label="Log out"
      initialValues={{}}
      onCancel={closeModal}
      onSaveAnalytics={{
        action: "Log out",
        category: "Navigation",
        label: "Log out",
      }}
      onSubmit={() => {
        closeModal();
        logout();
      }}
      submitLabel="Log out"
    >
      <p className="u-nudge-down--small">
        You will be logged out of MAAS and returned to the login page. Are you
        sure you want to continue?
      </p>
    </FormikForm>
  );
};

export default LogoutConfirm;
