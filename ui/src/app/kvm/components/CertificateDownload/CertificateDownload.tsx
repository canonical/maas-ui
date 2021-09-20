import { Button, CodeSnippet, Icon } from "@canonical/react-components";

type Props = {
  certificateString: string;
};

const CertificateDownload = ({ certificateString }: Props): JSX.Element => {
  return (
    <>
      <div className="certificate-download">
        <CodeSnippet
          blocks={[
            { code: "lxc config trust add - <<EOF" },
            { code: certificateString },
            { code: "EOF" },
          ]}
          className="u-no-margin--bottom"
        />
      </div>
      <Button
        onClick={() => {
          // TODO: Add download functionality
          // https://github.com/canonical-web-and-design/app-squad/issues/248
          return null;
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
