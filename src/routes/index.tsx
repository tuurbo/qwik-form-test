import { component$, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import {
  formArray,
  formControl,
  type FormArray,
  type FormControl,
  useForm,
  // formGroup,
  // type FormGroup,
} from "~/components/form/form";
import { FormDebug } from "~/components/form/form-helpers";
import { isMax, required } from "~/components/form/validators";
import PrettyPrint from "~/components/pretty-print/pretty-print";

export default component$(() => {
  console.log("init page component$");

  type TestForm = {
    age: FormControl<number>;
    options: FormArray<FormControl<string>>;
    // subgroup: FormGroup<{
    //   sub1: FormControl<string>;
    //   sub2: FormControl<number>;
    // }>;
  };

  const validators = $(() => [required(), isMax(3)]);

  const group = useForm<TestForm>({
    age: formControl({
      value: 1,
      validator: validators,
    }),
    options: formArray([
      formControl({
        value: 1,
        validator: validators,
      }),
      formControl({
        value: 1,
      }),
    ]),
    // subgroup: formGroup({
    //   sub1: formControl({
    //     value: 1,
    //   }),
    //   sub2: formControl({
    //     value: 1,
    //     validator: validators,
    //   }),
    // }),
  });

  const add = $(() => {
    group.push(
      group.controls.options,
      formControl({
        value: `opt ${group.controls.options.controls.length + 1}`,
        validator: $(() => [required(), isMax(3)]),
      })
    );
  });

  return (
    <div>
      <div class="my-6 flex gap-x-6">
        <div class="w-1/2 border-2 border-blue-300 p-2">
          Age:
          <input
            class="form-input"
            type="text"
            value={group.controls.age.value}
            onInput$={(e) => {
              const val = (e.target as HTMLInputElement).value;
              group.setValue(group.controls.age, val);
              // group.setValue("age", val);
            }}
          />
          <FormDebug ctrl={group.controls.age} />
        </div>
      </div>

      <div class="my-6 mb-2 flex flex-wrap border-2 border-blue-300 p-2">
        {group.controls.options.controls?.map((control, i) => (
          <div class="my-1 w-1/2 px-2" key={`opt-${i}`}>
            Option {i}
            <input
              class="form-input"
              type="text"
              value={control.value}
              onInput$={(e) => {
                const val = (e.target as HTMLInputElement).value;
                group.setValue(group.controls.options.controls[i], val);
                // group.setValue(`options.${i}`, val);
              }}
            />
            <FormDebug ctrl={control} />
          </div>
        ))}
      </div>

      <button
        class="btn my-2 border rounded p-2 bg-gray-200 hover:bg-gray-300"
        onClick$={() => add()}
      >
        Add option
      </button>

      {group.controls.options.controls[0].value == "111" && <div>match!</div>}

      <div class="m-1 border p-1">
        Values:
        <PrettyPrint data={group.value} />
      </div>
      <div class="m-1 border p-1">
        Errors:
        <PrettyPrint data={group.errors} />
      </div>
      {/* <div class="m-1 border p-1">
        <PrettyPrint data={group.controls} />
      </div> */}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik form test",
};
