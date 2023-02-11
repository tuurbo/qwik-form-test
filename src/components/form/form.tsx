import { $, useStore } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";

export interface AbstractControl<TValue = any> {
  value: TValue;
  validator?: QRL<(val: any) => any>;
  valid: boolean;
}

export function useForm<
  TControl extends {
    [K in keyof TControl]: AbstractControl;
  } = any
>(controls: TControl) {
  const store = useStore(
    {
      controls: controls as TControl,
    },
    {
      deep: true,
    }
  );

  const setValue = $(async (ctrl: AbstractControl, value: any) => {
    ctrl.value = value;
    if (ctrl.validator) {
      await validate(ctrl);
    }
  });

  return {
    setValue,
    controls: store.controls,
  };
}

export type Form = typeof useForm;

export const validate = async (ctrl: AbstractControl): Promise<void> => {
  if (ctrl.validator) {
    const validators = (await ctrl.validator(null)) as any[];
    const errors: any[] = [];
    for (let i = 0; i < validators.length; i++) {
      const res = validators[i](ctrl.value);
      if (res && res !== null) {
        errors.push(res);
        break;
      }
    }

    const isValid = errors.length === 0;
    ctrl.valid = isValid;
  }
};
