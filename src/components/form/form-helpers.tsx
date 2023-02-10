import { component$ } from "@builder.io/qwik";
import PrettyPrint from "../pretty-print/pretty-print";
import { type FormControl } from "./types";

export const FormDebug = component$<{ class?: string; ctrl: FormControl }>(
  (props) => {
    function toType(value: any) {
      return value === undefined
        ? "(undefined)"
        : value === ""
        ? "(empty string)"
        : value === null
        ? "(null)"
        : typeof value === "boolean"
        ? "(boolean)"
        : typeof value === "number"
        ? "(number)"
        : typeof value === "string"
        ? "(string)"
        : "";
    }

    return (
      <div class={props.class || "py-2 text-xs"}>
        <div>
          value:{" "}
          {typeof props.ctrl.value === "boolean" ? (
            <>{props.ctrl.value === true ? "true " : "false "} </>
          ) : (
            <>{props.ctrl.value} </>
          )}
          <span class="text-gray-500">{toType(props.ctrl.value)}</span>
        </div>
        <div>
          Validator:{" "}
          <span
            class={`${typeof props.ctrl.validator !== 'undefined' ? "text-green-500" : "text-red-500"}`}
          >
            {typeof props.ctrl.validator !== 'undefined' ? "yes" : "no"}
          </span>
        </div>
        <div>
          Valid:{" "}
          <span
            class={`${props.ctrl.valid ? "text-green-500" : "text-red-500"}`}
          >
            {props.ctrl.valid ? "valid" : "not valid"}
          </span>
        </div>
        <div>
          Dirty:{" "}
          <span
            class={`${props.ctrl.dirty ? "text-green-500" : "text-red-500"}`}
          >
            {props.ctrl.dirty ? "dirty" : "not dirty"}
          </span>
        </div>
        <div>
          Touched:{" "}
          <span
            class={`${props.ctrl.touched ? "text-green-500" : "text-red-500"}`}
          >
            {props.ctrl.touched ? "touched" : "not touched"}
          </span>
        </div>
        <div>
          Errors: <PrettyPrint data={props.ctrl?.errors || undefined} />
        </div>
      </div>
    );
  }
);
