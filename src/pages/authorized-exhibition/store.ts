import { action, observable } from "mobx";
import {
  exhibitionList,
  getCompanyType,
  listMainType,
  getConfirm,
  getCountry,
  getProvince, matchSearchList, matchMakingListFirst, matchMakingList,
} from "@utils/api";
import _isEmpty from 'lodash/isEmpty';
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";

class AuthorizedStore {
  @observable AuthorizedDetail: object[];
  @observable companyType: object[];
  @observable productType: object[];
  @observable goalType: object[];
  @observable interestDataList: object[];
  @observable categoryType: object[];
  @observable listConfirm: any;
  @observable exhibitionTimes: object[];
  @observable countryInfo: object[];
  @observable provinceInfo: object[];

  @observable autherizedData: object;

  // 参展检索列表数据
  @observable sCompany: object[];
  @observable sIp: object[];
  @observable sPersonnel: object[];
  // 商贸配对列表数据
  @observable filterResult = {
    companyVOs: [], // 参展的公司
    ipVOs: [], // 参展的IP
    personnelVOs: [], // 参展的人
  };
  @observable beginDateStr: string;
  @observable endDateStr: string;
  @observable isOver: number; // 会议是否结束
  @observable isLoading: boolean = true;
  @observable flag: boolean = true;

  @action
  async getNewsData() {
    let { errorCode, result }: any = await exhibitionList();
    if (errorCode === '200') {
      this.autherizedData = result;
      return result;
    }
  }

  /**
   * 预约门票 企业类别 【type === 1】
   */
  @action
  async getCompanyType() {
    const { errorCode, result }: any = await getCompanyType({ type: 1 });
    if (errorCode === '200') {
      this.companyType = result;
    }
  }

  /**
   * 预约门票 所经营的业务/产品 【type === 2】
   */
  @action
  async getProductType() {
    const { errorCode, result }: any = await getCompanyType({ type: 10 });
    if (errorCode === '200') {
      this.productType = result;
    }
  }

  /**
   * 预约门票 参观展会的目的 【type === 7】
   */
  @action
  async getGoalType() {
    const { errorCode, result }: any = await getCompanyType({ type: 7 });
    if (errorCode === '200') {
      this.goalType = result;
    }
  }

  /**
   * IP类型 -- 感兴趣的授权合作品类
   */
  @action
  getListMainType = async () => {
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      this.interestDataList = result;
    }
  };

  /**
   * 获取预订门票信息 -- 预定门票成功后
   */
  @action
  async getConfirm(params) {
    const { errorCode, result }: any = await getConfirm(params);
    if (errorCode === "200" && result.data) {
      this.listConfirm = result.data;
      this.exhibitionTimes = result.data.exhibitionTimes;
    }
  }

  /**
   * 获取国家号 -- 门票预定
   */
  @action
  async getCountry() {
    const { errorCode, result }: any = await getCountry();
    if (errorCode === '200') {
      this.countryInfo = result;
    }
  }

  /**
   * 获取省份 -- 门票预订
   */
  @action
  async getProvince() {
    const { errorCode, result }: any = await getProvince();
    if (errorCode === '200') {
      this.provinceInfo = result;
    }
  }

  /**
   * 展会检索列表
   */
  @action
  async getMatchSearchList(params) {
    const { errorCode, result: { companyList, companyIpList, companyPersonnelList } }: any = await matchSearchList(params);
    if (errorCode === '200') {
      if (!_isEmpty(companyList)) {
        this.sCompany = companyList;
      }
      if (!_isEmpty(companyIpList)) {
        this.sIp = companyIpList;
      }
      if (!_isEmpty(companyPersonnelList)) {
        this.sPersonnel = companyPersonnelList;
      }
    }
  }

  @action
  setLoadingStatus(param) {
    this.isLoading = param;
  }

  /**
   * 商贸配对分页接口
   */
  @action
  async getMatchListFirst(
    { loginUserGuid, exhibitionGuid, currentPage, pageSize }:
      { loginUserGuid: string, exhibitionGuid: string, currentPage: number, pageSize: number }
  ) {
    this.setLoadingStatus(true);
    const { errorCode, result }: any = await matchMakingListFirst({
      loginUserGuid,
      exhibitionGuid,
      currentPage,
      pageSize,
    });
    if (errorCode === '200') {
      if (!_isEmpty(result)) {
        const { companyVOs, ipVOs, personnelVOs, endDateStr, beginDateStr, isOver } = result;
        if (!_isEmpty(companyVOs)) {
          currentPage === 1 ? this.filterResult.companyVOs = companyVOs : this.filterResult.companyVOs = _uniqWith(this.filterResult.companyVOs.concat(companyVOs), _isEqual);
          this.setLoadingStatus(false);
          if (companyVOs.length < pageSize) {
            this.flag = false;
            // this.setLoadingStatus(false);
          }
        } else {
          this.flag = false;
          this.setLoadingStatus(true);
        }
        if (!_isEmpty(ipVOs)) {
          this.filterResult.ipVOs = ipVOs;
        } else {
          this.filterResult.ipVOs = [];
        }
        if (!_isEmpty(personnelVOs)) {
          this.filterResult.personnelVOs = personnelVOs;
        } else {
          this.filterResult.personnelVOs = [];
        }
        this.endDateStr = endDateStr;
        this.beginDateStr = beginDateStr;
        this.isOver = isOver;
      }
    }
  }

  /**
   * 搜索后的商贸配对数据
   */
  @action
  async getMatchList(
    { loginUserGuid, exhibitionGuid, exhibitionCompanyGuid, ipid, userGuid }:
      { loginUserGuid: string, exhibitionGuid: string, exhibitionCompanyGuid: string, ipid: string, userGuid: string }
  ) {
    const { errorCode, result }: any = await matchMakingList({
      loginUserGuid,
      exhibitionGuid,
      exhibitionCompanyGuid,
      ipid,
      userGuid
    });
    if (errorCode === '200') {
      this.flag = true;
      this.setLoadingStatus(false);
      if (!_isEmpty(result)) {
        const { companyVOs, ipVOs, personnelVOs, endDateStr, beginDateStr, isOver } = result;
        if (!_isEmpty(companyVOs)) {
          this.filterResult.companyVOs = companyVOs;
        } else {
          this.filterResult.companyVOs = [];
        }
        if (!_isEmpty(ipVOs)) {
          this.filterResult.ipVOs = ipVOs;
        } else {
          this.filterResult.ipVOs = [];
        }
        if (!_isEmpty(personnelVOs)) {
          this.filterResult.personnelVOs = personnelVOs;
        } else {
          this.filterResult.personnelVOs = [];
        }
        this.endDateStr = endDateStr;
        this.beginDateStr = beginDateStr;
        this.isOver = isOver;
      }
    }
  }
}

export default new AuthorizedStore();
