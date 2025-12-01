import { CodeBlock } from "../CodeBlock";
import { CommandSnippet } from "../CommandSnippet";
import { StepBlock } from "../StepBlock";
import { When } from "../When";

export function LocalCliFlowContent() {
	return (
		<>
			<StepBlock step={1} title="Set up your project">
				<When matches={{ starting_suite: "existing" }}>
					<p>Navigate to your Playwright project root:</p>
					<CommandSnippet command="cd your-project" />
				</When>

				<When matches={{ starting_suite: "demo" }}>
					<p>Clone our tutorial repository to get started quickly:</p>
					<CommandSnippet command="git clone git@github.com:endformdev/playwright-tutorial.git && cd playwright-tutorial" />
					<CommandSnippet command="pnpm install" />
				</When>
			</StepBlock>

			<StepBlock step={2} title="Login to Endform">
				<p>Authenticate with the Endform CLI:</p>
				<CommandSnippet command="npx endform@latest login" />
			</StepBlock>

			<StepBlock step={3} title="Configure Playwright">
				<When
					matches={{ starting_suite: "existing", starting_target: "local" }}
				>
					<p>
						Configure your <code>playwright.config.ts</code> webServer to boot
						your local server:
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
				</When>

				<When
					matches={{ starting_suite: "existing", starting_target: "remote" }}
				>
					<p>
						Configure your <code>playwright.config.ts</code> to point to your
						remote server:
					</p>
					<CodeBlock filename="playwright.config.ts" language="typescript">
						{`import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://staging.yourapp.com',
  },
});`}
					</CodeBlock>
				</When>

				<When
					matches={{ starting_suite: "existing", starting_target: "vercel" }}
				>
					<p>
						Configure your <code>playwright.config.ts</code> to use the Vercel
						preview URL:
					</p>
					<CodeBlock filename="playwright.config.ts" language="typescript">
						{`import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.VERCEL_URL || 'https://your-project.vercel.app',
  },
});`}
					</CodeBlock>
				</When>

				<When matches={{ starting_suite: "demo", starting_target: "local" }}>
					<p>
						The tutorial repository has <code>webServer</code> configured to
						start the dev server on port 3000:
					</p>
					<CodeBlock filename="playwright.config.ts" language="typescript">
						{`// Already configured in the tutorial repository
export default defineConfig({
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});`}
					</CodeBlock>
				</When>

				<When matches={{ starting_suite: "demo", starting_target: "remote" }}>
					<p>
						You can test against our deployed demo app. Set the{" "}
						<code>baseURL</code> in your config:
					</p>
					<CodeBlock filename="playwright.config.ts" language="typescript">
						{`import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://endform-playwright-tutorial.vercel.app',
  },
});`}
					</CodeBlock>
				</When>
			</StepBlock>

			<StepBlock step={4} title="Run your tests">
				<p>Execute your test suite with Endform:</p>
				<CommandSnippet command="npx endform@latest test" />
			</StepBlock>
		</>
	);
}
