import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(
  req: IncomingMessage & { method?: string },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
    })
  );
}
