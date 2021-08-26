import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
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
import { FilterMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

export const CloneErrorCodes = {
  IS_SOURCE: "is-source",
  ITEM_INVALID: "item_invalid",
  NETWORKING: "networking",
  STORAGE: "storage",
} as const;

export type CloneError = {
  destinations: {
    code: ValueOf<typeof CloneErrorCodes>;
    message: string;
  }[];
};

type FormattedCloneError = {
  code: ValueOf<typeof CloneErrorCodes> | "global";
  description: string;
  destinations: Machine["system_id"][];
};

type Props = {
  closeForm: () => void;
  destinations: Machine["system_id"][];
  sourceMachine: MachineDetails | null;
};

const getErrorDescription = (code: ValueOf<typeof CloneErrorCodes>) => {
  // TODO: Update with more specific error messages.
  // https://github.com/canonical-web-and-design/maas-ui/issues/3009
  switch (code) {
    case CloneErrorCodes.IS_SOURCE:
      return "Source machine cannot be a destination machine.";
    case CloneErrorCodes.ITEM_INVALID:
      return "Destination machine is not a valid choice.";
    case CloneErrorCodes.NETWORKING:
      return "Source networking does not match destination networking.";
    case CloneErrorCodes.STORAGE:
      return "Source storage does not match destination storage.";
    default:
      return "Cloning was unsuccessful.";
  }
};

const formatCloneError = (
  error: APIError<CloneError>,
  destinations: Machine["system_id"][]
): FormattedCloneError[] => {
  if (!error) {
    return [];
  } else if (typeof error === "object" && "destinations" in error) {
    const cloneError = error as CloneError;
    return cloneError.destinations.reduce<FormattedCloneError[]>(
      (formattedErrors, error) => {
        const existingError = formattedErrors.find(
          (formattedError) => formattedError.code === error.code
        );
        if (existingError) {
          // TODO: Add system_id of affected machine so we can filter and
          // show an accurate success message.
          // https://github.com/canonical-web-and-design/app-squad/issues/230
          return formattedErrors;
        } else {
          formattedErrors.push({
            code: error.code,
            description: getErrorDescription(error.code),
            destinations: [],
          });
        }
        return formattedErrors;
      },
      []
    );
  }
  // If an error is returned and it's not tied to the selected destinations,
  // assume the error is global and therefore no machines were cloned to
  // successfully.
  return [
    {
      code: "global",
      description: `Cloning was unsuccessful.`,
      destinations,
    },
  ];
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

  const apiError: APIError<CloneError> = cloneErrors.length
    ? cloneErrors[0].error
    : null;
  const formattedCloneErrors = formatCloneError(apiError, destinations);
  // TODO: This will always be 0 until the API returns the system_ids of failed
  // destinations.
  // https://github.com/canonical-web-and-design/app-squad/issues/229
  const failedCount = formattedCloneErrors.reduce<Machine["system_id"][]>(
    (failedIds, error) => {
      error.destinations.forEach((destId) => {
        if (!failedIds.includes(destId)) {
          failedIds.push(destId);
        }
      });
      return failedIds;
    },
    []
  ).length;

  return (
    <>
      <div className="clone-results">
        <h2 className="clone-results__title p-heading--4">Cloning complete</h2>
        <div className="clone-results__info">
          <p data-test="results-string">
            {`${destinationCount - failedCount} of ${pluralize(
              "machine",
              destinationCount,
              true
            )} cloned successfully from `}
            <Link
              to={machineURLs.machine.index({ id: sourceMachine.system_id })}
            >
              {sourceMachine.hostname}
            </Link>
            .
          </p>
          {formattedCloneErrors.length > 0 && (
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
                  {formattedCloneErrors.map((error) => {
                    const filter = FilterMachines.filtersToQueryString({
                      system_id: error.destinations,
                    });
                    return (
                      <TableRow data-test="error-row" key={error.code}>
                        <TableCell className="error-col">
                          <Icon name="error" />
                          <span className="u-nudge-right">
                            {error.description}
                          </span>
                        </TableCell>
                        <TableCell className="affected-col u-align--right">
                          <span className="u-nudge-left--small">
                            {error.destinations.length}
                          </span>
                          <Link to={`${machineURLs.machines.index}${filter}`}>
                            Show
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
