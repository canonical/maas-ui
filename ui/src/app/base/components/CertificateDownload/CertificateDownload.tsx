import { Button, CodeSnippet, Icon } from "@canonical/react-components";
import fileDownload from "js-file-download";

import type { CertificateData } from "app/store/general/types";

type Props = {
  certificate: CertificateData["certificate"];
  filename: string;
};

const CertificateDownload = ({ certificate, filename }: Props): JSX.Element => {
  return (
    <>
      <div className="certificate-download">
        <CodeSnippet
          blocks={[
            { code: "lxc config trust add - <<EOF" },
            { code: certificate },
            { code: "EOF" },
          ]}
          className="u-no-margin--bottom"
        />
      </div>
      <Button
        data-test="certificate-download-button"
        onClick={() => {
          fileDownload(certificate, filename);
        }}
        type="button"
      >
        Download certificate
        <span className="u-nudge-right--small">
          <Icon name="begin-downloading" />
        </span>
      </Button>
    </>
  );
};

export default CertificateDownload;
