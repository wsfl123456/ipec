import { action, observable } from "mobx";
import { industryOrder, firstOrder, industryCase, hotWords } from "@utils/api";
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import _isEmpty from "lodash/isEmpty";

interface IIndustryStatus {
  ipTypeSuperiorNumber?: string,
  portalCategoryGuid?: string,
  hotWords?: string,
  userGuid?: string,
  currentPage: number,
  postType: number,
  pageSize: number,
}

class IndustryStore {
  @observable industryList: object[];
  @observable firstOrderList: object[];
  @observable industryCaseList: object[] = [];
  @observable currentPage: number;

  @observable postType: number;
  @observable industryParams: IIndustryStatus = {
    ipTypeSuperiorNumber: "",
    portalCategoryGuid: "",
    userGuid: "",
    hotWords: "",
    postType: 1,
    currentPage: 1,
    pageSize: 15,
  };

  @observable hotWords: object[];

  @observable isLoading: boolean = false;

  @observable noMore: boolean = false; // 没有更多内容

  @observable seeMore: boolean = false; // 下拉查看更多

  @action
  async setStatus(params?: IIndustryStatus) {
    if (params) {
      this.industryParams = { ...this.industryParams, ...params };
    }
    await this.industryCase();
  }

  @action
  async firstOrders() {
    let { errorCode, result }: any = await firstOrder();
    if (errorCode === '200') {
      this.firstOrderList = result;
    }
  }

  @action
  async industry() {
    const { errorCode, result }: any = await industryOrder();
    if (errorCode === '200') {
      this.industryList = result;
    }
  }

  @action
  setIsLoading(flag: boolean) {
    this.isLoading = flag;
  }

  // 行业案例、 行业动态、人物专访、IP需求、行业趋势：5
  @action
  async industryCase() {
    const {
      ipTypeSuperiorNumber,
      portalCategoryGuid,
      hotWords,
      userGuid,
      postType,
      currentPage,
      pageSize
    } = this.industryParams;

    const { errorCode, result: { currentPage: current, data, totalPage } }: any = await industryCase({
      ipTypeSuperiorNumber,
      portalCategoryGuid,
      hotWords,
      userGuid,
      postType,
      currentPage,
      pageSize
    });
    this.setIsLoading(false);
    if (errorCode === "200") {
      if (!_isEmpty(data)) {
        current === 1 ? this.industryCaseList = data : this.industryCaseList = [...this.industryCaseList, ...data];
        if (this.currentPage !== current) this.currentPage = current;

        if (data.length < pageSize) {
          this.seeMore = false;
          this.noMore = true;
        } else {
          this.seeMore = true;
          this.noMore = false;
        }
      } else {
        if (current === 1) {
          this.industryCaseList = [];
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        this.isLoading = false;
        this.seeMore = false;
      }

    }

  }

  @action
  async getHotWords(params) {
    const { errorCode, result }: any = await hotWords(params);
    if (errorCode === '200') {
      this.hotWords = result;
    }
  }
}

export default new IndustryStore();
