import { action, observable } from "mobx";
import {
  getlistIp,
  getScreeningNew,
  getAcquireNew,
  getPortraitNew,
  getbusinessNew,
  getWbWordNew,
  getPraiseNew,
  getContrastBoxOfficeNew, getAreaDataNew,
  getConsumptionToken, ReqBasicPlatformList, ReqContrastPlatform, ReqContrastPlatformList, ReqBasicPlatform
} from "@utils/api";
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

interface IUpdateState {
  listIp: object,
  message: string,
  Acquire: object,

  dataScreening: object,
  wbWordData: object,
  interate: object,
  media: object,
  fans: object,
  business: object,
  landResults: object,
  isMoveData: object,
  dataPraise: object,
  isTvData: object,
  ipProvinceData: any,
  ipAreaData: any,
  Portrait: {
    gender: object,
    age: object,
  },
}

interface IContrastDataState {
  userGuid: string,
  ipTypeSuperiorNumber: number,
  ipids: number,
  moduleNumber: number,
  platformNumber?: number,
  type?: number,
}

class UserStore {
  @observable myUpdateList: object[];
  @observable myReleaseList: object[];

  @observable updateList: IUpdateState = {
    listIp: null,
    message: '',
    dataScreening: null,
    wbWordData: null,
    Acquire: null,
    interate: null,
    media: null,
    business: null,
    fans: null,
    isMoveData: null,
    isTvData: null,
    landResults: null,
    dataPraise: null,
    ipProvinceData: {},
    ipAreaData: {},
    Portrait: {
      gender: null,
      age: null,
    },

  };

  @observable consumptionToken: null;

  @observable userInfo;

  // tabs
  @observable derivativesSalesTabs = []; // 衍生品销售数据   3
  @observable socialPlatformTabs = []; // 社交p平台数据总览  4
  @observable fansTrendTabs = []; // 粉丝趋势               5
  @observable searchBasicTabs = []; // 搜索基础数据          6
  @observable mediaFocusTabs = []; // 媒体关注基础数据        7

  // current
  @observable derivativesSalesCurrent = ''; // 衍生品销售数据
  @observable socialPlatformCurrent = ''; // 社交p平台数据总览
  @observable fansTrendCurrent = ''; // 粉丝趋势
  @observable searchBasicCurrent = ''; // 搜索基础数据
  @observable mediaFocusCurrent = ''; // 媒体关注基础数据
  // name
  // @observable derivativesSalesName = ''; // 衍生品销售数据
  // @observable socialPlatformName = ''; // 社交p平台数据总览
  @observable fansTrendCurrentName = ''; // 粉丝趋势
  @observable searchBasicCurrentName = ''; // 搜索基础数据
  @observable mediaFocusCurrentName = ''; // 媒体关注基础数据
  // data
  @observable dataViewData: any[] = []; // 数据总览           1
  @observable boxOfficeData: any[] = []; // 票房              2
  @observable derivativesSalesData = {}; // 衍生品销售数据   3
  @observable socialPlatformData = []; // 社交p平台数据总览  4
  @observable fansTrendData = {}; // 粉丝趋势               5
  @observable searchBasicData = {}; // 搜索基础数据            6
  @observable mediaFocusData = {}; // 媒体关注基础数据          7

  @observable contrastPlatformDataParams: IContrastDataState = {
    userGuid: '',
    ipTypeSuperiorNumber: 0,
    ipids: 0,
    moduleNumber: 0,
    platformNumber: 0,
    type: 1,
  };

  @action
  tabData(moduleNumber, data) {
    switch (moduleNumber) {
      case 3:
        this.derivativesSalesTabs = data;
        this.derivativesSalesCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeContrastPlatformParams({ platformNumber: this.derivativesSalesCurrent });
        break;
      case 4:
        this.socialPlatformTabs = data;
        this.socialPlatformCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeContrastPlatformParams({ platformNumber: this.socialPlatformCurrent });
        break;
      case 5:
        this.fansTrendTabs = data;
        this.fansTrendCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.fansTrendCurrentName = !_isEmpty(data) ? data[0].name : 0;
        this.changeContrastPlatformParams({ platformNumber: this.fansTrendCurrent });
        break;
      case 6:
        this.searchBasicTabs = data;
        this.searchBasicCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.searchBasicCurrentName = !_isEmpty(data) ? data[0].name : 0;
        this.changeContrastPlatformParams({ platformNumber: this.searchBasicCurrent });
        break;
      case 7:
        this.mediaFocusTabs = data;
        this.mediaFocusCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.mediaFocusCurrentName = !_isEmpty(data) ? data[0].name : 0;
        this.changeContrastPlatformParams({ platformNumber: data[0].platformNumber });
        break;
    }
  }

