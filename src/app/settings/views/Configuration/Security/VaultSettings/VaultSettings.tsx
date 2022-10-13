import { useEffect } from "react";

import {
  Icon,
  Spinner,
  CodeSnippet,
  CodeSnippetBlockAppearance,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import docsUrls from "app/base/docsUrls";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { RootState } from "app/store/root/types";

export enum Labels {
  Loading = "Loading...",
  IntegrateWithVault = "Integrate with Vault",
  VaultEnabled = "Vault enabled",
  SetupInstructions = "Vault setup instructions",
}

const VaultSettings = (): JSX.Element => {
  const dispatch = useDispatch();
  const controllersLoading = useSelector(controllerSelectors.loading);
  const controllersLoaded = useSelector(controllerSelectors.loaded);

  const [unconfiguredControllers, configuredControllers] = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  if (controllersLoading && !controllersLoaded)
    return <Spinner aria-label={Labels.Loading} text={Labels.Loading} />;

  if (
    unconfiguredControllers.length === 0 &&
    configuredControllers.length >= 1
  ) {
    return (
      <>
        <p>
          <Icon name="secured" />
          <span className="u-nudge-right--small">Vault enabled</span>
        </p>
        <a href={docsUrls.aboutNativeTLS}>More about Vault integration</a>
      </>
    );
  } else
    return (
      <>
        {configuredControllers.length >= 1 &&
        unconfiguredControllers.length >= 1 ? (
          <p>
            <Icon name="warning" />
            <span className="u-nudge-right--small">
              Incomplete vault integration, configure{" "}
              {unconfiguredControllers.length} other{" "}
              {unconfiguredControllers.length > 1
                ? "controllers"
                : "controller"}{" "}
              with Vault to complete this operation.
            </span>
          </p>
        ) : (
          <p>
            <Icon name="secured" />
            <span className="u-nudge-right--small">Integrate with Vault</span>
          </p>
        )}
        <div aria-label={Labels.SetupInstructions}>
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
                code: "sudo maas config-vault migrate",
              },
            ]}
          />
        </div>

        <a href={docsUrls.vaultIntegration}>More about Vault integration</a>
      </>
    );
};

export default VaultSettings;
