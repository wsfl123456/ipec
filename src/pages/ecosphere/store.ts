import { action, observable } from 'mobx';
import { getListCompany, getListUser, } from '@utils/api';
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import _isEmpty from 'lodash/isEmpty';

interface IGetState {
  type?: number,
  currentPage: number,
  pageSize: number,
}

interface IUserState {
  ecosphereType?: number,
  currentPage: number,
  pageSize: number,
}

class EcosphereStore {
  @observable falseData = {}; // 假数据个人信息
  @observable listUser: object[];

  // 1. 顾问团、2. 行业先锋
  @observable getParams_i: IUserState = {
    ecosphereType: 2,
    currentPage: 1,
    pageSize: 10
  };
  @observable listIndustry: object[];
  @observable isLoading_i: boolean;
  @observable seeMore_i: boolean;
  @observable noMore_i: boolean = false;

  //  企业
  @observable getParams: IGetState = {
    type: undefined,
    currentPage: 1,
    pageSize: 12
  };
  @observable listCompany: object[];
  @observable isLoading: boolean;
  @observable seeMore: boolean;
  @observable noMore: boolean = false;

  @action
  /**
   *  假数据个人信息保存,展示个人中心
   */
  @action
  keepData(data){
    this.falseData = data;
  };

  /**
   *  企业分类筛选
   * @param params
   */
  @action
  async receiveChange(params: IGetState) {
    this.getParams = { ...this.getParams, ...params };
    await this.getListCompany();
  }

  /**
   * 顾问团、行业先锋
   * @param params
   */
  @action
  async receiveChange_i(params: IUserState) {
    this.getParams_i = { ...this.getParams_i, ...params };
    await this.getListIndustry();
  }

  /**
   * 获取生态圈(个人-顾问团、行业先锋)
   */
  @action
  async getListIndustry() {
    const { ecosphereType, pageSize, currentPage } = this.getParams_i;
    const { errorCode, result }: any = await getListUser({
      ecosphereType,
      pageSize,
      currentPage
    });
    if (errorCode === '200') {
      currentPage === 1 ? this.listIndustry = result : this.listIndustry = [...this.listIndustry, ...result];
      if (!_isEmpty(result)) {
        if (result.length < pageSize) {
          this.seeMore_i = false;
          this.isLoading_i = false;
          this.noMore_i = true;
        } else {
          this.seeMore_i = true;
          this.isLoading_i = false;
        }

      } else {
        if (currentPage === 1) {
          this.listIndustry = [];
        }
        this.seeMore_i = false;
        this.isLoading_i = false;
        this.noMore_i = false;
      }

    }
  }

  /**
   * 获取会员列表- 生态圈 - 企业
   */
  @action
  async getListCompany() {
    const { type, pageSize, currentPage } = this.getParams;
    this.isLoading = false;
    const { errorCode, result }: any = await getListCompany({
      type, pageSize, currentPage
    });
    if (errorCode === '200') {
      currentPage === 1 ? this.listCompany = result : this.listCompany = [...this.listCompany, ...result];

      if ((!_isEmpty(result) && result.length < pageSize) || _isEmpty(result)) {
        this.seeMore = false;
        this.isLoading = false;
      } else {
        this.seeMore = true;
      }

      if (!_isEmpty(result) && result.length < pageSize) {
        this.noMore = true;
      } else {
        this.noMore = false;
      }

    } else {
      return { message: result.errorMsg, request: false };
    }
  }

}

export default new EcosphereStore();
