<!-- 疫情list -->
<template>
  <div class="list-box">
    <div class="info-title info">
      <p>地区</p>
      <p>现有确诊</p>
      <p>确诊</p>
      <p>死亡</p>
      <p>治愈</p>
    </div>
    <div class="list" v-for="item in epideList" :key="item.id">
      <div class="p-box">
        <div @click="getChowChildren(item.id)" class="info">
          <p>{{ item.name }}</p>
          <!-- 确诊病例 计数可能出现负数情况 -->
          <p>
            {{
              item.total.confirm - item.total.dead - item.total.heal >= 0
                ? item.total.confirm - item.total.dead - item.total.heal
                : 0
            }}
          </p>
          <p>
            <span>{{ item.total.confirm }}</span>
            <span>较昨日+{{ item.today.confirm ? item.today.confirm : 0 }}</span>
          </p>
          <p>{{ item.total.dead }}</p>
          <p>{{ item.total.heal }}</p>
        </div>
        <div v-if="showChildren">
          <div>
            <div v-show="data.showChildrenId == item.id" class="children-box">
              <EpidemicList :epideList="item.children" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- name  组件可以自己调用自己(递归调用) 只能通过name选项来做此事-->
<script name="EpidemicList" setup lang="ts">
// 声明props
import {  reactive } from "vue";
import { IEpidData } from "../type";
//无需引入
const props = defineProps({
  //疫情数据
  epideList:Array<IEpidData>,
  //是否展示子数组 省=>市 区数据
  showChildren: Boolean,
});
//点击展示
const data = reactive({
  showChildrenId: "",
});
//判定 子列表点击是否展示 各个省下面具体的地区
const getChowChildren = (id: string) => {
  //原理:通过id来确定要展示的list 点击第二次则置空 不展示效果
  data.showChildrenId == id ? (data.showChildrenId = ""): (data.showChildrenId = id);
};
//确诊案例 存在
</script>

<style lang="scss" scoped>
.list-box {
  border: 1px solid #d1d1d1;
  margin: 1rem 0;
  .p-box {
    .children-box {
      margin-left: 1rem;
      .list-box {
        border: none;
      }
      .info-title {
        height: 30px;
        line-height: 30px;
      }
      p {
        &:nth-child(1) {
          font-weight: 600;
          color: #999;
        }
      }
    }
  }
}
.info-title {
  font-weight: 600;
  color: #000;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  background: #d1d1d1;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > p {
    width: 15%;
    text-align: center;
    // white-space: nowrap;
    &:nth-child(1) {
      font-weight: 600;
      color: #000;
    }
    &:nth-child(2) {
      width: 23%;
      color: red;
    }
    &:nth-child(3) {
      width: 23%;
      white-space: nowrap;
      span {
        display: block;
        &:last-child {
          color: #999;
        }
      }
    }
  }
}
.list {
  &:nth-of-type(odd) {
    background: #f6f6f6;
  }
  .info {
    height: 80px;
    line-height: 80px;
    p {
      line-height: 20px;
    }
  }
}
</style>
