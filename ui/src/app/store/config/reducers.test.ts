import reducers from "./slice";

import {
  config as configFactory,
  configState as configStateFactory,
} from "testing/factories";

describe("config reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      configStateFactory({
        errors: null,
        loading: false,
        loaded: false,
        saving: false,
        saved: false,
        items: [],
      })
    );
  });

  it("should correctly reduce config/fetchStart", () => {
    expect(
      reducers(undefined, {
        type: "config/fetchStart",
      })
    ).toEqual(
      configStateFactory({
        loading: true,
        loaded: false,
        saving: false,
        saved: false,
        items: [],
      })
    );
  });

  it("should correctly reduce config/fetchSuccess", () => {
    expect(
      reducers(
        configStateFactory({
          loading: true,
          loaded: false,
          saving: false,
          items: [],
        }),
        {
          type: "config/fetchSuccess",
          payload: [
            configFactory({ name: "default_storage_layout", value: "bcache" }),
            configFactory({
              name: "enable_disk_erasing_on_release",
              value: "foo",
            }),
          ],
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: true,
        saving: false,
        items: [
          configFactory({ name: "default_storage_layout", value: "bcache" }),
          configFactory({
            name: "enable_disk_erasing_on_release",
            value: "foo",
          }),
        ],
      })
    );
  });

  it("should correctly reduce config/updateStart", () => {
    expect(
      reducers(
        configStateFactory({
          loading: false,
          loaded: false,
          saving: false,
          saved: false,
          items: [],
        }),
        {
          type: "config/updateStart",
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: false,
        saving: true,
        saved: false,
        items: [],
      })
    );
  });

  it("should correctly reduce config/updateSuccess, without a store update", () => {
    expect(
      reducers(
        configStateFactory({
          loading: false,
          loaded: false,
          saving: true,
          saved: false,
          items: [
            configFactory({ name: "default_storage_layout", value: "bcache" }),
          ],
        }),
        {
          type: "config/updateSuccess",
          payload: { name: "default_storage_layout", value: "flat" },
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: false,
        saving: false,
        saved: true,
        items: [
          configFactory({ name: "default_storage_layout", value: "bcache" }),
        ],
      })
    );
  });

  it("should correctly reduce config/updateNotify, updating the store", () => {
    expect(
      reducers(
        configStateFactory({
          loading: false,
          loaded: false,
          saving: false,
          saved: true,
          items: [
            { name: "maas_name", value: "my-maas" },
            configFactory({ name: "default_storage_layout", value: "bcache" }),
          ],
        }),
        {
          type: "config/updateNotify",
          payload: { name: "default_storage_layout", value: "flat" },
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: false,
        saving: false,
        saved: true,
        items: [
          { name: "maas_name", value: "my-maas" },
          { name: "default_storage_layout", value: "flat" },
        ],
      })
    );
  });
});
