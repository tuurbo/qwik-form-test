import { component$ } from '@builder.io/qwik';

export default component$<{ data: any }>((props) => {
  return (
    <pre class={`whitespace-pre-wrap break-all text-xs`}>
      {JSON.stringify(props.data, null, 2)}
    </pre>
  );
});
