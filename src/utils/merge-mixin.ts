type ClassRef<T = object, T2 = any> = {
  new (
    ...arg: T2 extends new (...arg2: any) => any
      ? ConstructorParameters<T2>
      : any
  ): T;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
/**
 * миксин-велосипед на подобии InterceptType
 * @description создает класс который наследует все последовательно переданные классы
 * @param classRefs - массив классов
 */
export function MergeMixin<
  T extends ClassRef[],
  U extends UnionToIntersection<
    { [index in keyof T]: InstanceType<T[index]> }[number]
  >,
  R extends ClassRef<U>,
>(classRefs: T): R {
  function fn(instanceArr: T, index = 0) {
    const prevInstanceIndex = index - 1;
    if (index === 0 || instanceArr[prevInstanceIndex]) {
      if (index > 0) {
        instanceArr[prevInstanceIndex] = class Mixin extends (
          instanceArr[prevInstanceIndex]
        ) {
          constructor(...args: any[]) {
            super(args);
          }
        };
      }
      return fn(instanceArr, index + 1);
    }
    return instanceArr.at(-1);
  }
  return fn(classRefs) as R;
}
