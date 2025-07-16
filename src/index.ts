import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).get(
  "/",
  () => `Hello from bun@${Bun.version}`,
);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
