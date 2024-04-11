import { Navigation } from "@canonical/maas-react-components";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../../../../../public/zg_logo_for_dark.svg";
import { isSelected } from "../utils";

import urls from "@/app/base/urls";

const NavigationBanner = ({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element => {
  const location = useLocation();

  const homepageLink = { url: urls.machines.index, label: "Homepage" };
  return (
    <Navigation.Banner>
      <Navigation.Logo
        aria-current={
          isSelected(location.pathname, homepageLink) ? "page" : undefined
        }
        aria-label={homepageLink.label}
        as={Link}
        to={homepageLink.url}
      >
        <Navigation.LogoTag>
          <Navigation.LogoIcon>
            <img alt="logo" src="/favicon.png" />
          </Navigation.LogoIcon>
        </Navigation.LogoTag>
        <Navigation.LogoText>
          {/* <Navigation.LogoName variant="small">ZEROGAP.ai</Navigation.LogoName> */}
          <Navigation.LogoName>
            <img alt="Zero Gap AI" className="logo" src={Logo} width="130" />
          </Navigation.LogoName>
        </Navigation.LogoText>
      </Navigation.Logo>
      {children}
    </Navigation.Banner>
  );
};

export default NavigationBanner;
