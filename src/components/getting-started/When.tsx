import type { JSX, ParentProps } from "solid-js";
import { useGetStartedState } from "./context";
import type { GetStartedState } from "./types";

type Condition = Partial<GetStartedState>;

export function When(
	props: ParentProps<{ matches: Condition | Condition[] }>,
): JSX.Element {
	const state = useGetStartedState();

	const isMatch = () => {
		const conditions = Array.isArray(props.matches)
			? props.matches
			: [props.matches];

		const currentState = state();
		return conditions.some((condition) =>
			Object.entries(condition).every(
				([key, value]) => currentState[key as keyof GetStartedState] === value,
			),
		);
	};

	// Using conditional rendering directly
	return <>{isMatch() ? props.children : null}</>;
}
