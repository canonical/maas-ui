import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import type { BaseController } from "app/store/controller/types/base";

const ControllerLink = ({
  hostname,
  system_id,
  domain: { name: domainName },
}: Pick<BaseController, "hostname" | "system_id" | "domain">): JSX.Element => {
  return (
    <LegacyLink route={baseURLs.controller({ id: system_id })}>
      <strong>{hostname}</strong>
      <span>.{domainName}</span>
    </LegacyLink>
  );
};

export default ControllerLink;
