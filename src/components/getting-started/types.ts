export type SuiteOrigin = "existing" | "demo";
export type Target = "local" | "remote" | "vercel";
export type Runner = "local-cli" | "github-actions" | "other-ci";

export interface GetStartedState {
	starting_suite: SuiteOrigin;
	starting_target: Target;
	starting_runner: Runner;
}

export const DefaultGetStartedState: GetStartedState = {
	starting_suite: "existing",
	starting_target: "local",
	starting_runner: "local-cli",
};
