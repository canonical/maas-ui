type DiagnosticRecord = Record<string, unknown>;

type Options = {
  methods: string[];
  model: "machine" | "subnet";
  snapshot: (document: Document) => DiagnosticRecord;
};

const MAX_EVENTS = 100;

const isRecord = (value: unknown): value is DiagnosticRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const pick = (value: unknown, keys: string[]): DiagnosticRecord => {
  const result: DiagnosticRecord = {};
  if (isRecord(value)) {
    keys.forEach((key) => {
      if (key in value) {
        result[key] = value[key];
      }
    });
  }
  return result;
};

const summarize = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(summarize);
  }
  if (!isRecord(value)) {
    return value;
  }
  const result = pick(value, [
    "id",
    "system_id",
    "hostname",
    "fqdn",
    "status",
    "status_code",
    "name",
    "cidr",
    "version",
    "count",
    "cur_page",
    "num_pages",
    "value",
    "collapsed",
    "success_count",
    "failed_system_ids",
    "failure_details",
    "errors",
  ]);
  for (const key of ["groups", "items"]) {
    if (key in value) {
      result[key] = summarize(value[key]);
    }
  }
  return result;
};

export const captureCIFailureDiagnostics = ({
  methods,
  model,
  snapshot,
}: Options): (() => void) => {
  const startedAt = Date.now();
  const events: DiagnosticRecord[] = [];
  const cleanup: (() => void)[] = [];
  let currentWindow: Cypress.AUTWindow | undefined;
  let droppedEvents = 0;
  let nextConnectionId = 0;

  const record = (event: DiagnosticRecord) => {
    events.push({ elapsedMs: Date.now() - startedAt, ...event });
    if (events.length > MAX_EVENTS) {
      events.shift();
      droppedEvents++;
    }
  };

  const parse = (data: unknown): DiagnosticRecord | undefined => {
    if (typeof data !== "string") {
      record({ event: "non-text WebSocket frame" });
      return;
    }
    let message: unknown;
    try {
      message = JSON.parse(data);
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      record({ event: "invalid JSON WebSocket frame" });
      return;
    }
    return isRecord(message) ? message : undefined;
  };

  cy.on("window:before:load", (win) => {
    currentWindow = win;
    const prototype = win.WebSocket.prototype;
    const originalSend = prototype.send;
    const observe = (socket: WebSocket) => {
      const connectionId = ++nextConnectionId;
      const pending = new Map<number, string>();
      record({ connectionId, event: "observing MAAS WebSocket" });
      const onMessage = (event: MessageEvent) => {
        const message = parse(event.data);
        if (!message) {
          return;
        }
        if (message.type === 2 && message.name === model) {
          record({
            connectionId,
            event: "notification",
            action: message.action,
            data: summarize(message.data),
          });
        } else if (
          message.type === 1 &&
          typeof message.request_id === "number"
        ) {
          const method = pending.get(message.request_id);
          if (method) {
            record({
              connectionId,
              event: "response",
              requestId: message.request_id,
              method,
              responseType: message.rtype,
              result: summarize(message.result),
              error: message.error,
            });
            pending.delete(message.request_id);
          }
        }
      };
      const onClose = (event: CloseEvent) => {
        record({ connectionId, event: "socket closed", code: event.code });
      };
      const onError = () => {
        record({ connectionId, event: "socket error" });
      };
      socket.addEventListener("message", onMessage);
      socket.addEventListener("close", onClose);
      socket.addEventListener("error", onError);
      cleanup.push(() => {
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("close", onClose);
        socket.removeEventListener("error", onError);
      });
      return { connectionId, pending };
    };
    const connections = new WeakMap<WebSocket, ReturnType<typeof observe>>();

    // Observe real traffic without replacing the socket or changing its payloads.
    const send: WebSocket["send"] = function (this: WebSocket, data) {
      if (new URL(this.url).pathname === `${Cypress.env("BASENAME")}/ws`) {
        if (!connections.has(this)) {
          connections.set(this, observe(this));
        }
        const connection = connections.get(this);
        const message = parse(data);
        if (
          connection &&
          message &&
          message.type === 0 &&
          typeof message.method === "string" &&
          methods.includes(message.method) &&
          typeof message.request_id === "number"
        ) {
          connection.pending.set(message.request_id, message.method);
          record({
            connectionId: connection.connectionId,
            event: "request",
            requestId: message.request_id,
            method: message.method,
            params: pick(message.params, [
              "action",
              "filter",
              "group_key",
              "group_collapsed",
              "page_size",
              "page_number",
              "sort_key",
              "sort_direction",
              "id",
              "system_id",
            ]),
          });
        }
      }
      originalSend.call(this, data);
    };
    prototype.send = send;
    cleanup.push(() => {
      if (prototype.send === send) {
        prototype.send = originalSend;
      }
    });
  });

  cy.on("fail", (error) => {
    const report = {
      model,
      droppedEvents,
      events,
      pathname: currentWindow?.location.pathname,
      search: currentWindow?.location.search,
      ui: currentWindow
        ? snapshot(currentWindow.document)
        : "No application window was captured",
    };
    // Cypress commands cannot be queued here; attach evidence to the original failure.
    error.message = `CI diagnostics:\n${JSON.stringify(report, null, 2)}\n\n${error.message}`;
    throw error;
  });

  return () => {
    cleanup.forEach((restore) => restore());
  };
};
