import { renderWithBrowserRouter, screen, waitFor } from 'testing/utils';
import type { MockStore } from 'redux-mock-store';
import configureStore from 'redux-mock-store';
import ComposeForm from '../../ComposeForm';
import type { PowerType } from 'app/store/general/types';
import type { MenuLink } from './SubnetSelect';
import type { Pod } from 'app/store/pod/types';
import type { RootState } from 'app/store/root/types';
import {
  domainState as domainStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from 'testing/factories';

const mockStore = configureStore();

const generateWrapper = (store: MockStore, pod: Pod) =>
  renderWithBrowserRouter(
    <ComposeForm clearSidePanelContent={jest.fn()} hostId={pod.id} />,
    { route: `/kvm/${pod.id}`, store }
  );

describe('SubnetSelect', () => {
  let initialState: RootState;

  beforeEach(() => {
    const pod = podDetailsFactory({ id: 1 });

    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()] as PowerType[],
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

  it('groups subnets by space if a space is not yet selected', async () => {
    const spaces = [
      spaceFactory({ name: 'Outer' }),
      spaceFactory({ name: 'Safe' }),
    ];
    const subnets = [
      subnetFactory({ space: spaces[0].id, vlan: 1 }),
      subnetFactory({ space: spaces[0].id, vlan: 1 }),
      subnetFactory({ space: spaces[1].id, vlan: 1 }),
    ];
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = spaces;
    state.subnet.items = subnets;
    const store = mockStore(state);
    const { getByRole } = generateWrapper(store, pod);

    // Click 'Define' button
    userEvent.click(getByRole('button', { name: /define/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    const links = (screen.getAllByRole(
      'menuitem'
    ) as HTMLAnchorElement[]).map((link) => link.textContent);

    // 'Space: Outer' + outer subnets + 'Space: Safe' + safe subnets
    expect(links).toHaveLength(5);
    expect(links[0]).toBe('Space: Outer');
    expect(links[3]).toBe('Space: Safe');
  });

  it('filters subnets by selected space', async () => {
    const space = spaceFactory();
    const [subnetInSpace, subnetNotInSpace] = [
      subnetFactory({ space: space.id, vlan: 1 }),
      subnetFactory({ space: null, vlan: 1 }),
    ];
    const pod = podDetailsFactory({
      attached_vlans: [1],
      boot_vlans: [1],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [subnetInSpace, subnetNotInSpace];
    const store = mockStore(state);
    const { getByRole } = generateWrapper(store, pod);

    // Click 'Define' button
    userEvent.click(getByRole('button', { name: /define/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    const links = (screen.getAllByRole(
      'menuitem'
    ) as HTMLAnchorElement[]).map((link) => link.textContent);

    const filteredLinks = links.filter((link) => !link.startsWith('Space: '));
    expect(filteredLinks).toHaveLength(2);

    // Choose the space in state from the dropdown
    // Only the subnet in the selected space should be available
    userEvent.selectOptions(
      getByRole('combobox', { name: /interface 1 space/i }),
      `${space.id}`
    );

    const linksAfterSelect = (screen.getAllByRole(
      'menuitem'
    ) as HTMLAnchorElement[]).map((link) => link.textContent);

    const filteredLinksAfterSelect = linksAfterSelect.filter(
      (link) => !link.startsWith('Space: ')
    );
    expect(filteredLinksAfterSelect).toHaveLength(1);
  });

  it('shows an error if multiple interfaces defined without at least one PXE network', async () => {
    const fabric = fabricFactory();
    const space = spaceFactory();
    const pxeVlan = vlanFactory({ fabric: fabric.id, id: 1 });
    const nonPxeVlan = vlanFactory({ fabric: fabric.id, id: 2 });
    const pxeSubnet = subnetFactory({ name: 'pxe', vlan: pxeVlan.id });
    const nonPxeSubnet = subnetFactory({
      name: 'non-pxe',
      vlan: nonPxeVlan.id,
    });
    const pod = podDetailsFactory({
      attached_vlans: [pxeVlan.id, nonPxeVlan.id],
      boot_vlans: [pxeVlan.id],
      id: 1,
    });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [pxeSubnet, nonPxeSubnet];
    state.vlan.items = [pxeVlan, nonPxeVlan];
    const store = mockStore(state);
    const { getByRole, getByTestId, queryByTestId } = generateWrapper(
      store,
      pod
    );

    // Click 'Define' button
    userEvent.click(getByRole('button', { name: /define/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    // Add a second interface
    userEvent.click(getByRole('button', { name: /add interface/i }));

    // Select non-PXE network for the first interface
    userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`subnet select 1 attach network`, 'i'),
      })
    );
    userEvent.click(screen.getByRole('menuitem', { name: /non-pxe/i }));

    //