import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import ActionForm from "app/base/components/ActionForm";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterEventError as vmClusterEventErrorFactory,
  vmClusterState as vmClusterStateFactory,
  vmClusterStatuses as vmClusterStatusesFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("DeleteForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can show the processing status when deleting the given pod", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="saving-label"]').text()).toBe(
      "Removing KVM..."
    );
  });

  it("can show the processing status when deleting the given cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: true,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="saving-label"]').text()).toBe(
      "Removing cluster..."
    );
  });

  it("shows a decompose checkbox if deleting a LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FormikField[name='decompose']").exists()).toBe(true);
  });

  it("shows a decompose checkbox if deleting a cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FormikField[name='decompose']").exists()).toBe(true);
  });

  it("does not show a decompose checkbox if deleting a non-LXD pod", async () => {
    const pod = podFactory({ id: 1, type: PodType.VIRSH });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FormikField[name='decompose']").exists()).toBe(false);
  });

  it("correctly dispatches actions to delete given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
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
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
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

  it("correctly dispatches actions to delete a cluster", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").simulate("submit");
    await waitForComponentToPaint(wrapper);
    expect(
      store.getActions().find((action) => action.type === "vmcluster/delete")
    ).toStrictEqual({
      type: "vmcluster/delete",
      meta: {
        model: "vmcluster",
        method: "delete",
      },
      payload: {
        params: {
          decompose: false,
          id: cluster.id,
        },
      },
    });
  });

  it("sets the form to saved when a cluster has been deleted", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = ({ clearHeaderContent = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={clearHeaderContent} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    const status = jest.spyOn(vmClusterSelectors, "status");
    // Update the component to the state where the cluster is being deleted.
    status.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the cluster has finished being deleted.
    status.mockReturnValue(false);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(true);
  });

  it("sets the form to saved when a pod has been deleted", async () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = ({ clearHeaderContent = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={clearHeaderContent} hostId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the pod is being deleted.
    const podsDeleting = jest.spyOn(podSelectors, "deleting");
    podsDeleting.mockReturnValue([pod]);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the pod has finished being deleted.
    podsDeleting.mockReturnValue([]);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(true);
  });

  it("clusters do not get marked as deleted if there is an error", async () => {
    const cluster = vmClusterFactory({ id: 1 });
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        statuses: vmClusterStatusesFactory({
          deleting: false,
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = ({ clearHeaderContent = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={clearHeaderContent} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    const status = jest.spyOn(vmClusterSelectors, "status");
    const eventError = jest.spyOn(vmClusterSelectors, "eventError");
    // Update the component to the state where the cluster is being deleted.
    status.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the cluster has finished being deleted.
    status.mockReturnValue(false);
    eventError.mockReturnValue([
      vmClusterEventErrorFactory({
        error: "Uh oh",
        event: "delete",
      }),
    ]);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
  });

  it("pods do not get marked as deleted if there is an error", async () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = ({ clearHeaderContent = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={clearHeaderContent} hostId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the pod is being deleted.
    const podsDeleting = jest.spyOn(podSelectors, "deleting");
    const errors = jest.spyOn(podSelectors, "errors");
    podsDeleting.mockReturnValue([pod]);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
    // Update the component to the state where the pod has finished being deleted.
    podsDeleting.mockReturnValue([]);
    errors.mockReturnValue("Uh oh");
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    expect(wrapper.find(ActionForm).prop("saved")).toBe(false);
  });
});
