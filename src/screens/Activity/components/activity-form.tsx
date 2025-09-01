import React from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { DropDownOption } from '../types/activity.types';

// Form Field Container
interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required = false, children }) => (
    <View style={{ marginBottom: 15 }}>
        <Text
            style={{
                fontWeight: 'bold',
                fontSize: wp('3.5%'),
                marginBottom: 6,
                color: '#333',
            }}
        >
            {label}
            {required && <Text style={{ color: '#FF6B6B' }}>*</Text>}
        </Text>
        {children}
    </View>
);

// Date/Time Input Component
interface DateTimeInputProps {
    value: string;
    placeholder: string;
    iconName: string;
    onPress: () => void;
    showPicker: boolean;
    pickerValue: Date;
    pickerMode: 'date' | 'time';
    onPickerChange: (event: DateTimePickerEvent, date?: Date) => void;
    maximumDate?: Date;
    minimumDate?: Date;
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
    value,
    placeholder,
    iconName,
    onPress,
    showPicker,
    pickerValue,
    pickerMode,
    onPickerChange,
    maximumDate,
    minimumDate,
}) => (
    <View style={{ position: 'relative' }}>
        <TextInput
            style={{
                height: wp('10%'),
                borderWidth: wp('0.1%'),
                borderRadius: wp('1%'),
                borderColor: '#ddd',
                paddingHorizontal: 10,
                fontSize: wp('3.5%'),
                backgroundColor: '#fff',
            }}
            editable={false}
            placeholder={placeholder}
            value={value}
        />
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    position: 'absolute',
                    right: 7,
                    top: '50%',
                    transform: [{ translateY: -wp('3%') }],
                    padding: 5,
                }}
            >
                <Icon name={iconName} size={wp('6%')} color="#666" />
            </View>
        </TouchableWithoutFeedback>
        {showPicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={pickerValue}
                mode={pickerMode}
                display="default"
                onChange={onPickerChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
            />
        )}
    </View>
);

// Dropdown Component
interface FormDropdownProps {
    data: DropDownOption[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
    data,
    value,
    placeholder,
    onChange,
}) => {
    const renderItem = (item: DropDownOption) => (
        <View
            style={{
                padding: 17,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    flex: 1,
                    fontSize: wp('3.5%'),
                    color: '#000',
                }}
            >
                {item.label}
            </Text>
        </View>
    );

    return (
        <Dropdown
            style={{
                height: wp('10%'),
                borderWidth: wp('0.1%'),
                borderRadius: wp('1%'),
                borderColor: '#ddd',
                paddingHorizontal: 10,
                backgroundColor: '#fff',
            }}
            placeholderStyle={{ fontSize: wp('3.5%'), color: '#999' }}
            selectedTextStyle={{ fontSize: wp('3.5%'), color: '#333' }}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={item => onChange(item.value)}
            renderItem={renderItem}
        />
    );
};

// Submit Button Component
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
        style={{
            padding: 12,
            backgroundColor: disabled || isLoading ? '#ccc' : '#56C58D',
            borderRadius: wp('1%'),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        }}
    >
        {isLoading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text
                style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: wp('4%'),
                }}
            >
                {title}
            </Text>
        )}
    </TouchableOpacity>
);

// Loading Overlay Component
interface LoadingOverlayProps {
    visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
        >
            <View
                style={{
                    width: wp('20%'),
                    height: wp('20%'),
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: wp('2%'),
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        </View>
    );
};

// Section Header Component
interface SectionHeaderProps {
    icon: string;
    title: string;
    color?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    icon,
    title,
    color = '#56C58D',
}) => (
    <View
        style={{
            padding: 15,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
        }}
    >
        <View
            style={{
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: wp('30%'),
                backgroundColor: `${color}20`,
            }}
        >
            <Icon name={icon} size={wp('5%')} color={color} />
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: wp('4%'), color }}>{title}</Text>
    </View>
);

// Error Banner Component
interface ErrorBannerProps {
    error: string;
    onDismiss?: () => void;
}

export const ActivityErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => (
    <View
        style={{
            backgroundColor: '#fee',
            padding: 12,
            borderRadius: wp('1%'),
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeftWidth: 4,
            borderLeftColor: '#ff6b6b',
        }}
    >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="exclamationcircleo" size={wp('4%')} color="#ff6b6b" />
            <Text
                style={{
                    flex: 1,
                    color: '#d32f2f',
                    fontSize: wp('3.2%'),
                    lineHeight: wp('4.2%'),
                }}
            >
                {error}
            </Text>
        </View>
        {onDismiss && (
            <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
                <Icon name="close" size={wp('4%')} color="#ff6b6b" />
            </TouchableOpacity>
        )}
    </View>
);

// Form Container with Error Support
interface FormContainerProps {
    children: React.ReactNode;
    error?: string | null;
    validationError?: string | null;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => (
    <View
        style={{
            padding: 15,
            backgroundColor: '#fff',
            margin: 10,
            borderRadius: 8,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
        }}
    >
        {children}
    </View>
);

// Multi-line Text Input Component
interface MultilineInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    numberOfLines?: number;
}

export const MultilineInput: React.FC<MultilineInputProps> = ({
    value,
    onChangeText,
    placeholder,
    numberOfLines = 8,
}) => (
    <TextInput
        style={{
            height: wp('25%'),
            borderWidth: wp('0.1%'),
            borderRadius: wp('1%'),
            borderColor: '#ddd',
            paddingHorizontal: 10,
            fontSize: wp('3.5%'),
            backgroundColor: '#fff',
            paddingTop: 10,
        }}
        multiline
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
    />
);
