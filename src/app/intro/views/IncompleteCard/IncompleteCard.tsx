import { Link } from "@canonical/react-components";

import docsUrls from "app/base/docsUrls";
import IntroCard from "app/intro/components/IntroCard";
import IntroSection from "app/intro/components/IntroSection";

const IncompleteCard = (): JSX.Element => {
  return (
    <IntroSection>
      <IntroCard
        hasErrors={true}
        data-testid="maas-name-form"
        title="Welcome to MAAS"
        titleLink={
          <Link href={docsUrls.configurationJourney} target="_blank">
            Help with configuring MAAS
          </Link>
        }
      >
        <p>
          This MAAS has not be configured. Ask an admin to log in and finish the
          configuration.
        </p>
      </IntroCard>
    </IntroSection>
  );
};

export default IncompleteCard;
