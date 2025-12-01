import { Show } from "solid-js";
import { CodeBlock } from "../CodeBlock";
import { StepBlock } from "../StepBlock";
import { When } from "../When";

export function OtherCiFlowContent() {
	return (
		<>
			<StepBlock step={1} title="Generate an API key">
				<p>Create an API key to authenticate your CI pipeline with Endform:</p>
				<a
					href="https://endform.dev/app"
					target="_blank"
					rel="noopener noreferrer"
					class="gs-link-button"
				>
					<svg
						class="gs-link-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
						/>
					</svg>
					Generate API Key in Dashboard
				</a>
				<p>
					<small>
						Set this as the <code>ENDFORM_API_KEY</code> environment variable in
						your CI system.
					</small>
				</p>
			</StepBlock>

			<When matches={{ starting_target: "local" }}>
				<StepBlock step={2} title="Configure Playwright webServer">
					<p>
						Configure your <code>playwright.config.ts</code> to start your dev
						server in CI:
					</p>
					<CodeBlock filename="playwright.config.ts" language="typescript">
						{`import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});`}
					</CodeBlock>
				</StepBlock>
			</When>

			{/* Step 3 (or 2 for remote/vercel): Configure CI */}
			<When matches={{ starting_target: "local" }}>
				<StepBlock step={3} title="Configure your CI pipeline">
					<CiPipelineExamples showBaseUrl={false} />
				</StepBlock>
			</When>

			<When
				matches={[{ starting_target: "remote" }, { starting_target: "vercel" }]}
			>
				<StepBlock step={2} title="Configure your CI pipeline">
					<CiPipelineExamples showBaseUrl={true} />
				</StepBlock>
			</When>

			{/* Final configure step number varies */}
			<When matches={{ starting_target: "local" }}>
				<StepBlock step={4} title="Run your pipeline">
					<p>
						Commit and push your CI configuration. Tests will run on your next
						pipeline execution.
					</p>
				</StepBlock>
			</When>

			<When
				matches={[{ starting_target: "remote" }, { starting_target: "vercel" }]}
			>
				<StepBlock step={3} title="Run your pipeline">
					<p>
						Commit and push your CI configuration. Tests will run on your next
						pipeline execution.
					</p>
				</StepBlock>
			</When>
		</>
	);
}

function CiPipelineExamples(props: { showBaseUrl: boolean }) {
	const baseUrlLine = props.showBaseUrl
		? "\n    BASE_URL: https://your-server.com"
		: "";
	const baseUrlComment = props.showBaseUrl
		? "\n        # Also set BASE_URL to your server URL"
		: "";

	return (
		<>
			<p>
				Add these steps to your CI configuration. Examples for popular
				platforms:
			</p>

			<CodeBlock filename=".gitlab-ci.yml" language="yaml">
				{`e2e-tests:
  image: node:20
  script:
    - npm ci
    - npx endform@latest test
  variables:
    ENDFORM_API_KEY: $ENDFORM_API_KEY${baseUrlLine}`}
			</CodeBlock>

			<CodeBlock filename=".circleci/config.yml" language="yaml">
				{`version: 2.1
jobs:
  e2e:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run: npm ci
      - run: npx endform@latest test
    environment:
      ENDFORM_API_KEY: $ENDFORM_API_KEY${baseUrlLine}`}
			</CodeBlock>

			<CodeBlock filename="azure-pipelines.yml" language="yaml">
				{`trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
  - script: npm ci
    displayName: 'Install dependencies'
  - script: npx endform@latest test
    displayName: 'Run E2E tests'
    env:
      ENDFORM_API_KEY: $(ENDFORM_API_KEY)${props.showBaseUrl ? "\n      BASE_URL: $(BASE_URL)" : ""}`}
			</CodeBlock>

			<CodeBlock filename="bitbucket-pipelines.yml" language="yaml">
				{`pipelines:
  default:
    - step:
        name: E2E Tests
        image: node:20
        script:
          - npm ci
          - npx endform@latest test
        # Set ENDFORM_API_KEY in repository variables${baseUrlComment}`}
			</CodeBlock>

			<Show when={props.showBaseUrl}>
				<p>
					<small>
						Make sure to set <code>BASE_URL</code> to your server's URL in your
						CI environment variables.
					</small>
				</p>
			</Show>
		</>
	);
}
