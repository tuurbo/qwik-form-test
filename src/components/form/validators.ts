export declare interface ValidatorFn {
  (val: any): {
    [key: string]: {
      message: string;
      actual?: any;
    };
  } | null;
}

export function required(): ValidatorFn {
  return function (val: any) {
    if (val !== null && val !== "" && typeof val !== "undefined") {
      return null;
    }

    return {
      required: {
        message: `This field is required`,
      },
    };
  };
}

export function isMax(max: number): ValidatorFn {
  return function (val: any) {
    if (val <= max) {
      return null;
    }

    return {
      max: {
        message: `Must be less than ${max}`,
        actual: val,
        max,
      },
    };
  };
}
