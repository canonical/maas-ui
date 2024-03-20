import ReleaseSelect from "./ReleaseSelect";

import * as factory from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

describe("ReleaseSelect", () => {
  it("separates ubuntu releases by LTS and non-LTS, sorted descending by title", () => {
    const releases = [
      factory.bootResourceUbuntuRelease({
        name: "hirsute",
        title: "21.04",
      }),
      factory.bootResourceUbuntuRelease({
        name: "bionic",
        title: "18.04 LTS",
      }),
      factory.bootResourceUbuntuRelease({
        name: "groovy",
        title: "20.10",
      }),
      factory.bootResourceUbuntuRelease({
        name: "xenial",
        title: "16.04 LTS",
      }),
      factory.bootResourceUbuntuRelease({
        name: "impish",
        title: "21.10",
      }),
      factory.bootResourceUbuntuRelease({
        name: "focal",
        title: "20.04 LTS",
      }),
    ];
    render(
      <ReleaseSelect
        releases={releases}
        selectedRelease="focal"
        setSelectedRelease={vi.fn()}
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
    const setSelectedRelease = vi.fn();
    const releases = [
      factory.bootResourceUbuntuRelease({
        name: "focal",
        title: "20.04",
      }),
      factory.bootResourceUbuntuRelease({
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
