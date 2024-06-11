export interface MsmStatus {
  smUrl: string | null;
  running: "not_connected" | "pending" | "connected";
  startTime: string | null;
}

export interface MsmState {
  status: MsmStatus | null;
  loading: boolean;
  errors: string | null;
}
