import { createSignal, type ParentProps, Show } from "solid-js";

interface CodeBlockProps extends ParentProps {
  filename?: string;
  language?: string;
}

export function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = createSignal(false);

  const copyToClipboard = async () => {
    const content =
      typeof props.children === "string"
        ? props.children
        : ((props.children as HTMLElement)?.textContent ?? "");

    await navigator.clipboard.writeText(content.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="gs-code-block">
      <Show when={props.filename}>
        <div class="gs-code-header">
          <span class="gs-code-filename">{props.filename}</span>
          <button type="button" onClick={copyToClipboard} class="gs-copy-btn">
            {copied() ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </Show>
      <pre class="gs-code-pre">
        <code>{props.children}</code>
      </pre>
    </div>
  );
}
