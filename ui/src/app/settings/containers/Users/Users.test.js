import { shallow } from "enzyme";
import React from "react";
import { Users } from "./Users";

describe("Users", () => {
  it("can render", () => {
    const wrapper = shallow(
      <Users
        authUser={{
          email: "test@example.com",
          first_name: "",
          global_permissions: ["machine_create"],
          id: 1,
          is_superuser: true,
          last_name: "",
          sshkeys_count: 0,
          username: "admin"
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
