import { shallow } from "enzyme";
import React from "react";

import TableActions from "./TableActions";

describe("TableActions ", () => {
  it("renders a copy button if copy value provided", () => {
    const wrapper = shallow(<TableActions copyValue="foo" />);
    expect(wrapper.find("CopyButton").exists()).toBe(true);
  });

  it("renders an edit link if edit path provided", () => {
    const wrapper = shallow(<TableActions editPath="/bar" />);
    expect(wrapper.find("Button").props().to).toBe("/bar");
  });

  it("renders a delete button if delete function provided", () => {
    const onDelete = jest.fn();
    const wrapper = shallow(<TableActions onDelete={onDelete} />);
    expect(wrapper.find("Button .p-icon--delete").exists()).toBe(true);
    wrapper.find("Button").simulate("click");
    expect(onDelete).toHaveBeenCalled();
  });

  it("correctly renders tooltips", () => {
    const wrapper = shallow(
      <TableActions
        deleteTooltip="delete tooltip"
        editPath="/bar"
        editTooltip="edit tooltip"
        onDelete={jest.fn()}
      />
    );
    expect(wrapper.find("Tooltip").at(0).props().message).toBe("edit tooltip");
    expect(wrapper.find("Tooltip").at(1).props().message).toBe(
      "delete tooltip"
    );
  });

  it("correctly disables buttons", () => {
    const wrapper = shallow(
      <TableActions
        deleteDisabled
        editDisabled
        editPath="/bar"
        onDelete={jest.fn()}
      />
    );
    expect(wrapper.find("Button").at(0).props().disabled).toBe(true);
    expect(wrapper.find("Button").at(1).props().disabled).toBe(true);
  });
});
