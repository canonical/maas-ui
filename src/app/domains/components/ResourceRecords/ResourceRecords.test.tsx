import ResourceRecords, {
  Labels as ResourceRecordsLabels,
} from "./ResourceRecords";

import AddRecordForm from "@/app/domains/components/DomainDetailsHeader/AddRecordForm";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("ResourceRecords", () => {
  it("shows a message if domain has no records", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domainDetails({ id: 1, rrsets: [] })],
      }),
    });

    renderWithProviders(<ResourceRecords id={1} />, {
      state,
    });

    expect(
      screen.getByText(ResourceRecordsLabels.NoRecords)
    ).toBeInTheDocument();
  });

  it("displays a loading spinner with text when loading", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [],
        loading: true,
      }),
    });
    renderWithProviders(<ResourceRecords id={1} />, {
      state,
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("opens the Add record form when Add record is clicked", async () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domainDetails({ id: 1, rrsets: [] })],
      }),
    });
    renderWithProviders(<ResourceRecords id={1} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add record" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add record" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddRecordForm,
      title: "Add record",
      props: { id: 1 },
    });
  });

  it("disables the Add record button without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domainDetails({ id: 1, rrsets: [] })],
      }),
    });
    renderWithProviders(<ResourceRecords id={1} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add record" })
      ).toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: "Add record" }));
    expect(mockOpen).not.toHaveBeenCalled();
  });
});
