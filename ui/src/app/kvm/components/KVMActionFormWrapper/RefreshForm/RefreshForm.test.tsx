import { mount } from "enzyme";
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
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("RefreshForm", () => {
  it("can show the processing status when refreshing the active KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ refreshing: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Refreshing KVM..."
    );
  });

  it("correctly dispatches actions to refresh active KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ refreshing: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(
      store.getActions().find((action) => action.type === "pod/refresh")
    ).toStrictEqual({
      type: "pod/refresh",
      meta: {
        model: "pod",
        method: "refresh",
      },
      payload: {
        params: {
          id: pod.id,
        },
      },
    });
  });
});
