import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import DomainSummary, { Labels as DomainSummaryLabels } from "./DomainSummary";

import { Labels as EditableSectionLabels } from "@/app/base/components/EditableSection";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("DomainSummary", () => {
  it("render nothing if domain doesn't exist", () => {
    const state = factory.rootState();
    renderWithBrowserRouter(<DomainSummary id={1} />, {
      state,
    });

    expect(
      screen.queryByRole("heading", { name: DomainSummaryLabels.Title })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(DomainSummaryLabels.Summary)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: DomainSummaryLabels.FormLabel })
    ).not.toBeInTheDocument();
  });

  it("renders domain summary", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 1, name: "test" })],
      }),
    });

    renderWithBrowserRouter(<DomainSummary id={1} />, {
      state,
    });

    expect(
      screen.getByRole("heading", { name: DomainSummaryLabels.Title })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(DomainSummaryLabels.Summary)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: DomainSummaryLabels.FormLabel })
    ).not.toBeInTheDocument();
  });

  it("doesn't render Edit button when user is not admin", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 1, name: "test" })],
      }),
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: false }),
        }),
      }),
    });

    renderWithBrowserRouter(<DomainSummary id={1} />, {
      state,
    });

    expect(
      screen.queryByRole("button", { name: EditableSectionLabels.EditButton })
    ).not.toBeInTheDocument();
  });

  describe("when user is admin", () => {
    let state: RootState;

    beforeEach(() => {
      state = factory.rootState({
        domain: factory.domainState({
          items: [
            factory.domain({
              id: 1,
              name: "test",
            }),
          ],
        }),
        user: factory.userState({
          auth: factory.authState({
            user: factory.user({ is_superuser: true }),
          }),
        }),
      });
    });

    it("renders the Edit button", () => {
      renderWithBrowserRouter(<DomainSummary id={1} />, {
        state,
      });

      expect(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      ).toBeInTheDocument();
    });

    it("renders the form when Edit button is clicked", async () => {
      renderWithBrowserRouter(<DomainSummary id={1} />, {
        state,
      });

      await userEvent.click(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      );

      expect(
        screen.queryByLabelText(DomainSummaryLabels.Summary)
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("form", { name: DomainSummaryLabels.FormLabel })
      ).toBeInTheDocument();
    });

    it("closes the form when Cancel button is clicked", async () => {
      renderWithBrowserRouter(<DomainSummary id={1} />, {
        state,
      });

      await userEvent.click(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      );

      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(
        screen.getByLabelText(DomainSummaryLabels.Summary)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("form", { name: DomainSummaryLabels.FormLabel })
      ).not.toBeInTheDocument();
    });

    it("calls actions.update on save click", async () => {
      const store = mockStore(state);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DomainSummary id={1} />
          </MemoryRouter>
        </Provider>
      );

      await userEvent.click(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      );

      await userEvent.clear(
        screen.getByRole("textbox", { name: DomainSummaryLabels.Name })
      );

      await userEvent.type(
        screen.getByRole("textbox", { name: DomainSummaryLabels.Name }),
        "test"
      );

      await userEvent.type(
        screen.getByRole("spinbutton", { name: DomainSummaryLabels.Ttl }),
        "42"
      );

      await userEvent.click(
        screen.getByRole("button", { name: DomainSummaryLabels.SubmitLabel })
      );

      expect(
        store.getActions().find((action) => action.type === "domain/update")
      ).toStrictEqual({
        type: "domain/update",
        meta: {
          method: "update",
          model: "domain",
        },
        payload: {
          params: {
            id: 1,
            name: "test",
            ttl: 42,
            authoritative: false,
          },
        },
      });
    });
  });
});
