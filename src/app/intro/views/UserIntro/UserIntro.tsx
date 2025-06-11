import { useState } from "react";

import { ActionButton, Button, Card, Icon } from "@canonical/react-components";

import { useListSshKeys } from "@/app/api/query/sshKeys";
import { useCompleteIntro, useGetThisUser } from "@/app/api/query/users";
import TableConfirm from "@/app/base/components/TableConfirm";
import IntroCard from "@/app/intro/components/IntroCard";
import IntroSection from "@/app/intro/components/IntroSection";
import AddSSHKey from "@/app/preferences/views/SSHKeys/components/AddSSHKey";
import SSHKeysList from "@/app/preferences/views/SSHKeys/views";
import { formatErrors } from "@/app/utils";

export enum Labels {
  Continue = "Finish setup",
  Skip = "Skip user setup",
  AreYouSure = "Are you sure you want to skip your user setup? You will still be able to manage your SSH keys in your user preferences.",
}

const UserIntro = (): React.ReactElement => {
  const [showSkip, setShowSkip] = useState(false);

  const user = useGetThisUser();
  const completeIntro = useCompleteIntro();
  const { data, isPending: sshKeyLoading } = useListSshKeys();

  const sshkeys = data?.items || [];
  const hasSSHKeys = sshkeys.length > 0;
  const errorMessage = formatErrors(
    user.isError ? user.error.message : undefined
  );

  return (
    <IntroSection
      errors={errorMessage}
      loading={user.isPending || sshKeyLoading}
      shouldExitIntro={user.data?.completed_intro}
      windowTitle="User"
    >
      <IntroCard
        complete={hasSSHKeys}
        data-testid="sshkey-card"
        hasErrors={!!errorMessage}
        title={<>SSH keys for {user.data?.username}</>}
      >
        <p>
          Add multiple keys from Launchpad and Github or enter them manually.
        </p>
        <h4>Keys</h4>
        {hasSSHKeys ? <SSHKeysList isIntro={true} /> : null}
        <AddSSHKey />
      </IntroCard>
      <div className="u-align--right">
        <Button
          data-testid="skip-button"
          onClick={() => {
            setShowSkip(true);
          }}
        >
          {Labels.Skip}
        </Button>
        <ActionButton
          appearance="positive"
          data-testid="continue-button"
          disabled={!hasSSHKeys}
          loading={completeIntro.isPending && !showSkip}
          onClick={() => {
            completeIntro.mutate({});
          }}
          success={completeIntro.isSuccess}
        >
          {Labels.Continue}
        </ActionButton>
      </div>
      {showSkip && (
        <Card data-testid="skip-setup" highlighted>
          <TableConfirm
            confirmLabel={Labels.Skip}
            errors={completeIntro.error?.message}
            finished={completeIntro.isSuccess}
            inProgress={
              !(user.data?.completed_intro || completeIntro.isSuccess) &&
              showSkip
            }
            message={
              <>
                <Icon className="is-inline" name="warning" />
                {Labels.AreYouSure}
              </>
            }
            onClose={() => {
              setShowSkip(false);
            }}
            onConfirm={() => {
              completeIntro.mutate({});
            }}
            sidebar={false}
          />
        </Card>
      )}
    </IntroSection>
  );
};

export default UserIntro;
