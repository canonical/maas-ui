import { useEffect } from "react";

import { Button, Card, Icon, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import dashboardURLs from "app/dashboard/urls";
import machineURLs from "app/machines/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";

const UserIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const sshkeys = useSelector(sshkeySelectors.all);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);

  const hasSSHKeys = sshkeys.length > 0;

  useWindowTitle("Welcome");

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  if (authLoading || sshkeyLoading) {
    return <Spinner />;
  }

  return (
    <Section>
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
      </Card>
      <Row>
        <Button
          appearance="positive"
          data-test="continue-button"
          disabled={!hasSSHKeys}
          element={Link}
          to={
            authUser?.is_superuser
              ? dashboardURLs.index
              : machineURLs.machines.index
          }
        >
          Go to {authUser?.is_superuser ? "dashboard" : "machine list"}
        </Button>
      </Row>
    </Section>
  );
};

export default UserIntro;
