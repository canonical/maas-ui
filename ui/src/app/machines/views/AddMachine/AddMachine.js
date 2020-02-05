import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";
import React from "react";

import FormCard from "app/base/components/FormCard";

export const AddMachine = () => (
  <FormCard sidebar={false} title="Add machine">
    <hr />
    <div className="u-align--right">
      <Button
        appearance="base"
        className="u-no-margin--bottom"
        element={Link}
        style={{ marginRight: "1rem" }}
        to="/machines"
      >
        Cancel
      </Button>
      <Button appearance="neutral" className="u-no-margin--bottom" disabled>
        Save and add another
      </Button>
      <Button appearance="positive" className="u-no-margin--bottom" disabled>
        Save machine
      </Button>
    </div>
  </FormCard>
);

export default AddMachine;
