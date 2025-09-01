import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';

import { useAuth } from '../../../providers/auth-provider';
import { RootStackParamList, DropDownType } from '../../../types';
import { getWorkingDays } from '../../../utils/hari-libur';
import {
  createCutiUser,
  getAtasan,
  getCutiUserByIdCuti,
  getHariLibur,
  getPic,
} from '../../../api/cuti';
import {
  CutiData,
  CutiFormValues,
  CutiFormState,
  CreateCutiRequest,
} from '../types/cuti.types';
import { useLoading } from '../../../hooks/use-loading';

// --- Types
type CutiPengajuanRouteProps = RouteProp<RootStackParamList, 'CutiPengajuan'>;

// --- Initial Values
const INITIAL_CUTI_DATA: CutiData = {
  id_cuti: '',
  periode: '',
  nik: 0,
  tanggal_berlaku: new Date(),
  tanggal_berakhir: new Date(),
  hak_cuti: 0,
  sisa_hutang: 0,
  saldo: 0,
  aktif: 0,
};

const INITIAL_FORM_VALUES: CutiFormValues = {
  telp: '',
  alamat: '',
  keperluan: '',
  tanggalDari: new Date(),
  tanggalSampai: new Date(),
  tanggalDariValue: '',
  tanggalSampaiValue: '',
  valuePIC: 0,
  valueAtasan: 0,
};

const INITIAL_FORM_STATE: CutiFormState = {
  tanggalDariShow: false,
  tanggalSampaiShow: false,
  totalHariLibur: 0,
};

