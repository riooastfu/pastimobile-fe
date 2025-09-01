import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCutiHistory } from './hooks/useCutiHistory';
import {
    CutiHistoryLoading,
    CutiHistoryEmpty,
    CutiHistoryError,
    CutiHistoryList,
    CutiDetailModal,
} from './components/cuti-history';
import { CutiHistoryData } from './types/cuti.types';

const CutiHistory: React.FC = () => {
    const {
        isLoading,
        detailCuti,
        error,
        isRefreshing,
        onRefresh,
    } = useCutiHistory();

    const [modalData, setModalData] = useState<CutiHistoryData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleItemPress = (item: CutiHistoryData) => {
        setModalData(item);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setModalData(null);
    };
    if (isLoading) {
        return (
            <View style={styles.container}>
                <CutiHistoryLoading />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <CutiHistoryError error={error} onRetry={onRefresh} />
            </View>
        );
    }

    if (detailCuti.length === 0) {
        return (
            <View style={styles.container}>
                <CutiHistoryEmpty onRefresh={onRefresh} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CutiHistoryList
                data={detailCuti}
                isRefreshing={isRefreshing}
                onRefresh={onRefresh}
                onItemPress={handleItemPress}
            />
            
            <CutiDetailModal
                isVisible={isModalVisible}
                data={modalData}
                onClose={handleModalClose}
            />
        </View>
    );
};

export default CutiHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop: 10,
    },
});