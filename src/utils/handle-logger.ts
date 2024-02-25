export const HandelLogger = (
  title?: string,
  options: { message?: string; logArgs?: boolean } = {},
) => {
  let { message = '' } = options;
  const { logArgs = 'dev' === process?.env?.NODE_ENV } = options;
  return (
    target: Record<string, any>,
    name: string,
    description: PropertyDescriptor,
  ) => {
    const originalFn = description.value;
    message = `[${title || 'HandleLogger'}] -  ${name}${
      message && ' : ' + message
    }`;
    description.value = function (...args: any[]) {
      logArgs && (message += ` [args]:${JSON.stringify(args)}`);
      this.logger.log({
        level: 'info',
        message,
      });
      return originalFn.apply(this, args);
    };
    return description;
  };
};
