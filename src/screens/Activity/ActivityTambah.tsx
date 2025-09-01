import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useActivityForm } from './hooks/useActivityForm';

import { STATUS_WORK_OPTIONS } from './types/activity.types';
import { DateTimeInput, FormDropdown, FormField, LoadingOverlay, SectionHeader, SubmitButton, FormContainer, ActivityErrorBanner } from './components/activity-form';

const ActivityTambah: React.FC = () => {
    const {
        isLoading,
        formValues,
        formState,
        error,
        validationError,
        handleDateChange,
        handleJamMasukChange,
        handleJamPulangChange,
        handleStatusChange,
        showDatePicker,
        showJamMasukPicker,
        showJamPulangPicker,
        onSubmit,
    } = useActivityForm();

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={isLoading} />

            <SectionHeader
                icon="profile"
                title="Aktivitas Header"
                color="#56C58D"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <FormContainer error={error} validationError={validationError}>
                    <FormField label="Tanggal Masuk" required>
                        <DateTimeInput
                            value={formValues.dateValue}
                            placeholder="Pilih Tanggal"
                            iconName="calendar"
                            onPress={showDatePicker}
                            showPicker={formState.showDatePicker}
                            pickerValue={formValues.date}
                            pickerMode="date"
                            onPickerChange={handleDateChange}
                            maximumDate={new Date(2200, 12, 31)}
                            minimumDate={new Date(2005, 1, 1)}
                        />
                    </FormField>

                    <FormField label="Jam Masuk" required>
                        <DateTimeInput
                            value={formValues.jamMasukValue}
                            placeholder="Pilih Jam Masuk"
                            iconName="clockcircleo"
                            onPress={showJamMasukPicker}
                            showPicker={formState.showJamMasukPicker}
                            pickerValue={formValues.jamMasuk}
                            pickerMode="time"
                            onPickerChange={handleJamMasukChange}
                        />
                    </FormField>

                    <FormField label="Jam Pulang" required>
                        <DateTimeInput
                            value={formValues.jamPulangValue}
                            placeholder="Pilih Jam Pulang"
                            iconName="clockcircleo"
                            onPress={showJamPulangPicker}
                            showPicker={formState.showJamPulangPicker}
                            pickerValue={formValues.jamPulang}
                            pickerMode="time"
                            onPickerChange={handleJamPulangChange}
                        />
                    </FormField>

                    <FormField label="Status Kerja" required>
                        <FormDropdown
                            data={STATUS_WORK_OPTIONS}
                            value={formValues.statusValue}
                            placeholder="Pilih Status Kerja"
                            onChange={handleStatusChange}
                        />
                    </FormField>

                    {error && <ActivityErrorBanner error={error} />}
                    {validationError && <ActivityErrorBanner error={validationError} />}

                    <SubmitButton
                        title="Simpan"
                        onPress={onSubmit}
                        isLoading={isLoading}
                    />
                </FormContainer>
            </ScrollView>
        </View>
    );
};

export default ActivityTambah;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 50,
    },

});