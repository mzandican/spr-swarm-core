import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export class Pheromone {
  static async reinforce(path: string, value: number) {
    await redis.zincrby("pheromone:paths", value, path);
  }

  static async decay(rate: number = 0.01) {
    const all = await redis.zrange("pheromone:paths", 0, -1, "WITHSCORES");

    for (let i = 0; i < all.length; i += 2) {
      const path = all[i];
      const score = parseFloat(all[i + 1]);
      const updated = score * (1 - rate);

      await redis.zadd("pheromone:paths", updated, path);
    }
  }

  static async getBestPaths(limit = 5) {
    return redis.zrevrange("pheromone:paths", 0, limit - 1, "WITHSCORES");
  }
}
