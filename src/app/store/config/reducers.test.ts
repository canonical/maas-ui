import reducers from "./slice";

import { ConfigNames } from "app/store/config/types";
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
            configFactory({
              name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
              value: "bcache",
            }),
            configFactory({
              name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
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
          configFactory({
            name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
            value: "bcache",
          }),
          configFactory({
            name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
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
            configFactory({
              name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
              value: "bcache",
            }),
          ],
        }),
        {
          type: "config/updateSuccess",
          payload: { name: ConfigNames.DEFAULT_STORAGE_LAYOUT, value: "flat" },
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: false,
        saving: false,
        saved: true,
        items: [
          configFactory({
            name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
            value: "bcache",
          }),
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
            configFactory({ name: ConfigNames.MAAS_NAME, value: "my-maas" }),
            configFactory({
              name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
              value: "bcache",
            }),
          ],
        }),
        {
          type: "config/updateNotify",
          payload: { name: ConfigNames.DEFAULT_STORAGE_LAYOUT, value: "flat" },
        }
      )
    ).toEqual(
      configStateFactory({
        loading: false,
        loaded: false,
        saving: false,
        saved: true,
        items: [
          { name: ConfigNames.MAAS_NAME, value: "my-maas" },
          { name: ConfigNames.DEFAULT_STORAGE_LAYOUT, value: "flat" },
        ],
      })
    );
  });
});
