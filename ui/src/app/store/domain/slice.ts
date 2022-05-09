import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { DomainMeta } from "./types";
import type {
  CreateAddressRecordParams,
  CreateDNSDataParams,
  CreateParams,
  DeleteAddressRecordParams,
  DeleteDNSDataParams,
  DeleteDNSResourceParams,
  DeleteRecordParams,
  Domain,
  DomainState,
  SetDefaultErrors,
  UpdateAddressRecordParams,
  UpdateDNSDataParams,
  UpdateDNSResourceParams,
  UpdateParams,
  UpdateRecordParams,
} from "./types";

import type { APIError } from "app/base/types";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

const domainSlice = createSlice({
  initialState: {
    ...genericInitialState,
    active: null,
  } as DomainState,
  name: DomainMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      DomainState,
      DomainMeta.PK,
      CreateParams,
      UpdateParams
    >(DomainMeta.MODEL, DomainMeta.PK),
    createAddressRecord: {
      prepare: (params: CreateAddressRecordParams) => ({
        meta: {
          method: "create_address_record",
          model: DomainMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createAddressRecordError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    createAddressRecordStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    createAddressRecordSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    createDNSData: {
      prepare: (params: CreateDNSDataParams) => ({
        meta: {
          method: "create_dnsdata",
          model: DomainMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createDNSDataError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    createDNSDataStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    createDNSDataSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    deleteAddressRecord: {
      prepare: (params: DeleteAddressRecordParams) => {
        return {
          meta: {
            method: "delete_address_record",
            model: DomainMeta.MODEL,
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
    deleteAddressRecordError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    deleteAddressRecordStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    deleteAddressRecordSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    deleteDNSData: {
      prepare: (params: DeleteDNSDataParams) => {
        return {
          meta: {
            method: "delete_dnsdata",
            model: DomainMeta.MODEL,
          },
          payload: {
            params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteDNSDataError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    deleteDNSDataStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    deleteDNSDataSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    deleteDNSResource: {
      prepare: (params: DeleteDNSResourceParams) => {
        return {
          meta: {
            method: "delete_dnsresource",
            model: DomainMeta.MODEL,
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
    deleteDNSResourceError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.errors = action.payload;
    },
    deleteDNSResourceSuccess: (state: DomainState) => {
      state.errors = null;
    },
    deleteRecord: {
      prepare: (params: DeleteRecordParams) => ({
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    get: {
      prepare: (id: Domain[DomainMeta.PK]) => ({
        meta: {
          method: "get",
          model: DomainMeta.MODEL,
        },
        payload: {
          params: { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
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
    getStart: (state: DomainState) => {
      state.loading = true;
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
    setActive: {
      prepare: (id: Domain[DomainMeta.PK] | null) => ({
        meta: {
          method: "set_active",
          model: DomainMeta.MODEL,
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
    setDefault: {
      prepare: (id: Domain[DomainMeta.PK]) => ({
        meta: {
          method: "set_default",
          model: DomainMeta.MODEL,
        },
        payload: {
          params: { domain: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
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
    setDefaultStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
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
    updateAddressRecord: {
      prepare: (params: UpdateAddressRecordParams) => {
        return {
          meta: {
            method: "update_address_record",
            model: DomainMeta.MODEL,
          },
          payload: {
            params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateAddressRecordError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    updateAddressRecordStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    updateAddressRecordSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    updateDNSData: {
      prepare: (params: UpdateDNSDataParams) => {
        return {
          meta: {
            method: "update_dnsdata",
            model: DomainMeta.MODEL,
          },
          payload: {
            params,
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateDNSDataError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.saving = false;
      state.errors = action.payload;
    },
    updateDNSDataStart: (state: DomainState) => {
      state.saving = true;
      state.saved = false;
    },
    updateDNSDataSuccess: (state: DomainState) => {
      state.saving = false;
      state.saved = true;
      state.errors = null;
    },
    updateDNSResource: {
      prepare: (params: UpdateDNSResourceParams) => {
        return {
          meta: {
            method: "update_dnsresource",
            model: DomainMeta.MODEL,
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
    updateDNSResourceError: (
      state: DomainState,
      action: PayloadAction<APIError>
    ) => {
      state.errors = action.payload;
    },
    updateDNSResourceSuccess: (state: DomainState) => {
      state.errors = null;
    },
    updateRecord: {
      prepare: (params: UpdateRecordParams) => ({
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
  },
});

export const { actions } = domainSlice;

export default domainSlice.reducer;
