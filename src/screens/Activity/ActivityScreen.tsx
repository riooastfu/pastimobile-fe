import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useActivityScreen } from './hooks/useActivityScreen';
import {
    LoadingScreen,
    ActivityErrorState,
    ActivityContent,
    ActivitySearchHeader,
} from './components/activity-screen';

const ActivityScreen: React.FC = () => {
    const {
        isLoading,
        isRefreshing,
        laporanKesehatan,
        dateFilter,
        error,
        deleteError,
        onDateFilterChange,
        onRefresh,
        onDelete,
        onAddActivity,
        onEditActivity,
        clearDeleteError,
    } = useActivityScreen();

    const renderContent = () => {
        if (isLoading) return <LoadingScreen />;
        
        if (error) {
            return (
                <SafeAreaView style={styles.content}>
                    <ActivityErrorState error={error} onRetry={onRefresh} />
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.content}>
                <ActivityContent
                    data={laporanKesehatan}
                    isRefreshing={isRefreshing}
                    onRefresh={onRefresh}
                    onDelete={onDelete}
                    onAdd={onAddActivity}
                    onEdit={onEditActivity}
                    deleteError={deleteError}
                    onDismissDeleteError={clearDeleteError}
                />
            </SafeAreaView>
        );
    };

    return (
        <View style={styles.container}>
            <ActivitySearchHeader
                dateValue={dateFilter.dateValue}
                onDateChange={onDateFilterChange}
                onSearch={() => onDateFilterChange(dateFilter.date)}
            />
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
});

export default ActivityScreen;