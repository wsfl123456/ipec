import { action, observable } from 'mobx';
import {
  eqFamousDangerNew,
  eqForecastBasicNew,
  eqForecastBlackWorld,
  eqForecastTrendNew,
  eqRecommendNew,
  eqBusinessCNew,
  getFansAreaNew,
  getGrowthCycleNew,
  getHeatTrendNew,
  getStarTGINew,
  getWavePathNew, getWordCloubNew, eqBusinessEcologyNew,
  getConsumptionToken,
  getIsDeduction,
  getFansAreaNewFilter,
  getWordCloubNewFilter
} from '@utils/api';
import _isEmpty from 'lodash/isEmpty';
import { BaseStore } from '../../stores/base-store';


class ForecastDetailStore  {
  @observable userInfo;
  @observable tabTitle: number = 1;
  @observable hotFamousTitle: number = 1; // 1热度 2知名度
  @observable tgiParam = {
    ipids: ''
  };
  @observable fansSexData = {};
  @observable fansAgeData = {};
  @observable basicInfo = [];
  @observable lifeData = [];

  @observable growthCycle = {}; // 发展周期
  @observable wavePath = {}; // 波动轨迹

  @observable heatData = []; // 热度

  @observable blackPowerData = {}; // 黑粉占比
  @observable blackPowerDangerData = []; // 黑粉风险点
  @observable tabBlackFans = 0;

  @observable mediaFocusData = {}; // 媒体关注度（知名度)
  @observable fansData = {}; //  粉丝数（知名度）
  @observable searchData = {}; // 搜索量（知名度）

  @observable searchResultData = {}; // 搜索相关结果量(知名度）
  @observable tabSearch = 85;
  @observable tabSearchResult = [
    { id: 85, name: '百度' },
    { id: 86, name: '360搜索' },
    { id: 87, name: '搜狗搜索' },
    { id: 88, name: '必应' },
  ]; // tab切换-搜索相关结果量

