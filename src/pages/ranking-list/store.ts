import { action, observable } from 'mobx';
import { eqRankingList, eqTimeList } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';

interface IRankState {
  platformType: number;
  dataRiqi: any;
  currentPage: number;
  pageSize: number;
}

class IRankingStore {
  @observable rankingData: Array<any>;
  @observable tabActive: string = "抖音";
  @observable isLoading: boolean = true;
  @observable rankParams: IRankState = {
    platformType: 1,
    dataRiqi: '',
    currentPage: 1,
    pageSize: 10,
  };
  @observable timeList = [];
  @observable time = '';
  @observable seeMore = false;
  @observable noMore = false;

  // tab 切换
  @action
  setTab(param) {
    this.tabActive = param;
  }

  @action
  async changeRankParams(params) {
    this.rankParams = { ...this.rankParams, ...params };
    await this.getRanking();
  }

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
      await this.changeRankParams(param);
    } else {
      this.timeList = [];
      this.time = '';
      this.rankingData = [];
      this.noMore = false;
      this.seeMore = false;
    }
  }
}

export default new IRankingStore();
