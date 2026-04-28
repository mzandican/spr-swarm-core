import { WorkerAgent } from "../../swarm/worker";
import { reproductionLoop } from "../../swarm/reproduce";

const worker = new WorkerAgent(crypto.randomUUID());

worker.run();
reproductionLoop();
