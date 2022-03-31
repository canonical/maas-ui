import { mount, shallow } from "enzyme";

import type { Tag } from "./TagSelector";
import TagSelector from "./TagSelector";

describe("TagSelector", () => {
  let tags: Tag[];
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
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("tag1");
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
    component.find('[data-testid="existing-tag"]').at(0).simulate("click");
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("tag1");
  });

  it("can hide the tags that have been selected", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        showSelectedTags={false}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component.find('[data-testid="existing-tag"]').at(0).simulate("click");
    expect(component.find('[data-testid="selected-tag"] span').exists()).toBe(
      false
    );
    expect(component.find(".tag-selector__selected-list").exists()).toBe(false);
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
    expect(component.find('[data-testid="selected-tag"]').length).toBe(2);
    component.find(".tag-selector__input").simulate("focus");
    component.find('[data-testid="selected-tag"]').at(0).simulate("click");
    expect(component.find('[data-testid="selected-tag"]').length).toBe(1);
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("tag2");
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
    component.find('[data-testid="new-tag"]').simulate("click");
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("new-tag");
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
    component.find('[data-testid="new-tag"]').simulate("click");
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("tag-with-spaces");
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
    expect(component.find('[data-testid="existing-tag"]').length).toBe(3);
    component
      .find(".tag-selector__input")
      .simulate("change", { target: { value: "tag" } });
    expect(component.find('[data-testid="existing-tag"]').length).toBe(2);
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
      component.find('[data-testid="existing-tag"] > span').at(0).text()
    ).toBe("there");
    expect(
      component.find('[data-testid="existing-tag"] > span em').at(0).text()
    ).toBe("the");
    expect(
      component.find('[data-testid="existing-tag"] > span').at(1).text()
    ).toBe("other");
    expect(
      component.find('[data-testid="existing-tag"] > span em').at(1).text()
    ).toBe("the");
  });

  it("can disable tags", () => {
    const tags = [
      { id: 1, name: "enabledTag" },
      { id: 2, name: "disabledTag" },
    ];
    const component = shallow(
      <TagSelector
        disabledTags={[{ id: 2, name: "disabledTag" }]}
        initialSelected={tags}
        tags={tags}
      />
    );

    expect(
      component.find('[data-testid="selected-tag"]').at(0).prop("disabled")
    ).toBe(false);
    expect(
      component.find('[data-testid="selected-tag"]').at(1).prop("disabled")
    ).toBe(true);
  });

  it("can display a dropdown header", () => {
    const component = shallow(
      <TagSelector
        header={<span data-testid="dropdown-header"></span>}
        label="Tags"
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        showSelectedTags={false}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    const header = component.find(".tag-selector__dropdown");
    expect(header.exists()).toBe(true);
    expect(header.find("[data-testid='dropdown-header']").exists()).toBe(true);
  });

  it("can customise the dropdown items", () => {
    const component = shallow(
      <TagSelector
        label="Tags"
        generateDropdownEntry={() => <span data-testid="dropdown-item"></span>}
        placeholder="Select or create tags"
        onTagsUpdate={jest.fn()}
        showSelectedTags={false}
        tags={tags}
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    expect(
      component
        .find(".tag-selector__dropdown-button [data-testid='dropdown-item']")
        .exists()
    ).toBe(true);
  });

  it("can use an external list of selected tags", () => {
    const component = shallow(
      <TagSelector
        externalSelectedTags={[tags[0]]}
        label="Tags"
        onTagsUpdate={jest.fn()}
        tags={tags}
        useExternalTags
      />
    );
    expect(
      component.find('[data-testid="selected-tag"] span').at(0).text()
    ).toBe("tag1");
  });

  it("handles selecting external tags", () => {
    const onTagsUpdate = jest.fn();
    const component = shallow(
      <TagSelector
        externalSelectedTags={[tags[0]]}
        label="Tags"
        onTagsUpdate={onTagsUpdate}
        tags={tags}
        useExternalTags
      />
    );
    component.find(".tag-selector__input").simulate("focus");
    component.find('[data-testid="existing-tag"]').at(0).simulate("click");
    expect(onTagsUpdate).toHaveBeenCalledWith([tags[0], tags[1]]);
  });
});
