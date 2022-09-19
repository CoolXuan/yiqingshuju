import { IChinaTotal, IData, IEpidData, IMap } from "../type";
import axios from "axios";
import * as echarts from "echarts";
import chinaJson from "../assets/china.json";
//疫情实时数据 数据处理
class InfoData implements IData {
  areaTree: IEpidData[] = [];
  chinaDayList: [] = [];
  globalEpidemic:Array<IEpidData[]>=[];
  showList: IEpidData[]=[];
  chinaTotal: IChinaTotal = {
    total: {
      confirm: 0,
      suspect: 0,
      heal: 0,
      dead: 0,
      severe: 0,
      input: 0,
    },
    today: {
      input: 0,
      storeConfirm: 0,
      confirm: 0,
      dead: 0,
      heal: 0,
    },
    extData: {
      noSymptom: 0,
      incrNoSymptom: 0,
    },
  };
  china: IEpidData[] | undefined = [];
  jxData: IEpidData | undefined = {
    today: {
      confirm: 0,
      suspect: 0,
      heal: 0,
      dead: 0,
      severe: 0,
      storeConfirm: 0,
    },
    total: {
      confirm: 0,
      suspect: 0,
      heal: 0,
      dead: 0,
      severe: 0,
      input: 0,
    },
    extData: {},
    name: "",
    id: "",
    lastUpdateTime: "",
    children: ([] = []),
  };
  // 进行判定 0 全国 1 江西
  type = 0;
  mapType = 1;
  lineType = 0;
  lastUpdateTime = "";
  isScroll=true;
}
//数据分页处理 数组[][] 20一页
const getPageList = (list: IEpidData[]) => {
  const arr: Array<IEpidData[]> = [];
  for (let index = 0; index < list.length; index += 20) {
      arr.push(list.slice(index, index + 20))
  }
  return arr
}
const initDataFun = async (data: InfoData) => {
  //疫情地图数据 初始化
  //绑定要渲染的地方
  let nowMapDom: HTMLElement | null = document.getElementById("nowMap");
  let totalmapDom: HTMLElement | null = document.getElementById("totalMap");
  //初始化echarts实例
  let nowMap=echarts.getInstanceByDom(nowMapDom as HTMLElement); //有的话就获取已有echarts实例的DOM节点。
  let totalMap=echarts.getInstanceByDom(totalmapDom as HTMLElement);
  if(nowMap ==null || totalMap == null){ // 如果不存在，就进行初始化。
    nowMap = echarts.init(nowMapDom as HTMLElement);
    totalMap = echarts.init(totalmapDom as HTMLElement);
  } 
  //显示加载圈圈
  nowMap.showLoading();
  totalMap.showLoading();
  //定义两个地图 类型
  let nowMapData: IMap[] = [];
  let totalMapData: IMap[] = [];
  //导入自定义地图数据 registerMap 注册的地图名称。
  echarts.registerMap("china", chinaJson as any);
  //定义 图表 类型
  type EChartsOption = echarts.EChartsOption;
  //定义地图配置
  let series = {
    type: "map",
    map: "china",
    colorBy: "series", //按照系列分配调色盘中的颜色，同一系列中的所有数据都是用相同的颜色
    zoom: 1.3, //当前视角的缩放比例
    top: 80, //组件离容器上侧的距离
    label: {
      show: true,
      color: "#333",
      fontSize: 10,
    },
  };
  //点击地图效果 
  let optionMap: EChartsOption = {
    title: {
      //标题内容
      // text: '中国疫情图',
      subtext: "单击省份可查看病例数",
    },
    tooltip: {
      //提示框组件
      trigger: "item", //触发类型 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
      formatter: "现有确诊病例<br/>{b}: {c} ", //提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      //  模板变量有 { a }, { b }，{ c }，{ d }，{ e }，分别表示系列名，数据名，数据值等。
      //在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 { a0 }, { a1 }, { a2 } 这种后面加索引的方式表示系列的索引。 不同图表类型下的 { a }，{ b }，{ c }，{ d } 含义不一样。 其中变量{ a }, { b }, { c }, { d } 在不同图表类型下代表数据含义为：
      // 地图: { a }（系列名称），{ b }（区域名称），{ c }（合并数值）, { d }（无）
    },
    visualMap: {
      show: false,
    },
  };
  //获取疫情全部数据接口
  //await是等待的意思，await关键字只能放在async函数里
  //await配合async一起使用，相当于把异步函数变成了同步，await会等待后面表达式的返回结果之后才执行下一步。
  let res=await axios("/prod-api/ug/api/wuhan/app/data/list-total");
  console.log(res.data);
    //疫情实时数据处理
    //解构 [[1-30],[31-60],....]
    data.globalEpidemic = getPageList(res.data.data.areaTree);
    data.showList = data.globalEpidemic[0];
    //普通数据赋值
    data.areaTree = res.data.data.areaTree;
    data.chinaDayList = res.data.data.chinaDayList;
    data.chinaTotal = res.data.data.chinaTotal;
    data.lastUpdateTime=res.data.data.lastUpdateTime;
    //获取中国数据
    data.china = data.areaTree.find((v) => v.id === "0")?.children;
    //获取江西疫情数据
    data.jxData = data.china?.find((v) => v.id === "360000");
    //疫情地图数据处理
    data.china?.map((v:IEpidData ) => {
      //对于俩地图赋值
      nowMapData.push({
        name: v.name,
        value: v.total.confirm - v.total.dead - v.total.heal || 0,
      });
      totalMapData.push({
        name: v.name,
        value: v.total.confirm || 0,
      });
    });
    //隐藏加载 圈圈
    nowMap.hideLoading();
    totalMap.hideLoading();
    //数据入地图配置  绘制图表
    nowMap.setOption({
      ...optionMap,
      series: {
        ...series,
        data: nowMapData,
      },
    });
    totalMap.setOption({
      ...optionMap,
      series: {
        ...series,
        data: totalMapData,
      },
    });
};
export { InfoData, initDataFun };
