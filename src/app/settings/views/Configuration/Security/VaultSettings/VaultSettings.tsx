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
import { NodeType } from "app/store/types/node";

export enum Labels {
  Loading = "Loading...",
  IntegrateWithVault = "Integrate with Vault",
  VaultEnabled = "Vault enabled",
  SetupInstructions = "Vault setup instructions",
}

const VaultSettings = (): JSX.Element => {
  const dispatch = useDispatch();

  const selectedIDs = useSelector(controllerSelectors.selectedIDs);
  const controllers = useSelector((state: RootState) =>
    controllerSelectors.search(
      state,
      `node_type:(=${NodeType.REGION_CONTROLLER},${NodeType.REGION_AND_RACK_CONTROLLER})`,
      selectedIDs
    )
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  const controllersLoaded = useSelector(controllerSelectors.loaded);

  const unconfiguredControllers = controllers.filter((controller) => {
    return controller.vault_configured === false;
  }).length;
  const configuredControllers = controllers.filter((controller) => {
    return controller.vault_configured === true;
  }).length;

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  if (controllersLoading && !controllersLoaded)
    return <Spinner aria-label={Labels.Loading} text={Labels.Loading} />;

  if (unconfiguredControllers === 0 && configuredControllers >= 1) {
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
        {configuredControllers >= 1 && unconfiguredControllers >= 1 ? (
          <p>
            <Icon name="warning" />
            <span className="u-nudge-right--small">
              Incomplete vault integration, configure {unconfiguredControllers}{" "}
              other {unconfiguredControllers > 1 ? "controllers" : "controller"}{" "}
              with Vault to complete this operation.
            </span>
          </p>
        ) : (
          <p>
            <Icon name="lock-locked-active" />
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

        <a href={docsUrls.aboutNativeTLS}>More about Vault integration</a>
      </>
    );
};

export default VaultSettings;
