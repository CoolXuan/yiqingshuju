<!-- 下拉刷新新数据 -->
<template>
  <div class="box">
    <!-- 内部属性  @scroll 监听滚动条事件 -->
    <div
      @scroll="scrollEvent"
      class="scroll-box"
    >
      <!-- 插槽 -->
      <slot></slot>
      <div class="end-text" v-if="!isScroll">{{ endText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "@vue/reactivity";
const props = defineProps({
  //下拉高度
  distance: Number ,
  //判定是否下拉
  isScroll: Boolean,
  endText: {
    type: String,
    default: "没有更多了",
  },
});
//子传父参数
const $emits = defineEmits(["getList"]);

const data = reactive({
  //离屏幕高度
  scrollTop: 0,
});

let {
  scrollTop,
} = toRefs(data);


//下拉刷新 判定
const scrollEvent = (e: any) => {
  scrollTop = e.srcElement.scrollTop;
  if (!props.isScroll) return;
  if (
    //判定下拉高度
    scrollTop + e.srcElement.offsetHeight >
    e.srcElement.scrollHeight - props.distance!
  ) {
    $emits("getList");
  }
};
</script>

<style lang="scss" scoped>
.box {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 90vh;
}
.scroll-box {
  height: 90vh;
  width: 100%;
  overflow: auto;
  transition: all 0s ease 0s;
  position: absolute;
  right: 0;
  .end-text {
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #999;
  }
}
</style>