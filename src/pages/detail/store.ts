import { action, observable, toJS } from "mobx";
import {
  getDetail,
  getArtLike,
  getDownload,
  getPortalpost,
  getWordCloubNew,
  getProduction,
  getTotalDataNew,
  getEchartsDataNew,
  getNewsData,
  getFansAreaNew,
  getFollow,
  getBusniessNew,
  getIpPeople,
  getBoxOfficeDataNew,
  getBroadcastTrendNew,
  getPublicPraiseNew,
  getBroadcastPlaformNew,
  getAgeSexAreaNew,
  getTVAndMovieNew,
  getDataPlatform,
  getPlatformData,
  reqStarFansNew,
  reqStarRecentWorksNew,
  getConsumptionToken,
  getIsDeduction,
  ReqBasicPlatformList, ReqBasicPlatform
} from "@utils/api";
import _isEmpty from "lodash/isEmpty";
import _uniqWIth from "lodash/uniqWith";
import _isEquel from "lodash/isEqual";

interface IObj {
  value: string | number;
  name: string | number;
}

interface IEchartStatus {
  userGuid: string,
  dayNumber: number,
  ipid: number,
  typeId: number,
  type: string,
}

// 名人明星-动态粉丝趋势、获赞趋势
interface IFansLikedStatus {
  userGuid: string,
  dataType: number,
  platformType: number | string,
  type: number,
  ipid: number,
  dayNumber: number,
}

interface IBasicDataState {
  userGuid: string,
  ipTypeSuperiorNumber: number,
  ipid: number,
  moduleNumber: number,
  platformNumber?: number,
  type?: number,
  currentPage?: number,
  pageSize?: number,
}

class DetailStore {
  @observable userInfo;

  @observable data: object;
  @observable component: string;
  @observable status: IEchartStatus = {
    userGuid: "",
    dayNumber: 10,
    ipid: 0,
    typeId: 0,
    type: ""
  };
  @observable ipDetailData: object = {};
  @observable ipStarList: object[];

  // 名人明星
  @observable starList: object = {
    repProductionList: [],
    ipProvinceData: [],
    upcomingProductionList: [],
    ipTotalData: [],
    coBrands: "",
    ipName: "",
    ipNewDataAbout: [], // 相关动态
    followStatus: Boolean,
  };

  @observable detailList: object = {
    ipArtLikeData: [],
    ipCaseData: [],
    ipWordCloudData: [],
    ipNewData: [],
    ipSexData: [],
    ipAreaData: [],
    xArea: [],
    yArea: [],
    ipProvinceData: [],
    xProvince: [],
    yProvince: [],
    // ageData: [],
    // agePercent: [],
    xHot: [],
    yHot: [],
    yBlog: [],
    xBlog: [],
    yMedia: [],
    xMedia: [],
    xfan: [],
    yfan: [],
    xfansBlog: [],
    yfansBlog: [],
    followStatus: false,
    ipPeopleList: [],
  };
  @observable ageData: object = {};
  @observable sexData: object = [];
  @observable ipTotalData: object = {};

  @observable starPlatform = []; // 名人明星-数据总览-平台类型集合
  @observable starPlatformData = []; // 名人明星-数据总览-平台类型-数据
  @observable platformType = ''; // 名人明星- 平台ID
  @observable starFansData = []; // 名人明星-粉丝趋势
  @observable starFansType = 1; // 明星-粉丝趋势-增量总量-默认1
  @observable starLikedData = []; // 名人明星-获赞趋势
  @observable starRecentWorksData = {}; // 名人明星- 近期作品展现
  @observable starLikedTab = '';
  @observable starLikedDayNumber = 10;
  @observable starLikedType = 1; // 明星-获赞趋势-增量总量-默认1
  @observable starRecentTab = '';
  @observable starFansLikedParams: IFansLikedStatus = {
    userGuid: '',
    dataType: 2,
    platformType: '',
    type: 1,
    dayNumber: 10,
    ipid: 0,
  };

