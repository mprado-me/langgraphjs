import { RunnableConfig } from "@langchain/core/runnables";
import {
  BaseCheckpointSaver,
  Checkpoint,
  ConfigurableFieldSpec,
} from "./base.js";

export class MemorySaver extends BaseCheckpointSaver {
  storage: Record<string, Checkpoint> = {};

  get config_specs(): ConfigurableFieldSpec[] {
    return [
      {
        id: "thread_id",
        name: "Thread ID",
        annotation: undefined,
        description: undefined,
        default: "",
        isShared: true,
        dependencies: undefined,
      },
    ];
  }

  get(config: RunnableConfig): Checkpoint | undefined {
    return this.storage[config.configurable?.thread_id];
  }

  put(config: RunnableConfig, checkpoint: Checkpoint): void {
    this.storage[config.configurable?.thread_id] = checkpoint;
  }
}
