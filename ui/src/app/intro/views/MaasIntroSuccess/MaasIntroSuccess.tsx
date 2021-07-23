import { Button, Card, Icon, List } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { useExitURL } from "app/intro/hooks";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";

const MaasIntroSuccess = (): JSX.Element => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const exitURL = useExitURL();
  const continueLink = authUser?.completed_intro ? exitURL : introURLs.user;

  useWindowTitle("Welcome - Success");

  return (
    <Section>
      <Card
        className="maas-intro__card"
        data-test="maas-connectivity-form"
        highlighted
        title={
          <>
            <span className="p-heading--4 u-sv1">
              <Icon name="success" />
              &ensp;MAAS has been successfully set up
            </span>
            <hr />
          </>
        }
      >
        <List
          items={[
            "Once DHCP is enabled, set your machines to PXE boot and they will be automatically enlisted in the Machines tab.",
            "Discovered MAC/IP pairs in your network will be listed on your dashboard and can be added to MAAS.",
            "The fabrics, VLANs and subnets in your network will be automatically added to MAAS in the Subnets tab.",
          ]}
        />
      </Card>
      <div className="u-align--right">
        <Button appearance="neutral" element={Link} to={introURLs.images}>
          Back
        </Button>
        <Button
          appearance="positive"
          data-test="continue-button"
          element={Link}
          onClick={() => {
            dispatch(configActions.update({ completed_intro: true }));
          }}
          to={continueLink}
        >
          Finish setup
        </Button>
      </div>
    </Section>
  );
};

export default MaasIntroSuccess;
