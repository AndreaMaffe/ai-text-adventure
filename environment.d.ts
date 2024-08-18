declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      ANTHROPIC_KEY: string
    }
  }
}

export { };
