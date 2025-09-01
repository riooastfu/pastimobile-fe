import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useCutiPengajuan } from './hooks/useCutiPengajuan';
import { CutiFormHeader, DatePickerField, DropdownField, FormContainer, FormField, LoadingOverlay, SubmitButton, TextField, ErrorBanner } from './components/cuti-form';


const CutiPengajuan: React.FC = () => {
    const {
        // State
        isLoading,
        cutiData,
        formValues,
        formState,
        dataPIC,
        dataAtasan,
        error,
        validationError,

        // Form handlers
        updateFormValue,
        handleTanggalDariChange,
        handleTanggalSampaiChange,
        showTanggalDariPicker,
        showTanggalSampaiPicker,
        handlePICChange,
        handleAtasanChange,

        // Actions
        onSubmit,
        fetchData,
    } = useCutiPengajuan();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LoadingOverlay visible={isLoading} />

            <CutiFormHeader saldo={cutiData.saldo} />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <FormContainer error={error} onRetry={fetchData}>

                    <DatePickerField
                        label="Dari"
                        value={formValues.tanggalDari}
                        show={formState.tanggalDariShow}
                        onShowChange={showTanggalDariPicker}
                        onDateChange={handleTanggalDariChange}
                        required
                        maximumDate={new Date(2200, 12, 31)}
                        minimumDate={new Date(2005, 1, 1)}
                    />

                    <DatePickerField
                        label="Hingga"
                        value={formValues.tanggalSampai}
                        show={formState.tanggalSampaiShow}
                        onShowChange={showTanggalSampaiPicker}
                        onDateChange={handleTanggalSampaiChange}
                        required
                        maximumDate={new Date(2200, 12, 31)}
                        minimumDate={new Date(2005, 1, 1)}
                    />

                    <FormField label="Total Hari">
                        <TextField
                            value={`${formState.totalHariLibur}`}
                            editable={false}
                        />
                    </FormField>

                    <FormField label="Keperluan" required>
                        <TextField
                            value={formValues.keperluan}
                            onChangeText={(text) => updateFormValue('keperluan', text)}
                            placeholder="contoh: Keperluan pribadi"
                            multiline
                        />
                    </FormField>

                    <FormField label="Alamat" required>
                        <TextField
                            value={formValues.alamat}
                            onChangeText={(text) => updateFormValue('alamat', text)}
                            placeholder="contoh: Jl. Bahagia II"
                            multiline
                        />
                    </FormField>

                    <DropdownField
                        label="PIC"
                        data={dataPIC}
                        value={formValues.valuePIC}
                        onChange={handlePICChange}
                        placeholder="Pilih PIC"
                        searchPlaceholder="contoh: Dhani"
                        required
                    />

                    <DropdownField
                        label="Atasan"
                        data={dataAtasan}
                        value={formValues.valueAtasan}
                        onChange={handleAtasanChange}
                        placeholder="Pilih Atasan"
                        searchPlaceholder="contoh: Dhani"
                        required
                    />

                    <FormField label="Nomor Telepon" required>
                        <TextField
                            value={formValues.telp}
                            onChangeText={(text) => updateFormValue('telp', text)}
                            placeholder="contoh: 081200006789"
                            inputMode="numeric"
                        />
                    </FormField>

                    <View style={{ marginTop: 15 }}> 
                        {validationError && (
                        <ErrorBanner error={validationError} />
                    )}

                    <SubmitButton
                        title="Simpan"
                        onPress={onSubmit}
                        isLoading={isLoading}
                    />
                    </View>

                </FormContainer>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CutiPengajuan;

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