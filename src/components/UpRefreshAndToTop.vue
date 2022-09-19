<!-- 顶部刷新 回退到顶部 -->
<template>
  <div class="box">
    <!-- 内部属性 事件: 触摸开始 @touchstart 触摸移动 @touchmove 触摸结束 @touchend  滚动条滑动 @scroll-->
    <div
      @touchend="touchend"
      @touchmove="touchmove"
      @touchstart="touchstart"
      @scroll="scrollEvent"
      :style="{ top: `${translateY}px` }"
      class="scroll-box"
    >
      <div class="loadingBox" v-if="touchstartTitleShow">释放可刷新...</div>
      <div class="loadingBox" v-if="touchEndTitleShow">加载中...</div>
      <!-- top 回退顶部的定位点 -->
      <div id="top"></div>
      <!-- 插槽 -->
      <slot></slot>
      <div v-show="data.isShowTop" class="back-box" @click="toTop">
      <img src="../assets/toTop.gif">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "@vue/reactivity";

const $emits = defineEmits(["refreshFun"]);

const data = reactive({
  startText: "释放即可刷新",
  scrollTop: 0,
  startY: 0,
  translateY: 0,
  touchEndTitleShow: false, //控制手指离开屏幕的title显示
  touchstartTitleShow: false, //控制手指按下屏幕的title显示
  isShowTop:false
});

let {
  touchstartTitleShow,
  touchEndTitleShow,
  translateY,
} = toRefs(data);

//手指触碰到屏幕
const touchstart = (e: any) => {
  let y = e.targetTouches[0].pageY;
  data.startY = y;
};
const scrollEvent = (e: any) => {
  data.scrollTop = e.srcElement.scrollTop;
  //判定是否展示回退顶部按钮
  data.scrollTop>400? (data.isShowTop=true) : (data.isShowTop=false); 
}
const toTop=()=>{
     //定位到div->top
     let anchor = document.getElementById("top")!;
      anchor.scrollIntoView();
}
//手指开始滑动
const touchmove = (e: any) => {
  let y = e.targetTouches[0].pageY;
  if (y > data.startY && data.scrollTop == 0) {
    data.touchstartTitleShow = true;
    //如果当前移动距离大于初始点击坐标，则视为是下拉。并且要处于顶部才刷新，不能影响正常的列表滑动。
    data.translateY = (y - data.startY) / 2;
  } else {
    data.touchstartTitleShow = false;
  }
};
//手指松开
const touchend = (e: any) => {
  let y = e.changedTouches[0].pageY;
  if (y > data.startY && data.scrollTop == 0) {
    data.translateY = 0;
    data.touchstartTitleShow = false;
    data.touchEndTitleShow = true;
    $emits("refreshFun", () => {
      data.touchEndTitleShow = false;
    });
    data.startY = 0;
  }
};

</script>

<style lang="scss" scoped>
.box {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100vh;
  .loadingBox {
    padding: 20px;
    text-align: center;
  }
}
.scroll-box {
  height: 100vh;
  width: 100%;
  overflow: auto;
  transition: all 0s ease 0s;
  position: absolute;
  right: 0;
   .back-box {
    height: 4rem;
    width: 4rem;
    // 如果对小火箭不满意 可以换成阴影盒子 样式也有
    // background-color: #fff;
    // 圆角弧度 添加圆角边框
    // border-radius: 50%;
    //盒子阴影
    // box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.4);
    // position 属性规定元素的定位类型 fixed元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    text-align: center;
    line-height: 4rem;
    img{
      width: 5rem;
      height: 5rem;
    }
  }
}
</style>