import { action, observable } from 'mobx';
import {
  getGrowthCycle,
  getHeatTrend,
  getLifeCycle,
  getQuadrant,
  getStarTGI,
  getWavePath,
  listMainType
} from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

class ForecastDetailStore {
  @observable tabTitle: number = 1;
  // @observable ipids: string;
  @observable tgiParam = {
    ipids: ''
  };
  @observable fansSexData = {};
  @observable fansAgeData = {};
  @observable basicInfo = [];
  @observable lifeData = [];

  @observable fluctuation = {}; // 波动值
  @observable growthCycle = {}; // 发展周期
  @observable wavePath = {}; // 波动轨迹

  @observable heatData = []; // 热度
  @observable quadrant = {
    famousData: {}, // 知名度
    matchData: {}, // 匹配度
  }; // 四象限图

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

    this.fluctuation = {}; // 波动值
    this.growthCycle = {}; // 发展周期
    this.wavePath = {}; // 波动轨迹

    this.heatData = []; // 热度

    this.quadrant = {
      famousData: {}, // 知名度
      matchData: {}, // 匹配度
    }
    ; // 四象限图

  }

  /**
   * IP概况 basicInfo
   * 粉丝分析 fansSexData fansAgeData
   */
  @action
  async funTGI() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getStarTGI({
      ipids
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
      this.basicInfo = data;

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
      this.basicInfo = [];

      this.fansSexData = {};
      this.fansAgeData = {};
    }
  }

  /**
   * 发展周期
   */
  @action
  async funLife() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getLifeCycle({
      ipids
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.lifeData = data;
      let legend = [], series = [];
      data.forEach(item => {
        legend.push(item.ipName);
        series.push(item.sharpeNumber);
      });
      this.fluctuation = {
        legend, series
      };
    } else {
      this.lifeData = [];
      this.fluctuation = {};
    }
  }

  /**
   * 发展周期-发展周期
   */
  @action
  async funGrowthCycle() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getGrowthCycle({
      ipids
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.growthCycle = data;

    }
  }

  /**
   * 发展周期-波动轨迹
   */
  @action
  async funWavePath() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getWavePath({
      ipids
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.wavePath = data;
    }
  }

  /**
   * 四象限图
   */
  async funQuadrant() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getQuadrant({
      ipids
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.quadrant.famousData = {
        legend: data.popularitysIpName,
        series: data.popularitys
      };
      this.quadrant.matchData = {
        legend: data.matchingDegreesIpName,
        series: data.matchingDegrees
      };
    } else {
      this.quadrant = {
        famousData: {}, // 知名度
        matchData: {}, // 匹配度
      }; // 四象限图
    }
  }

  /**
   * 热度趋势
   */
  async funHeat() {
    const { ipids } = this.tgiParam;
    const { errorCode, result: { data, errorCode: code } }: any = await getHeatTrend({
      ipids
    });
    if (errorCode === '200' && code === 200 && !_isEmpty(data)) {
      this.heatData = data;
    } else {

      this.heatData = [];
    }
  }
}

export default new ForecastDetailStore();
