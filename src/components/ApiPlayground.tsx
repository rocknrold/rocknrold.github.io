"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SITE_URL } from "@/data/resume";
import { Icon } from "./Icon";
import styles from "./ApiPlayground.module.css";

export type PlaygroundEndpoint = { name: string; path: string; description: string; legacy?: boolean };

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
type Method = (typeof METHODS)[number];

type ApiResponse = {
  status: number;
  statusText: string;
  timeMs: number;
  size: number;
  headers: [string, string][];
  raw: string;
  /** Parsed body, or undefined when the server didn't return JSON. */
  json?: unknown;
  contentType: string;
};

type RequestTab = "params" | "headers" | "docs" | "code";
type ResponseTab = "body" | "headers";

const CONTACT_EMAIL = "aaronharoldc@gmail.com";

const now = () => performance.now();

// ---- Request policy -------------------------------------------------------
// The playground is a sandboxed client for this site's own read-only API:
// GET only, same origin, /api/v1/* only, no cookies, no redirects, bounded
// time and size. Other methods are answered locally with the same 405 that
// GitHub Pages returns, so nothing but a GET ever leaves the browser.
const API_PREFIX = "/api/v1/";
const MAX_URL_LENGTH = 2048;
const MAX_BODY_BYTES = 512 * 1024;
const TIMEOUT_MS = 10_000;

type Checked = { ok: true; url: URL } | { ok: false; error: string };

function checkUrl(input: string, origin: string): Checked {
  if (input.length > MAX_URL_LENGTH) return { ok: false, error: `URL is longer than ${MAX_URL_LENGTH} characters.` };
  let url: URL;
  try {
    url = new URL(input, origin);
  } catch {
    return { ok: false, error: "That URL could not be parsed. Pick an endpoint from the collection." };
  }
  if (url.origin !== origin) return { ok: false, error: `Only ${origin} can be called from this playground.` };
  if (url.username || url.password) return { ok: false, error: "URLs with embedded credentials are not allowed." };
  if (!url.pathname.startsWith(API_PREFIX)) return { ok: false, error: `Only paths under ${API_PREFIX} can be requested.` };
  url.hash = "";
  return { ok: true, url };
}

/** Reads at most `max` bytes so an unexpectedly large response can't freeze the page. */
async function readCapped(res: Response, max: number) {
  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > max) throw new Error(`Response is ${formatBytes(declared)}; the limit is ${formatBytes(max)}.`);
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      throw new Error(`Response exceeded the ${formatBytes(max)} limit.`);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/** POSIX single-quoting: the copied command can never run anything but curl. */
const shellQuote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

// The URL bar points at whichever host serves the page (localhost in dev, GitHub Pages in prod).
const noopSubscribe = () => () => {};
const getOrigin = () => (window.location.origin.startsWith("http") ? window.location.origin : SITE_URL);
const getServerOrigin = () => SITE_URL;

