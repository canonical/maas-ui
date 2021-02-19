import type { ReactNode } from "react";

import { Button } from "@canonical/react-components";

import type { ScriptResult } from "app/store/scriptresult/types";

type Props = {
  close: () => void;
  scriptResult: ScriptResult;
};

const TestMetrics = ({ close, scriptResult }: Props): JSX.Element => {
  const metrics = scriptResult.results;
  let content: ReactNode;

  if (metrics.length) {
    content = (
      <table data-test="metrics-table">
        <tbody>
          {metrics.map((metric) => (
            <tr key={`metric-${metric.name}`}>
              <td>{metric.title}</td>
              <td>{metric.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    content = (
      <p className="u-align--center u-no-max-width">
        This test does not have any metrics.
      </p>
    );
  }
  return (
    <>
      {content}
      <div className="u-align--right u-nudge-left--small">
        <Button
          appearance="neutral"
          className="u-no-margin--bottom"
          onClick={() => close()}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default TestMetrics;
