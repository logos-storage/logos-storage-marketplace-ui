import { StrictMode } from "react";
import "./index.css";
import { render } from "preact";
// Import the generated route tree
import * as Sentry from "@sentry/react";
import { CodexSdk } from "./sdk/codex";
import { OnBoardingRoute } from "./routes/onboarding.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnBoardingNameRoute } from "./routes/onboarding-name.tsx";
import { OnBoardingChecksRoute } from "./routes/onboarding-checks.tsx";
import { Root } from "./routes/root.tsx";
import { DashboardRoute } from "./routes/dashboard/dashboard.tsx";
import { WalletRoute } from "./routes/dashboard/wallet.tsx";
import { FilesRoute } from "./routes/dashboard/files.tsx";
import { PurchasesRoute } from "./routes/dashboard/purchases.tsx";
import { AvailabilitiesRoute } from "./routes/dashboard/availabilities.tsx";
import { PeersRoute } from "./routes/dashboard/peers.tsx";
import { LogsRoute } from "./routes/dashboard/logs.tsx";
import { SettingsRoute } from "./routes/dashboard/settings.tsx";
import { HelpRoute } from "./routes/dashboard/help.tsx";
import { DisclaimerRoute } from "./routes/dashboard/disclaimer.tsx";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary/RouteErrorBoundary.tsx";
import { HealthCheckUtils } from "./components/HealthChecks/health-check.utils.ts";

if (import.meta.env.PROD && !import.meta.env.CI) {
  Sentry.init({
    release: "codex-storage-marketplace-ui@" + import.meta.env.PACKAGE_VERSION,
    dsn: "https://22d77c59a27b8d5efc07132188b505b9@o4507855852011520.ingest.de.sentry.io/4507866758512720",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      // Sentry.feedbackIntegration({
      //   // Additional SDK configuration goes in here, for example:
      //   colorScheme: "dark",
      //   triggerLabel: "",
      //   autoInject: false,
      // }),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnBoardingRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/onboarding-name",
    element: <OnBoardingNameRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/onboarding-checks",
    element: <OnBoardingChecksRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Root />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "",
        element: <DashboardRoute />,
      },
      {
        path: "wallet",
        element: <WalletRoute />,
      },
      {
        path: "files",
        element: <FilesRoute />,
      },
      {
        path: "purchases",
        element: <PurchasesRoute />,
      },
      {
        path: "availabilities",
        element: <AvailabilitiesRoute />,
      },
      {
        path: "peers",
        element: <PeersRoute />,
      },
      {
        path: "logs",
        element: <LogsRoute />,
      },
      {
        path: "settings",
        element: <SettingsRoute />,
      },
      {
        path: "help",
        element: <HelpRoute />,
      },
      {
        path: "disclaimer",
        element: <DisclaimerRoute />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;

if (rootElement) {
  CodexSdk.load()
    .then(() => {
      const queryString = window.location.search;
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        const param = urlParams.get("api-port");
        if (param) {
          const port = parseInt(param, 10);
          if (!isNaN(port)) {
            const address = HealthCheckUtils.removePort(CodexSdk.url());

            const url = address + ":" + port;

            if (HealthCheckUtils.isUrlInvalid(url)) {
              return;
            }

            return CodexSdk.updateURL(url, {});
          }
        }
      }
    })
    .then(() => {
      render(
        <StrictMode>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </StrictMode>,
        rootElement
      );
    });
}