export function ApiPlayground({ endpoints }: { endpoints: PlaygroundEndpoint[] }) {
  const origin = useSyncExternalStore(noopSubscribe, getOrigin, getServerOrigin);
  const [method, setMethod] = useState<Method>("GET");
  const [active, setActive] = useState(0);
  const [editedUrl, setUrl] = useState<string | null>(null);
  const url = editedUrl ?? `${origin}${endpoints[active].path}`;
  const [reqTab, setReqTab] = useState<RequestTab>("docs");
  const [resTab, setResTab] = useState<ResponseTab>("body");
  const [view, setView] = useState<"pretty" | "raw">("pretty");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"body" | "curl" | null>(null);
  const controller = useRef<AbortController | null>(null);

  const parsed = useMemo(() => {
    try {
      return new URL(url, origin);
    } catch {
      return null;
    }
  }, [url, origin]);

  // Snippets are built from the validated URL only, never from raw input.
  const checked = checkUrl(url, origin);
  const snippetUrl = checked.ok ? checked.url.href : `${origin}${endpoints[active].path}`;
  const curl = `curl ${method === "GET" ? "" : `-X ${method} `}${shellQuote(snippetUrl)} -H 'Accept: application/json'`;
  const fetchSnippet = `const res = await fetch(${JSON.stringify(snippetUrl)}${method === "GET" ? "" : `, { method: "${method}" }`});\nconst { data } = await res.json();`;

  const select = (index: number) => {
    setActive(index);
    setMethod("GET");
    const next = `${origin}${endpoints[index].path}`;
    setUrl(next);
    send(next, "GET");
  };

  async function send(target = url, verb: Method = method) {
    controller.current?.abort();
    setError(null);
    setResTab("body");

    const checkedTarget = checkUrl(target, origin);
    if (!checkedTarget.ok) {
      setResponse(null);
      setError(checkedTarget.error);
      return;
    }
    const parsedTarget = checkedTarget.url;

    setLoading(true);
    const started = now();

    if (verb !== "GET") {
      // Read-only API: answered locally (see request policy above), no request is sent.
      await new Promise((r) => setTimeout(r, 220));
      const body = {
        status: "error",
        code: 405,
        message: "Method Not Allowed",
        detail: `This API is read-only. Use GET, or send your ${verb === "POST" ? "proposal" : "request"} to ${CONTACT_EMAIL}.`,
        allow: ["GET"],
      };
      const raw = JSON.stringify(body);
      setResponse({
        status: 405,
        statusText: "Method Not Allowed",
        timeMs: Math.round(now() - started),
        size: new Blob([raw]).size,
        headers: [
          ["allow", "GET"],
          ["content-type", "application/json"],
        ],
        raw,
        json: body,
        contentType: "application/json",
      });
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    controller.current = ac;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ac.abort();
    }, TIMEOUT_MS);
    try {
      const res = await fetch(parsedTarget.href, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "same-origin",
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer",
        cache: "no-store",
        signal: ac.signal,
      });
      const raw = await readCapped(res, MAX_BODY_BYTES);
      const timeMs = Math.round(now() - started);
      const headers = [...res.headers.entries()].sort(([a], [b]) => a.localeCompare(b));
      const contentType = res.headers.get("content-type") ?? "";
      let json: unknown;
      if (contentType.includes("application/json")) {
        try {
          json = JSON.parse(raw);
        } catch {
          json = undefined;
        }
      }
      setResponse({
        status: res.status,
        statusText: res.statusText || (res.ok ? "OK" : "Not Found"),
        timeMs,
        size: new Blob([raw]).size,
        headers,
        raw,
        json,
        contentType,
      });
    } catch (e) {
      if ((e as Error).name === "AbortError" && !timedOut) return;
      setResponse(null);
      setError(
        timedOut
          ? `The request timed out after ${TIMEOUT_MS / 1000} seconds.`
          : `Could not get a response: ${(e as Error).message}`,
      );
    } finally {
      clearTimeout(timer);
      if (controller.current === ac) setLoading(false);
    }
  }

  const copy = async (what: "body" | "curl") => {
    const text = what === "curl" ? curl : response ? (response.json === undefined ? response.raw : JSON.stringify(response.json, null, 2)) : "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const params = parsed ? [...parsed.searchParams.entries()] : [];
  const endpoint = endpoints[active];
  const statusClass = response
    ? response.status < 300
      ? styles.ok
      : response.status < 500
        ? styles.warn
        : styles.err
    : "";

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.workspace}>
          <Icon name="layers" size={16} />
          <span className={styles.wsName}>Harold Aaron API</span>
          <span className={styles.sep}>/</span>
          <span className={styles.version}>v1</span>
        </div>
        <button type="button" className={styles.ghostBtn} onClick={() => copy("curl")} aria-label="Copy request as cURL">
          <Icon name={copied === "curl" ? "check" : "terminal"} size={15} />
          <span className={styles.hideSm}>{copied === "curl" ? "Copied" : "Copy as cURL"}</span>
        </button>
      </div>

      <div className={styles.body}>
        <nav className={styles.sidebar} aria-label="API collection">
          <p className={styles.sideLabel}>Collection</p>
          <ul>
            {endpoints.map((e, i) => (
              <li key={e.path}>
                <button
                  type="button"
                  className={`${styles.endpoint} ${i === active ? styles.endpointActive : ""}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => select(i)}
                >
                  <span className={styles.methodTag} data-method="GET">
                    GET
                  </span>
                  <span className={styles.endpointName}>
                    {e.path.split("/").pop()?.replace(".json", "")}
                    {e.legacy && <span className={styles.legacy}>legacy</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.main}>
          <form
            className={styles.requestBar}
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <label className="sr-only" htmlFor="pg-method">
              HTTP method
            </label>
            <select
              id="pg-method"
              className={styles.method}
              data-method={method}
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="pg-url">
              Request URL
            </label>
            <input
              id="pg-url"
              className={styles.url}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              inputMode="url"
            />
            <button type="submit" className={`btn btn-primary ${styles.send}`} disabled={loading} aria-busy={loading}>
              {loading ? <span className={styles.spinner} aria-hidden="true" /> : <Icon name="send" size={16} />}
              {loading ? "Sending" : "Send"}
            </button>
          </form>

          <div className={styles.tabs} role="tablist" aria-label="Request details" onKeyDown={onTabKeys}>
            {(
              [
                ["docs", "Docs"],
                ["params", `Params${params.length ? ` (${params.length})` : ""}`],
                ["headers", "Headers (1)"],
                ["code", "Code"],
              ] as [RequestTab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`req-tab-${key}`}
                aria-selected={reqTab === key}
                tabIndex={reqTab === key ? 0 : -1}
                aria-controls="req-panel"
                className={styles.tab}
                onClick={() => setReqTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.reqPanel} role="tabpanel" id="req-panel" aria-labelledby={`req-tab-${reqTab}`}>
            {reqTab === "docs" && (
              <p>
                <strong>{endpoint.name}.</strong> {endpoint.description} Every response is wrapped in{" "}
                <code>{"{ status, code, message, data, links }"}</code>.
              </p>
            )}
            {reqTab === "params" &&
              (params.length ? (
                <table className={styles.kv}>
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map(([k, v], i) => (
                      <tr key={`${k}-${i}`}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.dim}>No query parameters. Add some to the URL and they will show up here.</p>
              ))}
            {reqTab === "headers" && (
              <table className={styles.kv}>
                <tbody>
                  <tr>
                    <td>Accept</td>
                    <td>application/json</td>
                  </tr>
                </tbody>
              </table>
            )}
            {reqTab === "code" && (
              <div className={styles.snippets}>
                <pre>
                  <span className={styles.prompt}>$</span> {curl}
                </pre>
                <pre>{fetchSnippet}</pre>
              </div>
            )}
          </div>

          <section className={styles.response} aria-label="Response" aria-live="polite" aria-busy={loading}>
            <div className={styles.resHead}>
              <div className={styles.tabs} role="tablist" aria-label="Response details" onKeyDown={onTabKeys}>
                {(["body", "headers"] as ResponseTab[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={resTab === key}
                    tabIndex={resTab === key ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setResTab(key)}
                    disabled={!response}
                  >
                    {key === "body" ? "Body" : `Headers${response ? ` (${response.headers.length})` : ""}`}
                  </button>
                ))}
              </div>
              {response && (
                <dl className={styles.meta}>
                  <div>
                    <dt>Status</dt>
                    <dd className={statusClass}>
                      {response.status} {response.statusText}
                    </dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{response.timeMs} ms</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{formatBytes(response.size)}</dd>
                  </div>
                </dl>
              )}
            </div>

            {loading && !response && (
              <div className={styles.empty}>
                <span className={styles.spinner} aria-hidden="true" />
                <p>Sending request…</p>
              </div>
            )}

            {!loading && !response && !error && (
              <div className={styles.empty}>
                <Icon name="send" size={28} />
                <p>
                  Hit <strong>Send</strong> or pick an endpoint from the collection.
                </p>
                <p className={styles.dim}>
                  Try another method like <code>POST</code> too.
                </p>
              </div>
            )}

            {error && (
              <div className={`${styles.empty} ${styles.errorBox}`} role="alert">
                <Icon name="x" size={28} />
                <p>{error}</p>
                <button type="button" className="btn btn-ghost" onClick={() => send()}>
                  Retry
                </button>
              </div>
            )}

            {response && resTab === "body" && (
              <div className={`${styles.bodyWrap} ${loading ? styles.stale : ""}`}>
                <div className={styles.bodyBar}>
                  <div className={styles.segment} role="group" aria-label="Body format">
                    {(["pretty", "raw"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={view === v}
                        onClick={() => setView(v)}
                      >
                        {v === "pretty" ? "Pretty" : "Raw"}
                      </button>
                    ))}
                  </div>
                  <span className={styles.ctype}>{response.json === undefined ? "Text" : "JSON"}</span>
                  <button type="button" className={styles.ghostBtn} onClick={() => copy("body")}>
                    <Icon name={copied === "body" ? "check" : "copy"} size={15} />
                    {copied === "body" ? "Copied" : "Copy"}
                  </button>
                </div>
                {view === "raw" ? (
                  <pre className={styles.raw}>{response.raw}</pre>
                ) : response.json !== undefined ? (
                  <JsonView value={response.json} />
                ) : (
                  <div className={styles.notJson}>
                    <p>
                      No JSON in this response ({response.contentType.split(";")[0] || "unknown type"},{" "}
                      {formatBytes(response.size)}).
                      {response.status === 404 && " That endpoint doesn't exist. Try one of these:"}
                    </p>
                    {response.status === 404 && (
                      <ul>
                        {endpoints.map((e, i) => (
                          <li key={e.path}>
                            <button type="button" onClick={() => select(i)}>
                              GET {e.path}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {response && resTab === "headers" && (
              <table className={`${styles.kv} ${styles.resHeaders}`}>
                <tbody>
                  {response.headers.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// WAI-ARIA tabs: Left/Right/Home/End move between tabs (roving tabindex).
function onTabKeys(e: React.KeyboardEvent<HTMLDivElement>) {
  const tabs = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
  const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (i < 0) return;
  const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  const tab = tabs[(next + tabs.length) % tabs.length];
  tab.focus();
  tab.click();
}

function formatBytes(n: number) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(2)} KB`;
}

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function highlight(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const [, str, colon, bool, nil, num] = m;
    if (str) {
      out.push(
        <span key={i} className={colon ? styles.jKey : styles.jStr}>
          {str}
        </span>,
      );
      if (colon) out.push(colon);
    } else if (bool) out.push(<span key={i} className={styles.jBool}>{bool}</span>);
    else if (nil) out.push(<span key={i} className={styles.jNull}>{nil}</span>);
    else if (num) out.push(<span key={i} className={styles.jNum}>{num}</span>);
    last = i + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function JsonView({ value }: { value: unknown }) {
  const lines = useMemo(() => JSON.stringify(value, null, 2).split("\n"), [value]);
  return (
    <pre className={styles.code} tabIndex={0} aria-label="Response body">
      {lines.map((line, i) => {
        const indent = line.length - line.trimStart().length;
        return (
          <span key={i} className={styles.line} style={{ "--indent": `${indent}ch` } as React.CSSProperties}>
            {highlight(line)}
          </span>
        );
      })}
    </pre>
  );
}
