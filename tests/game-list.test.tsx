import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GameList } from "@/components/game-list";
import type { Game } from "@/lib/catalogue";

const azul: Game = {
  id: "azul",
  categoryId: "family",
  name: "Azul",
  description: "Draft ceramic tiles to decorate a palace wall.",
  price: 39.5,
  currency: "EUR",
  releaseDate: "2017-10-19",
  imageUrl: "/images/azul.svg",
};

/** Routes the two endpoints the component talks to. */
function stubFetch({
  games,
  gamesStatus = 200,
  photosStatus = 503,
}: {
  games?: Game[];
  gamesStatus?: number;
  photosStatus?: number;
}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.startsWith("/api/games")) {
      return gamesStatus === 200
        ? jsonResponse({ data: { games } }, 200)
        : jsonResponse(
            { error: { code: "INTERNAL_ERROR", message: "The catalogue service is offline." } },
            gamesStatus,
          );
    }

    return jsonResponse(
      { error: { code: "MISSING_API_KEY", message: "Unsplash is not configured." } },
      photosStatus,
    );
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function jsonResponse(body: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function renderList() {
  return render(
    <GameList categoryId="family" categoryName="Family" photoQuery="family board game" />,
  );
}

describe("GameList", () => {
  it("shows a skeleton placeholder while loading, not a bare spinner", () => {
    stubFetch({ games: [azul] });
    const { container } = renderList();

    expect(screen.getByRole("status")).toHaveTextContent("Loading games");
    expect(container.querySelectorAll("li.animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders the games with house-style price and date once loaded", async () => {
    stubFetch({ games: [azul] });
    renderList();

    expect(await screen.findByRole("heading", { name: "Azul", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("39.50 EUR")).toBeInTheDocument();
    expect(screen.getByText("19 Oct 2017")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Azul" })).toHaveAttribute("href", "/games/azul");
  });

  it("falls back to the local placeholder cover, with a notice, when photos fail", async () => {
    stubFetch({ games: [azul] });
    renderList();

    const image = await screen.findByAltText("Placeholder cover art for Azul");

    expect(image).toHaveAttribute("width", "480");
    expect(image).toHaveAttribute("height", "300");
    expect(await screen.findByText(/local placeholder covers/i)).toBeInTheDocument();
  });

  it("explains what to do next when the category has no games", async () => {
    stubFetch({ games: [] });
    renderList();

    expect(await screen.findByRole("heading", { name: /no family games yet/i })).toBeInTheDocument();
    expect(screen.getByText(/try another category/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse all categories/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("explains the failure and recovers when the retry succeeds", async () => {
    const fetchMock = stubFetch({ gamesStatus: 500 });
    renderList();

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent(/could not load the Family games/i);
    expect(alert).toHaveTextContent("The catalogue service is offline.");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const retryFetch = stubFetch({ games: [azul] });
    fireEvent.click(screen.getByRole("button", { name: /try loading again/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Azul", level: 3 })).toBeInTheDocument();
    });
    expect(retryFetch).toHaveBeenCalledWith(expect.stringContaining("/api/games"));
  });
});
