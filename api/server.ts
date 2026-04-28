import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL!);

app.use(express.json());

app.post("/task", async (req, res) => {
  const task = {
    id: crypto.randomUUID(),
    ...req.body,
    timestamp: Date.now()
  };

  await redis.rpush("tasks:queue", JSON.stringify(task));

  res.json({ status: "queued", id: task.id });
});

app.listen(3000, () => {
  console.log("SPR API running on :3000");
});
