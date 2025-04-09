import configureStore from "redux-mock-store";

import DeleteSubnet from "./DeleteSubnet";

import urls from "@/app/base/urls";
import { subnetActions } from "@/app/store/subnet";
import { vlanActions } from "@/app/store/vlan";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

const subnetId = 1;
const getRootState = () => {
  return factory.rootState({
    subnet: factory.subnetState({
      items: [
        factory.subnetDetails({
          id: subnetId,
          vlan: 1,
        }),
      ],
      loading: false,
      loaded: true,
    }),
    vlan: factory.vlanState({
      items: [
        factory.vlan({
          id: 1,
          dhcp_on: true,
        }),
      ],
      loading: false,
      loaded: true,
    }),
  });
};

it("displays a correct error message for a subnet with IPs obtained through DHCP", () => {
  const state = getRootState();
  state.subnet.items = [
    factory.subnetDetails({
      id: subnetId,
      ip_addresses: [factory.subnetIP()],
      vlan: 1,
    }),
  ];
  const store = configureStore()(state);
  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    { store, initialEntries: [urls.subnets.subnet.index({ id: subnetId })] }
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).getByText(
      /This subnet cannot be deleted as there are nodes that have an IP address obtained through DHCP services on this subnet./
    )
  ).toBeInTheDocument();
});

it("displays a message if DHCP is disabled on the VLAN", () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    { store, initialEntries: [urls.subnets.subnet.index({ id: subnetId })] }
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).getByText(
      /Beware IP addresses on devices on this subnet might not be retained/
    )
  ).toBeInTheDocument();
});

it("does not display a message if DHCP is enabled on the VLAN", () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = true;
  const store = configureStore()(state);
  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    { store, initialEntries: [urls.subnets.subnet.index({ id: subnetId })] }
  );
  const deleteSubnetSection = screen.getByRole("region", {
    name: /Delete subnet?/,
  });

  expect(
    within(deleteSubnetSection).queryByText(
      /Beware IP addresses on devices on this subnet might not be retained/
    )
  ).not.toBeInTheDocument();
});

it("dispatches an action to load vlans and subnets if not loaded", () => {
  const state = getRootState();
  state.vlan.loaded = false;
  state.subnet.loaded = false;
  const store = configureStore()(state);
  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    { store, initialEntries: [urls.subnets.subnet.index({ id: subnetId })] }
  );
  const expectedActions = [vlanActions.fetch(), subnetActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches a delete action on submit", async () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;
  const store = configureStore()(state);
  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    { store, initialEntries: [urls.subnets.subnet.index({ id: subnetId })] }
  );

  expect(
    screen.getByText(/Are you sure you want to delete this subnet?/)
  ).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

  const expectedAction = subnetActions.delete(subnetId);
  const actualAction = store
    .getActions()
    .find((actualAction) => actualAction.type === expectedAction.type);
  expect(actualAction).toStrictEqual(expectedAction);
});

it("redirects on save", async () => {
  const state = getRootState();
  state.vlan.items[0].dhcp_on = false;

  renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    {
      state,
      initialEntries: [urls.subnets.subnet.index({ id: subnetId })],
    }
  );

  state.subnet.saved = true;

  const { router } = renderWithProviders(
    <DeleteSubnet setSidePanelContent={vi.fn()} subnetId={subnetId} />,
    {
      state,
      initialEntries: [urls.subnets.subnet.index({ id: subnetId })],
    }
  );

  await waitFor(() => {
    expect(router.state.location.pathname).toEqual(urls.subnets.index);
  });
});
