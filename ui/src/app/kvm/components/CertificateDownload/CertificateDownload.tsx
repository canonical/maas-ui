import { Button, CodeSnippet, Icon } from "@canonical/react-components";
import fileDownload from "js-file-download";

import type { GeneratedCertificate } from "app/store/general/types";

type Props = {
  certificate: GeneratedCertificate | null;
};

const CertificateDownload = ({ certificate }: Props): JSX.Element => {
  return (
    <>
      <div className="certificate-download">
        <CodeSnippet
          blocks={[
            { code: "lxc config trust add - <<EOF" },
            { code: certificate?.certificate || "" },
            { code: "EOF" },
          ]}
          className="u-no-margin--bottom"
        />
      </div>
      <Button
        data-test="certificate-download-button"
        onClick={() => {
          if (certificate) {
            fileDownload(certificate.certificate, certificate.CN);
          }
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
