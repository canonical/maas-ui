import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import { UserForm } from "./UserForm";

import {
  rootState as rootStateFactory,
  user as userFactory,
} from "testing/factories";
import { submitFormikForm, render, screen } from "testing/utils";

const mockStore = configureStore();

describe("UserForm", () => {
  let state;
  let user;

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
    render(<UserForm onSave={jest.fn()} />, { store, route: "/" });
    expect(screen.getByTestId("userForm")).toBeInTheDocument();
  });

  it("can handle saving", async () => {
    const store = mockStore(state);
    const onSave = jest.fn();
    render(<UserForm onSave={onSave} user={user} />, { store, route: "/" });

    await submitFormikForm(screen.getByTestId("userForm"), {
      isSuperuser: true,
      email: "test@example.com",
      fullName: "Miss Wallaby",
      password: "test1234",
      passwordConfirm: "test1234",
      username: "admin",
    });
    expect(onSave).toHaveBeenCalledWith({
      email: "test@example.com",
      isSuperuser: true,
      fullName: "Miss Wallaby",
      password: "test1234",
      passwordConfirm: "test1234",
      username: "admin",
    });
  });

  it("hides the password fields when editing", async () => {
    const store = mockStore(state);
    render(<UserForm onSave={jest.fn()} user={user} />, {
      store,
      route: "/settings/users",
    });
    expect(screen.getByText("Change password…")).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });

  it("can toggle the password fields", () => {
    const store = mockStore(state);
    render(<UserForm onSave={jest.fn()} user={user} />, {
      store,
      route: "/settings/users",
    });
    expect(screen.queryAllByLabelText("Password")).toHaveLength(0);
    userEvent.click(screen.getByTestId("toggle-passwords"));
    expect(screen.queryAllByLabelText("Password")).toHaveLength(2);
  });

  it("can show the current password field", () => {
    const store = mockStore(state);
    render(<UserForm includeCurrentPassword onSave={jest.fn()} user={user} />, {
      store,
      route: "/settings/users",
    });
    userEvent.click(screen.getByTestId("toggle-passwords"));
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
  });

  it("can include auth errors in the error status", () => {
    state.user.errors = {
      username: ["Username already exists"],
    };
    state.user.auth.errors = {
      password: ["Password too short"],
    };
    const store = mockStore(state);
    render(<UserForm includeCurrentPassword onSave={jest.fn()} user={user} />, {
      store,
      route: "/settings/users",
    });
    expect(screen.getByText("Username already exists")).toBeInTheDocument();
    expect(screen.getByText("Password too short")).toBeInTheDocument();
  });

  it("disables fields when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    render(<UserForm onSave={jest.fn()} />, {
      store,
      route: "/settings/users",
    });
    expect(screen.getAllByLabelText("Email")[0]).toBeDisabled();
  });

  it("hides the password fields on save", async () => {
    const store = mockStore(state);
    const Proxy = ({ onSave = jest.fn() }) => (
      <UserForm onSave={onSave} user={user} />
    );
    const { rerender } = render(<Proxy />, { store, route: "/settings/users" });
    userEvent.click(screen.getByTestId("toggle-passwords"));
    expect(screen.queryAllByLabelText("Password")).toHaveLength(2);
    jest
      .spyOn(global, "location", "get")
      .mockReturnValue({ href: "http://localhost:3000" });
    jest.spyOn(require("react-redux"), "useSelector").mockReturnValue(true);
    await rerender(<Proxy onSave={jest.fn()} user={user} />);
    expect(screen.queryAllByLabelText("Password")).not.toBeInTheDocument();
  });

  it("does not hides the password fields when there are save errors", async () => {
    state.user.errors = "Uh oh!";
    const store = mockStore(state);
    const Proxy = ({ onSave = jest.fn() }) => (
      <UserForm onSave={onSave} user={user} />
    );
    const { rerender } = render(<Proxy />, { store, route: "/settings/users" });
    userEvent.click(screen.getByTestId("toggle-passwords"));
    expect(screen.queryAllByLabelText("Password")).toHaveLength(2);
    await rerender(<Proxy onSave={jest.fn()} user={user} />);
    expect(screen.queryAllByLabelText("Password")).toHaveLength(2);
  });
});
