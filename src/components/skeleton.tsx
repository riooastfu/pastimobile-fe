import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    ViewStyle,
    StyleProp,
    Dimensions,
    DimensionValue,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    return (
        <View
            style={[
                {
                    backgroundColor: '#E1E9EE',
                    width,
                    height,
                    borderRadius,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: '#f0f3f5',
                        opacity: 0.5,
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    );
};

export default Skeleton;