  @observable businessData = [];
  @observable indicator: object[] = [];

  // @observable boxOfficeData = [];
  @observable boxOfficeDate = [];

  @observable broadcastNO = false;
  @observable broadcastTrendData = {
    '51': [], // 爱奇艺
    '62': [], // 优酷
    '49': [], //  芒果TV
    '46': [], // 腾讯视频
    '65': [], // 搜狐,
    '53': [], // 乐视
  };
  @observable broadcastTrendDate = [];
  // @observable publicPraiseData = [];
  @observable broadcastPlatformData = [];
  @observable broadcastPlatformData2 = [];

  @observable isLoading: boolean = true;
  @observable treeData: object = {};

  @observable baseConsumptionToken: string = '';
  @observable assessConsumptionToken: string = '';

  // tabs
  @observable onlinePlatformTabs = []; // 在线平台趋势 567 =>1
  @observable derivativesSalesTabs = []; // 衍生品销售数据    2
  @observable socialPlatformTabs = []; // 社交p平台数据总览   3
  @observable fansTrendTabs = []; // 粉丝趋势                4
  @observable recentWorksTabs = []; // 近期作品               5
  @observable searchBasicTabs = []; // 搜索基础数据            6
  @observable mediaFocusTabs = []; // 媒体关注基础数据          7
  // current
  @observable onlinePlatformCurrent = ''; // 在线平台趋势 567
  @observable derivativesSalesCurrent = ''; // 衍生品销售数据
  @observable socialPlatformCurrent = ''; // 社交p平台数据总览
  @observable fansTrendCurrent = ''; // 粉丝趋势
  @observable recentWorksCurrent = ''; // 近期作品
  @observable searchBasicCurrent = ''; // 搜索基础数据
  @observable mediaFocusCurrent = ''; // 媒体关注基础数据
  // name
  @observable recentWorksCurrentName = ''; // 近期作品
  @observable searchBasicCurrentName = ''; // 搜索基础数据
  @observable mediaFocusCurrentName = ''; // 媒体关注基础数据
  // data
  @observable onlinePlatformData = []; // 在线平台趋势 567 =>1
  @observable derivativesSalesData = {}; // 衍生品销售数据    2
  @observable socialPlatformData = []; // 社交p平台数据总览   3
  @observable fansTrendData = []; // 粉丝趋势                4
  @observable recentWorksData = []; // 近期作品               5
  @observable searchBasicData = []; // 搜索基础数据            6
  @observable mediaFocusData = []; // 媒体关注基础数据          7
  @observable dataViewData: any[] = []; // 数据总览            8
  @observable publicPraiseData = [];             // 口碑                  9
  @observable boxOfficeData: any[] = []; // 票房                10

  // timeSelect 票房下拉时间
  @observable boxOfficeSelect: any[] = [];
  @observable boxOfficeNumber = 0;

  @observable basicPlatformDataParams: IBasicDataState = {
    userGuid: '',
    ipTypeSuperiorNumber: 0,
    ipid: 0,
    moduleNumber: 0,
    platformNumber: 0,
    type: 1,
    currentPage: 1,
    pageSize: 7,
  };

