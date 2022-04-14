import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { UserForm } from "./UserForm";

import type { RootState } from "app/store/root/types";
import userSelectors from "app/store/user/selectors";
import type { User } from "app/store/user/types";
import {
  rootState as rootStateFactory,
  user as userFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("UserForm", () => {
  let state: RootState;
  let user: User;

  beforeEach(() => {
    user = userFactory({
      email: "old@example.com",
      id: 808,
      is_superuser: true,
      last_name: "Miss Wallaby",
      username: "admin",
    });
    state = rootStateFactory();
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm onSave={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UserForm").exists()).toBe(true);
  });

  it("can handle saving", () => {
    const store = mockStore(state);
    const onSave = jest.fn();
    const resetForm = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm onSave={onSave} user={user} />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(
      wrapper,
      {
        isSuperuser: true,
        email: "test@example.com",
        fullName: "Miss Wallaby",
        password: "test1234",
        passwordConfirm: "test1234",
        username: "admin",
      },
      { resetForm }
    );
    expect(onSave.mock.calls[0][0]).toEqual({
      email: "test@example.com",
      isSuperuser: true,
      fullName: "Miss Wallaby",
      password: "test1234",
      passwordConfirm: "test1234",
      username: "admin",
    });
    expect(resetForm).toHaveBeenCalled();
  });

  it("hides the password fields when editing", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button").first().children().text()).toEqual(
      "Change password…"
    );
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
  });

  it("can toggle the password fields", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
    wrapper.find("Button").simulate("click");
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
  });

  it("can show the current password field", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button").simulate("click");
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("name") === "old_password"
      ).length
    ).toEqual(1);
  });

  it("can include auth errors in the error status", () => {
    state.user.errors = {
      username: ["Username already exists"],
    };
    state.user.auth.errors = {
      password: ["Password too short"],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikFormContent").prop("errors")).toEqual({
      username: ["Username already exists"],
      password: ["Password too short"],
    });
  });

  it("disables fields when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikField[disabled=true]").length).toEqual(
      wrapper.find("FormikField").length
    );
  });

  it("hides the password fields on save", () => {
    const store = mockStore(state);
    // Use a proxy component so that setProps can force a rerender of the inner component.
    const Proxy = ({ onSave = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={onSave} user={user} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    wrapper.find("button[data-testid='toggle-passwords']").simulate("click");
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
    jest.spyOn(userSelectors, "saved").mockReturnValue(true);
    // Force the component to rerender so the saved selector value gets picked up.
    wrapper.setProps({ onSave: jest.fn() });
    wrapper.update();
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
  });

  it("does not hides the password fields when there are save errors", () => {
    state.user.errors = "Uh oh!";
    const store = mockStore(state);
    // Use a proxy component so that setProps can force a rerender of the inner component.
    const Proxy = ({ onSave = jest.fn() }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UserForm onSave={onSave} user={user} />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    wrapper.find("button[data-testid='toggle-passwords']").simulate("click");
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
    jest.spyOn(userSelectors, "saved").mockReturnValue(true);
    // Force the component to rerender so the saved selector value gets picked up.
    wrapper.setProps({ onSave: jest.fn() });
    wrapper.update();
    expect(
      wrapper.findWhere(
        (n) => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
  });
});
