import { Pheromone } from "../core/pheromone";

export abstract class Agent {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  abstract perceive(): Promise<any>;
  abstract act(input: any): Promise<void>;

  async run() {
    while (true) {
      const input = await this.perceive();
      await this.act(input);
      await this.sleep(100);
    }
  }

  sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }
  }
