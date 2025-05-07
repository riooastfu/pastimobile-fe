import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { responsiveHeight as rh, responsiveWidth as rw } from '../../utils/responsive';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonItem = () => {
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
        <View style={styles.skeletonBox}>
            <Animated.View
                style={[
                    styles.shimmerOverlay,
                    { transform: [{ translateX }] }
                ]}
            />
        </View>
    );
};

const ActivityScreenSkeleton = () => {
    return (
        <View>
            {[1, 2, 3].map((_, i) => (
                <SkeletonItem key={i} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonBox: {
        height: rh(8),
        width: rw(90),
        backgroundColor: '#E1E9EE',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: rh(1),
        alignSelf: 'center',
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f0f3f5',
        opacity: 0.5,
    },
});

export default ActivityScreenSkeleton;
