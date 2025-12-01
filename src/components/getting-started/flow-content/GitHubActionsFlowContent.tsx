import { CodeBlock } from "../CodeBlock";
import { CommandSnippet } from "../CommandSnippet";
import { StepBlock } from "../StepBlock";
import { When } from "../When";

export function GitHubActionsFlowContent() {
	return (
		<>
			<StepBlock step={1} title="Connect GitHub">
				<p>
					Install the Endform GitHub App to enable OIDC authentication in your
					workflows:
				</p>
				<a
					href="https://endform.dev/app"
					target="_blank"
					rel="noopener noreferrer"
					class="gs-link-button"
				>
					<svg class="gs-link-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					Connect GitHub in Dashboard
				</a>
			</StepBlock>

			<When matches={{ starting_target: "vercel" }}>
				<StepBlock step={2} title="Connect Vercel">
					<p>
						Connect your Vercel account to automatically test preview
						deployments:
					</p>
					<a
						href="https://endform.dev/app"
						target="_blank"
						rel="noopener noreferrer"
						class="gs-link-button"
					>
						<svg class="gs-link-icon" viewBox="0 0 24 24" fill="currentColor">
							<path d="M24 22.525H0l12-21.05 12 21.05z" />
						</svg>
						Connect Vercel in Dashboard
					</a>
				</StepBlock>
			</When>

			{/* Demo Suite + Vercel: Deploy with Vercel button */}
			<When matches={{ starting_suite: "demo", starting_target: "vercel" }}>
				<StepBlock step={3} title="Deploy the demo project">
					<p>
						Deploy our demo repository to your Vercel account. This will
						automatically configure the project and start running tests on main:
					</p>
					<a
						href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fendformdev%2Fplaywright-tutorial"
						target="_blank"
						rel="noopener noreferrer"
						class="gs-link-button"
					>
						<svg class="gs-link-icon" viewBox="0 0 24 24" fill="currentColor">
							<path d="M24 22.525H0l12-21.05 12 21.05z" />
						</svg>
						Deploy with Vercel
					</a>
					<p>
						<small>
							Once deployed, tests will automatically run. Results will appear
							in the dashboard shortly.
						</small>
					</p>
				</StepBlock>
			</When>

			{/* Workflow file step - varies by target and suite */}
			<When matches={{ starting_suite: "existing", starting_target: "vercel" }}>
				<StepBlock step={3} title="Create workflow file">
					<GitHubActionsWorkflowContent />
				</StepBlock>
			</When>
			<When
				matches={[
					{ starting_suite: "existing", starting_target: "local" },
					{ starting_suite: "existing", starting_target: "remote" },
				]}
			>
				<StepBlock step={2} title="Create workflow file">
					<GitHubActionsWorkflowContent />
				</StepBlock>
			</When>
			<When
				matches={[
					{ starting_suite: "demo", starting_target: "local" },
					{ starting_suite: "demo", starting_target: "remote" },
				]}
			>
				<StepBlock step={2} title="Create workflow file">
					<GitHubActionsWorkflowContent />
				</StepBlock>
			</When>

			{/* Commit & Push steps for non-demo-vercel flows */}
			<When
				matches={[
					{ starting_suite: "existing", starting_target: "local" },
					{ starting_suite: "existing", starting_target: "remote" },
					{ starting_suite: "demo", starting_target: "local" },
					{ starting_suite: "demo", starting_target: "remote" },
				]}
			>
				<StepBlock step={3} title="Commit your changes">
					<CommitStep />
				</StepBlock>
				<StepBlock step={4} title="Push to trigger tests">
					<PushStep />
				</StepBlock>
			</When>

			<When matches={{ starting_suite: "existing", starting_target: "vercel" }}>
				<StepBlock step={4} title="Commit your changes">
					<CommitStep />
				</StepBlock>
				<StepBlock step={5} title="Push to trigger tests">
					<PushStep />
				</StepBlock>
			</When>
		</>
	);
}

function GitHubActionsWorkflowContent() {
	return (
		<>
			<p>
				Create <code>.github/workflows/endform-e2e.yml</code> in your
				repository:
			</p>

			<When matches={{ starting_target: "remote" }}>
				<CodeBlock filename=".github/workflows/endform-e2e.yml" language="yaml">
					{`name: Run end to end tests with endform

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  id-token: write # required for authentication with Endform

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up pnpm (or whichever package manager you use)
        uses: pnpm/action-setup@v4

      - name: Install Node
        uses: actions/setup-node@v4

      - name: Run end to end tests with endform
        working-directory: . # where your playwright suite is located
        env:
          BASE_URL: https://url-to-your-server.com
        run: |
          npx endform@latest test`}
				</CodeBlock>
			</When>

			<When matches={{ starting_target: "local" }}>
				<CodeBlock filename=".github/workflows/endform-e2e.yml" language="yaml">
					{`name: Run end to end tests with endform

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  id-token: write # required for authentication with Endform

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up pnpm (or whichever package manager you use)
        uses: pnpm/action-setup@v4

      - name: Install Node
        uses: actions/setup-node@v4
      
      # Any other setup needed for your local server to run...

      - name: Run end to end tests with endform
        working-directory: . # where your playwright suite is located
        run: |
          npx endform@latest test`}
				</CodeBlock>
			</When>

			<When matches={{ starting_target: "vercel" }}>
				<CodeBlock filename=".github/workflows/endform-e2e.yml" language="yaml">
					{`name: Run end to end tests with endform

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read
  id-token: write # required for authentication with Endform

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up pnpm (or whichever package manager you use)
        uses: pnpm/action-setup@v4

      - name: Install Node
        uses: actions/setup-node@v4

      - name: Wait for Vercel deployment
        uses: endformdev/actions/await-vercel-deployment@main
        with:
          project-name: your-vercel-project-name
          set-url-env-var: BASE_URL # Sets the Vercel preview URL as this environment variable

      - name: Run end to end tests with endform
        working-directory: . # where your playwright suite is located
        run: |
          npx endform@latest test`}
				</CodeBlock>
			</When>
		</>
	);
}

function CommitStep() {
	return (
		<>
			<p>Stage and commit your workflow file:</p>
			<CommandSnippet command='git add -A && git commit -m "Add endform github actions workflow"' />
		</>
	);
}

function PushStep() {
	return (
		<>
			<p>
				Push your changes to trigger the workflow on your next pull request:
			</p>
			<CommandSnippet command="git push" />
		</>
	);
}