// --- Hook
export const useCutiPengajuan = () => {
  const route = useRoute<CutiPengajuanRouteProps>();
  const { id_cuti } = route.params;
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isLoading, showLoading, hideLoading } = useLoading();

  // --- State
  const [cutiData, setCutiData] = useState<CutiData>(INITIAL_CUTI_DATA);
  const [formValues, setFormValues] = useState<CutiFormValues>(INITIAL_FORM_VALUES);
  const [formState, setFormState] = useState<CutiFormState>(INITIAL_FORM_STATE);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [dataPIC, setDataPIC] = useState<DropDownType[]>([]);
  const [dataAtasan, setDataAtasan] = useState<DropDownType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- Helpers
  const updateFormValue = useCallback(
    (key: keyof CutiFormValues, value: any) => {
      setFormValues(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFormState = useCallback(
    (key: keyof CutiFormState, value: any) => {
      setFormState(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  // --- Date Handlers
  const handleTanggalDariChange = useCallback(
    (_: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || formValues.tanggalDari;
      updateFormState('tanggalDariShow', Platform.OS === 'ios');
      updateFormValue('tanggalDari', currentDate);
      updateFormValue('tanggalDariValue', moment(currentDate).format('YYYY-MM-DD'));
    },
    [formValues.tanggalDari, updateFormValue, updateFormState]
  );

  const handleTanggalSampaiChange = useCallback(
    (_: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || formValues.tanggalSampai;
      updateFormState('tanggalSampaiShow', Platform.OS === 'ios');
      updateFormValue('tanggalSampai', currentDate);
      updateFormValue('tanggalSampaiValue', moment(currentDate).format('YYYY-MM-DD'));

      const workingDays = getWorkingDays(formValues.tanggalDari, currentDate, holidays);
      updateFormState('totalHariLibur', workingDays);
    },
    [formValues.tanggalDari, formValues.tanggalSampai, holidays, updateFormValue, updateFormState]
  );

  const showTanggalDariPicker = useCallback(
    () => updateFormState('tanggalDariShow', true),
    [updateFormState]
  );

  const showTanggalSampaiPicker = useCallback(
    () => updateFormState('tanggalSampaiShow', true),
    [updateFormState]
  );

  // --- Dropdown Handlers
  const handlePICChange = useCallback(
    (item: DropDownType) => updateFormValue('valuePIC', item.value),
    [updateFormValue]
  );

  const handleAtasanChange = useCallback(
    (item: DropDownType) => updateFormValue('valueAtasan', item.value),
    [updateFormValue]
  );

  // --- Validation
  const validateForm = useCallback((): boolean => {
    setValidationError(null);

    const requiredFields = [
      { field: formValues.tanggalDariValue, name: 'Tanggal mulai' },
      { field: formValues.tanggalSampaiValue, name: 'Tanggal berakhir' },
      { field: formValues.keperluan, name: 'Keperluan' },
      { field: formValues.alamat, name: 'Alamat' },
      { field: formValues.telp, name: 'Nomor telepon' },
      { field: formValues.valuePIC, name: 'PIC' },
      { field: formValues.valueAtasan, name: 'Atasan' },
    ];

    for (const { field, name } of requiredFields) {
      if (!field || field === 0) {
        setValidationError(`${name} harus diisi`);
        return false;
      }
    }

    if (formState.totalHariLibur <= 0) {
      setValidationError('Durasi cuti tidak valid');
      return false;
    }

    if (formState.totalHariLibur > cutiData.saldo) {
      setValidationError(`Saldo cuti tidak mencukupi. Sisa saldo: ${cutiData.saldo} hari`);
      return false;
    }

    return true;
  }, [formValues, formState.totalHariLibur, cutiData.saldo]);

  // --- Data Fetch
  const fetchData = useCallback(async () => {
    showLoading();
    setError(null);

    try {
      const [cutiRes, liburRes, picRes, atasanRes] = await Promise.all([
        getCutiUserByIdCuti(id_cuti),
        getHariLibur(),
        getPic({
          nik: userData.karyawanid,
          departemen: userData.departemen,
          perusahaan: userData.pt,
        }),
        getAtasan({
          nik: userData.karyawanid,
          departemen: userData.departemen,
        }),
      ]);

      if (cutiRes.status === 'success') {
        setCutiData(cutiRes.data);
      } else {
        setError('Gagal memuat data cuti');
        return;
      }

      if (liburRes.status === 'success') {
        const holidayDates = liburRes.data.map((h: any) =>
          moment(h.Tanggal_Libur).format('YYYY-MM-DD')
        );
        setHolidays(holidayDates);
      }

      if (picRes.status === 'success') setDataPIC(picRes.data);
      if (atasanRes.status === 'success') setDataAtasan(atasanRes.data);
    } catch (err) {
      console.error('Fetch data error:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      hideLoading();
    }
  }, [id_cuti, userData, showLoading, hideLoading]);

  // --- Submit
  const onSubmit = useCallback(async () => {
    if (!validateForm()) return;

    showLoading();
    setError(null);

    try {
      const requestData: CreateCutiRequest = {
        id_cuti,
        tanggal_mulai: new Date(formValues.tanggalDariValue),
        tanggal_berakhir: new Date(formValues.tanggalSampaiValue),
        tipe_cuti: 'CT',
        alasan: formValues.keperluan,
        alamat_cuti: formValues.alamat,
        pic: formValues.valuePIC,
        atasan: formValues.valueAtasan,
        no_telepon: formValues.telp,
      };

      const res = await createCutiUser(requestData);

      if (res.status === 'success') {
        navigation.navigate('BottomTab', { screen: 'Cuti' });
      } else {
        setError(res.message || 'Gagal mengajukan cuti');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Terjadi kesalahan saat mengajukan cuti');
    } finally {
      hideLoading();
    }
  }, [formValues, id_cuti, validateForm, navigation, showLoading, hideLoading]);

  // --- Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Return
  return {
    isLoading,
    cutiData,
    formValues,
    formState,
    dataPIC,
    dataAtasan,
    error,
    validationError,

    updateFormValue,
    handleTanggalDariChange,
    handleTanggalSampaiChange,
    showTanggalDariPicker,
    showTanggalSampaiPicker,
    handlePICChange,
    handleAtasanChange,

    onSubmit,
    validateForm,
    fetchData,
  };
};
