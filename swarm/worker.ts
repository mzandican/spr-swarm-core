import { Agent } from "./agent";
import { Pheromone } from "../core/pheromone";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export class WorkerAgent extends Agent {

  async perceive() {
    const task = await redis.lpop("tasks:queue");
    return task ? JSON.parse(task) : null;
  }

  async act(task: any) {
    if (!task) return;

    const start = Date.now();

    try {
      // EXECUTE TASK (plug your real logic here)
      await this.executeTask(task);

      const duration = Date.now() - start;

      await Pheromone.reinforce(task.path, 10 / duration);

      await redis.hset("tasks:done", task.id, "success");

    } catch (e) {
      await redis.hset("tasks:done", task.id, "failed");
    }
  }

  async executeTask(task: any) {
    // REAL WORK HAPPENS HERE
    // API call, compute, pipeline, etc.
    return new Promise(res => setTimeout(res, 200));
  }
        }
