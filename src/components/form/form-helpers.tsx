import { component$ } from "@builder.io/qwik";
import type { AbstractControl } from './form';

export const FormDebug = component$<{ class?: string; ctrl: AbstractControl }>(
  (props) => {
    return (
      <div class={props.class || "py-2 text-xs"}>
        <div>
          value:{" this_breaks?? "} -
          {typeof props.ctrl.value === "boolean" ? (
            <>{props.ctrl.value === true ? "true " : "false "} </>
          ) : (
            <>{props.ctrl.value} </>
          )}
        </div>
        <div>
          Valid:{" "}
          <span
            class={`${props.ctrl.valid ? "text-green-500" : "text-red-500"}`}
          >
            {props.ctrl.valid ? "valid" : "not valid"}
          </span>
        </div>
      </div>
    );
  }
);
