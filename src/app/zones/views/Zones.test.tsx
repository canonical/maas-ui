import { screen } from "@testing-library/react";

import Zones from "./Zones";

import { Label as NotFoundLabel } from "app/base/views/NotFound/NotFound";
import type { RootState } from "app/store/root/types";
import zonesURLs from "app/zones/urls";
import { Label as ZoneDetailsLabel } from "app/zones/views/ZoneDetails/ZoneDetails";
import { Label as ZoneListLabel } from "app/zones/views/ZonesList/ZonesList";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("Zones", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 1,
            name: "zone-name",
          }),
        ],
      }),
    });
  });

  [
    {
      label: ZoneListLabel.List,
      path: zonesURLs.index,
      pattern: zonesURLs.index,
    },
    {
      label: ZoneDetailsLabel.Details,
      path: zonesURLs.details({ id: 1 }),
      pattern: zonesURLs.details(null, true),
    },
    {
      label: NotFoundLabel.Title,
      path: `${zonesURLs.index}/not/a/path`,
      pattern: `${zonesURLs.index}/*`,
    },
  ].forEach(({ label, path, pattern }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<Zones />, {
        wrapperProps: { routePattern: pattern, state },
        route: path,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
