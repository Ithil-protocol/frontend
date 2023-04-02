export enum CoreInstance {
  PublicNetwork = 'public',
  PublicTestnet = 'testnet',
  PrivateTestnet = 'private',
  Development = 'dev',
}

export interface CoreConfig {
  instance: CoreInstance
}
export const coreConfig: CoreConfig = {
  instance: process.env.NEXT_PUBLIC_DEPLOY_TYPE as CoreInstance,
}