  @action
  tabContentData(moduleNumber, data) {
    switch (moduleNumber) {
      case 1:
        this.dataViewData = data;
        break;
      case 2:
        this.boxOfficeData = data;
        break;
      case 3:
        this.derivativesSalesData = data;
        break;
      case 4:
        this.socialPlatformData = data;
        break;
      case 5:
        this.fansTrendData = data;
        break;
      case 6:
        this.searchBasicData = data;
        break;
      case 7:
        this.mediaFocusData = data;
        break;

    }
  }

  /**
   *  平台列表Tabs
   */
  @action
  async getContrastPlatformList({ userGuid, ipids, moduleNumber }) {
    const { result: { datas: data, data: tabs } }: any = await ReqContrastPlatformList({
      userGuid,
      consumptionToken: this.consumptionToken,
      ipids,
      moduleNumber
    });
    // console.log('tabs', tabs, tabs.values);
    if (tabs.values) {
      this.tabData(moduleNumber, tabs.values);
    }
  }

  /**
   * 对比数据平台数据
   */
  @action
  async getContrastData(params) {
    this.changeContrastPlatformParams(params);
    await this.getContrastPlatformData();
  }

  @action
  changeContrastPlatformParams(params) {
    this.contrastPlatformDataParams = { ...this.contrastPlatformDataParams, ...params };
  }

