import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function reproductionLoop() {
  setInterval(async () => {
    const queueSize = await redis.llen("tasks:queue");

    const workers = await redis.scard("workers:active");

    if (queueSize > workers * 5) {
      await redis.incr("workers:spawn");
      console.log("⚡ spawning new worker");
    }

    if (queueSize < workers) {
      await redis.decr("workers:spawn");
    }

  }, 2000);
}
