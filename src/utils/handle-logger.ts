export const HandleLogger = (
  title?: string,
  options: { message?: string; logArgs?: boolean } = {},
) => {
  let { message = '' } = options;
  const { logArgs = 'dev' === process?.env?.NODE_ENV } = options;
  return (_, name: string, description: PropertyDescriptor) => {
    const originalFn = description.value;
    const date = new Date().toLocaleString('ru-RU', {
      timeZoneName: 'shortOffset',
    });
    message = `${date}\n[${title || 'HandleLogger'}] -  ${name}${
      message && ' : ' + message
    }`;
    description.value = function (...args: any[]) {
      logArgs &&
        (message += `\n[args]:${JSON.stringify(args).replace(
          /"password":".*?[^"]",?/,
          '',
        )}\n`);
      this.logger.log({
        level: 'info',
        message,
      });
      return originalFn.apply(this, args);
    };
    return description;
  };
};
