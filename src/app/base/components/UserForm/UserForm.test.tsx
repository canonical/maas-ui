import { UserForm } from "./UserForm";

import type { RootState } from "app/store/root/types";
import userSelectors from "app/store/user/selectors";
import type { User } from "app/store/user/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
  user as userFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

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
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("can render", () => {
    renderWithBrowserRouter(<UserForm onSave={jest.fn()} />, {
      route: "/",
      state,
    });
    expect(
      screen.getByRole("textbox", { name: "Username" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Full name (optional)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email address" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password (again)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("can handle saving", async () => {
    const onSave = jest.fn();
    renderWithBrowserRouter(<UserForm onSave={onSave} user={user} />, {
      state,
      route: "/",
    });

    await userEvent.clear(
      screen.getByRole("textbox", { name: "Email address" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "test@example.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Change password/i })
    );

    await userEvent.type(screen.getByLabelText("Password"), "test1234");
    await userEvent.type(screen.getByLabelText("Password (again)"), "test1234");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

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
    renderWithBrowserRouter(<UserForm onSave={jest.fn()} user={user} />, {
      state,
      route: "/settings/users",
    });
    expect(
      screen.getByRole("button", { name: /Change password/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password (again)")).not.toBeInTheDocument();
  });

  it("can toggle the password fields", async () => {
    renderWithBrowserRouter(<UserForm onSave={jest.fn()} user={user} />, {
      state,
      route: "/settings/users",
    });
    // Fields should be hidden by default
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password (again)")).not.toBeInTheDocument();

    // Click button to change password
    await userEvent.click(
      screen.getByRole("button", { name: /Change password/i })
    );

    // Fields should be shown
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password (again)")).toBeInTheDocument();
  });

  it("can show the current password field", async () => {
    renderWithBrowserRouter(
      <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />,
      {
        state,
        route: "/settings/users",
      }
    );
    // Click button to change password
    await userEvent.click(
      screen.getByRole("button", { name: /Change password/i })
    );

    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
  });

  it("disables the submit button if there are errors", () => {
    state.user.errors = {
      username: ["Username already exists"],
    };
    state.user.auth.errors = {
      password: ["Password too short"],
    };
    renderWithBrowserRouter(
      <UserForm includeCurrentPassword onSave={jest.fn()} user={user} />,
      {
        state,
        route: "/settings/users",
      }
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("disables fields when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithBrowserRouter(<UserForm onSave={jest.fn()} />, {
      state,
      route: "/settings/users",
    });
    screen.getAllByRole("textbox").forEach((field) => {
      expect(field).toBeDisabled();
    });
  });

  it("hides the password fields on save", async () => {
    const { rerender } = renderWithBrowserRouter(
      <UserForm onSave={jest.fn()} user={user} />,
      {
        state,
        route: "/settings/users",
      }
    );
    // Click button to change password
    await userEvent.click(
      screen.getByRole("button", { name: /Change password/i })
    );

    // Fields should be shown
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password (again)")).toBeInTheDocument();

    jest.spyOn(userSelectors, "saved").mockReturnValue(true);

    rerender(<UserForm onSave={jest.fn()} user={user} />);

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password (again)")).not.toBeInTheDocument();
  });

  it("does not hides the password fields when there are save errors", async () => {
    state.user.errors = "oh no";
    const { rerender } = renderWithBrowserRouter(
      <UserForm onSave={jest.fn()} user={user} />,
      {
        state,
        route: "/settings/users",
      }
    );
    // Click button to change password
    await userEvent.click(
      screen.getByRole("button", { name: /Change password/i })
    );

    // Fields should be shown
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password (again)")).toBeInTheDocument();

    jest.spyOn(userSelectors, "saved").mockReturnValue(true);

    rerender(<UserForm onSave={jest.fn()} user={user} />);

    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Password (again)")).toBeInTheDocument();
  });
});
