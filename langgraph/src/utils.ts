import { Runnable, RunnableConfig } from "@langchain/core/runnables";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RunnableCallableArgs extends Partial<any> {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any[]) => any;
  tags?: string[];
  trace?: boolean;
  recurse?: boolean;
}

export class RunnableCallable extends Runnable {
  lc_namespace: string[] = ["langgraph"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any[]) => any;

  tags?: string[];

  config?: RunnableConfig;

  trace: boolean = true;

  recurse: boolean = true;

  constructor(fields: RunnableCallableArgs) {
    super();
    this.name = fields.name ?? fields.func.name;
    this.func = fields.func;
    this.config = fields.tags ? { tags: fields.tags } : undefined;
    this.trace = fields.trace ?? this.trace;
    this.recurse = fields.recurse ?? this.recurse;
  }

  async invoke(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    options?: Partial<RunnableConfig> | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (this.func === undefined) {
      return this.invoke(input, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let returnValue: any;

    // TODO: mergeConfigs() from @langchain/core is not exported
    if (this.trace) {
      returnValue = await this._callWithConfig(this.func, input, options);
    } else {
      returnValue = await this.func(input, options);
    }

    // eslint-disable-next-line no-instanceof/no-instanceof
    if (returnValue instanceof Runnable && this.recurse) {
      return await returnValue.invoke(input, options);
    }

    return returnValue;
  }
}