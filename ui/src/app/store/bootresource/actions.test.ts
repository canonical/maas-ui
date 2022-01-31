import { actions } from "./slice";
import { BootResourceSourceType } from "./types";

describe("bootresource actions", () => {
  it("can create a deleteImage action", () => {
    expect(actions.deleteImage({ id: 1 })).toEqual({
      type: "bootresource/deleteImage",
      meta: {
        model: "bootresource",
        method: "delete_image",
      },
      payload: {
        params: { id: 1 },
      },
    });
  });

  it("can create a fetch action", () => {
    expect(
      actions.fetch({
        keyring_data: "text",
        keyring_filename: "text",
        source_type: BootResourceSourceType.CUSTOM,
        url: "www.website.com",
      })
    ).toEqual({
      type: "bootresource/fetch",
      meta: {
        model: "bootresource",
        method: "fetch",
      },
      payload: {
        params: {
          keyring_data: "text",
          keyring_filename: "text",
          source_type: BootResourceSourceType.CUSTOM,
          url: "www.website.com",
        },
      },
    });
  });

  it("can create a continuous poll action", () => {
    expect(actions.poll({ continuous: true })).toEqual({
      type: "bootresource/poll",
      meta: {
        model: "bootresource",
        method: "poll",
        poll: true,
      },
      payload: null,
    });
  });

  it("can create a one-off poll action", () => {
    expect(actions.poll({ continuous: false })).toEqual({
      type: "bootresource/poll",
      meta: {
        model: "bootresource",
        method: "poll",
        poll: false,
      },
      payload: null,
    });
  });

  it("can create a pollStop action", () => {
    expect(actions.pollStop()).toEqual({
      type: "bootresource/pollStop",
      meta: {
        model: "bootresource",
        method: "poll",
        pollStop: true,
      },
      payload: null,
    });
  });

  it("can create a saveOther action", () => {
    expect(actions.saveOther({ images: ["this/image/is/fake"] })).toEqual({
      type: "bootresource/saveOther",
      meta: {
        model: "bootresource",
        method: "save_other",
      },
      payload: {
        params: {
          images: ["this/image/is/fake"],
        },
      },
    });
  });

  it("can create a saveUbuntu action", () => {
    expect(
      actions.saveUbuntu({
        osystems: [
          {
            osystem: "ubuntu",
            release: "focal",
            arches: ["amd64"],
          },
        ],
        source_type: BootResourceSourceType.MAAS_IO,
      })
    ).toEqual({
      type: "bootresource/saveUbuntu",
      meta: {
        model: "bootresource",
        method: "save_ubuntu",
      },
      payload: {
        params: {
          osystems: [
            {
              osystem: "ubuntu",
              release: "focal",
              arches: ["amd64"],
            },
          ],
          source_type: BootResourceSourceType.MAAS_IO,
        },
      },
    });
  });

  it("can create a saveUbuntuCore action", () => {
    expect(actions.saveUbuntuCore({ images: ["this/image/is/fake"] })).toEqual({
      type: "bootresource/saveUbuntuCore",
      meta: {
        model: "bootresource",
        method: "save_ubuntu_core",
      },
      payload: {
        params: {
          images: ["this/image/is/fake"],
        },
      },
    });
  });

  it("can create a stopImport action", () => {
    expect(actions.stopImport()).toEqual({
      type: "bootresource/stopImport",
      meta: {
        model: "bootresource",
        method: "stop_import",
      },
      payload: null,
    });
  });

  it("can create a clearFetchedImages action", () => {
    expect(actions.clearFetchedImages()).toEqual({
      type: "bootresource/clearFetchedImages",
    });
  });
});
