import React, { use } from 'react';
import { AuthProviders } from './src/providers/auth-provider';
import { ThemeProvider } from './src/providers/theme-provider';
import { LoadingProvider } from './src/providers/loading-provider';

import AuthNavigation from './src/navigation/auth-navigation';
import { ErrorBoundary } from './src/components/error-boundary';
// import { useNotifications } from './src/hooks/use-notifications';

function App() {
  // useNotifications();
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <ThemeProvider>
          <AuthProviders>
            <AuthNavigation />
          </AuthProviders>
        </ThemeProvider>
      </LoadingProvider>
    </ErrorBoundary>
  )
}

export default App;
