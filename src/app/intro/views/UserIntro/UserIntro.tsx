import { useEffect, useState } from "react";

import { ActionButton, Button, Card, Icon } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SSHKeyForm from "app/base/components/SSHKeyForm";
import SSHKeyList from "app/base/components/SSHKeyList";
import TableConfirm from "app/base/components/TableConfirm";
import { useCycled } from "app/base/hooks";
import IntroCard from "app/intro/components/IntroCard";
import IntroSection from "app/intro/components/IntroSection";
import authSelectors from "app/store/auth/selectors";
import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";
import { formatErrors } from "app/utils";

export enum Labels {
  Continue = "Finish setup",
  Skip = "Skip user setup",
  AreYouSure = "Are you sure you want to skip your user setup? You will still be able to manage your SSH keys in your user preferences.",
}

const UserIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const [showSkip, setShowSkip] = useState(false);
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const completedUserIntro = useSelector(authSelectors.completedUserIntro);
  const sshkeys = useSelector(sshkeySelectors.all);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const markingIntroComplete = useSelector(userSelectors.markingIntroComplete);
  const [markedIntroComplete] = useCycled(!markingIntroComplete);
  const errors = useSelector(userSelectors.markingIntroCompleteErrors);
  const hasSSHKeys = sshkeys.length > 0;
  const errorMessage = formatErrors(errors);

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  return (
    <IntroSection
      errors={errors}
      loading={authLoading || sshkeyLoading}
      shouldExitIntro={completedUserIntro || markedIntroComplete}
      windowTitle="User"
    >
      <IntroCard
        complete={!!hasSSHKeys}
        data-testid="sshkey-card"
        hasErrors={!!errorMessage}
        title={<>SSH keys for {authUser?.username}</>}
      >
        <p>
          Add multiple keys from Launchpad and Github or enter them manually.
        </p>
        <h4>Keys</h4>
        {hasSSHKeys ? <SSHKeyList sidebar={false} /> : null}
        <SSHKeyForm
          onSaveAnalytics={{
            action: "Import",
            category: "User intro",
            label: "Import SSH key form",
          }}
          resetOnSave
        />
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
          loading={markingIntroComplete && !showSkip}
          onClick={() => {
            dispatch(userActions.markIntroComplete());
          }}
          success={markedIntroComplete}
        >
          {Labels.Continue}
        </ActionButton>
      </div>
      {showSkip && (
        <Card data-testid="skip-setup" highlighted>
          <TableConfirm
            confirmLabel={Labels.Skip}
            errors={errors}
            finished={markedIntroComplete}
            inProgress={markingIntroComplete && showSkip}
            message={
              <>
                <Icon className="is-inline" name="warning" />
                {Labels.AreYouSure}
              </>
            }
            onClose={() => setShowSkip(false)}
            onConfirm={() => {
              dispatch(userActions.markIntroComplete());
            }}
            sidebar={false}
          />
        </Card>
      )}
    </IntroSection>
  );
};

export default UserIntro;
