import { Link } from "react-router-dom";

import type { SetExpanded } from "../MachineTestsTable";
import { ScriptResultAction } from "../MachineTestsTable";

import TableMenu from "app/base/components/TableMenu";
import { scriptStatus } from "app/base/enum";
import { useSendAnalytics } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import type { ScriptResult } from "app/store/scriptresult/types";

type Props = {
  scriptResult: ScriptResult;
  setExpanded: SetExpanded;
};

const TestActions = ({ scriptResult, setExpanded }: Props): JSX.Element => {
  const sendAnalytics = useSendAnalytics();
  const canViewDetails = [
    scriptStatus.DEGRADED,
    scriptStatus.FAILED_APPLYING_NETCONF,
    scriptStatus.FAILED_INSTALLING,
    scriptStatus.FAILED,
    scriptStatus.PASSED,
    scriptStatus.SKIPPED,
    scriptStatus.TIMEDOUT,
  ].includes(scriptResult.status);
  const hasMetrics = scriptResult.results.length > 0;
  // TODO - Update ContextualMenu props to be able to accept non Button props
  const links: TSFixMe = [];

  if (canViewDetails) {
    links.push({
      children: "View details...",
      "data-test": "view-details",
      element: Link,
      to: `testing/${scriptResult.id}/details`,
    });
  }

  links.push({
    children: "View previous tests...",
    "data-test": "view-previous-tests",
    onClick: () => {
      setExpanded({
        id: scriptResult.id,
        content: ScriptResultAction.VIEW_PREVIOUS_TESTS,
      });
      sendAnalytics(
        "Machine testing",
        "View testing script history",
        "View previous tests"
      );
    },
  });

  if (hasMetrics) {
    links.push({
      children: "View metrics...",
      "data-test": "view-metrics",
      onClick: () => {
        setExpanded({
          id: scriptResult.id,
          content: ScriptResultAction.VIEW_METRICS,
        });
        sendAnalytics(
          "Machine testing",
          "View testing script metrics",
          "View metrics"
        );
      },
    });
  }

  return <TableMenu links={links} position="right" title="Take action:" />;
};

export default TestActions;
