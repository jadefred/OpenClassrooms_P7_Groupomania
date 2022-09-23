declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
    }
  }
}

export {};
