import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).get(
  "/",
  () => `Hello from bun@${Bun.version}`,
);

if (process.env.NODE_ENV !== "production") {
  app.listen({ port: 3000 });
  console.log("Server is running on http://localhost:3000");
}

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app.handle;
