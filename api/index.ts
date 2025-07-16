import {
  getAnime,
  getAnimeDetail,
  getAnimeSummary,
  getLatestUpdate,
  getServerList,
  getStreamResource,
  getTopByCategory,
  searchAnime,
} from "animbus";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).get(
  "/",
  () => `Hello from bun@${Bun.version}`,
);

app.group("/v1", (app) =>
  app
    .get("/", () => "Welcome to API v1")
    .get("/ongoing", async () => {
      const animes = await getLatestUpdate();

      if (!animes || animes.length === 0) {
        return { message: "No ongoing anime found" };
      }

      return animes;
    })
    .get("/genre", () => {
      return {
        message: "Please provide a genre ID Example: /api/v1/genre/action",
      };
    })
    .get("/genre/:id", async ({ params: { id } }) => {
      const animes = await getTopByCategory(id);
      if (!animes || animes.length === 0) {
        return { message: `No anime found for genre ${id}` };
      }
      return animes;
    })
    .get("/top-anime", async () => {
      const animes = await getTopByCategory();
      if (!animes || animes.length === 0) {
        return { message: "No top anime found" };
      }
      return animes;
    })
    .get("/detail", () => {
      return {
        message: "Please provide an anime ID Example: /api/v1/anime/detail/1",
      };
    })
    .get("/detail/:id", async ({ params: { id } }) => {
      const anime = await getAnimeDetail(Number(id));
      if (!anime) {
        return { message: `No anime found with ID ${id}` };
      }
      return anime;
    })
    .get("/anime/:id", async ({ params: { id } }) => {
      const anime = await getAnime(id);
      if (!anime) {
        return { message: `No anime found with ID ${id}` };
      }
      return anime;
    })
    .get("/anime/:id/:videoId", async ({ params: { id, videoId } }) => {
      const servers = await getServerList(videoId);
      const links = await Promise.all(
        servers.map(async (server) => {
          return {
            name: server.name,
            url: await getStreamResource(server),
          };
        }),
      );
      return links;
    })
    .get("/search", async ({ query: { q } }) => {
      const animes = await searchAnime(q);
      if (!animes || animes.length === 0) {
        return { message: `No anime found with keyword ${q}` };
      }

      return animes;
    }),
);

if (process.env.NODE_ENV !== "production") {
  app.listen({ port: 3000 });
  console.log("Server is running on http://localhost:3000");
}

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app.handle;
