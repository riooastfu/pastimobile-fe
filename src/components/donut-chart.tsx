import { StyleSheet, TextInput, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Svg, { G, Circle } from 'react-native-svg';

// For Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface DonutChartProps {
    percentage: number;
    maxValue: number;
    radius?: number;
    strokeWidth?: number;
    color?: string;
    duration?: number;
    delay?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
    percentage = 50,
    maxValue = 100,
    radius = 50,
    strokeWidth = 10,
    color = '#715D91',
    duration = 500,
    delay = 500,
}) => {
    // Circle SVG
    const animatedValue = useRef(new Animated.Value(0)).current;
    const circleRef = useRef<any>(null);
    const inputRef = useRef<any>(null);
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;

    const animation = (toValue: number) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true,
        }).start();
    };

    const maxPerc = (100 * percentage) / maxValue;
    const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc) / 100;

    useEffect(() => {
        animation(percentage);

        animatedValue.addListener((v) => {
            if (circleRef.current) {
                const maxPerc = (100 * v.value) / maxValue;
                const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc) / 100;
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }

            if (inputRef.current) {
                inputRef.current.setNativeProps({
                    text: `${Math.round(v.value)}`,
                });
            }
        });

        return () => {
            animatedValue.removeAllListeners();
        };
    }, [percentage]);

    return (
        <>
            <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx="50%"
                        cy="50%"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeOpacity={0.2}
                    />
                    <AnimatedCircle
                        ref={circleRef}
                        cx="50%"
                        cy="50%"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <AnimatedInput
                ref={inputRef}
                underlineColorAndroid="transparent"
                editable={false}
                defaultValue="0"
                style={[
                    StyleSheet.absoluteFillObject,
                    { fontSize: radius / 2, color: color },
                    { fontFamily: 'Urbanist', textAlign: 'center' },
                ]}
            />
        </>
    );
};

export default DonutChart;

const styles = StyleSheet.create({});
