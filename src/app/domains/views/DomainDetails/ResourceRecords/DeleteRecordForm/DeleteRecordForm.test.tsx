import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeleteRecordForm, {
  Labels as DeleteRecordFormLabels,
} from "./DeleteRecordForm";

import { actions as domainActions } from "app/store/domain";
import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  domainResource as resourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("DeleteRecordForm", () => {
  it("closes the form when Cancel button is clicked", async () => {
    const resource = resourceFactory();
    const domain = domainFactory({ id: 1, rrsets: [resource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const closeForm = jest.fn();

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
      resourceFactory({ dnsresource_id: 123, name: "resource" }),
      resourceFactory({ dnsresource_id: 123, name: "other-resource" }),
    ];
    const domain = domainFactory({ id: 1, rrsets: [resource, otherResource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeleteRecordForm
              closeForm={jest.fn()}
              id={1}
              resource={resource}
            />
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
    const resource = resourceFactory();
    const domain = domainFactory({ id: 1, rrsets: [resource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DeleteRecordForm
              closeForm={jest.fn()}
              id={1}
              resource={resource}
            />
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
