export class ArrayUtils {
  static haveItemInCommon(array1: Array<any>, array2: Array<any>) {
    return array1.some((item: any) => array2.includes(item));
  }

  static clone(array: Array<any>): Array<any> {
    return [...array];
  }
}
