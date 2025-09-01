import { useCallback, useState } from 'react';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import moment from 'moment';

import { useAuth } from '../../../providers/auth-provider';
import { RootStackParamList } from '../../../types';
import { createLaporanKesehatan } from '../../../api/aktivitas';
import {
  ActivityFormState,
  ActivityFormValues,
  CreateActivityRequest,
} from '../types/activity.types';

// --- Initial Values
const INITIAL_FORM_VALUES: ActivityFormValues = {
  date: new Date(),
  jamMasuk: new Date(),
  jamPulang: new Date(),
  dateValue: '',
  jamMasukValue: '',
  jamPulangValue: '',
  statusValue: '',
};

const INITIAL_FORM_STATE: ActivityFormState = {
  showDatePicker: false,
  showJamMasukPicker: false,
  showJamPulangPicker: false,
};

// --- Hook
export const useActivityForm = () => {
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // --- State
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<ActivityFormValues>(INITIAL_FORM_VALUES);
  const [formState, setFormState] = useState<ActivityFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- Helpers
  const updateFormValue = useCallback(
    (key: keyof ActivityFormValues, value: any) => {
      setFormValues(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFormState = useCallback(
    (key: keyof ActivityFormState, value: any) => {
      setFormState(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  // --- Date/Time Handlers
  const handleDateChange = useCallback(
    (_: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || formValues.date;
      updateFormState('showDatePicker', false);
      updateFormValue('date', currentDate);
      updateFormValue('dateValue', moment(currentDate).format('YYYY-MM-DD'));
    },
    [formValues.date, updateFormValue, updateFormState]
  );

  const handleJamMasukChange = useCallback(
    (_: DateTimePickerEvent, selectedTime?: Date) => {
      const currentTime = selectedTime || formValues.jamMasuk;
      updateFormState('showJamMasukPicker', false);
      updateFormValue('jamMasuk', currentTime);
      updateFormValue('jamMasukValue', moment(currentTime).format('HH:mm:ss'));
    },
    [formValues.jamMasuk, updateFormValue, updateFormState]
  );

  const handleJamPulangChange = useCallback(
    (_: DateTimePickerEvent, selectedTime?: Date) => {
      const currentTime = selectedTime || formValues.jamPulang;
      updateFormState('showJamPulangPicker', false);
      updateFormValue('jamPulang', currentTime);
      updateFormValue('jamPulangValue', moment(currentTime).format('HH:mm:ss'));
    },
    [formValues.jamPulang, updateFormValue, updateFormState]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateFormValue('statusValue', value);
    },
    [updateFormValue]
  );

  // --- Show/Hide Pickers
  const showDatePicker = useCallback(
    () => updateFormState('showDatePicker', true),
    [updateFormState]
  );

  const showJamMasukPicker = useCallback(
    () => updateFormState('showJamMasukPicker', true),
    [updateFormState]
  );

  const showJamPulangPicker = useCallback(
    () => updateFormState('showJamPulangPicker', true),
    [updateFormState]
  );

  // --- Validation
  const validateForm = useCallback((): boolean => {
    setValidationError(null);

    const requiredFields = [
      { field: formValues.dateValue, name: 'Tanggal' },
      { field: formValues.jamMasukValue, name: 'Jam masuk' },
      { field: formValues.jamPulangValue, name: 'Jam pulang' },
      { field: formValues.statusValue, name: 'Status kerja' },
    ];

    for (const { field, name } of requiredFields) {
      if (!field) {
        setValidationError(`${name} harus diisi`);
        return false;
      }
    }

    return true;
  }, [formValues]);

  // --- Submit
  const onSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const requestData: CreateActivityRequest = {
        nik: userData.karyawanid,
        nik_kantor: userData.nik_kantor,
        tanggal: formValues.dateValue,
        jam_masuk: formValues.jamMasukValue,
        jam_pulang: formValues.jamPulangValue,
        status_kerja: formValues.statusValue,
        kesehatan_nama: userData.nama_karyawan,
        kesehatan_dept: userData.departemen,
        kesehatan_jabatan: userData.jabatan,
        kesehatan_pt: userData.pt,
      };

      const res = await createLaporanKesehatan(requestData);

      if (res.status === 'success') {
        navigation.navigate('BottomTab', { screen: 'Aktivitas' });
      } else {
        setError(res.message || 'Gagal menyimpan aktivitas');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Terjadi kesalahan saat menyimpan aktivitas');
    } finally {
      setIsLoading(false);
    }
  }, [formValues, userData, validateForm, navigation]);

  // --- Reset
  const resetForm = useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
    setFormState(INITIAL_FORM_STATE);
  }, []);

  // --- Return
  return {
    // State
    isLoading,
    formValues,
    formState,
    error,
    validationError,

    // Form helpers
    updateFormValue,

    // Handlers
    handleDateChange,
    handleJamMasukChange,
    handleJamPulangChange,
    handleStatusChange,

    // Show/hide pickers
    showDatePicker,
    showJamMasukPicker,
    showJamPulangPicker,

    // Actions
    onSubmit,
    resetForm,
    validateForm,
  };
};
