import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useAbsensiReport } from './hooks/useAbsensiReport';
import { LoadingScreen } from './components/absensi';
import { AbsensiContent } from './components/absensi';

const AbsensiReport: React.FC = () => {
    const {
        isLoading,
        isRefresh,
        filteredData,
        attendanceStats,
        selectedFilter,
        setSelectedFilter,
        onRefresh,
    } = useAbsensiReport();

    return (
        <SafeAreaView style={styles.safeArea}>
            {isLoading && !isRefresh ? (
                <LoadingScreen />
            ) : (
                <AbsensiContent
                    data={filteredData}
                    stats={attendanceStats}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    isRefreshing={isRefresh}
                    onRefresh={onRefresh}
                />
            )}
        </SafeAreaView>
    );
};

export default AbsensiReport;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#F8F9FA',
        flex: 1,
    },
});