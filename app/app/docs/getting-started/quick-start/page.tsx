export default function QuickStartPage() {
  return (
    <div className="max-w-4xl animate-fade-in">
      <h1 className="docs-h1">Quick Start</h1>
      <p className="docs-p text-xl text-slate-600 dark:text-slate-400">
        Get up and running with Aether Identity in 5 minutes.
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-number">1</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Install the SDK</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Install Aether Identity SDK using your preferred package manager.
            </p>
            <div className="docs-code-block mt-3">
              {`npm install @aether-identity/sdk`}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              or with pnpm:
            </p>
            <div className="docs-code-block mt-3">
              {`pnpm add @aether-identity/sdk`}
            </div>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-number">2</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Initialize the Client</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create a client instance with your API credentials.
            </p>
            <div className="docs-code-block mt-3">
              {`import { AetherClient } from '@aether-identity/sdk';

const client = new AetherClient({
  apiKey: process.env.AETHER_API_KEY,
  endpoint: 'https://api.aether.com'
});`}
            </div>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-number">3</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Authenticate a User</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Use the client to authenticate users in your application.
            </p>
            <div className="docs-code-block mt-3">
              {`// Start an authentication flow
const session = await client.authenticate({
  provider: 'oauth2',
  redirectUri: 'https://yourapp.com/callback'
});

console.log('User authenticated:', session.user);`}
            </div>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-number">4</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Verify Tokens</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Secure your API endpoints by verifying tokens.
            </p>
            <div className="docs-code-block mt-3">
              {`// Verify an incoming request
const payload = await client.verifyToken(token);

if (payload.isValid) {
  console.log('Request authorized for:', payload.userId);
}`}
            </div>
          </div>
        </div>
      </div>

      <div className="callout success mt-8">
        <div className="callout-content">
          <h4 className="callout-title">Congratulations!</h4>
          <p>
            You've successfully integrated Aether Identity into your
            application. Check out the{" "}
            <Link href="/docs/sdk/core" className="docs-link">
              Core SDK
            </Link>{" "}
            documentation for more advanced features.
          </p>
        </div>
      </div>
    </div>
  );
}

function Link({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`docs-link ${className || ""}`}>
      {children}
    </a>
  );
}
