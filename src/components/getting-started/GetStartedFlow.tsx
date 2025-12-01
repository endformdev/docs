import { createSignal, Show } from "solid-js";
import { GetStartedContext } from "./context";
import { SegmentSelector } from "./SegmentSelector";
import { LocalCliFlowContent } from "./flow-content/LocalCliFlowContent";
import { GitHubActionsFlowContent } from "./flow-content/GitHubActionsFlowContent";
import { OtherCiFlowContent } from "./flow-content/OtherCiFlowContent";
import { StepBlock } from "./StepBlock";
import { When } from "./When";
import {
	DefaultGetStartedState,
	type GetStartedState,
	type Runner,
	type SuiteOrigin,
} from "./types";

export function GetStartedFlow() {
	const [state, setState] = createSignal<GetStartedState>(
		DefaultGetStartedState,
	);

	const updateState = (field: keyof GetStartedState, value: string) => {
		setState((prev) => ({ ...prev, [field]: value }));
	};

	const isInvalidCombination = () => {
		const s = state();
		return (
			s.starting_suite === "demo" &&
			s.starting_runner !== "local-cli" &&
			s.starting_runner !== "github-actions"
		);
	};

	return (
		<GetStartedContext.Provider value={state}>
			<div class="gs-root">
				<style>{styles}</style>

				{/* Selector Panel */}
				<div class="gs-selector-panel">
					<SegmentSelector
						label="Suite"
						field="starting_suite"
						value={state().starting_suite}
						onChange={updateState}
						options={[
							{ value: "existing", label: "Existing Suite" },
							{ value: "demo", label: "Demo Suite" },
						]}
					/>
					<SegmentSelector
						label="Target"
						field="starting_target"
						value={state().starting_target}
						onChange={updateState}
						options={[
							{ value: "local", label: "Local Server" },
							{ value: "remote", label: "Remote Server" },
							{
								value: "vercel",
								label: "Vercel Preview",
								disabled: true,
								badge: "Soon",
							},
						]}
					/>
					<SegmentSelector
						label="Run From"
						field="starting_runner"
						value={state().starting_runner}
						onChange={updateState}
						options={[
							{ value: "local-cli", label: "Local CLI" },
							{ value: "github-actions", label: "GitHub Actions" },
							{ value: "other-ci", label: "Other CI/CD" },
						]}
					/>
				</div>

				<Show when={isInvalidCombination()}>
					<InvalidCombinationWarning
						onSelectRunner={(runner) => updateState("starting_runner", runner)}
						onSelectSuite={(suite) => updateState("starting_suite", suite)}
					/>
				</Show>

				<Show when={!isInvalidCombination()}>
					<div class="gs-steps">
						<When matches={{ starting_runner: "local-cli" }}>
							<LocalCliFlowContent />
						</When>

						<When matches={{ starting_runner: "github-actions" }}>
							<GitHubActionsFlowContent />
						</When>

						<When matches={{ starting_runner: "other-ci" }}>
							<OtherCiFlowContent />
						</When>

						<FinalStep />
					</div>
				</Show>
			</div>
		</GetStartedContext.Provider>
	);
}

function InvalidCombinationWarning(props: {
	onSelectRunner: (runner: Runner) => void;
	onSelectSuite: (suite: SuiteOrigin) => void;
}) {
	return (
		<div class="gs-warning">
			<div class="gs-warning-icon">⚠️</div>
			<div class="gs-warning-content">
				<strong>Demo Suite requires Local CLI or GitHub Actions</strong>
				<p>
					The demo suite is designed to work with Local CLI or GitHub Actions
					only.
				</p>
				<div class="gs-warning-buttons">
					<button
						type="button"
						onClick={() => props.onSelectRunner("local-cli")}
						class="gs-btn gs-btn--primary"
					>
						Use Local CLI
					</button>
					<button
						type="button"
						onClick={() => props.onSelectRunner("github-actions")}
						class="gs-btn gs-btn--primary"
					>
						Use GitHub Actions
					</button>
					<button
						type="button"
						onClick={() => props.onSelectSuite("existing")}
						class="gs-btn gs-btn--ghost"
					>
						Use Existing Suite
					</button>
				</div>
			</div>
		</div>
	);
}

function FinalStep() {
	return (
		<StepBlock step="final" title="View your results">
			<p>
				Once your tests complete, results will appear in the{" "}
				<a
					href="https://endform.dev/app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Endform dashboard
				</a>
				.
			</p>
		</StepBlock>
	);
}

