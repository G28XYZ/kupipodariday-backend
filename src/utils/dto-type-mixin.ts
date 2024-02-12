import { PickType, PartialType } from '@nestjs/swagger';

export const DtoTypeMixin = (options?: {
  pickType?: Parameters<typeof PickType>;
  partialType?: Parameters<typeof PartialType>;
}) => {
  return (target: any) => {
    [
      PickType(...options.pickType),
      PartialType(...options.partialType),
    ].forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          target.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null),
        );
      });
    });
    return target as any;
  };
};
