import configureStore from "redux-mock-store";

import SetDefaultForm from "./SetDefaultForm";

import { Labels as DomainTableLabels } from "@/app/domains/views/DomainsList/DomainsTable/DomainsTable";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();
const domain = factory.domain({ name: "test" });
const state = factory.rootState({
  domain: factory.domainState({
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
