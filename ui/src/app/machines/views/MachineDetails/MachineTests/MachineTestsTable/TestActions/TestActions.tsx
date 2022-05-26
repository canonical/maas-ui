import type { ContextualMenuProps } from "@canonical/react-components";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import type { SetExpanded } from "../MachineTestsTable";
import { ScriptResultAction } from "../MachineTestsTable";

import TableMenu from "app/base/components/TableMenu";
import { useSendAnalytics } from "app/base/hooks";
import type { DataTestElement } from "app/base/types";
import machineURLs from "app/machines/urls";
import type { Machine } from "app/store/machine/types";
import type { ScriptResult } from "app/store/scriptresult/types";
import { ScriptResultType } from "app/store/scriptresult/types";
import { scriptResultInProgress } from "app/store/scriptresult/utils";

type Props = {
  machineId: Machine["system_id"];
  resultType: ScriptResultType.TESTING | ScriptResultType.COMMISSIONING;
  scriptResult: ScriptResult;
  setExpanded: SetExpanded;
};

type LinkWithDataTest = DataTestElement<LinkProps>;

const TestActions = ({
  machineId,
  resultType,
  scriptResult,
  setExpanded,
}: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();
  const canViewDetails = !scriptResultInProgress(scriptResult.status);
  const hasMetrics = scriptResult.results.length > 0;
  const links: ContextualMenuProps<LinkWithDataTest>["links"] = [];
  const isTesting = resultType === ScriptResultType.TESTING;

  if (canViewDetails) {
    links.push({
      children: "View details...",
      "data-testid": "view-details",
      element: Link,
      to: machineURLs.machine[
        isTesting ? "testing" : "commissioning"
      ].scriptResult({
        id: machineId,
        scriptResultId: scriptResult.id,
      }),
    });
  }

  links.push({
    children: "View previous tests...",
    "data-testid": "view-previous-tests",
    onClick: () => {
      setExpanded({
        id: scriptResult.id,
        content: ScriptResultAction.VIEW_PREVIOUS_TESTS,
      });
      sendAnalytics(
        `Machine ${isTesting ? "testing" : "commissioning"}`,
        "View testing script history",
        "View previous tests"
      );
    },
  });

  if (hasMetrics) {
    links.push({
      children: "View metrics...",
      "data-testid": "view-metrics",
      onClick: () => {
        setExpanded({
          id: scriptResult.id,
          content: ScriptResultAction.VIEW_METRICS,
        });
        sendAnalytics(
          `Machine ${
            resultType === ScriptResultType.TESTING
              ? "testing"
              : "commissioning"
          }`,
          "View testing script metrics",
          "View metrics"
        );
      },
    });
  }

  return <TableMenu links={links} position="right" title="Take action:" />;
};

export default TestActions;
