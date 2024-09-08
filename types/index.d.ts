type AcceptedTypes = string | undefined |
  number | undefined |
  unknown |
  Record<string, any> | undefined |
  string[] | undefined |
  Record<string, any>[] | undefined |
  number[] | undefined |
  Record<any, any> | undefined |
  Record<any, any>[] | undefined


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
