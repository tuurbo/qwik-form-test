import { $, useStore, useTask$ } from "@builder.io/qwik";
import { get } from "./get";
import type {
  FormControlArgs,
  FormControl,
  AbstractControl,
  FormArray,
  FormGroup,
  ɵTypedOrUntyped,
  ɵFormGroupValue,
} from "./types";

export function formControl<TValue = any>(
  ctrl: FormControlArgs<TValue>
): FormControl<TValue> {
  return {
    type: "control",
    value: ctrl.value,
    initialValue: JSON.parse(JSON.stringify(ctrl.value)),
    validator: ctrl.validator,
    valid: typeof ctrl.validator === "undefined",
    invalid: typeof ctrl.validator !== "undefined",
    touched: false,
    dirty: false,
    errors: undefined,
    setValue: undefined as any,
    setTouched: undefined as any,
  };
}

export function formArray<TControl extends AbstractControl<any> = any>(
  ctrls: TControl[]
): FormArray<any> {
  return {
    type: "array",
    value: [],
    initialValue: undefined,
    validator: undefined,
    valid: false,
    invalid: false,
    errors: undefined,
    touched: false,
    dirty: false,
    controls: [...ctrls],
    setValue: undefined as any,
    setTouched: undefined as any,
  };
}

export function formGroup<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
>(ctrls: TControl): FormGroup<any> {
  return {
    type: "group",
    value: {},
    initialValue: undefined,
    validator: undefined,
    valid: false,
    invalid: false,
    errors: undefined,
    touched: false,
    dirty: false,
    controls: ctrls,
    setValue: undefined as any,
    setTouched: undefined as any,
  };
}

export function useForm<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
>(controls: TControl) {
  const store = useStore(
    {
      controls: controls as TControl,
      // controls: JSON.parse(JSON.stringify(controls)) as TControl,
      // controls: { ...controls } as TControl,
      value: {} as AbstractControl<
        ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>
      >["value"],
      dirty: false,
      touched: false,
      errors: undefined as Record<string, any> | undefined,
    },
    {
      deep: true,
      reactive: true,
    }
  );

  const setDirty = $((ctrl: AbstractControl, value: boolean) => {
    ctrl.dirty = value;
  });

  const setTouched = $((ctrl: AbstractControl, value: boolean) => {
    ctrl.touched = value;
  });

  const setValue = $(
    async (ctrlOrPath: AbstractControl | string, value: any) => {
      let ctrl: any;
      if (typeof ctrlOrPath === "string") {
        const split = ctrlOrPath.split(".");
        const map = split.map((v, i) => {
          if (i === 0) {
            return v;
          }
          return `controls.${v}`;
        });
        ctrl = get(store.controls, map.join("."));
      } else {
        ctrl = ctrlOrPath;
      }

      ctrl.value = value;
      ctrl.dirty = ctrl.initialValue !== ctrl.value;
      await validate(ctrl, true);
    }
  );

  const push = $(async (ctrl: any, value: any) => {
    ctrl.controls.push(value);
    const newCtrl = ctrl.controls[ctrl.controls.length - 1];
    await setValue(newCtrl, newCtrl.value);
  });

  // run just once at start
  useTask$(async () => {
    for (const key in store.controls) {
      const ctrl = store.controls[key] as any;
      if (ctrl.type === "array") {
        const vals = [];
        for (const key2 in ctrl.controls) {
          await setValue(ctrl.controls[key2], ctrl.controls[key2].value);
          vals.push(ctrl.controls[key2].value);
        }
      } else if (ctrl.type === "group") {
        for (const key2 in ctrl.controls) {
          await setValue(ctrl.controls[key2], ctrl.controls[key2].value);
        }
      } else {
        await setValue(ctrl, ctrl.value);
      }
    }
  });

  // run anytime a value changes
  useTask$(async ({ track }) => {
    store.value = track(() =>
      Object.keys(store.controls).reduce((acc, key) => {
        // @ts-ignore
        const ctrl = store.controls[key];

        // console.log(555, key, ctrl);

        if (ctrl.type === "array") {
          acc[key] = ctrl.controls.map((c: any) => c.value);
        } else if (ctrl.type === "group") {
          acc[key] = Object.keys(ctrl.controls).reduce((acc2, key2) => {
            acc2[key2] = ctrl.controls[key2].value;
            return acc2;
          }, {} as Record<string, any>);
        } else {
          acc[key] = ctrl.value;
        }

        return acc;
      }, {} as Record<string, any>)
    ) as any;
  });

  // run anytime an error changes
  useTask$(({ track }) => {
    console.log("errors...");
    store.errors = track(() =>
      Object.keys(store.controls).reduce((acc, key) => {
        // @ts-ignore
        const ctrl = store.controls[key];

        if (ctrl.type === "array") {
          acc[key] = ctrl.controls.map((c: any) => c.errors);
        } else if (ctrl.type === "group") {
          acc[key] = Object.keys(ctrl.controls).reduce((acc2, key2) => {
            acc2[key2] = ctrl.controls[key2].errors;
            return acc2;
          }, {} as Record<string, any>);
        } else {
          acc[key] = ctrl.errors;
        }
        return acc;
      }, {} as Record<string, any>)
    );
  });

  return {
    setValue,
    push,
    setDirty,
    setTouched,
    controls: store.controls,
    value: store.value,
    errors: store.errors,
  };
}

export type Form = typeof useForm;

export const validate = async (
  ctrl: FormControl<any>,
  abortEarly: boolean
): Promise<void> => {
  if (ctrl.validator) {
    const validators = (await ctrl.validator(null)) as any[];
    const errors: any[] = [];
    for (let i = 0; i < validators.length; i++) {
      const res = validators[i](ctrl.value);
      if (res && res !== null) {
        errors.push(res);
        if (abortEarly) {
          break;
        }
      }
    }

    const isValid = errors.length === 0;

    ctrl.valid = isValid;
    ctrl.invalid = !isValid;

    if (isValid) {
      ctrl.errors = undefined;
    } else {
      ctrl.errors = errors.reduce((acc: any, item: any) => {
        const key = Object.keys(item)[0];
        acc[key] = item[key];
        return acc;
      }, {} as Record<string, any>);
    }
  }
};
