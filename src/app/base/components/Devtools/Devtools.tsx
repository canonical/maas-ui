import { useEffect, useState } from "react";

import { Button, Input } from "@canonical/react-components";

const DevTools = (): JSX.Element => {
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSend = (url: string) =>
    fetch("/MAAS/accounts/devtools/scenario", {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      }),
      body: new URLSearchParams({ url }),
    });

  useEffect(() => {
    fetch("/MAAS/accounts/devtools/scenario").then((response) => {
      response.json().then(({ url }) => setScenario(url));
    });
  }, []);

  const handleScenarioChange = (value: string) => {
    setIsLoading(true);
    handleSend(value).then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        console.error(response);
        setIsLoading(false);
      }
    });
  };

  return (
    <section aria-label="MAAS UI Devtools" className="row">
      <div className="col-6 p-footer__nav">
        <hr />
        <Input
          label="JSON file URL"
          onChange={(event) => setScenario(event.target.value)}
          stacked
          type="text"
          value={scenario}
        />
        <Button
          disabled={isLoading}
          onClick={() => handleScenarioChange(scenario)}
        >
          Set custom scenario
        </Button>
      </div>
    </section>
  );
};

export default DevTools;
