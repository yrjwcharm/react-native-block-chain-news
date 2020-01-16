/**
 * Created by puti on 2017/11/3.
 */
import React, {Component} from 'react'
import {StatusBar, Dimensions} from 'react-native';
import {AlbumView, Overlay, Button} from 'teaset'
export class CommonUtils {
    /**
     * 显示大图
     * @param actionView  点击的组件
     * @param index  默认显示
     * @param images  图片数组
     * @param onPress  点击图片关闭后回调
     */
    static showBigImages(actionView, index, images, onPress) {
        actionView.measureInWindow((x, y, width, height) => {
            let overlayView = (
                <Overlay.PopView
                    containerStyle={{flex: 1}}
                    overlayOpacity={1}
                    type='custom'
                    customBounds={{x, y, width, height}}
                    ref={v => this.fullImageView = v}
                >

                    <AlbumView
                        style={{flex: 1}}
                        control={true}
                        images={images}
                        defaultIndex={index}
                        onPress={(index, event) => {
                            this.fullImageView && this.fullImageView.close();
                            onPress && onPress(index, event)
                        }}
                    />

                    <StatusBar animated={false} hidden={true}/>
                </Overlay.PopView>
            );
            Overlay.show(overlayView);
        });
    }
    /**
     *
     * 以Base64位字符串数据的形式返回一个图片的source
     * @param data
     * @returns {{uri: string}}
     */
    static base64Image(data) {
        return `data:image/png;base64,${data}`
    }
    static lastClickTime = 0;

    /**
     * 是否连续点击
     * @param delay 间隔,默认1000ms
     * @returns {boolean}
     */
    static isFastClick(delay: number = 1000) {
        let nowTime = Date.now();
        if ((nowTime - this.lastClickTime) <= delay) {
            return true
        } else {
            this.lastClickTime = nowTime;
            return false
        }
    }

}
