import { screen } from "@testing-library/react";

import { Label as PoolAddLabel } from "./PoolAdd/PoolAdd";
import { Label as PoolEditLabel } from "./PoolEdit/PoolEdit";
import { Label as PoolListLabel } from "./PoolList/PoolList";
import Pools from "./Pools";

import urls from "app/base/urls";
import { Label as NotFoundLabel } from "app/base/views/NotFound/NotFound";
import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("Pools", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [resourcePoolFactory({ id: 1 })],
      }),
    });
  });

  [
    {
      label: PoolListLabel.Title,
      path: urls.pools.index,
    },
    {
      label: PoolAddLabel.Title,
      path: urls.pools.add,
    },
    {
      label: PoolEditLabel.Title,
      path: urls.pools.edit({ id: 1 }),
    },
    {
      label: NotFoundLabel.Title,
      path: `${urls.pools.index}/not/a/path`,
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<Pools />, {
        route: path,
        routePattern: `${urls.pools.index}/*`,
        state,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
