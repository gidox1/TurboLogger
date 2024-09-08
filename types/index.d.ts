type AcceptedTypes = string | Record<string, any> | number | string[] | Record<string, any>[] | number[] | Record<any, any> | Record<any, any>[];
interface Logger {
  log: (...args: AcceptedTypes[]) => void;
  error: (...args: AcceptedTypes[]) => void;
  warn: (...args: AcceptedTypes[]) => void;
}

declare enum Envs {
  prod = 'prod',
  dev = 'dev',
  custom = 'custom'
}

interface AppConfig {
  slack?: {
    webhook_url: string,
    channel: string
  },
  enableTimestamp: boolean;
}

/**
 * @param appConfig
 * @param env
 */
export declare function createStream(appConfig?: AppConfig, env?: Envs): Logger