  @action
  async getContrastPlatformData() {
    const {
      userGuid,
      ipTypeSuperiorNumber,
      ipids,
      moduleNumber,
      platformNumber,
      type,
    } = this.contrastPlatformDataParams;
    // console.log(platformNumber);
    // if ((moduleNumber !== 1 && platformNumber === 0) || (moduleNumber !== 2 && platformNumber === 0)){
    //   return false;
    // }
    try {
      const { errorCode, result: { datas: data } }: any = await ReqContrastPlatform({
        userGuid,
        consumptionToken: this.consumptionToken,
        ipTypeSuperiorNumber,
        ipids,
        moduleNumber,
        platformNumber,
        type,
      });
      // console.log(data, this.contrastPlatformDataParams);
      if (+errorCode === 500) {
        this.tabContentData(moduleNumber, []);
        return false;
      }
      // 接口返回数据一坨屎
      if (data && data.length < 3 && _isEmpty(data[0].values) && _isEmpty(data[1].values)) {
        this.tabContentData(moduleNumber, [] || {});
        return false;
      }
      if (data && data.length > 2 && _isEmpty(data[0].values) && _isEmpty(data[1].values) && _isEmpty(data[2].values)) {
        this.tabContentData(moduleNumber, [] || {});
        return false;
      }

      let newData = {
        legend: [],
        series: [],
        xAxis: []
      }, arr1 = [], arr2 = [], arr3 = [];
      if (moduleNumber === 2) {
        data && data.forEach((item, index) => {
          newData.legend = [...newData.legend, item['ip_name']];
          if (index === 0) {
            item['values'].forEach(i => {
              arr1 = [...arr1, i.data_number];
            });
          } else if (index === 1) {
            item['values'].forEach(i => {
              arr2 = [...arr2, i.data_number];
            });
          } else {
            item['values'].forEach(i => {
              arr3 = [...arr3, i.data_number];
            });
          }
        });
        newData.xAxis = ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周'];
        newData.series = [...newData.series, arr1, arr2, arr3];
        // console.log(newData);
        this.tabContentData(moduleNumber, newData);
      } else if (moduleNumber === 5 || moduleNumber === 6 || moduleNumber === 7) {
        // console.log('moduleNumber=' + moduleNumber, data);

        data && data.forEach((item, index) => {
          newData.legend = [...newData.legend, item['ip_name']];
          if (index === 0) {
            item['values'].data.forEach(i => {
              arr1 = [...arr1, i.data_number];
              newData.xAxis = [...newData.xAxis, moment(i.data_riiq).format('MM-DD')];
            });
          } else if (index === 1) {
            item['values'].data.forEach(i => {
              arr2 = [...arr2, i.data_number];
            });
          }else{
            item['values'].data.forEach(i => {
              arr3 = [...arr3, i.data_number];
            });
          }
        });
        if (data && data.length === 2) {
          newData.series = [...newData.series, arr1, arr2];
        } else {
          newData.series = [...newData.series, arr1, arr2, arr3];
        }
        // newData.series = [...newData.series, arr1, arr2, arr3];
        this.tabContentData(moduleNumber, newData);

      } else {
        this.tabContentData(moduleNumber, data);
        // console.log('moduleNumber=' + moduleNumber, data);
      }

    } catch (e) {
      // console.log('err');
      // console.log('err,moduleNumber=' + moduleNumber);
      this.tabContentData(moduleNumber, []);
    }
  }

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };

  @action
  clearUpdate() {
    this.updateList = {
      listIp: null,
      message: '',
      dataScreening: null,
      wbWordData: null,
      Acquire: null,
      interate: null,
      media: null,
      business: null,
      fans: null,
      isMoveData: null,
      isTvData: null,
      landResults: null,
      dataPraise: null,
      ipProvinceData: {},
      ipAreaData: {},
      Portrait: {
        gender: null,
        age: null,
      },

    };
  }

  @action
  async getListIp(params) {
    const { ipids } = params;
    const { errorCode, result }: any = await getlistIp({ ipids });
    if (errorCode === "200") {
      this.updateList.listIp = result;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  // 获取互动 搜索指数
  @action
  async getAcquire(params) {
    const { userGuid, typeId, ipids, dayNumber } = params;
    const { errorCode, result }: any = await getAcquireNew({
      userGuid,
      typeId,
      ipids,
      dayNumber,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === "200") {
      if (typeId === 5 || typeId === 6) this.updateList.Acquire = result.data;
      if (typeId === 41 || typeId === 40 || typeId === 9 || typeId === 10) this.updateList.interate = result.data;
      if (typeId === 13 || typeId === 8 || typeId === 84 || typeId === 15) this.updateList.media = result.data;
      if (typeId === 14 || typeId === 33 || typeId === 42) this.updateList.fans = result.data;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * 地区分布（3 省份 ，4 区域）；
   */
  @action
  async getArea(params) {
    const { userGuid, typeId, ipids } = params;
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getAreaDataNew({
      userGuid, ipids, typeId, consumptionToken: this.consumptionToken
    });

    if (errorCode === "200" && ecode > 0) {
      if (typeId === 3 && data) {
        this.updateList.ipProvinceData = data;
      } else if (typeId === 4 && data) {
        this.updateList.ipAreaData = data;

      }
    } else {
      return errorMsg;
    }
  }

  /**
   * 受众画像
   * @param params
   */
  async getPortrait(params) {
    const { userGuid, typeId, ipids } = params;
    const { errorCode, result }: any = await getPortraitNew({
      userGuid,
      typeId,
      ipids,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === "200" && result.errorCode > 0) {
      if (Number(typeId) === 1) this.updateList.Portrait.age = result.data;
      if (Number(typeId) === 2) this.updateList.Portrait.gender = result.data;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  // 获取口碑信息
  async getPraise(params) {
    const { ipids, userGuid } = params;
    const { errorCode, result }: any = await getPraiseNew({ ipids, userGuid, consumptionToken: this.consumptionToken });
    if (errorCode === "200" && result.errorCode === 200) {
      this.updateList.dataPraise = result.data;
    } else if (result.errorCode < 0) {
      this.updateList.message = result.errorMsg;
    }
  }

  // 获取词云
  async getWbWord(params) {
    const { ipids, userGuid } = params;
    const { errorCode, result }: any = await getWbWordNew({ ipids, userGuid, consumptionToken: this.consumptionToken });
    if (errorCode === "200" && result.errorCode === 200) {
      this.updateList.wbWordData = result.data;
    } else if (result.errorCode < 0) {
      this.updateList.message = result.errorMsg;
    }
  }

  /**
   * 数据总览
   * @param params
   */
  async getScreening(params) {
    const { ipids, ipTypeSuperiorNumber, userGuid } = params;
    const { errorCode, result }: any = await getScreeningNew({
      ipids,
      ipTypeSuperiorNumber,
      userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === "200" && result.errorCode === 200) {
      this.updateList.dataScreening = result.data;
    } else if (result.errorCode < 0) {
      this.updateList.message = result.errorMsg;
    }
  }

  // 院线票房对比
  // 平台数据对比
  @action
  async getBoxOffice(params) {
    const { userGuid, ipids, typeId, dayNumber } = params;
    const { errorCode, result }: any = await getContrastBoxOfficeNew({
      userGuid,
      ipids,
      typeId,
      dayNumber,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === "200" && result.errorCode === 200) {
      if (typeId === 57) {
        this.updateList.isMoveData = result.data;
      } else {
        this.updateList.isTvData = result.data;
      }
    } else if (result.errorCode < 0) {
      this.updateList.message = result.errorMsg;
    }
  }

  /**
   * 商业价值
   * @param params
   */
  @action
  async getbusiness(params) {
    const { ipids, ipTypeSuperiorNumber, userGuid } = params;
    const { errorCode, result }: any = await getbusinessNew({
      ipids,
      ipTypeSuperiorNumber,
      userGuid,
      consumptionToken: this.consumptionToken
    });
    if (errorCode === "200" && result.errorCode === 200) {
      this.updateList.business = result.data;
    } else if (result.errorCode < 0) {
      this.updateList.message = result.errorMsg;
    }
  }

  /**
   * 获取消费Token接口
   */
  async getConsumptionToken({ type = '', ipids = '' } = {}) {
    const { result: { data, errorCode, errorMsg } }: any = await getConsumptionToken({
      type,
      ipids,
      userGuid: this.userInfo && this.userInfo.userGuid
    });
    this.consumptionToken = data;
    return { errorCode, errorMsg };
  }

}

export default new UserStore();
