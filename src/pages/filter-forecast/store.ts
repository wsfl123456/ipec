import { action, observable, toJS } from 'mobx';
import { getForecastIp, getHotWords, getTypeList, listMainType, getConsumptionToken, getIsDeduction } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';
import { BaseStore } from '../../stores/base-store';

interface IFilterListParams {
  ipName: string,
  ageMax: number | string,
  ageMin: number | string,
  clientDemandGuid: string,
  currentPage: number,
  fansMax: number | string,
  fansMin: number | string,
  fansSuffix: string,
  ipTypeSuperiorNumber: string,
  labels: string,
  pageSize: number,
  profession: string,
  sex: string,
}

class FilterForecastStore {
  @observable userInfo;

  @observable head_list_top: object = {
    typeSecond_top: [], // 十大类型
    subTypeList_top: {},
  };

  @observable filterListParam: IFilterListParams = {
    ipName: '',
    ageMax: '',
    ageMin: '',
    clientDemandGuid: '',
    currentPage: 1,
    fansMax: '',
    fansMin: '',
    fansSuffix: '',
    ipTypeSuperiorNumber: '',
    labels: '', // 关键词
    pageSize: 12,
    profession: '',
    sex: '',
  };
  @observable selectedType = {}; // 选中的类型
  @observable selected: string = "卡通动漫";

  @observable secondType: Array<object> = []; // 二级

  @observable selectedChild: object = {
    nav: '', // 类别名称
    nav_number: '', // 类别ipTypeNumber,
  };
  @observable selectedAll = '1,9,10'; // 类别全部

  @observable selectedTypes: object = {
    // "": true, // 类型：默认选中全部
  };

  // 热门关键词
  @observable selectedKeyWords: object = {
    // "": true, // 类型：默认选中全部
  };
  @observable labels = '';

  @observable ipidsObj: object = {
    // ip列表数据选中checkbox
  };
  @observable ipidArr = []; // ip列表数据选中checkbox

  @observable secondTypeNumber: Array<object> = [];

  @observable filterData: Array<object> = [];
  @observable clientDemandGuid: string;
  @observable isLoading: boolean = false;
  @observable seeMore: boolean = false;
  @observable noMore: boolean = false;

  @observable hotWords: Array<string> = [];

  @action
  async changeParams(params: IFilterListParams) {
    this.filterListParam = { ...this.filterListParam, ...params };
    console.log(params, this.filterListParam);
    if (params.ipTypeSuperiorNumber) {
      localStorage.setItem("ipType", params.ipTypeSuperiorNumber);
      await this.getHotWordsData();
    }
    this.isLoading = true;
    await this.getIpList();
  }

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo
  };

  // 热门关键词
  @action
  changeHotKeywords(params) {
    this.selectedKeyWords = { ...this.selectedKeyWords, ...params };
    // this.labels = params;
    // console.log(this.selectedKeyWords);
  }

  @action
  clearHotKeywords() {
    this.selectedKeyWords = {};
    this.filterListParam = { ...this.filterListParam, ...{ labels: '' }}
    // this.labels = params;
    // console.log(this.selectedKeyWords);
  }

  // 选中的类别
  @action
  async changeSelectedChild(params) {
    this.selectedChild = { ...this.selectedChild, ...params };
    // console.log(toJS(this.selectedChild))
  }

  /**
   * 一级类型
   */
  @action
  async getMainType() {
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      const subTypeList_top: object = {};
      const typeSecond_top: object[] = []; // 一级类型
      let ipTypeGuidObj: object = [];
      result.forEach((item: any) => {
        const type = item.typeName;
        subTypeList_top[type] = item.childTypeList;
        const typeGuid = item.mainTypeGuid;
        ipTypeGuidObj = { ipTypeNumber: typeGuid, ipType: type };
        typeSecond_top.push(ipTypeGuidObj);
      });
      this.head_list_top = { subTypeList_top, typeSecond_top };
      // console.log(toJS(this.head_list_top));
    }
  }

  /**
   * 二级类型具体数据
   */
  @action
  async getIpType() {
    const { errorCode, result }: any = await getTypeList();
    if (errorCode === '200') {
      let arr = [];
      this.secondType = result;
      result.forEach((item) => {
        if (item.ipType === this.selected) {

        }
      });
      // console.log(result);
    }
  }

  /**
   * 热门关键词
   */
  @action
  async getHotWordsData() {
    const { ipTypeSuperiorNumber } = this.filterListParam;
    const { errorCode, result }: any = await getHotWords({
      ipTypeSuperiorNumber,
    });
    if (errorCode === '200') {
      this.hotWords = result;
    }
  }

  /**
   * 列表
   */
  @action
  async getIpList() {
    const {
      ipName,
      ageMax,
      ageMin,
      clientDemandGuid,
      currentPage,
      fansMax,
      fansMin,
      fansSuffix,
      ipTypeSuperiorNumber,
      labels,
      pageSize,
      profession,
      sex,
    } = this.filterListParam;
    const { errorCode, errorMessage, result: { errorCode: code, errorMsg, data: result }, }: any = await getForecastIp({
      ipName,
      ageMax,
      ageMin,
      clientDemandGuid,
      currentPage,
      fansMax,
      fansMin,
      fansSuffix,
      ipTypeSuperiorNumber,
      labels,
      pageSize,
      profession,
      sex,
    });
    this.isLoading = false;
    if (errorCode === '200' && code === 200) {

      if (!_isEmpty(result.data)) {
        const { data } = result;
        currentPage === 1 ? this.filterData = data : this.filterData = [...this.filterData, ...data];
        if (data.length < pageSize) {
          this.seeMore = false;
          this.noMore = true;
        } else {
          this.seeMore = true;
          this.noMore = false;
        }
      } else {
        if (currentPage < 2) {
          this.filterData = [];
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        this.isLoading = false;
        this.seeMore = false;
      }

    } else if (errorCode === '500') {
      return { show: true, msg: errorMessage };
    }
  }

  // 清空列表
  @action
  async clearIpData() {
    this.filterData = [];
    this.seeMore = false;
    this.isLoading = false;
    this.noMore = false;
    this.selectedTypes = {};
    // this.selectedTypes = {
    //   "": true,
    // };
    this.ipidsObj = {};
    this.filterListParam = {
      ...this.filterListParam,
      ipName: '',
      ageMax: '',
      ageMin: '',
      currentPage: 1,
      fansMax: '',
      fansMin: '',
      fansSuffix: '',
      // ipTypeSuperiorNumber: '',
      labels: '',
      pageSize: 12,
      profession: '',
      sex: ''
    };

    this.ipidArr = [];
    this.selectedKeyWords = {};
  }

  @action
  async clearIpTypeData() {
    this.filterData = [];
    this.seeMore = false;
    this.isLoading = false;
    this.noMore = false;
    this.selectedTypes = {};
    // this.selectedTypes = {
    //   "": true,
    // };
    this.ipidsObj = {};
    this.filterListParam = {
      ...this.filterListParam,
      currentPage: 1,
      pageSize: 12,
      profession: '',
    };
    this.ipidArr = [];

  }

  // 选中IP
  @action
  setIpArr(ipidArr: any[]) {
    this.ipidArr = ipidArr;
  }

  /**
   * 获取消费Token接口
   */
  async getIsDeduction({type = '', ipids = ''} = {}) {
    const { result: { data, errorCode, errorMsg } }: any = await getIsDeduction({type, ipids, userGuid: this.userInfo && this.userInfo.userGuid});
    return { data, errorCode, errorMsg }
  }

}

export default new FilterForecastStore();
