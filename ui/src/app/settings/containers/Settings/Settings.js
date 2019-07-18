import React from "react";

import Routes from "../../components/Routes";
import Section from "app/base/components/Section";
import SettingsNav from "../../components/Nav";

const Settings = () => {
  return (
    <Section title="Settings" sidebar={<SettingsNav />}>
      <Routes />
    </Section>
  );
};

export default Settings;
