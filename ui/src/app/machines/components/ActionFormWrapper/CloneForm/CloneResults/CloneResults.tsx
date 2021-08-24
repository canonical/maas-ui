import { useEffect, useState } from "react";

import {
  Button,
  Icon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import type { APIError } from "app/base/types";
import machineURLs from "app/machines/urls";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

export type CloneError = {
  destinations: {
    code: string;
    message: string;
  }[];
};

type Props = {
  closeForm: () => void;
  destinations: Machine["system_id"][];
  sourceMachine: MachineDetails | null;
};

const getResultsString = (count: number, error: APIError<CloneError>) => {
  let successCount: number;
  if (!error) {
    successCount = count;
  } else if (typeof error === "object" && "destinations" in error) {
    successCount = count - error.destinations.length;
  } else {
    // If an error is returned and it's not tied to the selected destinations,
    // assume the error is global and therefore no machines were cloned to
    // successfully.
    successCount = 0;
  }

  return `${successCount} of ${pluralize(
    "machine",
    count,
    true
  )} cloned successfully from`;
};

export const CloneResults = ({
  closeForm,
  destinations,
  sourceMachine,
}: Props): JSX.Element | null => {
  const [destinationCount, setDestinationCount] = useState(0);
  const cloneErrors = useSelector((state: RootState) =>
    machineSelectors.eventErrorsForIds(
      state,
      sourceMachine?.system_id || "",
      NodeActions.CLONE
    )
  );
  const error: APIError<CloneError> = cloneErrors.length
    ? cloneErrors[0].error
    : null;

  useEffect(() => {
    // We set destination count in local state otherwise the user could unselect
    // machines and change the results.
    if (!destinationCount) {
      setDestinationCount(destinations.length);
    }
  }, [destinationCount, destinations.length]);

  if (!sourceMachine) {
    return null;
  }

  return (
    <>
      <div className="clone-results">
        <h2 className="clone-results__title p-heading--4">Cloning complete</h2>
        <div className="clone-results__info">
          <p data-test="results-string">
            {getResultsString(destinationCount, error)}{" "}
            <Link
              to={machineURLs.machine.index({ id: sourceMachine.system_id })}
            >
              {sourceMachine.hostname}
            </Link>
            .
          </p>
          {error && (
            <>
              <p>The following errors occurred:</p>
              <Table className="clone-results__table" data-test="errors-table">
                <thead>
                  <TableRow>
                    <TableHeader className="error-col">
                      <span className="u-nudge-right--x-large">Error</span>
                    </TableHeader>
                    <TableHeader className="affected-col u-align--right">
                      Affected machines
                    </TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  <TableRow>
                    <TableCell className="error-col">
                      <Icon name="error" />
                      <span className="u-nudge-right">Error</span>
                    </TableCell>
                    <TableCell className="affected-col u-align--right">
                      Show
                    </TableCell>
                  </TableRow>
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
      <hr />
      <div className="u-align--right">
        <Button appearance="base" onClick={closeForm}>
          Close
        </Button>
      </div>
    </>
  );
};

export default CloneResults;
