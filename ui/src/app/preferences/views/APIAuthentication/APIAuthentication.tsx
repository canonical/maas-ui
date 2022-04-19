import APIKeyList from "./APIKeyList";
import TLSCertificate from "./TLSCertificate";

import { useWindowTitle } from "app/base/hooks";

const APIAuthentication = (): JSX.Element => {
  useWindowTitle("API authentication");

  return (
    <>
      <TLSCertificate />
      <APIKeyList />
    </>
  );
};

export default APIAuthentication;
