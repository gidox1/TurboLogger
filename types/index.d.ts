interface Logger {
  log: () => void;
  error: () => void;
  warn: () => void;
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
