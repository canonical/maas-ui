import React from "react";

import { Card, List, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";

import NumaCardDetails from "./NumaCardDetails";

import machineSelectors from "app/store/machine/selectors";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine["system_id"];
};

const NumaCard = ({ id }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  let numaNodeString = "NUMA node";
  let content: JSX.Element | null;

  // Confirm that the full machine details have been fetched. This also allows
  // TypeScript know we're using the right union type (otherwise it will
  // complain that numa_nodes doesn't exist on the base machine type).
  if (!machine || !("numa_nodes" in machine)) {
    content = <Spinner />;
  } else {
    const numaNodes = machine.numa_nodes;
    numaNodeString = pluralize("NUMA node", numaNodes.length, true);
    content = numaNodes.length ? (
      <List
        className="u-no-margin--bottom"
        items={numaNodes.map((numaNode, i) => ({
          className: "numa-card",
          content: (
            <NumaCardDetails
              isLast={i === numaNodes.length - 1}
              machineId={id}
              numaNode={numaNode}
              showExpanded={numaNodes.length <= 2}
            />
          ),
        }))}
      />
    ) : null;
  }

  return (
    <div className="machine-summary__numa-card">
      <Card>
        <strong className="p-muted-heading u-sv1">{numaNodeString}</strong>
        <hr />
        {content}
      </Card>
    </div>
  );
};

export default NumaCard;
