import type { ReactElement } from "react";

import type { FieldlessFormProps } from "../FieldlessForm/FieldlessForm";
import FieldlessForm from "../FieldlessForm/FieldlessForm";

import { NodeActions } from "@/app/store/types/node";

const PowerOffForm = ({
  action,
  actions,
  ...props
}: FieldlessFormProps): ReactElement => {
  return (
    <FieldlessForm
      action={action}
      actions={actions}
      description={
        action === NodeActions.OFF ? (
          <p>
            Power off will perform a hard power off, which occurs immediately
            without any warning to the OS.
          </p>
        ) : action === NodeActions.SOFT_OFF ? (
          <p>
            A soft power off generally asks the OS to shutdown the system
            gracefully before powering off. It is only supported by IPMI.
          </p>
        ) : (
          <></>
        )
      }
      {...props}
    />
  );
};

export default PowerOffForm;
