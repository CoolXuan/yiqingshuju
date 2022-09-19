interface IData {
  //全球疫情数据树
  areaTree: IEpidData[];
  chinaDayList: [];
  //全球疫情列表展示
  showList:IEpidData[];
  //全球疫情数组 用来完成分页功能 
  globalEpidemic: Array<IEpidData[]>
  // 疫情 中国总统计
  chinaTotal: IChinaTotal;
  //中国疫情
  china: IEpidData[] | undefined;
  //江西疫情
  jxData: IEpidData | undefined;
  // 进行判定 number 全国 1 江西
  type: number;
  // 判定展示那一个地图 全国现状 全国累计
  mapType: number;
  lineType: number;
  //最新更新时间
  lastUpdateTime: string;
  //下拉刷新判定
  isScroll:Boolean;
}
//疫情数据单位统计
interface IEpidData {
  today: {
    confirm: number;
    suspect: number;
    heal: number;
    dead: number;
    severe: number;
    storeConfirm: number;
  };
  total: {
    confirm: number;
    suspect: number;
    heal: number;
    dead: number;
    severe: number;
    input: number;
  };
  extData: {};
  name: string;
  id: string;
  lastUpdateTime: string;
  children: IEpidData[] | undefined;
}

//疫情 中国总统计
interface IChinaTotal {
  total: {
    confirm: number;
    suspect: number;
    heal: number;
    dead: number;
    severe: number;
    input: number;
  };
  today: {
    input: number;
    storeConfirm: number;
    confirm: number;
    dead: number;
    heal: number;
  };
  extData: {
    noSymptom: number;
    incrNoSymptom: number;
  };
}
//中国地图数值定义
interface IMap{
  name: string,
  value:number
}

export type { IData, IChinaTotal, IEpidData ,IMap};
