import { useEffect } from "react";

import {
  ActionButton,
  Card,
  Icon,
  Notification,
  Spinner,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";

import SSHKeyForm from "app/base/components/SSHKeyForm";
import SSHKeyList from "app/base/components/SSHKeyList";
import Section from "app/base/components/Section";
import { useCycled, useWindowTitle } from "app/base/hooks";
import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";
import { actions as userActions } from "app/store/user";
import userSelectors from "app/store/user/selectors";
import { formatErrors } from "app/utils";

const UserIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const sshkeys = useSelector(sshkeySelectors.all);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const markingIntroComplete = useSelector(userSelectors.markingIntroComplete);
  const [markedIntroComplete] = useCycled(!markingIntroComplete);
  const errors = useSelector(userSelectors.markingIntroCompleteErrors);
  const hasSSHKeys = sshkeys.length > 0;
  const errorMessage = formatErrors(errors);

  useWindowTitle("Welcome - User");

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  if (authLoading || sshkeyLoading) {
    return <Spinner />;
  }

  if (authUser?.completed_intro || markedIntroComplete) {
    return (
      <Redirect
        to={
          authUser?.is_superuser
            ? dashboardURLs.index
            : machineURLs.machines.index
        }
      />
    );
  }

  return (
    <Section>
      {errorMessage && (
        <Notification type="negative" status="Error:">
          {errorMessage}
        </Notification>
      )}
      <Card
        data-test="sshkey-card"
        highlighted
        title={
          <span className="p-heading--4">
            <Icon name={hasSSHKeys ? "success" : "success-grey"} />
            &ensp;SSH keys for {authUser?.username}
          </span>
        }
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
      </Card>
      <div className="u-align--right">
        <ActionButton
          appearance="positive"
          data-test="continue-button"
          disabled={!hasSSHKeys}
          loading={markingIntroComplete}
          onClick={() => {
            dispatch(userActions.markIntroComplete());
          }}
          success={markedIntroComplete}
        >
          Finish setup
        </ActionButton>
      </div>
    </Section>
  );
};

export default UserIntro;
