import { renderWithBrowserRouter, screen, userEvent } from 'testing/utils';
import type { MockStore } from 'redux-mock-store';
import configureStore from 'redux-mock-store';
import ComposeForm from '../../ComposeForm';
import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStoragePool as podStoragePoolFactory,
  podStoragePoolResource as podStoragePoolResourceFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from 'testing/factories';
import { waitFor } from '@testing-library/react';

const mockStore = configureStore();

const generateWrapper = (store: MockStore, pod: Pod) =>
  renderWithBrowserRouter(<ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />, { route: `/kvm/${pod.id}`, store });

describe('PoolSelect', () => {
  let state: RootState;

  beforeEach(() => {
    const pod = podDetailsFactory({ id: 1 });

    state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        items: [pod],
        loaded: true,
        statuses: { [pod.id]: podStatusFactory() },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      space: spaceStateFactory({
        loaded: true,
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: 'success' }),
      }),
    });
  });

  it(`correctly calculates allocated, requested, free and total space, where
    free space is rounded down`, async () => {
    const pool = podStoragePoolFactory({ name: 'pool' });
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: pool.id,
      storage_pools: [pool],
      resources: podResourcesFactory({
        storage_pools: {
          [pool.name]: podStoragePoolResourceFactory({
            allocated_other: 4000000000, // 4GB
            allocated_tracked: 6000000000, // 6GB
            total: 19999000000, // 19.999GB
          }),
        },
      }),
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const { container } = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 5GB
    const diskSizeInput = screen.getByRole('textbox', { name: /size/i });
    userEvent.clear(diskSizeInput);
    userEvent.type(diskSizeInput, '5');
    const poolSelectToggle = screen.getByRole('button', { name: /pool/i });
    userEvent.click(poolSelectToggle);
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    userEvent.click(screen.getByText(pool.name));
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    await waitFor(() => expect(container).toMatchSnapshot());

    // Allocated = 10GB
    expect(screen.getByTestId('allocated')).toHaveTextContent('10GB');
    // Requested = 5GB
    expect(screen.getByTestId('requested')).toHaveTextContent('5GB');
    // Free = available - requested = 9.999 - 5 = 4.999 rounded down = 4.99GB
    expect(screen.getByTestId('free')).toHaveTextContent('4.99GB');
    // Total = 19.999GB rounded automatically = 20GB
    expect(screen.getByTestId('total')).toHaveTextContent('20GB');
  });

  it('shows a tick next to the selected pool', async () => {
    const [defaultPool, otherPool] = [
      podStoragePoolFactory({ name: 'default' }),
      podStoragePoolFactory({ name: 'other' }),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: defaultPool.id,
      resources: podResourcesFactory({
        storage_pools: {
          [defaultPool.name]: podStoragePoolResourceFactory({
            allocated_other: 1000000000000,
            allocated_tracked: 2000000000000,
            total: 6000000000000,
          }),
          [otherPool.name]: podStoragePoolResourceFactory({
            allocated_other: 1000000000000,
            allocated_tracked: 2000000000000,
            total: 6000000000000,
          }),
        },
      }),
      storage_pools: [defaultPool, otherPool],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const { container } = generateWrapper(store, pod);

    // Open PoolSelect dropdown
    const poolSelectToggle = screen.getByRole('button', { name: /pool/i });
    userEvent.click(poolSelectToggle);
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    await waitFor(() => expect(container).toMatchSnapshot());

    // defaultPool should be selected by default
    expect(screen.getByTestId(`kvm-pool-select-${defaultPool.name}`)).toHaveClass('p-icon--tick');
    expect(screen.getByTestId(`kvm-pool-select-${otherPool.name}`)).not.toHaveClass('p-icon--tick');

    // Select other pool
    userEvent.click(screen.getByText(otherPool.name));
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    await waitFor(() => expect(container).toMatchSnapshot());

    // otherPool should now be selected
    expect(screen.getByTestId(`kvm-pool-select-${defaultPool.name}`)).not.toHaveClass('p-icon--tick');
    expect(screen.getByTestId(`kvm-pool-select-${otherPool.name}`)).toHaveClass('p-icon--tick');
  });

  it('disables a pool that does not have enough space for disk, with warning', async () => {
    const [poolWithSpace, poolWithoutSpace] = [
      podStoragePoolFactory({ name: 'pool-with-space' }),
      podStoragePoolFactory({ name: 'pool-without-space' }),
    ];
    const pod = podDetailsFactory({
      id: 1,
      default_storage_pool: poolWithSpace.id,
      resources: podResourcesFactory({
        storage_pools: {
          [poolWithSpace.name]: podStoragePoolResourceFactory({
            allocated_other: 0,
            allocated_tracked: 0,
            total: 100000000000, // 100GB free
          }),
          [poolWithoutSpace.name]: podStoragePoolResourceFactory({
            allocated_other: 0,
            allocated_tracked: 90000000000,
            total: 100000000000, // 10GB free
          }),
        },
      }),
      storage_pools: [poolWithSpace, poolWithoutSpace],
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const { container } = generateWrapper(store, pod);

    // Open PoolSelect dropdown and change disk size to 50GB
    const diskSizeInput = screen.getByRole('textbox', { name: /