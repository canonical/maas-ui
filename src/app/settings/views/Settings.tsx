import { useGetThisUser } from "@/app/api/query/users";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import Routes from "@/app/settings/components/Routes";
import { configActions } from "@/app/store/config";

const Settings = (): React.ReactElement => {
  const user = useGetThisUser();

  useFetchActions([configActions.fetch]);

  if (!user.data?.is_superuser) {
    return (
      <PageContent
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  return <Routes />;
};

export default Settings;
