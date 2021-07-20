import Section from "app/base/components/Section";
import Nav from "app/preferences/components/Nav";
import Routes from "app/preferences/components/Routes";

const Preferences = (): JSX.Element => (
  <Section header="My preferences" sidebar={<Nav />}>
    <Routes />
  </Section>
);

export default Preferences;
