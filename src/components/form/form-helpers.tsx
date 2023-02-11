import { component$ } from "@builder.io/qwik";
import type { AbstractControl } from "./form";

export const FormDebug = component$<{ ctrl: AbstractControl }>((props) => {
  return (
    <div class={"py-2 text-xs"}>
      <div>
        value:
        {props.ctrl.value}
      </div>
      <div>
        Valid: <span>{props.ctrl.valid ? "valid" : "not valid"}</span>
      </div>
    </div>
  );
});
