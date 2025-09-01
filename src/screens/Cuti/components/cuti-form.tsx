import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import { DropDownType } from '../../../types';
import { CutiFormHeaderProps } from '../types/cuti.types';

// Loading Overlay Component
interface LoadingOverlayProps {
    visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" />
            </View>
        </View>
    );
};

// Form Header Component
export const CutiFormHeader: React.FC<CutiFormHeaderProps> = ({ saldo = 0 }) => (
    <>
        <StatusBar backgroundColor="#fff5f5" />
        <View style={styles.headerWrapper}>
            <View style={styles.headerContainer}>
                <View style={styles.iconContainer}>
                    <Icon name="rocket1" color="#a35d5d" size={wp('6%')} />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Form Pengajuan Cuti</Text>
                    <Text style={styles.headerSubtitle}>
                        Jumlah cuti yang bisa diambil adalah{' '}
                        <Text style={styles.highlightedText}>{saldo}</Text> hari
                    </Text>
                </View>
            </View>
        </View>
    </>
);

// Form Field Container
interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    required = false,
    children,
}) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
            {label}
            {required && <Text style={styles.requiredMark}>*</Text>}
        </Text>
        {children}
    </View>
);

// Text Input Field
interface TextFieldProps {
    value: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    inputMode?: 'text' | 'numeric';
    multiline?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
    value,
    onChangeText,
    placeholder,
    editable = true,
    inputMode = 'text',
    multiline = false,
}) => (
    <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        editable={editable}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        inputMode={inputMode}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
    />
);

// Date Picker Field
interface DatePickerFieldProps {
    label: string;
    value: Date;
    show: boolean;
    onShowChange: () => void;
    onDateChange: (event: DateTimePickerEvent, date?: Date) => void;
    placeholder?: string;
    required?: boolean;
    maximumDate?: Date;
    minimumDate?: Date;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    value,
    show,
    onShowChange,
    onDateChange,
    placeholder = 'Pilih Tanggal',
    required = false,
    maximumDate,
    minimumDate,
}) => (
    <FormField label={label} required={required}>
        <View style={styles.dateFieldWrapper}>
            <TextInput
                style={styles.textInput}
                editable={false}
                placeholder={placeholder}
                value={moment(value.toISOString().substring(0, 10)).format('DD-MM-yyyy')}
            />
            <TouchableWithoutFeedback onPress={onShowChange}>
                <View style={styles.calendarIconContainer}>
                    <Icon name="calendar" size={wp('6%')} color="#666" />
                </View>
            </TouchableWithoutFeedback>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                />
            )}
        </View>
    </FormField>
);

// Dropdown Field
interface DropdownFieldProps {
    label: string;
    data: DropDownType[];
    value: number;
    onChange: (item: DropDownType) => void;
    placeholder: string;
    searchPlaceholder?: string;
    required?: boolean;
    searchable?: boolean;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    data,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    required = false,
    searchable = true,
}) => {
    const renderItem = (item: DropDownType) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );

    return (
        <FormField label={label} required={required}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearchInput}
                search={searchable}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                value={value}
                onChange={onChange}
                renderItem={renderItem}
            />
        </FormField>
    );
};

// Submit Button
interface SubmitButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
}) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[
            styles.submitButton,
            (disabled || isLoading) && styles.submitButtonDisabled,
        ]}
    >
        {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
        ) : (
            <Text style={styles.submitButtonText}>{title}</Text>
        )}
    </TouchableOpacity>
);

// Error Banner Component
interface ErrorBannerProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => (
    <View style={styles.errorBanner}>
        <View style={styles.errorContent}>
            <Icon name="exclamationcircleo" size={wp('4%')} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
        </View>
        {onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.errorRetryButton}>
                <Text style={styles.errorRetryText}>Coba Lagi</Text>
            </TouchableOpacity>
        )}
    </View>
);

// Form Container
interface FormContainerProps {
    children: React.ReactNode;
    error?: string | null;
    onRetry?: () => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({ 
    children, 
    error, 
    onRetry 
}) => (
    <View style={styles.formContainer}>
        {error && <ErrorBanner error={error} onRetry={onRetry} />}
        <View style={styles.formCard}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    // Loading styles
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loadingBox: {
        width: wp('20%'),
        height: wp('20%'),
        backgroundColor: '#fff5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2%'),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    // Header styles
    headerWrapper: {
        padding: 15,
        backgroundColor: '#fff5f5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: wp('1%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    iconContainer: {
        backgroundColor: '#edc2c2',
        padding: 15,
        borderRadius: wp('1%'),
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: wp('4%'),
    },
    headerSubtitle: {
        fontSize: wp('3%'),
        color: '#666',
        marginTop: 2,
    },
    highlightedText: {
        color: '#a35d5d',
        fontWeight: 'bold',
    },

    // Form styles
    formContainer: {
        padding: 15,
    },
    formCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: wp('1%'),
        gap: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    fieldContainer: {
        gap: 6,
    },
    fieldLabel: {
        fontWeight: 'bold',
        fontSize: wp('3.5%'),
        color: '#333',
    },
    requiredMark: {
        color: '#FF6B6B',
    },

    // Input styles
    textInput: {
        height: wp('10%'),
        borderWidth: wp('0.1%'),
        borderRadius: wp('1%'),
        borderColor: '#ddd',
        paddingHorizontal: 10,
        fontSize: wp('3.5%'),
        backgroundColor: '#fff',
    },
    multilineInput: {
        height: wp('20%'),
        paddingTop: 10,
    },

    // Date picker styles
    dateFieldWrapper: {
        position: 'relative',
    },
    calendarIconContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -wp('3%') }],
        padding: 5,
    },

    // Dropdown styles
    dropdown: {
        height: wp('10%'),
        borderWidth: wp('0.1%'),
        borderRadius: wp('1%'),
        borderColor: '#ddd',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    dropdownPlaceholder: {
        fontSize: wp('3.5%'),
        color: '#999',
    },
    dropdownSelectedText: {
        fontSize: wp('3.5%'),
        color: '#333',
    },
    dropdownSearchInput: {
        fontSize: wp('3.5%'),
        borderBottomColor: '#ddd',
    },
    dropdownItem: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f5f5f5',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: wp('3.5%'),
        color: '#000',
    },

    // Button styles
    submitButton: {
        padding: 12,
        backgroundColor: '#56C58D',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('1%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        elevation: 0,
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp('4%'),
    },

    // Error banner styles
    errorBanner: {
        backgroundColor: '#fee',
        padding: 12,
        borderRadius: wp('1%'),
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#ff6b6b',
    },
    errorContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        flex: 1,
        color: '#d32f2f',
        fontSize: wp('3.2%'),
        lineHeight: wp('4.2%'),
    },
    errorRetryButton: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: wp('1%'),
    },
    errorRetryText: {
        color: '#fff',
        fontSize: wp('3%'),
        fontWeight: '500',
    },
});