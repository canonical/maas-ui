import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import Nav from "app/preferences/components/Nav";
import Routes from "app/preferences/components/Routes";

const Preferences = (): JSX.Element => (
  <Section header={<SectionHeader title="My preferences" />} sidebar={<Nav />}>
    <Routes />
  </Section>
);

export default Preferences;
