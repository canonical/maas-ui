import { useEffect } from "react";

import { Button, Icon, Tooltip } from "@canonical/react-components";
import fileDownload from "js-file-download";
import { useDispatch, useSelector } from "react-redux";

import { actions as generalActions } from "app/store/general";
import { tlsCertificate as tlsCertificateSelectors } from "app/store/general/selectors";
import { breakLines, unindentString } from "app/utils";

export enum Labels {
  Download = "Download TLS certificate",
  Filename = "TLS certificate",
  Title = "TLS certificate",
}

const TLSCertificate = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const tlsCertificate = useSelector(tlsCertificateSelectors.get);

  useEffect(() => {
    dispatch(generalActions.fetchTlsCertificate());
  }, [dispatch]);

  if (!tlsCertificate) {
    return null;
  }

  return (
    <>
      <div className="u-flex--align-center">
        <h2 className="p-heading--5 u-sv-1">{Labels.Title}</h2>
        <Tooltip
          className="u-nudge-right--small"
          message={breakLines(
            unindentString(`If this MAAS certificate is not trusted in your
            machine, compare the fingerprint in the CLI with this one to verify
            you are connecting to this MAAS server.`)
          )}
        >
          <Button
            aria-label="More about trusting TLS certificates"
            appearance="base"
            dense
            hasIcon
            small
          >
            <Icon name="information" />
          </Button>
        </Tooltip>
        <span className="u-nudge-right--small">
          <Button
            aria-label={Labels.Download}
            appearance="base"
            dense
            hasIcon
            onClick={() => {
              fileDownload(tlsCertificate.certificate, Labels.Filename);
            }}
            small
            type="button"
          >
            <Icon name="begin-downloading" />
          </Button>
        </span>
      </div>
      <p className="u-no-max-width u-break-word">
        <span className="u-text--muted">Fingerprint:</span>{" "}
        <span>{tlsCertificate.fingerprint}</span>
      </p>
      <hr />
    </>
  );
};

export default TLSCertificate;
