import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import FormikFormContent from "app/base/components/FormikFormContent";
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
    expect(wrapper.find("FormikFormContent").prop("saving")).toBe(true);
    expect(wrapper.find('[data-testid="saving-label"]').text()).toBe(
      "Removing KVM host..."
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
    expect(wrapper.find("FormikFormContent").prop("saving")).toBe(true);
    expect(wrapper.find('[data-testid="saving-label"]').text()).toBe(
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

  it("sets the form to saved when a cluster has been deleted", () => {
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
    const Proxy = () => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);

    // Cluster is being deleted - form shouldn't be saved yet.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);

    // Mock the change from deleting the cluster to no longer deleting the
    // cluster, then rerender the component.
    jest.spyOn(vmClusterSelectors, "status").mockReturnValue(false);
    wrapper.setProps({});
    wrapper.update();

    // Form should have saved successfully.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(true);
  });

  it("sets the form to saved when a pod has been deleted", () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);

    // Pod is being deleted - form shouldn't be saved yet.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);

    // Mock the change from deleting the pod to no longer deleting the pod, then
    // rerender the component.
    jest.spyOn(podSelectors, "deleting").mockReturnValue([]);
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    wrapper.update();

    // Form should have saved successfully.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(true);
  });

  it("clusters do not get marked as deleted if there is an error", () => {
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
    const Proxy = () => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} clusterId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);

    // Cluster is being deleted - form shouldn't be saved yet.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);

    // Mock the change from deleting the cluster to no longer deleting the
    // cluster including an error, then rerender the component.
    jest.spyOn(vmClusterSelectors, "status").mockReturnValue(false);
    jest.spyOn(vmClusterSelectors, "eventError").mockReturnValue([
      vmClusterEventErrorFactory({
        error: "Uh oh",
        event: "delete",
      }),
    ]);
    wrapper.setProps({});
    wrapper.update();

    // Form should not have saved successfully.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);
  });

  it("pods do not get marked as deleted if there is an error", () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ deleting: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm clearHeaderContent={jest.fn()} hostId={1} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);

    // Pod is being deleted - form shouldn't be saved yet.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);

    // Mock the change from deleting the pod to no longer deleting the pod
    // including an error, then rerender the component.
    jest.spyOn(podSelectors, "deleting").mockReturnValue([]);
    jest.spyOn(podSelectors, "errors").mockReturnValue("Uh oh");
    wrapper.setProps({ clearHeaderContent: jest.fn() });
    wrapper.update();

    // Form should not have saved successfully.
    expect(wrapper.find(FormikFormContent).prop("saved")).toBe(false);
  });
});
