import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteRecordForm, {
  Labels as DeleteRecordFormLabels,
} from "./DeleteRecordForm";

import { domainActions } from "@/app/store/domain";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("DeleteRecordForm", () => {
  it("closes the form when Cancel button is clicked", async () => {
    const resource = factory.domainResource();
    const domain = factory.domainDetails({ id: 1, rrsets: [resource] });
    const state = factory.rootState({
      domain: factory.domainState({
        items: [domain],
      }),
    });
    const closeForm = vi.fn();

    renderWithBrowserRouter(
      <DeleteRecordForm
        closeForm={closeForm}
        id={domain.id}
        resource={resource}
      />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(closeForm).toHaveBeenCalled();
  });

  it("dispatches an action to delete one of many records that belong to a DNS resource", async () => {
    const [resource, otherResource] = [
      factory.domainResource({ dnsresource_id: 123, name: "resource" }),
      factory.domainResource({ dnsresource_id: 123, name: "other-resource" }),
    ];
    const domain = factory.domainDetails({
      id: 1,
      rrsets: [resource, otherResource],
    });
    const state = factory.rootState({
      domain: factory.domainState({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeleteRecordForm closeForm={vi.fn()} id={1} resource={resource} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await userEvent.click(
      screen.getByRole("button", { name: DeleteRecordFormLabels.SubmitLabel })
    );

    const expectedAction = domainActions.deleteRecord({
      deleteResource: false,
      domain: domain.id,
      rrset: resource,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/deleteRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("dispatches an action to delete the last record of a DNS resource", async () => {
    const resource = factory.domainResource();
    const domain = factory.domainDetails({ id: 1, rrsets: [resource] });
    const state = factory.rootState({
      domain: factory.domainState({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeleteRecordForm closeForm={vi.fn()} id={1} resource={resource} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: DeleteRecordFormLabels.SubmitLabel })
    );

    const expectedAction = domainActions.deleteRecord({
      deleteResource: true,
      domain: domain.id,
      rrset: resource,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/deleteRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
