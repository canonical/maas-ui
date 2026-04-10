import GroupsList from "./components/GroupsList";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

const Groups = () => {
  useWindowTitle("Groups");
  return (
    <PageContent>
      <GroupsList />
    </PageContent>
  );
};
export default Groups;
