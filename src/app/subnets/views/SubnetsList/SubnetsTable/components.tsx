import type { PropsWithChildren } from "react";
import { useState } from "react";

import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom-v5-compat";

import type { SubnetsTableColumn } from "./types";

export const SpaceCellContents = ({
  value,
}: PropsWithChildren<{
  value: SubnetsTableColumn;
}>): JSX.Element => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  return (
    <>
      <span
        className={
          value.isVisuallyHidden ? "subnets-table__visually-hidden" : ""
        }
      >
        {value.label === "No space" ? (
          <Button
            appearance="base"
            aria-label="No space - press to see more information"
            dense
            hasIcon
            onClick={() => setIsWarningOpen(!isWarningOpen)}
          >
            <i className="p-icon--warning"></i> <span>No space</span>
          </Button>
        ) : value.href ? (
          <Link to={value.href}>{value.label}</Link>
        ) : (
          value.label
        )}
        {isWarningOpen ? (
          <div>
            MAAS integrations require a space in order to determine the purpose
            of a network. Define a space for each subnet by selecting the space
            on the VLAN details page.
          </div>
        ) : null}
      </span>
    </>
  );
};

export const CellContents = ({
  value,
}: {
  value: SubnetsTableColumn;
}): JSX.Element => (
  <>
    <span
      className={value.isVisuallyHidden ? "subnets-table__visually-hidden" : ""}
    >
      {value.href ? <Link to={value.href}>{value.label}</Link> : value.label}
    </span>
  </>
);
