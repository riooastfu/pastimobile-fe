import React from 'react';
import {
    ActivityIndicator,
    BackHandler,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import {
    responsiveWidth,
    spacing,
    fontSizes,
    radius,
} from '../../../utils/responsive';

interface LoadingOverlayProps { }

interface LocationHeaderProps {
    isInsideRadius: boolean;
}

interface FloatingButtonsProps {
    isInsideRadius: boolean;
    onLocationPress: () => void;
    initLoc: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

interface FloatingButtonProps {
    onPress: () => void;
    iconComponent: React.ReactNode;
    style?: any;
}

// Loading Overlay Component
export const LoadingOverlay: React.FC<LoadingOverlayProps> = () => (
    <View style={styles.loadingOverlay}>
        <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0079AE" />
            <Text style={styles.loadingText}>Memuat lokasi...</Text>
        </View>
    </View>
);

// Location Header Component
export const LocationHeader: React.FC<LocationHeaderProps> = ({
    isInsideRadius,
}) => (
    <View style={styles.headbarContainer}>
        <View style={styles.headbarContent}>
            <View style={styles.headbarIconContainer}>
                <FontistoIcon
                    name="map"
                    size={responsiveWidth(6)}
                    color={isInsideRadius ? '#4CAF50' : '#0079AE'}
                />
            </View>
            <View style={styles.headbarTextContainer}>
                <Text style={styles.headbarTitle}>Status Lokasi</Text>
                <View
                    style={[
                        styles.headbarStatus,
                        {
                            backgroundColor: isInsideRadius ? '#E8F5E8' : '#FFF3E0',
                            borderColor: isInsideRadius ? '#4CAF50' : '#FF9800',
                        },
                    ]}
                >
                    <View style={[
                        styles.statusIndicator,
                        { backgroundColor: isInsideRadius ? '#4CAF50' : '#FF9800' }
                    ]} />
                    <Text style={[
                        styles.headbarStatusText,
                        { color: isInsideRadius ? '#2E7D32' : '#E65100' }
                    ]}>
                        {isInsideRadius
                            ? 'Dalam radius absensi'
                            : 'Di luar radius absensi'}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

// Floating Button Component
const FloatingButton: React.FC<FloatingButtonProps> = ({
    onPress,
    iconComponent,
    style,
}) => (
    <View style={[styles.circle, style]}>
        <TouchableOpacity onPress={onPress} style={styles.circleButton}>
            {iconComponent}
        </TouchableOpacity>
    </View>
);

// Error State Component
interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export const AbsensiErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
        <Icon name="exclamationcircleo" size={responsiveWidth(15)} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Icon name="reload1" size={responsiveWidth(4)} color="#fff" />
            <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
    </View>
);

// Location Error Banner Component
interface LocationErrorBannerProps {
    error: string;
    onRetry: () => void;
    onDismiss: () => void;
}

export const LocationErrorBanner: React.FC<LocationErrorBannerProps> = ({ 
    error, 
    onRetry, 
    onDismiss 
}) => (
    <View style={styles.errorBanner}>
        <View style={styles.errorBannerContent}>
            <Icon name="exclamationcircleo" size={responsiveWidth(4)} color="#ff6b6b" />
            <Text style={styles.errorBannerText}>{error}</Text>
        </View>
        <View style={styles.errorBannerActions}>
            <TouchableOpacity onPress={onRetry} style={styles.errorRetryButton}>
                <Text style={styles.errorRetryText}>Coba Lagi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDismiss} style={styles.errorDismissButton}>
                <Icon name="close" size={responsiveWidth(4)} color="#ff6b6b" />
            </TouchableOpacity>
        </View>
    </View>
);

// Mock Location Warning Component
interface MockLocationWarningProps {
    onDismiss: () => void;
    onExit: () => void;
}

export const MockLocationWarning: React.FC<MockLocationWarningProps> = ({ 
    onDismiss, 
    onExit 
}) => (
    <View style={styles.mockLocationOverlay}>
        <View style={styles.mockLocationBox}>
            <Icon name="warning" size={responsiveWidth(10)} color="#ff9800" />
            <Text style={styles.mockLocationTitle}>Peringatan Lokasi</Text>
            <Text style={styles.mockLocationText}>
                Terdeteksi penggunaan aplikasi penyamar lokasi. Silakan nonaktifkan terlebih dahulu.
            </Text>
            <View style={styles.mockLocationActions}>
                <TouchableOpacity onPress={onDismiss} style={styles.mockLocationDismiss}>
                    <Text style={styles.mockLocationDismissText}>Abaikan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onExit} style={styles.mockLocationExit}>
                    <Text style={styles.mockLocationExitText}>Keluar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

// Floating Buttons Container
export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
    isInsideRadius,
    onLocationPress,
    initLoc,
}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleCameraPress = () => {
        if (isInsideRadius) {
            navigation.navigate('AbsensiCamera', { position: initLoc });
        }
        // Location error is now handled by the parent component
    };

    const handleReportPress = () => {
        navigation.navigate('AbsensiReport');
    };

    return (
        <>
            {/* Camera Button */}
            <FloatingButton
                onPress={handleCameraPress}
                iconComponent={
                    <Icon
                        name="camerao"
                        size={responsiveWidth(6)}
                        color={isInsideRadius ? '#0079AE' : '#ccc'}
                    />
                }
                style={{ bottom: spacing.xl * 5 }}
            />

            {/* Location Button */}
            <FloatingButton
                onPress={onLocationPress}
                iconComponent={
                    <FontistoIcon
                        name="crosshairs"
                        size={responsiveWidth(6)}
                        color="#0079AE"
                    />
                }
                style={{ bottom: spacing.xl * 9 }}
            />

            {/* Report Button */}
            <FloatingButton
                onPress={handleReportPress}
                iconComponent={
                    <FeatherIcon
                        name="check-square"
                        size={responsiveWidth(6)}
                        color="#0079AE"
                    />
                }
                style={{ bottom: spacing.xl }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loadingBox: {
        minWidth: responsiveWidth(30),
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.lg,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: fontSizes.sm,
        color: '#666',
        fontWeight: '500',
    },
    headbarContainer: {
        backgroundColor: '#fff',
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
        borderBottomLeftRadius: radius.lg,
        borderBottomRightRadius: radius.lg,
        zIndex: 10,
    },
    headbarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        columnGap: spacing.md,
    },
    headbarIconContainer: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headbarTextContainer: {
        flex: 1,
        rowGap: spacing.xs,
    },
    headbarTitle: {
        color: '#1A1A1A',
        fontSize: fontSizes.lg,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    headbarStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
        borderWidth: 1,
        columnGap: spacing.xs,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    headbarStatusText: {
        fontSize: fontSizes.sm,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    circle: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        position: 'absolute',
        borderRadius: responsiveWidth(7),
        right: spacing.lg,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
    },
    circleButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: responsiveWidth(7),
    },

    // Error State Styles
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.lg,
        padding: spacing.xl,
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: fontSizes.lg,
        color: '#666',
        textAlign: 'center',
        lineHeight: fontSizes.lg * 1.4,
    },
    retryButton: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    retryText: {
        color: '#fff',
        fontSize: fontSizes.md,
        fontWeight: '500',
    },

    // Error Banner Styles
    errorBanner: {
        backgroundColor: '#fee',
        padding: spacing.md,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#ff6b6b',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    errorBannerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    errorBannerText: {
        flex: 1,
        color: '#d32f2f',
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm * 1.3,
    },
    errorBannerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    errorRetryButton: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
    },
    errorRetryText: {
        color: '#fff',
        fontSize: fontSizes.xs,
        fontWeight: '500',
    },
    errorDismissButton: {
        padding: spacing.xs,
    },

    // Mock Location Warning Styles
    mockLocationOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mockLocationBox: {
        backgroundColor: '#fff',
        margin: spacing.xl,
        padding: spacing.xl,
        borderRadius: radius.lg,
        alignItems: 'center',
        gap: spacing.md,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    mockLocationTitle: {
        fontSize: fontSizes.lg,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    mockLocationText: {
        fontSize: fontSizes.md,
        color: '#666',
        textAlign: 'center',
        lineHeight: fontSizes.md * 1.4,
    },
    mockLocationActions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    mockLocationDismiss: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mockLocationDismissText: {
        color: '#666',
        fontSize: fontSizes.md,
        fontWeight: '500',
    },
    mockLocationExit: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
    },
    mockLocationExitText: {
        color: '#fff',
        fontSize: fontSizes.md,
        fontWeight: '500',
    },
});