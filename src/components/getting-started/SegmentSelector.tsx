import { For, Show } from "solid-js";
import type { GetStartedState } from "./types";

interface SegmentOption {
	value: string;
	label: string;
	disabled?: boolean;
	badge?: string;
}

interface SegmentSelectorProps {
	label: string;
	field: keyof GetStartedState;
	options: SegmentOption[];
	value: string;
	onChange: (field: keyof GetStartedState, value: string) => void;
}

export function SegmentSelector(props: SegmentSelectorProps) {
	return (
		<div class="gs-selector">
			<span class="gs-selector-label">{props.label}</span>
			<div
				class="gs-selector-options"
				role="radiogroup"
				aria-label={props.label}
			>
				<For each={props.options}>
					{(option) => (
						<button
							role="radio"
							aria-checked={props.value === option.value}
							aria-disabled={option.disabled}
							disabled={option.disabled}
							class={`gs-selector-button ${props.value === option.value ? "gs-selector-button--active" : ""} ${option.disabled ? "gs-selector-button--disabled" : ""}`}
							onClick={() =>
								!option.disabled && props.onChange(props.field, option.value)
							}
						>
							{option.label}
							<Show when={option.badge}>
								<span class="gs-selector-badge">{option.badge}</span>
							</Show>
						</button>
					)}
				</For>
			</div>
		</div>
	);
}
