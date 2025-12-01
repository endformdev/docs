import { type ParentProps, Show } from "solid-js";

interface StepBlockProps extends ParentProps {
	step: number | "final";
	title: string;
	description?: string;
}

export function StepBlock(props: StepBlockProps) {
	const isFinal = () => props.step === "final";

	return (
		<section class="gs-step-block">
			<header class="gs-step-header">
				<span
					class={`gs-step-number ${isFinal() ? "gs-step-number--final" : ""}`}
				>
					{isFinal() ? (
						<svg
							class="gs-check-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<title>Completed</title>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					) : (
						props.step
					)}
				</span>
				<h3 class="gs-step-title">{props.title}</h3>
			</header>
			<Show when={props.description}>
				<p class="gs-step-description">{props.description}</p>
			</Show>
			<div class="gs-step-content">{props.children}</div>
		</section>
	);
}
