import { useEffect, useState } from "react";

import { Button, Input, Switch } from "@canonical/react-components";

const DevTools = (): JSX.Element => {
  const [mockUrl, setMockUrl] = useState("");
  const [savedMockUrl, setSavedMockUrl] = useState("");
  const [maasUrl, setMaasUrl] = useState("");
  const [savedMaasUrl, setSavedMaasUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldUseMockServer, setShouldUseMockServer] = useState(false);

  const handleMaasUrlSend = (url: string) => {
    return fetch(`/devtools/options`, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      }),
      body: new URLSearchParams({ url }),
    });
  };

  const handleMockUrlSend = (url: string) => {
    return fetch(`/mock-server-devtools/options`, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      }),
      body: new URLSearchParams({ url }),
    });
  };

  useEffect(() => {
    fetch("/mock-server-devtools/options").then((response) => {
      response.json().then(({ url }) => {
        setMockUrl(url);
        setSavedMockUrl(url);
      });
    });
    fetch("/devtools/options").then((response) => {
      response.json().then(({ url }) => {
        setMaasUrl(url);
        setSavedMaasUrl(url);
      });
    });
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    if (mockUrl !== savedMockUrl) {
      handleMockUrlSend(mockUrl).then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error(response);
          setIsLoading(false);
        }
      });
    }
    if (maasUrl !== savedMaasUrl) {
      handleMaasUrlSend(maasUrl).then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error(response);
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <section aria-label="MAAS UI Devtools" className="p-strip">
      <div className="row">
        <div className="col-3">
          <h4 className="u-no-margin--bottom">Developer Tools</h4>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-6">
              <Switch
                checked={shouldUseMockServer}
                label="Enable mock server"
                onChange={() => {
                  setShouldUseMockServer(!shouldUseMockServer);
                }}
              />
              {!shouldUseMockServer ? (
                <Input
                  help="The URL of the MAAS server to use for the UI"
                  label="MAAS URL"
                  onChange={(event) => setMaasUrl(event.target.value)}
                  stacked
                  type="text"
                  value={maasUrl}
                />
              ) : null}
            </div>
            <div className="col-6">
              {shouldUseMockServer ? (
                <Input
                  help="The URL of the JSON file to be used by the mock server"
                  label="JSON file URL"
                  onChange={(event) => setMockUrl(event.target.value)}
                  stacked
                  type="text"
                  value={mockUrl}
                />
              ) : null}
            </div>
          </div>
          <div className="u-align--right">
            <Button disabled={isLoading} onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevTools;
