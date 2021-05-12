import { action, observable } from 'mobx';
import { eqRankingList, eqTimeList, eqTypeRankingList, listMainType } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

interface IRankState {
  platformType: number;
  dataRiqi: any;
  currentPage: number;
  pageSize: number;
}

interface ITypeState {
  mainTypeGuid: string;
  dataRiqi: string;
}

class IRankingStore {
  @observable rankingData: Array<any>;
  @observable typeRankingData: Array<any>;
  @observable tabTitle: number = 1;
  @observable tabActive: string = "抖音";
  @observable tabTypeActive: string = "";
  @observable isLoading: boolean = true;
  @observable rankParams: IRankState = {
    platformType: 1,
    dataRiqi: '',
    currentPage: 1,
    pageSize: 10,
  };
  @observable typeParams: ITypeState = {
    mainTypeGuid: '',
    dataRiqi: ''
  };
  @observable timeList = [];
  @observable time = '';
  @observable seeMore = false;
  @observable noMore = false;
  @observable typeData = false;
  @observable tenType = [];

  // tab 切换
  @action
  setTabTitle(param) {
    this.tabTitle = param;
  }

  @action
  setTab(param) {
    this.tabActive = param;
  }

  @action
  setTabTypeActive(params) {
    this.tabTypeActive = params;
  }

  @action
  async changeRankParams(params) {
    this.rankParams = { ...this.rankParams, ...params };
    await this.getRanking();
  }

  @action
  async changeTypeRank(params) {
    this.typeParams = { ...this.typeParams, ...params };
    await this.getTypeRanking();
  }

  /**
   * 类型排行榜
   */
  @action
  async getTypeRanking() {
    const { mainTypeGuid, dataRiqi } = this.typeParams;
    const { errorCode, result: data }: any = await eqTypeRankingList({
      mainTypeGuid, dataRiqi
    });
    if (errorCode === '200') {
      this.typeRankingData = data;
    }
  }

  /**
   * 平台排行榜
   */
  @action
  async getRanking() {
    const { platformType, dataRiqi, currentPage, pageSize } = this.rankParams;
    const { errorCode, result: data, errorMessage }: any = await eqRankingList({
      platformType,
      dataRiqi,
      currentPage,
      pageSize
    });
    this.isLoading = true;
    if (errorCode === '200') {
      currentPage === 1 ? this.rankingData = data : this.rankingData = [...this.rankingData, ...data];

      this.isLoading = _isEmpty(data);

      if (!_isEmpty(this.rankingData)) {
        this.seeMore = true;
        this.noMore = false;
        if (data.length < pageSize) {
          this.seeMore = false;
          this.isLoading = false;
          this.noMore = true;
        }
      } else {
        this.seeMore = false;
        this.noMore = false;
      }
    }
  }

  /**
   * 日期
   * @param platformType:平台类型
   * 0:二厂IP排行
   */
  @action
  async dateList(platformType) {
    const { errorCode, result }: any = await eqTimeList({
      platformType
    });
    if (errorCode === '200' && !_isEmpty(result)) {
      this.timeList = result;
      this.time = result && result[0].substring(result[0].length - 10);
      let param = { dataRiqi: this.time, currentPage: 1, platformType };
      if (platformType === 0) {
        await this.changeTypeRank({ dataRiqi: this.time });
        return;
      }
      await this.changeRankParams(param);
    } else {
      this.timeList = [];
      this.time = '';
      this.rankingData = [];
      this.noMore = false;
      this.seeMore = false;
    }
  }

  // 十大类型
  @action
  async mediaType() {
    let { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      this.tenType = result;
      this.changeTypeRank({mainTypeGuid: ''});
    }
  }
}

export default new IRankingStore();
