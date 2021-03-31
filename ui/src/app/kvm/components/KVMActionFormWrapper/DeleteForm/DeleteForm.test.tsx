import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("DeleteForm", () => {
  it("can show the processing status when deleting the active KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Removing KVM..."
    );
  });

  it("shows a decompose checkbox if deleting a LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FormikField[name='decompose']").exists()).toBe(true);
  });

  it("does not show a decompose checkbox if deleting a non-LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.VIRSH });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FormikField[name='decompose']").exists()).toBe(false);
  });

  it("correctly dispatches actions to delete active KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        active: pod.id,
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(
      store.getActions().find((action) => action.type === "pod/delete")
    ).toStrictEqual({
      type: "pod/delete",
      meta: {
        model: "pod",
        method: "delete",
      },
      payload: {
        params: {
          decompose: false,
          id: pod.id,
        },
      },
    });
  });
});
