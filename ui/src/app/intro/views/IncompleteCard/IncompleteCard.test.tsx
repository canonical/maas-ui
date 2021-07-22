import { mount } from "enzyme";

import IncompleteCard from "./IncompleteCard";

describe("IncompleteCard", () => {
  it("renders", () => {
    const wrapper = mount(<IncompleteCard />);
    expect(wrapper).toMatchSnapshot();
  });
});
