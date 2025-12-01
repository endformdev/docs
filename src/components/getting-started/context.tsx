import { type Accessor, createContext, useContext } from "solid-js";
import type { GetStartedState } from "./types";

export const GetStartedContext = createContext<Accessor<GetStartedState>>();

export function useGetStartedState() {
	const context = useContext(GetStartedContext);
	if (!context) {
		throw new Error(
			"useGetStartedState must be used within GetStartedProvider",
		);
	}
	return context;
}
