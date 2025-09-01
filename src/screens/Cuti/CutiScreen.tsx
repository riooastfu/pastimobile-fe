import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCutiScreen } from './hooks/useCutiScreen';
import {
    CutiLoadingScreen,
    CutiSaldoDisplay,
    CutiCardList,
    CutiEmptyState,
    CutiErrorState,
} from './components/cuti-screen';

const CutiScreen: React.FC = () => {
    const {
        isLoading,
        kartuCuti,
        saldoInfo,
        hasValidCuti,
        error,
        onRefresh,
        onCardPress,
    } = useCutiScreen();

    if (isLoading) {
        return <CutiLoadingScreen />;
    }

    if (error) {
        return <CutiErrorState error={error} onRetry={onRefresh} />;
    }

    if (!hasValidCuti) {
        return <CutiEmptyState onRefresh={onRefresh} />;
    }

    return (
        <View style={styles.container}>
            <CutiSaldoDisplay
                saldoInfo={saldoInfo}
                isLoading={isLoading}
            />

            <CutiCardList
                kartuCuti={kartuCuti}
                onCardPress={onCardPress}
            />
        </View>
    );
};

export default CutiScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        gap: 10,
    },
});