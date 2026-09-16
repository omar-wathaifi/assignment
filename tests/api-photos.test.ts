// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/photos/route";
import { UNSPLASH_TIMEOUT_MS } from "@/lib/unsplash";

const ACCESS_KEY = "test-access-key-not-a-real-secret";

function request(query: string) {
  return new Request(`http://localhost:3000/api/photos${query}`);
}

function unsplashPayload() {
  return {
    results: [
      {
        id: "photo-1",
        alt_description: "wooden board game pieces on a table",
        urls: { small: "https://images.unsplash.com/photo-1?w=400" },
        user: { name: "Ada Lovelace", links: { html: "https://unsplash.com/@ada" } },
      },
    ],
  };
}

beforeEach(() => {
  vi.stubEnv("UNSPLASH_ACCESS_KEY", ACCESS_KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GET /api/photos — request validation", () => {
  it("rejects a missing query with the shared error envelope", async () => {
    const response = await GET(request(""));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: { code: "MISSING_QUERY", message: expect.any(String) },
    });
  });

  it("rejects a count outside the supported range", async () => {
    const response = await GET(request("?query=chess&count=99"));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_COUNT");
  });
});

describe("GET /api/photos — Unsplash failures", () => {
  it("reports a missing server key without calling Unsplash", async () => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(request("?query=chess"));

    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("MISSING_API_KEY");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps a timed-out upstream call to UPSTREAM_TIMEOUT", async () => {
    const timeout = new Error("The operation was aborted due to timeout");
    timeout.name = "TimeoutError";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeout));

    const response = await GET(request("?query=chess"));

    expect(response.status).toBe(504);
    expect((await response.json()).error.code).toBe("UPSTREAM_TIMEOUT");
  });

  it("maps a rejected key to INVALID_API_KEY", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));

    const response = await GET(request("?query=chess"));

    expect(response.status).toBe(502);
    expect((await response.json()).error.code).toBe("INVALID_API_KEY");
  });

  it("maps any other upstream failure to UPSTREAM_ERROR", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 500 })));

    const response = await GET(request("?query=chess"));

    expect(response.status).toBe(502);
    expect((await response.json()).error.code).toBe("UPSTREAM_ERROR");
  });
});

describe("GET /api/photos — successful search", () => {
  it("returns mapped photos and keeps the access key server-side", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(unsplashPayload()), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(request("?query=chess&count=1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.photos).toEqual([
      {
        id: "photo-1",
        url: "https://images.unsplash.com/photo-1?w=400",
        alt: "wooden board game pieces on a table",
        credit: { name: "Ada Lovelace", profileUrl: "https://unsplash.com/@ada" },
      },
    ]);

    // The key is sent to Unsplash, and only to Unsplash.
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.origin).toBe("https://api.unsplash.com");
    expect((init.headers as Record<string, string>).Authorization).toBe(`Client-ID ${ACCESS_KEY}`);
    expect(JSON.stringify(body)).not.toContain(ACCESS_KEY);
    expect(response.headers.get("authorization")).toBeNull();
  });

  it("aborts the upstream call after five seconds", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(unsplashPayload()), { status: 200 })),
    );

    await GET(request("?query=chess"));

    expect(UNSPLASH_TIMEOUT_MS).toBe(5000);
    expect(timeoutSpy).toHaveBeenCalledWith(5000);
  });
});
