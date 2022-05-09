import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserMeta } from "./types";
import type { CreateParams, UpdateParams, UserState, User } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

export const initialState = {
  ...genericInitialState,
  auth: {
    errors: null,
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
    user: null,
  },
  eventErrors: [],
  statuses: {
    markingIntroComplete: false,
  },
};

const userSlice = createSlice({
  initialState: initialState as UserState,
  name: UserMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      UserState,
      UserMeta.PK,
      CreateParams,
      UpdateParams
    >(UserMeta.MODEL, UserMeta.PK),
    /**
     * Mark the intro as completed for the authenticated user.
     */
    markIntroComplete: {
      prepare: () => ({
        meta: {
          method: "mark_intro_complete",
          model: UserMeta.MODEL,
        },
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    markIntroCompleteError: (
      state: UserState,
      action: PayloadAction<UserState["errors"]>
    ) => {
      state.statuses.markingIntroComplete = false;
      state.eventErrors.push({
        error: action.payload,
        event: "markIntroComplete",
      });
    },
    markIntroCompleteStart: (state: UserState) => {
      state.statuses.markingIntroComplete = true;
    },
    markIntroCompleteSuccess: (
      state: UserState,
      action: PayloadAction<User>
    ) => {
      state.statuses.markingIntroComplete = false;
      // The API does not send an update event when the mark complete action is
      // performed so use the API reponse from this action to update the
      // completed_intro flag.
      // This only updates the completed_intro flag as the response includes out
      // of date data for other user parameters. See:
      // https://bugs.launchpad.net/maas/+bug/1937138
      if (state.auth.user) {
        state.auth.user.completed_intro = action.payload.completed_intro;
      }
    },
  },
});

export const { actions } = userSlice;

export default userSlice.reducer;
