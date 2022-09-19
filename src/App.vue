<template>
  <UpRefreshAndToTop @refreshFun="refreshFun">
    <div class="box">
      <!-- 疫情实时数据 -->
      <div class="top-box">
        <img class="bg-img" src="./assets/bt.jpg" />
        <div class="title-text">
          <h1>科学防疫 共渡难关</h1>
          <h2>疫情大数据实时统计</h2>
          <h5>更新时间:{{ lastUpdateTime }}</h5>
        </div>
        <div v-if="chinaTotal" class="cover-cards">
          <div class="cover-tab">
            <div class="top-tab" @click="changeType(0)" :class="{ active: data.type === 0 }">
              全国疫情数据(含港澳台)
            </div>
            <div class="top-tab" @click="changeType(1)" :class="{ active: data.type === 1 }">
              江西疫情数据
            </div>
          </div>
          <!-- 全国疫情 -->
          <div class="cover-info" v-show="data.type === 0">
            <div>
              <h4 class="title">境外输入</h4>
              <p class="number">{{ chinaTotal.total.input }}</p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.today.input }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">无症状感染者</h4>
              <p class="number">{{ chinaTotal.extData.noSymptom }}</p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.extData.incrNoSymptom }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">现有确诊</h4>
              <p class="number">
                {{
                chinaTotal.total.confirm -
                chinaTotal.total.dead -
                chinaTotal.total.heal
                }}
              </p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.today.storeConfirm }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">累计确诊</h4>
              <p class="number">{{ chinaTotal.total.confirm }}</p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.today.confirm }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">累计死亡</h4>
              <p class="number">{{ chinaTotal.total.dead }}</p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.today.dead }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">累计治愈</h4>
              <p class="number">{{ chinaTotal.total.heal }}</p>
              <p class="tip">
                <span>较昨日</span>
                <span>+{{ chinaTotal.today.heal }}</span>
              </p>
            </div>
          </div>
          <!-- 江西疫情 -->
          <div v-if="jxData" v-show="data.type === 1" class="cover-info">
            <div>
              <h4 class="title">累计确诊</h4>
              <p class="number">{{ jxData.total.confirm }}</p>
              <p class="tip">
                较昨日
                <span>+{{ jxData.today.confirm }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">累计死亡</h4>
              <p class="number">{{ jxData.total.dead }}</p>
              <p class="tip">
                较昨日
                <span>+{{ jxData.today.dead }}</span>
              </p>
            </div>
            <div>
              <h4 class="title">累计治愈</h4>
              <p class="number">{{ jxData.total.heal }}</p>
              <p class="tip">
                较昨日
                <span>+{{ jxData.today.heal }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 疫情地图 -->
      <div class="data-map content">
        <h3>中国疫情</h3>
        <div class="map-box">
          <div :class="data.mapType == 1 ? 'to-left' : 'to-right'" id="nowMap"></div>
          <div :class="data.mapType == 1 ? 'to-left' : 'to-right'" id="totalMap"></div>
        </div>
        <div class="map-btn">
          <div @click="mapTypeChange(1)" :class="{ active: data.mapType == 1 }">
            现有确诊
          </div>
          <div @click="mapTypeChange(2)" :class="{ active: data.mapType == 2 }">
            累计确诊
          </div>
        </div>
      </div>
      <!-- 中国疫情列表 -->
      <div class="data-list content">
        <h3>中国病例</h3>
        <span class="hint">温馨提示:点击可展示具体城市</span>
        <EpidemicList :epideList="china" :showChildren="true"></EpidemicList>
      </div>
      <!-- 世界疫情 无点击子模块 -->
      <div v-if="data.showList.length" class="data-list content">
        <h3>世界病例</h3>
        <DownRefresh :distance="100" :isScroll="data.isScroll" @getList="getList">
          <EpidemicList :showChildren="false" :epideList="data.showList" />
        </DownRefresh>
      </div>
    </div>
  </UpRefreshAndToTop>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import { InfoData, initDataFun } from "./pageTs/index";
import EpidemicList from "./components/EpidemicList.vue";
import UpRefreshAndToTop from "./components/UpRefreshAndToTop.vue";
import DownRefresh from "./components/DownRefresh.vue";
const data = reactive(new InfoData());
onMounted(() => {
  initDataFun(data);
});
//解构数据
const { chinaTotal, jxData, china, lastUpdateTime } = toRefs(data);

//切换 疫情实时数据 全国 江西
const changeType = (toType: number) => {
  data.type = toType;
};
//地图 切换
const mapTypeChange = (type: number) => {
  console.log(type);
  data.mapType = type;
};
//下拉效果 全球疫情列表
let page: number = 0;
const getList = () => {
  if (page === data.globalEpidemic.length - 1) {
    data.isScroll = false;
    return;
  }
  console.log("加载下一页");

  // 子组件触发,加载下一页数据
  page++;
  data.showList.push(...data.globalEpidemic[page]);
};
//重新加载数据
const refreshFun = (fun: Function) => {
  initDataFun(data).then(() => {
    //疫情实时数据切换成全国数据
    data.type = 0;
    //重置全球疫情下拉功能
    page = 0;
    data.isScroll = true;
    //控制手指按下屏幕的title显示 去除
    fun();
  });
};
</script>

<style lang="scss" scoped>
html,
body,
#app {
  max-width: 375px;
}

// 滑动动画
@keyframes toRight {
  from {
    left: 0;
  }

  to {
    left: calc(0px - 100vw + 1rem);
  }
}

@keyframes toLeft {
  from {
    left: calc(0px - 100vw + 1rem);
  }

  to {
    left: 0;
  }
}

.bg-img {
  height: 100%;
  width: 100%;
}

//疫情实时数据样式
.top-box {
  position: relative;

  .title-text {
    position: absolute;
    z-index: 2;
    color: #fff;
    top: 20px;
    left: 1rem;

    h1 {
      color: #34aa70;
    }

    h2 {
      color: #ffa352;
    }

    h5 {
      color: #000;
    }
  }

  .cover-cards {
    position: absolute;
    top: 12rem;
    background: #fff;
    border-radius: 20px;
    width: calc(100% - 2rem);
    left: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 20px rgb(0 0 0 / 10%);

    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      &.cover-tab {
        >div {
          width: 50%;
          background: #efefef;
          text-align: center;
          height: 40px;
          line-height: 40px;

          &.active {
            background: #fff;
          }
        }

        .top-tab {
          font-size: 16px;
          font-weight: 550;
        }
      }

      &.cover-info {
        >div {
          width: 33%;
          text-align: center;
          margin: 10px 0;

          &:nth-child(2) {

            .number,
            span {
              color: #ffa352;
            }
          }

          &:nth-child(3) {

            .number,
            span {
              color: #791618;
            }
          }

          &:nth-child(4) {

            .number,
            span {
              color: #e44a3d;
            }
          }

          &:nth-child(5) {

            .number,
            span {
              color: #333;
            }
          }

          &:nth-child(6) {

            .number,
            span {
              color: #34aa70;
            }
          }

          .title {
            font-size: 12px;
          }

          .number {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 5px 0;
            color: #a31d13;

            span {
              color: #a31d13;
            }
          }

          .tip {
            font-size: 12px;
          }
        }
      }
    }
  }
}

//疫情地图 数组样式
.content {
  padding: 0 1rem;
}

.data-map,
.data-list {
  margin-top: 200px;
  overflow: hidden;

  h3 {
    border-left: 8px solid #e10000;
    padding-left: 1rem;
  }

  .hint {
    font-size: 0.5rem;
    color: coral;
  }
}

.map-box {
  display: flex;
  width: 200%;
}

#nowMap,
#totalMap {
  height: 350px;
  width: 50%;
  animation-fill-mode: forwards;
  left: 0;
}

#nowMap {
  margin-right: 1rem;
}

#totalMap {
  margin-left: 1rem;
}

.to-left {
  animation: toLeft 1s;
}

.to-right {
  animation: toRight 1s;
}

.map-btn,
.line-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;

  >div {
    width: 45%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #d2d2d2;
    box-shadow: 0 5px 7px 1px rgb(0 0 0 / 5%);
    border-radius: 5px;
    text-align: center;

    &.active {
      border-color: #ce4733;
      background-color: #fef7f7;
      color: #ce2c1e;
    }
  }
}

.line-btn {
  >div {
    width: 30%;
    height: 55px;
    line-height: 25px;
    padding-top: 5px;
  }
}

.data-list {
  margin-top: 20px;
}
</style>