const styles = `
  .gs-root {
    --gs-accent: var(--sl-color-accent, #f97316);
    --gs-accent-high: var(--sl-color-accent-high, #ea580c);
    --gs-bg: var(--sl-color-bg, #0a0a0a);
    --gs-bg-nav: var(--sl-color-bg-nav, #141414);
    --gs-border: var(--sl-color-gray-5, #27272a);
    --gs-border-light: var(--sl-color-gray-6, #18181b);
    --gs-text: var(--sl-color-text, #fafafa);
    --gs-text-muted: var(--sl-color-gray-2, #a1a1aa);
    --gs-radius: 0.5rem;
    --gs-font-mono: var(--sl-font-mono, ui-monospace, monospace);
  }

  /* ===== SELECTOR PANEL ===== */
  .gs-selector-panel {
    background: var(--gs-bg-nav);
    border: 1px solid var(--gs-border);
    border-radius: var(--gs-radius);
    padding: 1.25rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .gs-selector {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 600px) {
    .gs-selector {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }

  .gs-selector-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--gs-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .gs-selector-options {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .gs-selector-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    color: var(--gs-text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
  }

  .gs-selector-button:hover:not(.gs-selector-button--disabled) {
    color: var(--gs-text);
    background: var(--gs-border-light);
  }

  .gs-selector-button--active {
    background: var(--gs-accent) !important;
    color: #000 !important;
    font-weight: 600;
  }

  .gs-selector-button--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .gs-selector-badge {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 0.25rem;
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
  }

  /* ===== STEPS ===== */
  .gs-steps {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .gs-step-block {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .gs-step-header {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  .gs-step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
    background: var(--gs-accent);
    color: #000;
  }

  .gs-step-number--final {
    background: #22c55e;
    color: #fff;
  }

  .gs-check-icon {
    width: 1rem;
    height: 1rem;
  }

  .gs-step-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--gs-text);
  }

  .gs-step-content {
    margin-left: 2.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .gs-step-content p {
    margin: 0;
    color: var(--gs-text-muted);
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .gs-step-content p a {
    color: var(--gs-accent);
  }

  .gs-step-content code {
    padding: 0.125rem 0.375rem;
    background: var(--gs-border-light);
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    font-family: var(--gs-font-mono);
    color: var(--gs-text);
  }

  /* ===== CODE BLOCKS ===== */
  .gs-code-block {
    border-radius: var(--gs-radius);
    overflow: hidden;
    margin-top: 0.5rem;
    background: #0d1117;
    border: 1px solid #30363d;
  }

  .gs-code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1rem;
    background: #161b22;
    border-bottom: 1px solid #30363d;
  }

  .gs-code-filename {
    font-size: 0.75rem;
    font-family: var(--gs-font-mono);
    color: #7d8590;
  }

  .gs-copy-btn {
    font-size: 0.75rem;
    color: #7d8590;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.15s ease;
  }

  .gs-copy-btn:hover {
    color: #c9d1d9;
    background: #30363d;
  }

  .gs-code-pre {
    padding: 1rem;
    margin: 0;
    font-size: 0.8125rem;
    overflow-x: auto;
    font-family: var(--gs-font-mono);
    line-height: 1.6;
    background: #0d1117;
    color: #c9d1d9;
  }

  /* ===== COMMAND SNIPPETS ===== */
  .gs-command {
    display: flex;
    align-items: stretch;
    gap: 0;
    margin-top: 0.5rem;
    border-radius: var(--gs-radius);
    overflow: hidden;
    border: 1px solid #30363d;
    background: #0d1117;
  }

  .gs-command-pre {
    font-size: 0.875rem;
    font-family: var(--gs-font-mono);
    padding: 0.75rem 1rem;
    margin: 0;
    overflow-x: auto;
    flex: 1;
    color: #c9d1d9;
    background: transparent;
    display: flex;
    align-items: center;
  }

  .gs-command-pre::before {
    content: '$';
    color: #7d8590;
    margin-right: 0.75rem;
    font-weight: 600;
  }

  .gs-command-copy {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
    background: #161b22;
    border: none;
    border-left: 1px solid #30363d;
    cursor: pointer;
    color: #7d8590;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .gs-command-copy:hover {
    background: #21262d;
    color: #c9d1d9;
  }

  .gs-copy-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  /* ===== WARNING ===== */
  .gs-warning {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(234, 179, 8, 0.1);
    border: 1px solid rgba(234, 179, 8, 0.3);
    border-radius: var(--gs-radius);
    margin-bottom: 2rem;
  }

  .gs-warning-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .gs-warning-content {
    flex: 1;
  }

  .gs-warning-content strong {
    color: #facc15;
    font-size: 0.9375rem;
  }

  .gs-warning-content p {
    color: #fde047;
    font-size: 0.875rem;
    margin: 0.375rem 0 0.75rem;
    opacity: 0.9;
  }

  .gs-warning-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  /* ===== BUTTONS ===== */
  .gs-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
  }

  .gs-btn--primary {
    background: #eab308;
    color: #000;
  }

  .gs-btn--primary:hover {
    background: #facc15;
  }

  .gs-btn--ghost {
    background: transparent;
    border: 1px solid rgba(234, 179, 8, 0.4);
    color: #facc15;
  }

  .gs-btn--ghost:hover {
    background: rgba(234, 179, 8, 0.1);
  }

  /* ===== LINK BUTTONS ===== */
  .gs-link-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: var(--gs-border-light);
    border: 1px solid var(--gs-border);
    border-radius: var(--gs-radius);
    color: var(--gs-text);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.5rem;
    transition: all 0.15s ease;
  }

  .gs-link-button:hover {
    background: var(--gs-border);
    border-color: var(--gs-text-muted);
  }

  .gs-link-icon {
    width: 1rem;
    height: 1rem;
  }

  .gs-step-content small {
    color: var(--gs-text-muted);
    font-size: 0.8125rem;
  }
`;
