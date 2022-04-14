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
  it("can show the processing status when refreshing the given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <RefreshForm clearHeaderContent={jest.fn()} hostIds={[1]} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikFormContent").prop("saving")).toBe(true);
    expect(wrapper.find('[data-testid="saving-label"]').text()).toBe(
      "Refreshing KVM host..."
    );
  });

  it("correctly dispatches actions to refresh given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <RefreshForm clearHeaderContent={jest.fn()} hostIds={[1, 2]} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
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
            id: 1,
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
            id: 2,
          },
        },
      },
    ]);
  });
});
