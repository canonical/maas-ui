import { default as controllers } from "app/controllers/urls";
import { default as dashboard } from "app/dashboard/urls";
import { default as devices } from "app/devices/urls";
import { default as domains } from "app/domains/urls";
import { default as images } from "app/images/urls";
import { default as intro } from "app/intro/urls";
import { default as kvm } from "app/kvm/urls";
import { default as machines } from "app/machines/urls";
import { default as pools } from "app/pools/urls";
import { default as preferences } from "app/preferences/urls";
import { default as settings } from "app/settings/urls";
import { default as subnets } from "app/subnets/urls";
import { default as tags } from "app/tags/urls";
import { default as zones } from "app/zones/urls";

const urls = {
  index: "/",
  controllers,
  dashboard,
  devices,
  domains,
  images,
  intro,
  kvm,
  machines,
  pools,
  preferences,
  settings,
  subnets,
  tags,
  zones,
} as const;

export default urls;
