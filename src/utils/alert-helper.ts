import { Alert, AlertButton } from 'react-native';

export const showAlert = {
  // Success alerts
  success: (message: string, onPress?: () => void) => {
    Alert.alert('Berhasil', message, [
      { text: 'OK', onPress }
    ]);
  },

  // Error alerts
  error: (message: string, onPress?: () => void) => {
    Alert.alert('Gagal', message, [
      { text: 'OK', onPress }
    ]);
  },

  // Validation errors
  validation: (message: string) => {
    Alert.alert('Periksa Input', message);
  },

  // Network errors
  network: (onRetry?: () => void) => {
    const buttons: AlertButton[] = [
      { text: 'OK', style: 'cancel' }
    ];
    
    if (onRetry) {
      buttons.unshift({ text: 'Coba Lagi', onPress: onRetry });
    }

    Alert.alert(
      'Koneksi Bermasalah', 
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      buttons
    );
  },

  // Confirmation alerts
  confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    Alert.alert(title, message, [
      { text: 'Batal', style: 'cancel', onPress: onCancel },
      { text: 'Ya', onPress: onConfirm }
    ]);
  },

  // Camera/Photo specific
  camera: {
    photoFailed: () => showAlert.error('Gagal mengambil foto. Silakan coba lagi.'),
    photoNotFound: (onPress?: () => void) => showAlert.error('Foto tidak ditemukan.', onPress),
    permissionDenied: () => showAlert.error('Izin kamera diperlukan untuk mengambil foto.')
  },

  // Attendance specific
  attendance: {
    success: (type: 'masuk' | 'keluar', onPress?: () => void) => 
      showAlert.success(`Berhasil absen ${type}.`, onPress),
    failed: (message?: string) => 
      showAlert.error(message || 'Absen gagal. Silakan coba lagi.'),
    locationError: () => 
      showAlert.error('Anda berada di luar area yang diizinkan untuk absen.')
  },

  // Activity specific
  activity: {
    success: (onPress?: () => void) => showAlert.success('Berhasil menyimpan aktivitas.', onPress),
    deleteConfirm: (onConfirm: () => void) => 
      showAlert.confirm('Hapus Aktivitas', 'Yakin ingin menghapus aktivitas ini?', onConfirm)
  },

  // Leave (Cuti) specific
  leave: {
    success: (onPress?: () => void) => showAlert.success('Pengajuan cuti berhasil disubmit.', onPress),
    insufficientBalance: (remaining: number) => 
      showAlert.validation(`Saldo cuti tidak mencukupi. Sisa saldo: ${remaining} hari.`),
    invalidDuration: () => showAlert.validation('Total hari cuti harus lebih dari 0.')
  }
};