  @observable exitTimeData = {}; // 存在时间（知名度）
  // @observable famousDanger = {
  //   1: this.blackPowerData,
  //   2: this.fansData,
  //   3: this.searchData,
  //   4: this.searchResultData,
  //   5: this.exitTimeData,
  // };
  @observable peopleData = {}; // 大众热议指数
  @observable risingTrend = {}; // 涨粉趋势
  @observable priceTrend = {}; // 价格趋势
  @observable tabIdName = [];
  @observable tabId = '';
  @observable tabName = '';
  @observable cityList = [];
  @observable ipProvinceData = []; // 地区分布
  @observable xProvince = [];
  @observable yProvince = [];
  @observable ipWordCloudData = []; // IP词云
  @observable tabWordCloud = 0;
  @observable businessC = []; // 商业合作
  @observable businessE = []; // 商业生态
  @observable potentialValue = {}; // 潜力值
  @observable recommendData = []; // 推荐指数
  @observable consumptionToken = null;

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };
  @action
  setTabTitle(params: number) {
    this.tabTitle = params;
  }

  @action
  setIpids(params: string) {
    this.tgiParam.ipids = params;
  }

  @action
  clearData() {
    this.fansSexData = {};
    this.fansAgeData = {};
    this.basicInfo = [];
    this.lifeData = [];

    this.growthCycle = {}; // 发展周期

    this.heatData = []; // 热度

  }

  /**
   *  黑粉占比(风险评估)、粉丝数(知名度)、搜索量(知名度)、搜索相关结果量(知名度)
   * 类型Id：名人-黑粉占比89，影视综-黑粉占比93、粉丝数14、搜索量5、搜索相关结果量(百度-85、360-86、搜狗-87、必应-88)
   */
  @action
  async funFamousDanger(params) {
    const { result: { data }, errorCode }: any = await eqFamousDangerNew({...params, ...{consumptionToken:this.consumptionToken, userGuid:this.userInfo.userGuid}});
    if (errorCode === "200") {
      if (params.typeId === 89 || params.typeId === 93 || params.typeId === 95 || params.typeId === 97 || params.typeId === 101) {
        this.blackPowerData = data;
      }
      if (params.typeId === 14) {
        this.fansData = data;
      }
      if (params.typeId === 5) {
        this.searchData = data;
      }
      if (params.typeId === 85 || params.typeId === 86 || params.typeId === 87 || params.typeId === 88) {
        this.searchResultData = data;
      }
      // this.famousDanger[Number(params.type)] = data;
    }
  }

  /**
   * 基础信息、大众热议指数、媒体关注度、潜力值、存在时间
   */
  @action
  async funBasic(userGuid) {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await eqForecastBasicNew({ ipids, consumptionToken: this.consumptionToken, userGuid: this.userInfo.userGuid });
    if (errorCode === '200') {
      this.basicInfo = data;
      let xAxis = [], series = [], tabIdName = [],
        potentialSeries = [], existTimeSeries = [],
        mediaFocusSeries = [];
      data.forEach(item => {
        xAxis = [...xAxis, item.ipName];
        tabIdName.push({ ipid: item.ipid, ipName: item.ipName });
        series = [...series, item.arithmaticHotspotPrice];
        potentialSeries = [...potentialSeries, item.potential];
        existTimeSeries = [...existTimeSeries, item.existenceDuration];
        mediaFocusSeries = [...mediaFocusSeries, item.mediaAnalysis];

      });
      this.tabIdName = tabIdName;
      this.tabId = tabIdName[0].ipid;
      this.tabName = tabIdName[0].iName;

      await this.getFansAreaData({ userGuid, ipid: this.tabId, ipids, typeId: 3, consumptionToken: this.consumptionToken });
      await this.getWordData({ userGuid, ipid: Number(this.tabId), ipids, wordType: 1 });
      await this.getWordData({ userGuid, ipid: Number(this.tabId), ipids, wordType: 2 });

      // this.tabXA = xAxis;
      this.peopleData = { xAxis, series };
      this.potentialValue = { xAxis, series: potentialSeries };
      this.exitTimeData = { xAxis, series: existTimeSeries };
      this.mediaFocusData = { xAxis, series: mediaFocusSeries };
    }
  }

  /**
   * 详情页-评估数据--地区分布（3 省份 ）；
   */
  async getFansAreaData(params) {
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getFansAreaNewFilter(params);
    let ipProvinceData: object[] = [],
      xProvince: string[] = [],
      yProvince: string[] = [];

    if (errorCode === "200" && ecode > 0) {

      if (params.typeId === 3 && data) {
        data.forEach((it) => {
          let obj = {
            value: it.dataNumber,
            name: it.dataType.replace(/\省|\市/g, ''),
          };
          xProvince.push((it.dataNumber));
          yProvince.push(it.dataType);
          if (yProvince.length > 10) {
            yProvince = yProvince.slice(0, 10);
          }
          if (xProvince.length > 10) {
            xProvince = xProvince.slice(0, 10);
          }
          ipProvinceData.push(obj);
        });
        this.ipProvinceData = ipProvinceData;
        this.xProvince = xProvince.reverse();
        this.yProvince = yProvince.reverse();
      }
    } else {
      return errorMsg;
    }
  }

  /**
   * 关键词云  黑粉词云
   */
  @action
  async getWordData({ userGuid, ipid, ipids, wordType }: { userGuid: string, ipid: number, ipids: any, wordType: number }) {
    const { errorCode, result: { data, errorCode: ecode } }: any = await getWordCloubNewFilter({
      userGuid,
      ipid,
      ipids,
      wordType,
      consumptionToken: this.consumptionToken
    });
    let wordCloudData: object[] = [];
    if (errorCode === "200" && ecode === 200) {
      data.forEach((it) => {
        let obj = {
          name: it.wordName,
          value: it.wordValue,
        };
        wordCloudData.push(obj);
      });
      if (wordType === 1) {
        this.ipWordCloudData = wordCloudData;
      } else {
         this.blackPowerDangerData = wordCloudData;
      }

    }
  }

  /**
   * 涨粉趋势、价格趋势
   */
  @action
  async funHeatPriceTrend(params) {
    const { errorCode, result: { data, errorCode: code } }: any = await eqForecastTrendNew({...params, ...{userGuid: this.userInfo.userGuid,consumptionToken: this.consumptionToken}});
    if (errorCode === '200') {
      if (params.type === 1) {
        this.risingTrend = data;
        // console.log("涨粉x" + data);
      } else {
        this.priceTrend = data;
      }
    }
  }

  /**
   * 粉丝分析 fansSexData fansAgeData
   */
  @action
  async funTGI() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getStarTGINew({
      ipids,
      consumptionToken: this.consumptionToken,
      userGuid: this.userInfo.userGuid
    });

    let legend = [], male = [], female = [], arr = [], series = [];
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {

      data.forEach((item, index) => {
        legend.push(item.ipName);
        item.dataNumberMail === null ? male.push(0) : male.push(item.dataNumberMail);
        item.dataNumberFemail === null ? female.push(0) : female.push(item.dataNumberFemail);

        if (index + 1) {
          arr = [item.a70, item.a80, item.a90, item.a00];
        }
        series = [...series, arr];
      });
      // this.basicInfo = data;

      this.fansSexData = {
        legend,
        male,
        female
      };
      this.fansAgeData = {
        xAxis: legend,
        series,
      };
    } else {
      // this.basicInfo = [];

      this.fansSexData = {};
      this.fansAgeData = {};
    }
  }

  /**
   * 发展阶段
   */
  @action
  async funGrowthCycle() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getGrowthCycleNew({
      ipids,
      userGuid: this.userInfo.userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.growthCycle = data;

    }
  }

  /**
   * 波动轨迹
   */
  @action
  async funWavePath() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getWavePathNew({
      ipids,
      userGuid: this.userInfo.userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.wavePath = data;
    }
  }

  // 商业合作
  @action
  async funBusiness() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await eqBusinessCNew({
      ipids,
      userGuid: this.userInfo.userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.businessC = data;
    }
  }

  // 商业生态
  @action
  async funBusinessEcology() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await eqBusinessEcologyNew({
      ipids,
      userGuid: this.userInfo.userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.businessE = data;
    }
  }

  /**
   * 热度趋势
   */
  @action
  async funHeat() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getHeatTrendNew({
      ipids,
      consumptionToken: this.consumptionToken,
      userGuid:this.userInfo.userGuid
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.heatData = data;
    } else {

      this.heatData = [];
    }
  }

  /**
   * 推荐指数
   */
  @action
  async funRecommend() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data } }: any = await eqRecommendNew({ ipids,consumptionToken: this.consumptionToken,
      userGuid:this.userInfo.userGuid });
    if (errorCode === '200') {
      this.recommendData = data;
    }

  }
  /**
   * 获取消费Token接口
   */
  async getConsumptionToken({type = '', ipids = ''} = {}) {
    const { result: { data, errorCode, errorMsg } }: any = await getConsumptionToken({type, ipids, userGuid:this.userInfo.userGuid});
    this.consumptionToken = data;
    return { errorCode, errorMsg }
  }
}

export default new ForecastDetailStore();
