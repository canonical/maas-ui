import { useState } from "react";

import CustomSourceConnect from "./CustomSourceConnect";
import CustomSourceImages from "./CustomSourceImages";

const CustomSource = (): JSX.Element => {
  const [connected, setConnected] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  if (connected && sourceUrl) {
    return <CustomSourceImages sourceUrl={sourceUrl} />;
  }
  return (
    <>
      <h4>Mirror URL</h4>
      <p>Add the URL you want to use to select your images from.</p>
      <CustomSourceConnect
        setConnected={setConnected}
        setSourceUrl={setSourceUrl}
      />
    </>
  );
};

export default CustomSource;
