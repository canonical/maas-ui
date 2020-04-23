import { mount, shallow } from "enzyme";
import React from "react";

import TagSelector from "./TagSelector";

describe("TagSelector", () => {
  let tags;
  beforeEach(() => {
    tags = [
      { displayName: "tag one", name: "tag1" },
      { displayName: "tag two", name: "tag2" },
    ];
  });

  // snapshot tests
  it("renders and matches the snapshot when closed", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it("renders and matches the snapshot when opened", () => {
    const component = mount(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    component.find("Label").first().simulate("click");
    expect(component).toMatchSnapshot();
  });

  it("renders and matches the snapshot with tag descriptions", () => {
    const component = mount(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={[
          { ...tags[0], description: "description one" },
          { ...tags[1], description: "description two" },
        ]}
      />
    );
    component.find("Label").first().simulate("click");
    expect(component).toMatchSnapshot();
  });

  // unit tests
  it("can have some tags preselected", () => {
    const component = shallow(
      <TagSelector
        initialSelected={[tags[0]]}
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    expect(component.find('[data-test="selected-tag"] span').at(0).text()).toBe(
      "tag1"
    );
  });

  it("opens the dropdown when input is focused", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    expect(component.find(".tag-selector__dropdown").exists()).toBe(false);
    component.find(".tag-selector__input").simulate("focus");
    expect(component.find(".tag-selector__dropdown").exists()).toBe(true);
  });

  it("can select existing tags from dropdown", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component.find('[data-test="existing-tag"]').at(0).simulate("click");
    expect(component.find('[data-test="selected-tag"] span').at(0).text()).toBe(
      "tag1"
    );
  });

  it("can remove tags that have been selected", () => {
    const component = shallow(
      <TagSelector
        initialSelected={tags}
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    expect(component.find('[data-test="selected-tag"]').length).toBe(2);
    component.find(".tag-selector__input").simulate("focus");
    component.find('[data-test="selected-tag"]').at(0).simulate("click");
    expect(component.find('[data-test="selected-tag"]').length).toBe(1);
    expect(component.find('[data-test="selected-tag"] span').at(0).text()).toBe(
      "tag2"
    );
  });

  it("can create and select a new tag", () => {
    const component = shallow(
      <TagSelector
        allowNewTags
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component
      .find(".tag-selector__input")
      .simulate("change", { target: { value: "new-tag" } });
    component.find('[data-test="new-tag"]').simulate("click");
    expect(component.find('[data-test="selected-tag"] span').at(0).text()).toBe(
      "new-tag"
    );
  });

  it("sanitises text when creating new tag", () => {
    const component = shallow(
      <TagSelector
        allowNewTags
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component
      .find(".tag-selector__input")
      .simulate("change", { target: { value: "tag with spaces" } });
    component.find('[data-test="new-tag"]').simulate("click");
    expect(component.find('[data-test="selected-tag"] span').at(0).text()).toBe(
      "tag-with-spaces"
    );
  });

  it("can filter tag list", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={[...tags, { displayName: "other", name: "other" }]}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    expect(component.find('[data-test="existing-tag"]').length).toBe(3);
    component
      .find(".tag-selector__input")
      .simulate("change", { target: { value: "tag" } });
    expect(component.find('[data-test="existing-tag"]').length).toBe(2);
  });

  it("can highlight what matches the filter in existing tags", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        tags={[
          { displayName: "there", name: "there" },
          { displayName: "other", name: "other" },
        ]}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component
      .find(".tag-selector__input")
      .simulate("change", { target: { value: "the" } });
    expect(
      component.find('[data-test="existing-tag"] > span').at(0).text()
    ).toBe("there");
    expect(
      component.find('[data-test="existing-tag"] > span em').at(0).text()
    ).toBe("the");
    expect(
      component.find('[data-test="existing-tag"] > span').at(1).text()
    ).toBe("other");
    expect(
      component.find('[data-test="existing-tag"] > span em').at(1).text()
    ).toBe("the");
  });
});
