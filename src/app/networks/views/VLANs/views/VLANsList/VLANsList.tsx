import VLANsTable from "./components/VLANsTable";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import NetworksHeader from "@/app/networks/components/NetworksHeader";

const VLANsList = () => {
  useWindowTitle("VLANs");

  return (
    <PageContent
      header={<NetworksHeader />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      <VLANsTable />
    </PageContent>
  );
};

export default VLANsList;
