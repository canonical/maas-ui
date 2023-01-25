import ReleaseSelect from "./ReleaseSelect";

import { bootResourceUbuntuRelease as bootResourceUbuntuReleaseFactory } from "testing/factories";
import { userEvent, screen, render } from "testing/utils";

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
    render(
      <ReleaseSelect
        releases={releases}
        selectedRelease="focal"
        setSelectedRelease={jest.fn()}
      />
    );

    const screen_releases = screen.getAllByRole("radio");

    expect(screen_releases[0]).toStrictEqual(
      screen.getByLabelText("20.04 LTS")
    );
    expect(screen_releases[1]).toStrictEqual(
      screen.getByLabelText("18.04 LTS")
    );
    expect(screen_releases[2]).toStrictEqual(
      screen.getByLabelText("16.04 LTS")
    );
    expect(screen_releases[3]).toStrictEqual(screen.getByLabelText("21.10"));
    expect(screen_releases[4]).toStrictEqual(screen.getByLabelText("21.04"));
    expect(screen_releases[5]).toStrictEqual(screen.getByLabelText("20.10"));
  });

  it("can set the selected release", async () => {
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
    render(
      <ReleaseSelect
        releases={releases}
        selectedRelease="focal"
        setSelectedRelease={setSelectedRelease}
      />
    );

    await userEvent.click(screen.getByRole("radio", { name: "18.04" }));

    expect(setSelectedRelease).toHaveBeenCalledWith("bionic");
  });
});
