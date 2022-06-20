import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddRecordForm from "./AddRecordForm";

import { RecordType } from "app/store/domain/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddRecordForm", () => {
  it("calls closeForm on cancel click", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-brain" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddRecordForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-testid='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("Dispatches the correct action on submit", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-brain",
            resource_count: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <AddRecordForm closeForm={closeForm} id={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        name: "Some name",
        rrtype: RecordType.CNAME,
        rrdata: "Some data",
        ttl: 12,
      })
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
