export const stringFormat = (str: string, ...args: (string | number)[]) => {
  return args.reduce<string>(
    (acc, cur, i) =>
      acc.replace(new RegExp(String.raw`\{${i}\}`, 'g'), cur?.toString()),
    str,
  );
};
