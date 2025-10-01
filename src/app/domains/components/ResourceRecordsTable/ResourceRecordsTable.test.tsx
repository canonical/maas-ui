import ResourceRecordsTable from "./ResourceRecordsTable";

import type { DomainDetails } from "@/app/store/domain/types";
import { RecordType } from "@/app/store/domain/types";
import { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";
import configureStore from "redux-mock-store";

const mockStore = configureStore<RootState>();
let state = factory.rootState();
const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

describe("ResourceRecordsTable", () => {
  let items: DomainDetails = factory.domainDetails();
  const store = mockStore(state);
  beforeEach(() => {
    items = factory.domainDetails({
      id: 1,
      name: "b",
      is_default: true,
      rrsets: [
        {
          name: "abc",
          ttl: 20,
          system_id: "1",
          user_id: null,
          dnsdata_id: 1,
          dnsresource_id: 100,
          node_type: 0,
          rrdata: "",
          rrtype: RecordType.A,
        },
      ],
    });
  });

  it("renders the right columns", () => {
    renderWithProviders(<ResourceRecordsTable domain={items} id={1} />);
    ["Name", "Type", "TTL", "Data", "Actions"].forEach((column) => {
      expect(
        screen.getByRole("columnheader", {
          name: new RegExp(`^${column}`, "i"),
        })
      ).toBeInTheDocument();
    });
  });

  it("disables action dropdown when id is auto-generated", async () => {
    items.rrsets[0].dnsresource_id = null;

    renderWithProviders(<ResourceRecordsTable domain={items} id={1} />, {
      store,
    });
    const dropdownBtn = screen.getByRole("button", { name: "Toggle menu" });

    await waitFor(() => {
      expect(dropdownBtn).toHaveClass("is-disabled");
    });
    await userEvent.hover(dropdownBtn);
    await waitFor(() => {
      expect(
        screen.queryByRole("tooltip", {
          name: "System-generated records cannot be edited",
        })
      );
    });
  });

  it("disables action dropdown when id isn't auto-generated and user is not a superuser", async () => {
    items.rrsets[0].dnsresource_id = null;
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.user({ is_superuser: false })
      )
    );
    renderWithProviders(<ResourceRecordsTable domain={items} id={1} />, {
      store,
    });
    const dropdownBtn = screen.getByRole("button", { name: "Toggle menu" });
    await waitFor(() => {
      expect(dropdownBtn).toHaveClass("is-disabled");
    });
    await userEvent.hover(dropdownBtn);
    await waitFor(() => {
      expect(
        screen.queryByRole("tooltip", {
          name: "You do not have permission to edit this record",
        })
      );
    });
  });

  it("enables action dropdown only when user is a superuser and tag is not system-generated", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(factory.user({ is_superuser: true }))
    );
    items.rrsets[0].dnsresource_id = 50;
    renderWithProviders(<ResourceRecordsTable domain={items} id={1} />, {
      store,
    });
    screen.debug();
    expect(screen.getByRole("button", { name: "Toggle menu" })).not.toHaveClass(
      "is-disabled"
    );

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
