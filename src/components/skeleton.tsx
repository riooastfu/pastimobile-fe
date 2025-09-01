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
    variant?: 'text' | 'circular' | 'rectangular';
    lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
    variant = 'rectangular',
    lines = 1,
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

    const getSkeletonStyle = () => {
        switch (variant) {
            case 'circular':
                return { borderRadius: Math.min(Number(width) || 50, Number(height) || 50) / 2 };
            case 'text':
                return { borderRadius: 4 };
            default:
                return { borderRadius };
        }
    };

    if (lines > 1) {
        return (
            <View style={style}>
                {Array.from({ length: lines }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            {
                                backgroundColor: '#E1E9EE',
                                width: index === lines - 1 ? '70%' : width,
                                height,
                                marginBottom: index < lines - 1 ? 8 : 0,
                                overflow: 'hidden',
                            },
                            getSkeletonStyle(),
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
                ))}
            </View>
        );
    }

    return (
        <View
            style={[
                {
                    backgroundColor: '#E1E9EE',
                    width,
                    height,
                    overflow: 'hidden',
                },
                getSkeletonStyle(),
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
