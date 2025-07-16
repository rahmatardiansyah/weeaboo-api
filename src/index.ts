import { Elysia } from "elysia";
import { getLatestUpdate } from "animbus";

const app = new Elysia();

app.get("/", () => "Bun Online");

app.group("/v1", (app) =>
  app
    .get("/", () => "Bun Online v1")
    .get("/ongoing", async () => {
      const anime = await getLatestUpdate();
      if (!anime) {
        return { error: "No ongoing anime found" };
      }
      return anime;
    }),
);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
