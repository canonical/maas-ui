import {
  Icon,
  Spinner,
  CodeSnippet,
  CodeSnippetBlockAppearance,
} from "@canonical/react-components";
// import { useSelector } from "react-redux";

import docsUrls from "app/base/docsUrls";

export enum Labels {
  Loading = "Loading...",
  IntegrateWithVault = "Integrate with Vault",
  VaultEnabled = "Vault enabled",
  SetupInstructions = "Vault setup instructions",
}

const VaultSettings = (): JSX.Element => {
  // below is temporary while we wait for controller stuff to be implemented.
  const loading = false;
  const numberUnconfigured = 0;
  const numberConfigured = 0;

  if (loading) return <Spinner aria-label={Labels.Loading} />;

  if (numberUnconfigured === 0 && numberConfigured >= 1) {
    return (
      <>
        <p>
          <Icon name="lock-locked-active" />
          <span className="u-nudge-right--small">Vault enabled</span>
        </p>
        <a href={docsUrls.aboutNativeTLS}>More about Vault integration</a>
      </>
    );
  } else
    return (
      <>
        {numberConfigured >= 1 && numberUnconfigured >= 1 ? (
          <p>
            <Icon name="warning" />
            <span className="u-nudge-right--small">
              Incomplete vault integration, configure {numberUnconfigured} other{" "}
              {numberConfigured > 1 ? "controllers" : "controller"} with Vault
              to complete this operation.
            </span>
          </p>
        ) : (
          <p>
            <Icon name="lock-locked-active" />
            <span className="u-nudge-right--small">Integrate with Vault</span>
          </p>
        )}
        <p>
          1. Get the $wrapped_token and $role_id from Vault.{" "}
          <a
            href="https://learn.hashicorp.com/tutorials/vault/approle-best-practices?in=vault/auth-methods#approle-response-wrapping"
            rel="noreferrer noopener"
            target="_blank"
          >
            Find out more from Hashicorp Vault
          </a>
          .
        </p>
        <p>2. SSH into each region controller and configure Vault.</p>
        <CodeSnippet
          blocks={[
            {
              appearance: CodeSnippetBlockAppearance.LINUX_PROMPT,
              code: "sudo maas config-vault configure $url $approle_id $wrapped_token $secrets_path --secrets-mount $secret_mount",
            },
          ]}
        />
        <p>
          3. After Vault is configured on all region controllers, migrate
          secrets on one of the region controllers.
        </p>
        <CodeSnippet
          blocks={[
            {
              appearance: CodeSnippetBlockAppearance.LINUX_PROMPT,
              code: "sudo maas config-vault migrate-secrets",
            },
          ]}
        />
        <a href={docsUrls.aboutNativeTLS}>More about Vault integration</a>
      </>
    );
};

export default VaultSettings;
