// tslint:disable:no-console
/**
 * Logs to the console in a fetching blueish color.
 * 以引人注目的蓝色登录到控制台
 */
export function logColored(message: string) {
  console.log('\x1b[36m%s\x1b[0m', message);
}
