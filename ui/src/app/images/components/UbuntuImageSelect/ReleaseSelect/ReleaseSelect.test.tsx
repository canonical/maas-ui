import { mount } from "enzyme";

import ReleaseSelect from "./ReleaseSelect";

import { bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory } from "testing/factories";

describe("ReleaseSelect", () => {
  it("separates ubuntu releases by LTS and non-LTS, sorted descending by title", () => {
    const releases = [
      bootResourceUbuntuReleaseFactory({
        name: "hirsute",
        title: "21.04",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "bionic",
        title: "18.04 LTS",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "groovy",
        title: "20.10",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "xenial",
        title: "16.04 LTS",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "impish",
        title: "21.10",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "focal",
        title: "20.04 LTS",
      }),
    ];
    const wrapper = mount(
      <ReleaseSelect
        releases={releases}
        selectedRelease="focal"
        setSelectedRelease={jest.fn()}
      />
    );

    const getLabel = (dataTest: string, pos: number) =>
      wrapper.find(`[data-test='${dataTest}'] Input`).at(pos).prop("label");

    expect(getLabel("lts-releases", 0)).toBe("20.04 LTS");
    expect(getLabel("lts-releases", 1)).toBe("18.04 LTS");
    expect(getLabel("lts-releases", 2)).toBe("16.04 LTS");
    expect(getLabel("non-lts-releases", 0)).toBe("21.10");
    expect(getLabel("non-lts-releases", 1)).toBe("21.04");
    expect(getLabel("non-lts-releases", 2)).toBe("20.10");
  });

  it("can set the selected release", () => {
    const setSelectedRelease = jest.fn();
    const releases = [
      bootResourceUbuntuReleaseFactory({
        name: "focal",
        title: "20.04",
      }),
      bootResourceUbuntuReleaseFactory({
        name: "bionic",
        title: "18.04",
      }),
    ];
    const wrapper = mount(
      <ReleaseSelect
        releases={releases}
        selectedRelease="focal"
        setSelectedRelease={setSelectedRelease}
      />
    );

    wrapper
      .find("input[id='release-bionic']")
      .simulate("change", { target: { checked: true, id: "release-bionic" } });

    expect(setSelectedRelease).toHaveBeenCalledWith("bionic");
  });
});