  formatNum(strNum) {
    if (strNum.length <= 3) {
      return strNum;
    }
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
      return strNum;
    }
    let a = RegExp.$1,
      b = RegExp.$2,
      c = RegExp.$3;
    // @ts-ignore
    let re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
      b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c;
  }

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };

  @action
  changeDetailList(params) {
    this.detailList = { ...this.detailList, params };
  }

  tabData(moduleNumber, data) {
    switch (moduleNumber) {
      case 1:
        this.onlinePlatformTabs = data;
        this.onlinePlatformCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeBasicPlatformParams({ platformNumber: this.onlinePlatformCurrent });
        break;
      case 2:
        this.derivativesSalesTabs = data;
        this.derivativesSalesCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeBasicPlatformParams({ platformNumber: this.derivativesSalesCurrent });
        break;
      case 3:
        this.socialPlatformTabs = data;
        this.socialPlatformCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeBasicPlatformParams({ platformNumber: this.socialPlatformCurrent });
        break;
      case 4:
        this.fansTrendTabs = data;
        this.fansTrendCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.changeBasicPlatformParams({ platformNumber: this.fansTrendCurrent });
        break;
      case 5:
        this.recentWorksTabs = data;
        this.recentWorksCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.recentWorksCurrentName = !_isEmpty(data) ? data[0].name: 0;
        this.changeBasicPlatformParams({ platformNumber: this.recentWorksCurrent });
        break;
      case 6:
        this.searchBasicTabs = data;
        this.searchBasicCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.searchBasicCurrentName = !_isEmpty(data) ? data[0].name: 0;
        this.changeBasicPlatformParams({ platformNumber: this.searchBasicCurrent });
        break;
      case 7:
        this.mediaFocusTabs = data;
        this.mediaFocusCurrent = !_isEmpty(data) ? data[0].platformNumber : 0;
        this.mediaFocusCurrentName = !_isEmpty(data) ? data[0].name: 0;
        this.changeBasicPlatformParams({ platformNumber: this.mediaFocusCurrent });
        break;
    }
  }

  tabContentData(moduleNumber, data, obj) {
    switch (moduleNumber) {
      case 1:
        this.onlinePlatformData = data;
        break;
      case 2:
        this.derivativesSalesData = obj;
        break;
      case 3:
        this.socialPlatformData = data;
        break;
      case 4:
        this.fansTrendData = data;
        break;
      case 5:
        this.recentWorksData = data;
        break;
      case 6:
        this.searchBasicData = data;
        break;
      case 7:
        this.mediaFocusData = data;
        break;
      case 8:
        this.dataViewData = obj;
        console.log('data2', obj);
        break;
      case 9:
        this.publicPraiseData = data;
        break;
      case 10:
        this.boxOfficeData = data;
        // console.log(data, 'boxOfficeData');
        break;
    }
  }

  /**
   *  平台列表Tabs
   */
  @action
  async getBasicPlatformList({ userGuid, ipid, moduleNumber }) {
    try {
      const { result: { datas: data, data: time } }: any = await ReqBasicPlatformList({
        userGuid,
        consumptionToken: this.baseConsumptionToken,
        ipid,
        moduleNumber
      });
      if (moduleNumber === 8) {
        // 院线票房趋势 时间下拉列表
        this.boxOfficeSelect = time.data;
      } else {
        if (data) {
          // this.basicPlatformListObj[moduleNumber] = data;
          // this.basicPlatformCurrentObj[moduleNumber] = Number(data[0].platformNumber);
          this.tabData(moduleNumber, data);
        }
      }
    }catch (e) {
       console.log(e);
    }
  }

  /**
   * 基础数据平台数据
   */
  @action
  async getBasicData(params) {
    this.changeBasicPlatformParams(params);
    await this.getBasicPlatformData();
  }

  @action
  changeBasicPlatformParams(params) {
    this.basicPlatformDataParams = { ...this.basicPlatformDataParams, ...params };
  }

  @action
  async getBasicPlatformData() {
    const {
      userGuid,
      ipTypeSuperiorNumber,
      ipid,
      moduleNumber,
      platformNumber,
      type,
      currentPage,
      pageSize
    } = this.basicPlatformDataParams;
    if (platformNumber === 0) {
      return false;
    }
    try {
      // console.log(platformNumber);
      const { errorCode, result: { datas: data, data: obj, mapDate } }: any = await ReqBasicPlatform({
        userGuid,
        consumptionToken: this.baseConsumptionToken,
        ipTypeSuperiorNumber,
        ipid,
        moduleNumber,
        platformNumber,
        type,
        currentPage,
        pageSize,
      });
      if (+errorCode === 500) {
        this.tabContentData(moduleNumber, [], '');
        return false;
      }
      if (moduleNumber === 2 || moduleNumber === 8) {
        if (!_isEmpty(obj)) {
          console.log('dataView', obj);
          this.tabContentData(moduleNumber, '', obj);
        }
      }
      if (!_isEmpty(obj) && moduleNumber !== 2 && moduleNumber !== 8) {
        if (!_isEmpty(obj.data)) {
          this.tabContentData(moduleNumber, obj.data, '');
        } else {
          this.tabContentData(moduleNumber, [], '');
        }
      }

      if (!_isEmpty(data)) {
        this.tabContentData(moduleNumber, data, '');
        console.log(10, moduleNumber, data);
        this.boxOfficeNumber = !_isEmpty(mapDate) ? mapDate.value : 0;
        console.log(mapDate);
      }
    }catch (e) {
     console.log(e);
    }
  }

  /**
   * 详情页-IP相关介绍
   */
  @action
  async ipDetail(params) {
    const { userGuid, ipTypeSuperiorNumber, ipid }: { userGuid?: string, ipTypeSuperiorNumber: string, ipid: string } = params;
    const { errorCode, result: { data, errorCode: code } }: any = await getDetail({
      userGuid,
      ipTypeSuperiorNumber,
      ipid
    });
    if (code === 200 && data !== null) {
      this.ipDetailData = data;
      let followStatus = data.isFollowed;
      this.detailList = { ...this.detailList, followStatus };
      // this.detailList['followStatus'] = data.isFollowed;
      this.starList['ipName'] = data.ipName;
      if (Number(ipTypeSuperiorNumber) === 8) {
        this.starList['coBrands'] = data.cooperativeBrand;
      }
    } else if (code === -1) {
      return false;
    }
  }

  @action
  async echartChangeStatus(params: IEchartStatus) {
    await this.echartsSetStatus(params);
    await this.getEcharts();
  }

  @action
  async echartsSetStatus(params: IEchartStatus) {
    this.status = { ...this.status, ...params };
  }

  /**
   * 详情页--搜索基础数据，互动基础数据，媒体关注基础数据，粉丝趋势;
   */
  async getEcharts() {
    const { userGuid, dayNumber, ipid, typeId, type } = this.status;
    const { errorCode, result }: any = await getEchartsDataNew({
      userGuid: this.userInfo.userGuid, dayNumber, ipid, typeId, consumptionToken: this.baseConsumptionToken
    });
    let xHot: string[] = [];
    let yHot: string[] = [];
    let xBlog: string[] = [];
    let yBlog: string[] = [];
    let yMedia: string[] = [];
    let xMedia: string[] = [];
    let xfan: string[] = [];
    let yfan: string[] = [];
    if (errorCode === "200" && result.errorCode === 200 && result.data.length > 0) {
      result.data.forEach((item) => {
        if (type === "hot") {
          yHot.push(item.dataNumber);
          xHot.push(item.dataRiiq);
          this.detailList['xHot'] = xHot;
          this.detailList['yHot'] = yHot;
        } else if (type === "blog") {
          yBlog.push(item.dataNumber);
          xBlog.push(item.dataRiiq);
          this.detailList['xBlog'] = xBlog;
          this.detailList['yBlog'] = yBlog;
        } else if (type === "media") {
          yMedia.push(item.dataNumber);
          xMedia.push(item.dataRiiq);
          this.detailList['xMedia'] = xMedia;
          this.detailList['yMedia'] = yMedia;
        } else if (type === "fans" || type === "fans2") {
          yfan = [...yfan, item.dataNumber];
          xfan = [...xfan, item.dataRiiq];
          this.detailList['xfan'] = xfan;
          this.detailList['yfan'] = yfan;
        }
      });
    } else if (_isEmpty(result.data)) {
      if (type === "hot") {
        this.detailList['xHot'] = [];
        this.detailList['yHot'] = [];
      } else if (type === "blog") {
        this.detailList['xBlog'] = [];
        this.detailList['yBlog'] = [];
      } else if (type === "media") {
        this.detailList['xMedia'] = [];
        this.detailList['yMedia'] = [];
      } else if (type === "fans" || type === "fans2") {
        this.detailList['xfan'] = [];
        this.detailList['yfan'] = [];
      }
    }
  }

  /**
   * 详情页-基础信息-电影-院线票房趋势;
   */
  @action
  async getBoxOffice(params) {
    const { dayNumber, ipid }: { dayNumber: number, ipid: number } = params;
    const { errorCode, result: data }: any = await getBoxOfficeDataNew({
      dayNumber, ipid, consumptionToken: this.baseConsumptionToken, userGuid: this.userInfo.userGuid
    });

    this.boxOfficeData = [];
    this.boxOfficeDate = [];
    if (errorCode === '200' && !_isEmpty(data) && data.length > 0) {
      data.forEach((item: any) => {
        this.boxOfficeData = [...this.boxOfficeData, item.dataNumber];
        this.boxOfficeDate = _uniqWIth([...this.boxOfficeDate, item.dataRiiq], _isEquel);
      });
    } else if (_isEmpty(data)) {
      this.boxOfficeData = [];
    }

    // console.log(this.boxOfficeData, this.boxOfficeDate)
  }

  /**
   * 电视剧/综艺播放趋势、电影在线平台趋势
   * @param params
   */
  @action
  async getBroadcastTrend(params) {
    const { type, dayNumber, ipid }: { type: number, dayNumber: number, ipid: number } = params;
    const { errorCode, result: data }: any = await getBroadcastTrendNew({
      type, dayNumber, ipid, consumptionToken: this.baseConsumptionToken, userGuid: this.userInfo.userGuid
    });
    if (errorCode === '200' && data.length > 0) {
      data.forEach((i: any) => {
        if (i.list !== null && _isEmpty(this.broadcastTrendData) === false) {
          this.broadcastNO = false;
          this.broadcastTrendDate = i.dataRiiqs;
          i.list.forEach((item: any) => {
            this.broadcastTrendData[i.typeId] = [...this.broadcastTrendData[i.typeId], item.dataNumber];
            // this.broadcastTrendDate = this.unique([...this.broadcastTrendDate, item.dataRiiq]);
          });
        }
      });
    } else {
      this.broadcastNO = true;
      this.broadcastTrendDate = [];
    }
  }

  /**
   * 口碑信息 getPublicPraise
   */
  async getPublicPraise({ ipid }: { ipid: number }) {
    const { errorCode, result: { data } }: any = await getPublicPraiseNew({
      ipid,
      consumptionToken: this.baseConsumptionToken,
      userGuid: this.userInfo.userGuid
    });
    if (errorCode === '200') {
      this.publicPraiseData = data;
    }
  }

  /**
   * 基详情页-础信息-播放平台分布
   */
  async getBroadcastPlatform({ ipid }: { ipid: number }) {
    const { errorCode, result: { data } }: any = await getBroadcastPlaformNew({
      ipid,
      consumptionToken: this.baseConsumptionToken,
      userGuid: this.userInfo.userGuid
    });
    if (errorCode === '200') {
      this.broadcastPlatformData2 = data;
      this.broadcastPlatformData = [];
      data.forEach((it) => {
        let obj: IObj = {
          name: it.typeName,
          value: it.dataNumber,
        };
        this.broadcastPlatformData = [...this.broadcastPlatformData, obj];
      });
    }
  }

  /**
   * 文创猜你喜欢
   */
  @action
  async ipArtLike(params) {
    const { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: string, ipid: string } = params;
    const { errorCode, result }: any = await getArtLike({
      ipTypeSuperiorNumber,
      ipid
    });
    if (errorCode === "200") {
      this.detailList['ipArtLikeData'] = result;
    }
  }

  /**
   *  影人相关播放量
   */
  @action
  async getIpPeople(params) {
    const { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: string, ipid: number } = params;
    const { errorCode, result }: any = await getIpPeople({
      ipTypeSuperiorNumber, ipid
    });
    if (errorCode === "200") {
      this.detailList['ipPeopleList'] = result;
    }
  }

  /**
   * 下载
   */
  @action
  async getDownload({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getDownload(ipid);
    errorCode === "200" && result;
  }

  /**
   * 查询相关案列
   */
  @action
  async getRelatedCase({ ipid, ipTypeSuperiorNumber }: { ipid: number, ipTypeSuperiorNumber: number }) {
    const { errorCode, result }: any = await getPortalpost({
      ipid, ipTypeSuperiorNumber
    });
    if (errorCode === "200") {
      this.detailList['ipCaseData'] = result;
    }
  }

  @action
  setLoading(flag: boolean) {
    this.isLoading = flag;
  }

  /**
   * 关键词云
   */
  @action
  async getWordData({ userGuid, ipid, wordType }: { userGuid: string, ipid: number, wordType }) {
    this.setLoading(true);
    const { errorCode, result: { data, errorCode: ecode } }: any = await getWordCloubNew({
      userGuid,
      ipid,
      wordType,
      consumptionToken: this.assessConsumptionToken
    });
    let wordCloudData: object[] = [];
    if (errorCode === "200" && ecode === 200) {
      data.forEach((it) => {
        let obj: IObj = {
          name: it.wordName,
          // value: this.randomData(),
          value: it.wordValue,
        };
        wordCloudData.push(obj);
      });
      this.detailList['ipWordCloudData'] = wordCloudData;
      this.setLoading(false);
    }
  }

  /**
   * 代表作
   */
  @action
  async getProdctionData(params) {
    const { isUpcoming, ipid, ipName, currentPage, pageSize }: { isUpcoming: number, ipid: number, ipName: string, currentPage?: number, pageSize?: number } = params;
    const { errorCode, result }: any = await getProduction({
      isUpcoming,
      ipid,
      ipName,
      currentPage,
      pageSize,
    });
    if (errorCode === "200") {
      if (isUpcoming === 1) {
        this.starList['upcomingProductionList'] = result;
      } else {
        this.starList['repProductionList'] = result;
      }
    } else {
      this.starList['repProductionList'] = [];
      this.starList['upcomingProductionList'] = [];
    }
  }

  /**
   * 数据总览
   */
  @action
  async getDetailTotal(params) {
    const { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: number, ipid: number } = params;
    const { errorCode, result: { data } }: any = await getTotalDataNew({
      ipTypeSuperiorNumber,
      ipid,
      consumptionToken: this.baseConsumptionToken,
      userGuid: this.userInfo.userGuid
    });
    if (errorCode === "200") {
      this.ipTotalData = data;
    }
  }

  // 设置默认平台类型,默认Id
  @action
  setPlatformType(param) {
    this.platformType = param;
  }

  /**
   * 数据总览-名人明星-平台类型
   */
  @action
  async getStarPlatform(ipid) {
    const { errorCode, result }: any = await getDataPlatform({
      ipid,
    });
    if (errorCode === "200" && !_isEmpty(result)) {
      this.starPlatform = result;
      this.setPlatformType(result[0].platformType);
    }
  }

  /**
   * 数据总览-名人明星-平台类型-数据
   */
  @action
  async getStarPlatformData(params) {
    const { errorCode, result }: any = await getPlatformData(
      params
    );
    if (errorCode === "200" && !_isEmpty(result)) {
      this.starPlatformData = result;
    }
  }

  /**
   * 基础数据-名人明星-粉丝趋势、获赞趋势
   */
  async changeFansLikedParams(params) {
    this.starFansLikedParams = { ...this.starFansLikedParams, ...params };
    await this.getStarFansData();
  }

  async getStarFansData() {
    const { userGuid, dataType, platformType, type, dayNumber, ipid } = this.starFansLikedParams;
    const { errorCode, result: { data } }: any = await reqStarFansNew({
      userGuid, dataType, platformType, type, dayNumber, ipid, consumptionToken: this.baseConsumptionToken
    });
    if (errorCode === "200" && !_isEmpty(data)) {
      if (dataType === 1) {

        this.starFansData = data;
      } else {

        this.starLikedData = data;
      }
    }
  }

  /**
   * 基础数据-名人明星- 近期作品展现
   */

  async getStarRecentWorks(params) {
    const { errorCode, result: { data } }: any = await reqStarRecentWorksNew({ ...params, ...{ consumptionToken: this.baseConsumptionToken } });
    if (errorCode === "200" && !_isEmpty(data)) {
      this.starRecentWorksData = data;
    }
  }

  /**
   * 详情页-评估数据--受众画像（1 年龄,2 性别），地区分布（3 省份 ，4 区域）；
   */
  async getFansAreaData(params) {
    const { userGuid, ipid, typeId }: { userGuid: string, ipid: number, typeId: number } = params;
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getFansAreaNew({
      userGuid, ipid, typeId, consumptionToken: this.assessConsumptionToken
    });
    let ipSexData: object[] = [];
    let ipProvinceData: object[] = [];
    let ipAreaData: object[] = [];
    let xProvince: string[] = [];
    let yProvince: string[] = [];
    let ageData: string[] = [];
    let agePercent: string[] = [];
    let xArea: string[] = [];
    let yArea: string[] = [];

    if (errorCode === "200" && ecode > 0) {
      // 1年龄，2性别，3地区，4区域
      /*  if (typeId === 1 && data) {
          data.forEach((it) => {
            ageData.push(it.dataNumber);
            agePercent.push(it.dataType);
          });
          this.detailList['ageData'] = ageData.reverse();
          this.detailList['agePercent'] = agePercent.reverse();
        } else if (typeId === 2 && data) {
          data.forEach((it) => {
            let obj: IObj = {
              value: it.dataNumber,
              name: it.dataType,
            };
            ipSexData.push(obj);
          });
          this.detailList['ipSexData'] = ipSexData;
        }*/
      if (typeId === 3 && data) {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType.replace(/\省|\市/g, ''),
          };
          xProvince.push(it.dataNumber);
          yProvince.push(it.dataType);
          if (yProvince.length > 10) {
            yProvince = yProvince.slice(0, 10);
          }
          if (xProvince.length > 10) {
            xProvince = xProvince.slice(0, 10);
          }
          ipProvinceData.push(obj);
        });
        this.detailList['ipProvinceData'] = ipProvinceData;
        this.detailList['xProvince'] = xProvince.reverse();
        this.detailList['yProvince'] = yProvince.reverse();
      } else {
        data.forEach((it) => {
          let obj: IObj = {
            value: it.dataNumber,
            name: it.dataType,
          };
          xArea.push(it.dataNumber);
          yArea.push(it.dataType);
          ipProvinceData.push(obj);

        });
        this.detailList['ipAreaData'] = ipAreaData;
        this.detailList['xArea'] = xArea.reverse();
        this.detailList['yArea'] = yArea.reverse();
      }
    } else {
      return errorMsg;
    }
  }

  /**
   * 详情页-评估数据--受众画像（1 年龄,2 性别）
   */
  async getAgeSexData(params) {
    const { userGuid, ipid, typeId }: { userGuid: string, ipid: number, typeId: number } = params;
    const { errorCode, result: { errorMsg, data, errorCode: ecode } }: any = await getAgeSexAreaNew({
      userGuid, ipid, typeId, consumptionToken: this.assessConsumptionToken
    });

    if (errorCode === "200" && ecode > 0) {
      if (typeId === 1 && data) {
        this.ageData = data;
        // console.log( data);
      }
      if (typeId === 2 && data) {
        this.sexData = data;
        // console.log( data);
      }
    }
  }

  /**
   * 详情页-评估数据- 商业价值评估模型
   */
  async getBusinessData(params, type) {
    const { userGuid, ipid, ipTypeSuperiorNumber }: { userGuid: string, ipid: number, ipTypeSuperiorNumber: number } = params;
    const { errorCode, result: { data, errorCode: ecode, errorMsg } }: any = await getBusniessNew({
      userGuid, ipid, ipTypeSuperiorNumber, consumptionToken: this.assessConsumptionToken
    });

    if (errorCode === "200" && ecode > 0) {
      if (type === 'people') {

        this.businessData = [
          ...this.businessData,
          data.arithmaticHotspotPrice,
          // data.mediaAnalysis,
          data.reputationNumber,
          data.precisionNumber,
          // data.endorsementNumber,
          // data.potential,
        ];
        this.indicator = [
          { name: '大众热议指数', max: data.arithmaticHotspotPrice + 100 },
          // { name: '媒体关注度', max: data.mediaAnalysis + 100 },
          { name: '口碑指数', max: data.reputationNumber + 100 },
          { name: '专业指数', max: data.precisionNumber + 100 },
          // { name: '代言指数', max: data.endorsementNumber + 100 },
          // { name: '潜力预估值', max: data.potential + 100 },
        ];

      } else {
        this.businessData = [
          ...this.businessData,
          data.arithmaticHotspotPrice,
          data.mediaAnalysis,
          data.potential,
        ];
        this.indicator = [
          { name: '大众热议指数', max: data.arithmaticHotspotPrice + 100 },
          { name: '媒体关注度', max: data.mediaAnalysis + 100 },
          { name: '潜力预估值', max: data.potential + 100 },
        ];

      }

    } else {
      return { errorMsg };
    }
  }

  /**
   * 关注ip
   */
  async getFollowStatus(params) {
    const { userGuid, isFollow, type, guid }: { userGuid: string, isFollow: number, type: number, guid: string } = params;
    const { errorCode, result = {} }: any = await getFollow({
      userGuid, isFollow, type, guid,
    });
    if (errorCode === "200" && result.errorCode === 200) {
      return true;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  /**
   * 新闻舆情 默认4个(相关动态 默认2个)
   */
  async getNewAbout(params) {
    const { ipid, typeId, currentPage, pageSize }: { ipid: number, typeId: number, currentPage?: number, pageSize?: number } = params;
    const { errorCode, result }: any = await getNewsData({
      ipid, typeId, currentPage, pageSize
    });
    if (errorCode === "200") {
      if (pageSize === 4) {

        this.detailList['ipNewData'] = result;
      } else {
        this.starList['ipNewDataAbout'] = result;
      }
    }
  }

  /**
   * 评估数据-电视剧预测评分/电影预测票房
   */
  async getScoreAndBoxOffice(params) {
    const { errorCode, result: { data } }: any = await getTVAndMovieNew({ ...params, ...{ consumptionToken: this.assessConsumptionToken } });
    if (errorCode === '200' && !_isEmpty(data)) {
      this.treeData = data;
    }
  }

  /**
   * 获取消费Token接口
   */
  async getConsumptionToken({ type = '', ipids = '' } = {}) {
    const { result: { data, errorCode, errorMsg } }: any = await getConsumptionToken({
      type,
      ipids,
      userGuid: this.userInfo.userGuid
    });
    if (+type === 1) {
      this.baseConsumptionToken = data;
    } else {
      this.assessConsumptionToken = data;
    }
    return { errorCode, errorMsg };
  }

  /**
   * 获取消费Token接口
   */
  async getIsDeduction({ type = '', ipids = '' } = {}) {
    const { result: { data, errorCode, errorMsg } }: any = await getIsDeduction({
      type,
      ipids,
      userGuid: this.userInfo && this.userInfo.userGuid,
    });
    return { data, errorCode, errorMsg };
  }

}

export default new DetailStore();
