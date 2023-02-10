import { type QRL } from "@builder.io/qwik";

declare type ɵIsAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export declare type ɵTypedOrUntyped<T, Typed, Untyped> = ɵIsAny<
  T,
  Untyped,
  Typed
>;
export declare type ɵValue<T extends AbstractControl | undefined> =
  T extends AbstractControl<any> ? T["value"] : never;

export declare type ɵFormGroupValue<
  T extends {
    [K in keyof T]?: AbstractControl<any>;
  }
> = ɵTypedOrUntyped<
  T,
  Partial<{
    [K in keyof T]: ɵValue<T[K]>;
  }>,
  {
    [key: string]: any;
  }
>;

export interface FormControlArgs<T> {
  value: T;
  validator?: QRL<(val: any) => any>;
}

export interface AbstractControl<TValue = any> {
  type: "control" | "array" | "group";
  value: TValue;
  initialValue: any;
  validator?: QRL<(val: any) => any>;
  valid: boolean;
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
  errors: any;
  setValue: QRL<(val: TValue) => void>;
  setTouched: QRL<(val: boolean) => void>;
}

export interface FormControl<TValue = any> extends AbstractControl {
  type: "control";
  value: TValue;
}

export declare type ɵFormArrayValue<T extends AbstractControl<any>> =
  ɵTypedOrUntyped<T, Array<ɵValue<T>>, any[]>;

export interface FormArray<TControl extends AbstractControl<any> = any>
  extends AbstractControl<
    ɵTypedOrUntyped<TControl, ɵFormArrayValue<TControl>, any>
  > {
  type: "array";
  value: TControl["value"][];
  controls: TControl[];
}

export interface FormGroup<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
> extends AbstractControl<
    ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>
  > {
  type: "group";
  value: {
    [K in keyof TControl]: TControl[K]["value"];
  };
  initialValue: any;
  validator?: QRL<(val: any) => any>;
  valid: boolean;
  invalid: boolean;
  errors: any;
  controls: ɵTypedOrUntyped<
    TControl,
    TControl,
    {
      [key: string]: AbstractControl<any>;
    }
  >;
}
