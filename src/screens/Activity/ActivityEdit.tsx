import React, { useEffect, useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../../providers/auth-provider';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  createLaporanHarian,
  getlaporanHarianById,
  getLaporanKesehatanById,
} from '../../api/aktivitas';
import { RootStackParamList } from '../../types';
import { showAlert } from '../../utils/alert-helper';
import Skeleton from '../../components/skeleton';
import {
  FormField,
  FormDropdown,
  MultilineInput,
  SubmitButton,
} from './components/activity-form';
import { DropDownType } from '../../types';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

type ActivityEditRouteProps = RouteProp<RootStackParamList, 'ActivityEdit'>;

const KATEGORI_ITEMS: DropDownType[] = [
  { label: 'Rutin', value: 'Rutin' },
  { label: 'Projek', value: 'Projek' },
];

const HASIL_ITEMS: DropDownType[] = [
  { label: 'Selesai', value: 'Selesai' },
  { label: 'Berlanjut', value: 'Berlanjut' },
];

const ActivityEdit: React.FC = () => {
  const route = useRoute<ActivityEditRouteProps>();
  const { userData } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [laporanKesehatan, setLaporanKesehatan] = useState<any>(null);
  const [laporanHarian, setLaporanHarian] = useState<any[]>([]);
  const [lokasiKerja, setLokasiKerja] = useState('');
  const [kategori, setKategori] = useState('');
  const [hasil, setHasil] = useState('');
  const [kegiatan, setKegiatan] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const id = route.params.id_laporan;
      const [kesehatanRes, harianRes] = await Promise.all([
        getLaporanKesehatanById(id),
        getlaporanHarianById(id),
      ]);

      if (kesehatanRes.status === 'success') {
        setLaporanKesehatan(kesehatanRes.data);
      }
      if (harianRes.status === 'success') {
        setLaporanHarian(harianRes.data);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Terjadi kesalahan saat memuat data.';
      showAlert.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.id_laporan]);

  const onSimpan = useCallback(async () => {
    try {
      setIsLoading(true);
      const laporan = await createLaporanHarian({
        id_laporan: route.params.id_laporan,
        nik: userData.karyawanid,
        nik_kantor: userData.nik_kantor,
        nama_karyawan: userData.nama_karyawan,
        jabatan_karyawan: userData.jabatan,
        dept_karyawan: userData.departemen,
        uraian_kegiatan: kegiatan,
        target_harian: hasil,
        pt: userData.pt,
        kategori,
        lokasi_kerja: lokasiKerja,
      });

      if (laporan.status === 'success') {
        showAlert.activity.success(fetchData);
        setLokasiKerja('');
        setKategori('');
        setHasil('');
        setKegiatan('');
      } else {
        showAlert.error(laporan.message);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Terjadi kesalahan saat menyimpan aktivitas.';
      showAlert.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.id_laporan, userData, kegiatan, hasil, kategori, lokasiKerja, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.idText}>{laporanKesehatan?.id_laporan}</Text>
          <View style={styles.headerRow}>
            <Text style={styles.statusText}>{laporanKesehatan?.status_kerja}</Text>
            <Icon name="pushpino" color="#ccc" size={wp('5%')} style={{ transform: [{ scaleX: -1 }] }} />
          </View>
          <Text style={styles.dateText}>
            {moment(laporanKesehatan?.tanggal).format('DD MMM YYYY')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <FormField label="Lokasi Kerja" required>
            <MultilineInput
              value={lokasiKerja}
              placeholder="contoh: Head Office PAS"
              onChangeText={setLokasiKerja}
              numberOfLines={1}
            />
          </FormField>

          <FormField label="Kategori" required>
            <FormDropdown
              data={KATEGORI_ITEMS}
              value={kategori}
              placeholder="Pilih Kategori"
              onChange={setKategori}
            />
          </FormField>

          <FormField label="Hasil" required>
            <FormDropdown
              data={HASIL_ITEMS}
              value={hasil}
              placeholder="Pilih Hasil"
              onChange={setHasil}
            />
          </FormField>

          <FormField label="Uraian Kegiatan" required>
            <MultilineInput
              value={kegiatan}
              placeholder="contoh: Melakukan pendataan"
              onChangeText={setKegiatan}
            />
          </FormField>

          <SubmitButton title="Simpan" onPress={onSimpan} isLoading={isLoading} />
        </View>

        {/* List */}
        {isLoading ? (
          <Skeleton height={100} />
        ) : (
          laporanHarian.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Aktivitas Tercatat</Text>
              {laporanHarian.map((item, idx) => (
                <View key={idx} style={styles.activityItem}>
                  <Text style={styles.itemText}>{item.uraian_kegiatan}</Text>
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ActivityEdit;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scrollContent: { padding: 15, paddingBottom: 60 },
  headerCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 },
  idText: { fontSize: 12, color: '#aaa' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#000', marginRight: 8 },
  dateText: { fontSize: 14, color: '#555', marginTop: 8 },
  formCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 },
  listContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8 },
  listTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  activityItem: { padding: 10, backgroundColor: '#f0f8f5', borderRadius: 6, marginBottom: 8 },
  itemText: { color: '#333' },
});
