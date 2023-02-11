import { component$, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useForm } from "~/components/form/form";
import { FormDebug } from "~/components/form/form-helpers";
import { isMax, required } from "~/components/form/validators";

export default component$(() => {
  console.log("init page component$");

  const group = useForm({
    age: {
      value: 1,
      // COMMENT THIS LINE OUT TO STOP BUG
      validator: $(() => [required(), isMax(3)]),
      valid: true,
    },
  });

  return (
    <div>
      <div class="my-6 flex gap-x-6">
        <div class="w-1/2 border-2 border-blue-300 p-2">
          Age: <small>(required, max=3)</small>
          <input
            class="form-input"
            type="text"
            value={group.controls.age.value}
            onInput$={(e) => {
              const val = +(e.target as HTMLInputElement).value;
              group.setValue(group.controls.age, val);
            }}
          />
          <FormDebug ctrl={group.controls.age} />
        </div>
      </div>

      {/* COMMENT THIS LINE OUT TO STOP BUG */}
      {group.controls.age.value == 2 && <div>match!</div>}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik form test",
};
