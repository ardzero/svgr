import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  withErrorBoundary,
} from "@/components/utils/react-only/ErrorBoundary";
import { Card } from "@/components/ui/card";

// Component that throws an error during render
const BuggyCounter = () => {
  const [counter, setCounter] = useState(0);

  if (counter === 5) {
    throw new Error("I crashed on purpose when counter reached 5!");
  }

  return (
    <div className="space-y-4">
      <p>Counter: {counter}</p>
      <Button onClick={() => setCounter((c) => c + 1)}>
        Increment (Crashes at 5)
      </Button>
    </div>
  );
};

// Component with async error
const AsyncErrorComponent = () => {
  const [error, setError] = useState<string | null>(null);

  const triggerAsyncError = async () => {
    try {
      // Simulate an API call that fails
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Async operation failed!")), 1000);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  if (error) throw new Error(error);

  return <Button onClick={triggerAsyncError}>Trigger Async Error</Button>;
};

// HOC (Higher Order Component)  Usage
const RiskyComponent = () => {
  // Some component that might error
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Test 4: HOC Usage</h2>
      {/* Add the HOC example here if you implemented it */}
      <ErrorBoundary>
        <BuggyCounter />
      </ErrorBoundary>
    </Card>
  );
};
// Wrap the component with HOC error boundary
const SafeRiskyComponent = withErrorBoundary(RiskyComponent);

// Test page component
export default function TestPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Test Case 1: Render Error */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Test 1: Render Error</h2>
        <ErrorBoundary>
          <BuggyCounter />
        </ErrorBoundary>
      </Card>

      {/* Test Case 2: Async Error */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Test 2: Async Error</h2>
        <ErrorBoundary>
          <AsyncErrorComponent />
        </ErrorBoundary>
      </Card>

      {/* Test Case 3: Custom Fallback */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Test 3: Custom Fallback</h2>
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <div className="rounded-lg bg-orange-100 p-4 dark:bg-orange-900">
              <h3 className="font-medium">Custom Error View</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This is a custom error message with different styling.
              </p>
              <code>{error?.message}</code>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          )}
        >
          <BuggyCounter />
        </ErrorBoundary>
      </Card>

      {/* Test Case 4: HOC Usage */}
      <SafeRiskyComponent />
    </div>
  );
}
