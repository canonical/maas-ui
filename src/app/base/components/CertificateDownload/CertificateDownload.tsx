import {
  Button,
  CodeSnippet,
  Icon,
  Textarea,
} from "@canonical/react-components";
import fileDownload from "js-file-download";

import type { CertificateData } from "app/store/general/types";

type Props = {
  certificate: CertificateData["certificate"];
  filename: string;
  isGenerated?: boolean;
};

export enum Labels {
  Download = "Download certificate",
}

export enum TestIds {
  CertCodeSnippet = "certificate-code-snippet",
  CertTextarea = "certificate-textarea",
}

const CertificateDownload = ({
  certificate,
  filename,
  isGenerated = false,
}: Props): JSX.Element => {
  return (
    <>
      {isGenerated ? (
        <div className="certificate-download">
          <CodeSnippet
            blocks={[
              { code: "lxc config trust add - <<EOF" },
              { code: certificate },
              { code: "EOF" },
            ]}
            className="u-no-margin--bottom"
            data-testid={TestIds.CertCodeSnippet}
          />
        </div>
      ) : (
        <Textarea
          className="p-textarea--readonly"
          data-testid={TestIds.CertTextarea}
          id="lxd-cert"
          readOnly
          rows={5}
          value={certificate}
        />
      )}
      <Button
        onClick={() => {
          fileDownload(certificate, filename);
        }}
        type="button"
      >
        {Labels.Download}
        <span className="u-nudge-right--small">
          <Icon name="begin-downloading" />
        </span>
      </Button>
    </>
  );
};

export default CertificateDownload;
