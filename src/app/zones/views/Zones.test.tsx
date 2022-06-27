import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Zones from "./Zones";

import type { RootState } from "app/store/root/types";
import zonesURLs from "app/zones/urls";
import {
  authState as authStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Zones", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: true }),
        }),
      }),
      zone: testZones,
    });
  });

  const testZones = zoneStateFactory({
    errors: {},
    loading: false,
    loaded: true,
    items: [
      zoneFactory({
        id: 1,
        name: "zone-name",
      }),
    ],
  });

  [
    {
      component: "Availability zones",
      path: zonesURLs.index,
    },
    {
      component: /Availability Zone/i,
      path: zonesURLs.details({ id: 1 }),
    },
    {
      component: "Zone not found",
      path: zonesURLs.details({ id: 2 }),
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(initialState);
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Zones />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(
        screen.getByRole("heading", { name: component })
      ).toBeInTheDocument();
    });
  });
});
