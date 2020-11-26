import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RefreshForm from "./RefreshForm";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RefreshForm", () => {
  it("correctly dispatches actions to refresh selected RSDs", () => {
    const rsds = [podFactory({ type: "rsd" }), podFactory({ type: "rsd" })];
    const state = rootStateFactory({
      pod: podStateFactory({
        items: rsds,
        selected: [rsds[0].id, rsds[1].id],
        statuses: podStatusesFactory({
          [rsds[0].id]: podStatusFactory(),
          [rsds[1].id]: podStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").prop("onSubmit")());
    expect(
      store.getActions().filter((action) => action.type === "pod/refresh")
    ).toStrictEqual([
      {
        type: "pod/refresh",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: rsds[0].id,
          },
        },
      },
      {
        type: "pod/refresh",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: rsds[1].id,
          },
        },
      },
    ]);
  });

  it("can show the processing status when refreshing RSDs", () => {
    const rsds = [podFactory({ type: "rsd" }), podFactory({ type: "rsd" })];
    const state = rootStateFactory({
      pod: podStateFactory({
        items: rsds,
        selected: [rsds[0].id, rsds[1].id],
        statuses: podStatusesFactory({
          [rsds[0].id]: podStatusFactory({ refreshing: true }),
          [rsds[1].id]: podStatusFactory({ refreshing: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() => wrapper.find("Formik").prop("onSubmit")());
    wrapper.update();
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Refreshing 1 of 2 RSDs..."
    );
  });
});
