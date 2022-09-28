import { useEffect, useState } from "react";

import { Notification, usePrevious } from "@canonical/react-components";

import type { APIError } from "app/base/types";
import { formatErrors } from "app/utils";

const ErrorsNotification = ({
  errors,
  onAfterDismiss,
}: {
  errors: APIError;
  onAfterDismiss?: () => void;
}): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(true);
  const previousErrors = usePrevious(errors);
  const handleDismiss = () => {
    setIsOpen(false);
    onAfterDismiss?.();
  };

  useEffect(() => {
    if (errors !== previousErrors) {
      setIsOpen(true);
    }
  }, [errors, previousErrors]);

  return errors && isOpen ? (
    <Notification onDismiss={handleDismiss} severity="negative">
      {formatErrors(errors)}
    </Notification>
  ) : null;
};

export default ErrorsNotification;
