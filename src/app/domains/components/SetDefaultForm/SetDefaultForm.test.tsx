import configureStore from "redux-mock-store";

import SetDefaultForm from "./SetDefaultForm";

import { Labels as DomainTableLabels } from "@/app/domains/views/DomainsList/DomainsTable/DomainsTable";
import type { RootState } from "@/app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const domain = domainFactory({ name: "test" });
const state = rootStateFactory({
  domain: domainStateFactory({
    items: [domain],
  }),
});

it("renders", () => {
  renderWithBrowserRouter(<SetDefaultForm id={domain.id} onClose={vi.fn()} />, {
    state,
  });
  expect(screen.getByRole("form", { name: DomainTableLabels.FormTitle }));
  expect(screen.getByText(DomainTableLabels.AreYouSure)).toBeInTheDocument();
});

it("dispatches the set default action", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(<SetDefaultForm id={domain.id} onClose={vi.fn()} />, {
    store,
  });
  await userEvent.click(
    screen.getByRole("button", { name: DomainTableLabels.ConfirmSetDefault })
  );
  expect(
    store.getActions().some((action) => action.type === "domain/setDefault")
  ).toBe(true);
});
