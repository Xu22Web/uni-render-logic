<template>
  <view class="content">
    <template v-if="posterData">
      <image class="img" :src="posterData.poster"
        :style="`width: ${posterData.width}px; height: ${posterData.height}px`" />
      <view class="extra">原始尺寸: {{ toFixed(posterData?.rawWidth) }} × {{
        toFixed(posterData?.rawHeight) }}</view>
      <view class="extra">生成尺寸: {{ toFixed(posterData?.width) }} × {{
        toFixed(posterData?.height) }}</view>
    </template>
    <view class="tips" v-else>未选择视频</view>
    <view class="text-area">
      <button class="btn" @click="selectVideo">选择视频</button>
      <MSnapshot ref="snapshot" @complete="onComplete" />
    </view>
  </view>
</template>

<script setup lang="ts">
import MSnapshot from '@/components/MSnapshot.vue';
import { toFixed } from '@/utils';
import { ref } from 'vue';
const snapshot = ref<InstanceType<typeof MSnapshot>>();
const posterData = ref<{ width: number, height: number, poster: string, rawWidth: number, rawHeight: number }>()

/**
 * 选择视频
 */
const selectVideo = async () => {
  const res = await uni.chooseVideo({
    maxDuration: 30,
    sourceType: ['camera', 'album'],
    compressed: false
  })

  try {
    const data = await snapshot.value?.addJob<{ width: number, height: number, poster: string, rawWidth: number, rawHeight: number }>('getPoster', {
      src: plus.io.convertLocalFileSystemURL(res.tempFilePath),
      width: 200
    })
    posterData.value = data
    uni.showToast({
      title: '生成视频封面成功',
      icon: 'none'
    })
  } catch (e: any) {
    console.log(e);
    uni.showToast({
      title: `生成视频封面失败 ${e.message}`,
      icon: 'none'
    })
  }
}

/**
 * 生成完成
 */
const onComplete = (data: any) => {
  console.log('onComplete', data);
}

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.img {
  margin: 40rpx 0;
  border-radius: 10rpx;
  background: #f6f6f6;
}

.text-area {
  display: flex;
  justify-content: center;
}

.tips {
  height: 200rpx;
  width: 200rpx;
  margin: 80rpx 0;
  border-radius: 10rpx;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  color: #ccc;
}

.extra {
  font-size: 24rpx;
  color: #ccc;
  line-height: 40rpx;
}

.btn {
  font-size: 36rpx;
  color: #8f8f94;
  background: #fff;
  margin-top: 40rpx;
}
</style>
