import PageContent from "app/base/components/PageContent/PageContent";
import Routes from "app/preferences/components/Routes";

export enum Labels {
  Title = "My preferences",
}

const Preferences = (): JSX.Element => (
  <PageContent
    aria-label={Labels.Title}
    sidePanelContent={null}
    sidePanelTitle={null}
  >
    <Routes />
  </PageContent>
);

export default Preferences;
