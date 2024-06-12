import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/root/types";

const status = (state: RootState) => state.msm.status;
const running = createSelector(status, (status) => status?.running);
const loading = (state: RootState) => state.msm.loading;
const errors = (state: RootState) => state.msm.errors;

const msmSelectors = {
  status,
  running,
  loading,
  errors,
};

export default msmSelectors;
