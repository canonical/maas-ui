import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddRecordForm, { Labels as AddRecordFormLabels } from "./AddRecordForm";

import { Labels as RecordFieldsLabels } from "@/app/domains/components/RecordFields/RecordFields";
import { RecordType } from "@/app/store/domain/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("AddRecordForm", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = vi.fn();
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 1, name: "domain-in-the-brain" })],
      }),
    });

    renderWithBrowserRouter(<AddRecordForm closeForm={closeForm} id={1} />, {
      state,
    });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("Dispatches the correct action on submit", async () => {
    const closeForm = vi.fn();
    const state = factory.rootState({
      domain: factory.domainState({
        items: [
          factory.domain({
            id: 1,
            name: "domain-in-the-brain",
            resource_count: 0,
          }),
        ],
      }),
    });

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddRecordForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: RecordFieldsLabels.Name }),
      "Some name"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: RecordFieldsLabels.Type }),
      RecordType.CNAME
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: RecordFieldsLabels.Data }),
      "Some data"
    );

    await userEvent.type(
      screen.getByRole("spinbutton", { name: RecordFieldsLabels.Ttl }),
      "12"
    );

    await userEvent.click(
      screen.getByRole("button", { name: AddRecordFormLabels.SubmitLabel })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "domain/createDNSData")
    ).toStrictEqual({
      type: "domain/createDNSData",
      meta: {
        method: "create_dnsdata",
        model: "domain",
      },
      payload: {
        params: {
          domain: 1,
          name: "Some name",
          rrtype: RecordType.CNAME,
          rrdata: "Some data",
          ttl: 12,
        },
      },
    });
  });
});
