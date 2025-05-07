/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AuthProviders } from './src/providers/AuthProviders';
import AuthNavigation from './src/navigation/AuthNavigation';

function App() {
    return (
        <AuthProviders>
            <AuthNavigation />
        </AuthProviders>
    )
}

export default App;
