import { createSignal } from "solid-js";

export function CommandSnippet(props: { command: string }) {
	const [copied, setCopied] = createSignal(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(props.command);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<div class="gs-command">
			<pre class="gs-command-pre">{props.command}</pre>
			<button type="button" onClick={copyToClipboard} class="gs-command-copy">
				{copied() ? (
					<>
						<svg
							class="gs-copy-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Copied
					</>
				) : (
					<>
						<svg
							class="gs-copy-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						Copy
					</>
				)}
			</button>
		</div>
	);
}
