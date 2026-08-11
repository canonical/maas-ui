import { Navigate, Route, Routes } from "react-router";

import SwitchDetailsHeader from "../../components/SwitchDetailsHeader";
import SwitchDetailsSummary from "../../components/SwitchDetailsSummary";
import urls from "../../urls";

import { useGetSwitch } from "@/app/api/query/switches";
import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useGetURLId, useWindowTitle } from "@/app/base/hooks";
import { isId } from "@/app/utils";

const SwitchDetails = () => {
  const switchId = useGetURLId("id");

  const isValidId = isId(switchId);

  useWindowTitle("Switch Details");

  const { data: switchDetails } = useGetSwitch({
    path: { switch_id: switchId! },
  });

  if (!isValidId || !switchDetails) {
    return (
      <ModelNotFound id={switchId} linkURL={urls.index} modelName="switch" />
    );
  }

  return (
    <PageContent
      header={
        <SwitchDetailsHeader
          switchItem={{
            id: switchDetails.id,
            management_mac: switchDetails?.management_mac,
            name: switchDetails?.name || "Switch Name",
          }}
        />
      }
    >
      <Routes>
        <Route
          element={<SwitchDetailsSummary id={switchId} />}
          path="summary"
        />
        <Route
          element={
            <Navigate replace to={urls.detailsSummary(switchId.toString())} />
          }
          index
        />
      </Routes>
    </PageContent>
  );
};

export default SwitchDetails;
