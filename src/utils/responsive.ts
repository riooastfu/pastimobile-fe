import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (reference design size - e.g., iPhone 11)
const baseWidth = 414;
const baseHeight = 896;

// Scaling factors
const wScale = SCREEN_WIDTH / baseWidth;
const hScale = SCREEN_HEIGHT / baseHeight;

// Normalize based on dimensions to handle different device sizes
// Use a linear interpolation for a more sensible scaling
export const normalize = (size: number, based: 'width' | 'height' = 'width') => {
    const scale = based === 'width' ? wScale : hScale;
    const newSize = size * scale;

    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }

    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive font sizes
export const fontSizes = {
    xs: normalize(10),
    sm: normalize(12),
    md: normalize(14),
    lg: normalize(16),
    xl: normalize(18),
    xxl: normalize(20),
    xxxl: normalize(24),
};

// Responsive spacing
export const spacing = {
    xs: normalize(4),
    sm: normalize(8),
    md: normalize(12),
    lg: normalize(16),
    xl: normalize(20),
    xxl: normalize(24),
    xxxl: normalize(32),
};

// Responsive radius
export const radius = {
    xs: normalize(4),
    sm: normalize(8),
    md: normalize(12),
    lg: normalize(16),
    xl: normalize(24),
    xxl: normalize(32),
    round: normalize(999),
};

// Helper for responsive dimensions
export const scale = (size: number) => normalize(size, 'width');
export const verticalScale = (size: number) => normalize(size, 'height');

// Get safe area insets (especially for iPhone notch)
export const getSafeAreaInsets = () => {
    const statusBarHeight = StatusBar.currentHeight || 0;
    return {
        top: Platform.OS === 'ios' ? 44 : statusBarHeight,
        bottom: Platform.OS === 'ios' ? 34 : 0,
        left: 0,
        right: 0,
    };
};

// Responsive dimensions with percentage
export const responsiveWidth = (percentage: number) => wp(`${percentage}%`);
export const responsiveHeight = (percentage: number) => hp(`${percentage}%`);

// Helper for detecting orientation changes
export const isPortrait = () => {
    const { width, height } = Dimensions.get('window');
    return height > width;
};

export const isLandscape = () => {
    const { width, height } = Dimensions.get('window');
    return width > height;
};

// Helper for tablet detection (approximate)
export const isTablet = () => {
    const { width, height } = Dimensions.get('window');
    const screenSize = Math.sqrt(width * height) / 160;
    return screenSize > 7;
};

// Hook to listen for dimension changes
export const useDimensionsChange = (callback: () => void) => {
    Dimensions.addEventListener('change', callback);
    return () => {
        // Remove event listener if needed
    };
};