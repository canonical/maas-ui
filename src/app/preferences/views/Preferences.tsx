import MainContentSection from "app/base/components/MainContentSection";
import Routes from "app/preferences/components/Routes";

export enum Labels {
  Title = "My preferences",
}

const Preferences = (): JSX.Element => (
  <MainContentSection aria-label={Labels.Title}>
    <Routes />
  </MainContentSection>
);

export default Preferences;
