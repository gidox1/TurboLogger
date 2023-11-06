type AcceptedTypes = string | Record<string, any> | number | string[] | Record<string, any>[] | number[];
interface Logger {
  log: (...args: AcceptedTypes) => void;
  error: (...args: AcceptedTypes) => void;
  warn: (...args: AcceptedTypes) => void;
}

enum Envs {
  prod = 'prod',
  dev = 'dev',
  custom = 'custom'
};

interface AppConfig {
  slack?: {
    webhook_url: string,
    channel: string
  }
}

/**
 * @param appConfig
 * @param env
 */
export declare function createStream(appConfig?: AppConfig, env?: Envs): Logger
