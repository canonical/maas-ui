import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import DeleteForm from "./DeleteForm";

const mockStore = configureStore();

describe("DeleteForm", () => {
  it("correctly dispatches actions to delete selected RSDs", () => {
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
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").prop("onSubmit")());
    expect(
      store.getActions().filter((action) => action.type === "pod/delete")
    ).toStrictEqual([
      {
        type: "pod/delete",
        meta: {
          model: "pod",
          method: "delete",
        },
        payload: {
          params: {
            id: rsds[0].id,
          },
        },
      },
      {
        type: "pod/delete",
        meta: {
          model: "pod",
          method: "delete",
        },
        payload: {
          params: {
            id: rsds[1].id,
          },
        },
      },
    ]);
  });

  it("can show the processing status when deleting RSDs", () => {
    const rsds = [podFactory({ type: "rsd" }), podFactory({ type: "rsd" })];
    const state = rootStateFactory({
      pod: podStateFactory({
        items: rsds,
        selected: [rsds[0].id, rsds[1].id],
        statuses: podStatusesFactory({
          [rsds[0].id]: podStatusFactory({ deleting: true }),
          [rsds[1].id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() => wrapper.find("Formik").prop("onSubmit")());
    wrapper.update();
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Deleting 1 of 2 RSDs..."
    );
  });
});
