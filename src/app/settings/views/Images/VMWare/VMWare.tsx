import { ContentSection } from "@canonical/maas-react-components";
import { Notification, Spinner } from "@canonical/react-components";

import VMWareForm from "../VMWareForm";

import { useConfigurations } from "@/app/api/query/configurations";
import type { PublicConfigName } from "@/app/apiclient";
import { useWindowTitle } from "@/app/base/hooks";
import { ConfigNames } from "@/app/store/config/types";

export enum Labels {
  Loading = "Loading...",
}

const VMWare = (): React.ReactElement => {
  const names = [
    ConfigNames.VCENTER_SERVER,
    ConfigNames.VCENTER_USERNAME,
    ConfigNames.VCENTER_PASSWORD,
    ConfigNames.VCENTER_DATACENTER,
  ] as PublicConfigName[];
  const { isPending, error, isSuccess } = useConfigurations({
    query: { name: names },
  });
  useWindowTitle("VMWare");

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        VMware
      </ContentSection.Title>
      <ContentSection.Content>
        {isPending && <Spinner text={Labels.Loading} />}
        {error && (
          <Notification
            severity="negative"
            title="Error while fetching image configurations"
          >
            {error.message}
          </Notification>
        )}
        {isSuccess && <VMWareForm />}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default VMWare;
