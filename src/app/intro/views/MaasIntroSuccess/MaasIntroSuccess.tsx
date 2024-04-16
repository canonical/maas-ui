import { Button, List } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import urls from "@/app/base/urls";
import IntroCard from "@/app/intro/components/IntroCard";
import IntroSection from "@/app/intro/components/IntroSection";
import { useExitURL } from "@/app/intro/hooks";
import authSelectors from "@/app/store/auth/selectors";
import { configActions } from "@/app/store/config";

export enum Labels {
  FinishSetup = "Finish setup",
}

const MaasIntroSuccess = (): JSX.Element => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const exitURL = useExitURL();
  const continueLink = authUser?.completed_intro ? exitURL : urls.intro.user;

  return (
    <IntroSection windowTitle="Success">
      <IntroCard
        complete={true}
        data-testid="maas-connectivity-form"
        title="MAAS has been successfully set up"
      >
        <List
          items={[
            "Once DHCP is enabled, set your machines to PXE boot and they will be automatically enlisted in the Machines tab.",
            "Discovered MAC/IP pairs in your network will be listed on your dashboard and can be added to MAAS.",
            "The fabrics, VLANs and subnets in your network will be automatically added to MAAS in the Subnets tab.",
          ]}
        />
      </IntroCard>
      <div className="u-align--right">
        <Button element={Link} to={urls.intro.images}>
          Back
        </Button>
        <Button
          appearance="positive"
          data-testid="continue-button"
          element={Link}
          onClick={() => {
            dispatch(configActions.update({ completed_intro: true }));
          }}
          to={continueLink}
        >
          {Labels.FinishSetup}
        </Button>
      </div>
    </IntroSection>
  );
};

export default MaasIntroSuccess;
