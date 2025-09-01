import React, { useEffect, useRef, useState } from 'react';
import { FlatList, FlatListProps, View, StyleSheet } from 'react-native';

interface SliderDataProps {
    title: string
    desc: string
    image: any
}

interface SliderProps<ItemT> extends FlatListProps<ItemT> {
    width: number
    autoScroll: boolean
    slideInterval: number
    sliderData: SliderDataProps[]
    indicator: boolean
    indicatorStyles: object
    indicatorColor: string
}

function Slider<ItemT>(props: SliderProps<ItemT>) {
    const { width, autoScroll = true, slideInterval = 1000, sliderData, indicatorStyles, indicatorColor, indicator = true } = props;
    const sliderRef = useRef<FlatList>(null)
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const getItemLayout = (data: any, index: number) => ({
        length: width,
        offset: width * index,
        index: index
    })

    autoScroll &&
        useEffect(() => {
            let interval = setInterval(() => {
                if (currentIndex == sliderData.length - 1) {
                    sliderRef.current?.scrollToIndex({
                        index: 0,
                        animated: true,
                    });
                } else {
                    sliderRef.current?.scrollToIndex({
                        index: currentIndex + 1,
                        animated: true,
                    });
                }
            }, slideInterval);

            return () => clearInterval(interval)
        })

    return (
        <>
            <FlatList
                ref={sliderRef}
                getItemLayout={getItemLayout}
                onScroll={e => {
                    const position = e.nativeEvent.contentOffset.x;
                    setCurrentIndex(parseInt((position / width).toFixed(0)))
                }}
                {...props}
            />
            {
                indicator &&
                <View style={{ flexDirection: 'row', width, justifyContent: 'center', alignItems: 'center', ...indicatorStyles }}>
                    {
                        sliderData.map((item, index) => {
                            return (
                                <View key={index} style={{ width: currentIndex == index ? 50 : 8, height: 8, borderRadius: 4, backgroundColor: currentIndex == index ? "#0079AE" : indicatorColor, marginLeft: 5 }} />
                            )
                        })
                    }
                </View>
            }
        </>
    );
}

export default Slider;
