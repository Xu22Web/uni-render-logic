<template>
    <view :jobs="jobs" :change:jobs="snapshot.dispatchJob">
    </view>
</template>

<script lang="ts">
// @ts-nocheck
import { renderMixin } from 'uni-render-logic';

export default {
    mixins: [renderMixin],
}
</script>


<script module="snapshot" lang="renderjs">
import { logicMixin } from 'uni-render-logic'
import { drawElement } from '@/utils'

export default {
    mixins: [logicMixin],
    methods: {
        /**
        * 获取视频封面
        * 
        * @param options
        */
        getPoster(options) {
            const { src, width, height, scale = 1 } = options || {}
            if (!src) {
                throw new Error('src is undefined')
            }
            const ele = document.createElement("video");
            ele.crossOrigin = 'anonymous';
            ele.src = src
            ele.muted = true
            ele.autoplay = true
            return new Promise((resolve, reject) => {
                ele.addEventListener('canplay', (e) => {
                    const { videoWidth, videoHeight } = e.target
                    const ratio = videoWidth / videoHeight
                    const initWidth = width || (height ? height * ratio : videoWidth)
                    const initHeight = height || (width ? width / ratio : videoHeight)
                    const eleWidth = initWidth * scale
                    const eleHeight = initHeight * scale
                    ele.width = eleWidth
                    ele.height = eleHeight
                    const data = drawElement(ele, { width: eleWidth, height: eleHeight })
                    this.emitEvent('complete', {
                        width: eleWidth,
                        height: eleHeight,
                        rawWidth: videoWidth,
                        rawHeight: videoHeight
                    })
                    resolve({
                        poster: data,
                        width: eleWidth,
                        height: eleHeight,
                        rawWidth: videoWidth,
                        rawHeight: videoHeight
                    })
                })
                // 错误
                ele.addEventListener('error', (e) => {
                    reject(new Error(e.message))
                })
            })
        }
    }
}
</script>