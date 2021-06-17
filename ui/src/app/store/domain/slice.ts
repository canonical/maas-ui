import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type {
  CreateAddressRecordParams,
  CreateDNSDataParams,
  CreateParams,
  Domain,
  DomainState,
  SetDefaultErrors,
  UpdateParams,
  UpdateDnsResourceParams,
  UpdateDnsDataParams,
  UpdateAddressRecordParams,
} from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const domainSlice = createSlice({
  name: DomainMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
  } as DomainState,
  reducers: {
    ...generateCommonReducers<
      DomainState,
      DomainMeta.PK,
      CreateParams,
      UpdateParams
    >(DomainMeta.MODEL, DomainMeta.PK),
    get: {
      prepare: (id: Domain[DomainMeta.PK]) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getStart: (state: DomainState) => {
      state.loading = true;
    },
    getError: (
      state: DomainState,
      action: PayloadAction<DomainState["errors"]>
    ) => {
      // API seems to return the domain id in payload.error not an error message
      // when the domain can't be found. This override can be removed when the
      // bug is fixed: https://bugs.launchpad.net/maas/+bug/1931654.
      if (!isNaN(Number(action.payload))) {
        // returned error string is a number (id of the domain)
        state.errors = "There was an error getting the domain.";
      } else {
        // returned error string is an error message
        state.errors = action.payload;
      }

      state.loading = false;
      state.saving = false;
    },
    getSuccess: (state: DomainState, action: PayloadAction<Domain>) => {
      const domain = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Domain) => draftItem.id === domain.id
      );
      if (i !== -1) {
        state.items[i] = domain;
      } else {
        state.items.push(domain);
      }
      state.loading = false;
    },
    setDefault: {
      prepare: (id: Domain[DomainMeta.PK]) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "set_default",
        },
        payload: {
          params: { domain: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setDefaultStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    setDefaultError: (
      state: DomainState,
      action: PayloadAction<SetDefaultErrors>
    ) => {
      state.saving = false;
      // API seems to return the domain id in payload.error not an error message
      // when the domain can't be found. This override can be removed when the
      // bug is fixed: https://bugs.launchpad.net/maas/+bug/1931654.
      if (!isNaN(Number(action.payload))) {
        // returned error string is a number (id of the domain)
        state.errors = "There was an error when setting default domain.";
      } else {
        // returned error string is an error message
        state.errors = action.payload;
      }
    },
    setDefaultSuccess: (state: DomainState, action: PayloadAction<Domain>) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;

      // update the default domain in the redux store
      state.items.forEach((domain) => {
        if (domain.id === action.payload.id) {
          domain.is_default = true;
        } else {
          domain.is_default = false;
        }
      });
    },
    setActive: {
      prepare: (id: Domain[DomainMeta.PK] | null) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active domain if primary key (id) is not sent.
          params: id === null ? null : { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: DomainState,
      action: PayloadAction<DomainState["errors"]>
    ) => {
      state.active = null;
      // API seems to return the domain id in payload.error not an error message
      // when the domain can't be found. This override can be removed when the
      // bug is fixed: https://bugs.launchpad.net/maas/+bug/1931654.
      if (!isNaN(Number(action.payload))) {
        // returned error string is a number (id of the domain)
        state.errors = "There was an error when setting active domain.";
      } else {
        // returned error string is an error message
        state.errors = action.payload;
      }
    },
    setActiveSuccess: (
      state: DomainState,
      action: PayloadAction<Domain | null>
    ) => {
      state.active = action.payload?.id || null;
    },
    createAddressRecord: {
      prepare: (params: CreateAddressRecordParams) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "create_address_record",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createAddressRecordStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    createAddressRecordError: (state: DomainState, action: PayloadAction) => {
      state.saving = false;
      state.errors = action.payload;
    },
    createAddressRecordSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    createDNSData: {
      prepare: (params: CreateDNSDataParams) => ({
        meta: {
          model: DomainMeta.MODEL,
          method: "create_dnsdata",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createDNSDataStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    createDNSDataError: (state: DomainState, action: PayloadAction) => {
      state.saving = false;
      state.errors = action.payload;
    },
    createDNSDataSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    updateDnsResource: {
      prepare: (params: UpdateDnsResourceParams) => {
        return {
          meta: {
            model: DomainMeta.MODEL,
            method: "update_dnsresource",
          },
          payload: {
            params: params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateDnsResourceStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    updateDnsResourceError: (state: DomainState, action: PayloadAction) => {
      state.saving = false;
      state.errors = action.payload;
    },
    updateDnsResourceSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    updateDnsData: {
      prepare: (params: UpdateDnsDataParams) => {
        return {
          meta: {
            model: DomainMeta.MODEL,
            method: "update_dnsdata",
          },
          payload: {
            params: params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateDnsDataStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    updateDnsDataError: (state: DomainState, action: PayloadAction) => {
      state.saving = false;
      state.errors = action.payload;
    },
    updateDnsDataSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    updateAddressRecord: {
      prepare: (params: UpdateAddressRecordParams) => {
        return {
          meta: {
            model: DomainMeta.MODEL,
            method: "update_address_record",
          },
          payload: {
            params: params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateAddressRecordStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    updateAddressRecordError: (state: DomainState, action: PayloadAction) => {
      state.saving = false;
      state.errors = action.payload;
    },
    updateAddressRecordSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
  },
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
