import MainContentSection from "app/base/components/MainContentSection";
import SectionHeader from "app/base/components/SectionHeader";
import Nav from "app/preferences/components/Nav";
import Routes from "app/preferences/components/Routes";

export enum Labels {
  Title = "My preferences",
}

const Preferences = (): JSX.Element => (
  <MainContentSection
    aria-label={Labels.Title}
    header={<SectionHeader title={Labels.Title} />}
    sidebar={<Nav />}
  >
    <Routes />
  </MainContentSection>
);

export default Preferences;
