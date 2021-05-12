import { action, observable } from "mobx";
import { reqIpTypeList, reqIpList, reqIpTypeListTab, listMainType, listCountry } from "@utils/api";
import _isEmpty from "lodash/isEmpty";

class IpListStore {
  @observable head_list: object = {
    subTypeList: {},
    typeSecond: [],
  };
  @observable head_list_top: object = {
    subTypeList_top: {},
    typeSecond_top: [],
  };
  // 新增的导航属性 用来记录选中的状态 类别 国别
  @observable selectedchild: object = {
    nav: '',  // ..标记当前选中哪个类别
    show: false, // 记录类别是否显示
    nav_number: '', // 标记当前选中的是哪个类别的ipNunmber 传递给接口
    case_: '', // 记录当前选中的是哪个（公共的状态）
    slectTime: 'all', // 记录选中的时间
    country: '', // 记录选中的国家
    form: '', // 形式(影视综）
  };
  @observable ipItemList: string[];
  @observable listCountry: string[];

  @observable selectSubList: object = {
    theAllId: "", // 记录子类别 是不是选择的全部
    selectedObj: {  // 子类 判断有没有子类 如果在这个对象里有的话 就显示
      "地区": "",
      "类型": {},
      "时间": "",
      "状态": "",
      "形式": "",
      "性别": "",
    }
  };
  @observable ipTypeListData: string[];
  @observable typeResult: string[];
  @observable page: object = {
    numbers: [],
    lastPage: 0,
    totalCount: 0,
    currentPage: 0,
  };

  @observable customStatus: IStatus = {
    selected: "",
    ipTypeSuperiorNumbers: "",
    ipIsAuthenticated: null,
    ipLocation: "",
    ipTypeNumber: "",
    countryType: "",
    ipFormNumber: "",
    benginShowDate: "",
    endShowDate: "",
    ipStatus: "",
    ipSex: "",
    currentPage: 1,
    pageSize: 24,
  };

  // 截流分页加载的变量
  @observable isloading: boolean = false;
  @observable backRoute: boolean = false;
  @observable isInRoute: boolean = false;

  @observable isNoResult: boolean = false;
  @observable openLoading: boolean = false; // 下拉查看更多

  @action
  async changeStatus(params: IStatus) {
    await this.setStatus(params);
    await this.ipTypeListTab();
  }

  // 控制路由切换时  是否刷新页面
  @action
  setbackRout() {
    this.backRoute = true;
  }

  @action
  async setInRout() {
    this.isInRoute = true;
    this.backRoute = false;
  }

  @action
  async clearIpTypeListData() {
    this.ipTypeListData = [];
    this.page = {
      ...{
        lastPage: 0,
        totalCount: 0,
        currentPage: 0,
      }
    };
  }

  /**
   * 记录子类切换
   *
   */
  @action
  async setSelectSub(param: object) {
    this.selectSubList = { ...this.selectSubList, ...param };
  }

  /**
   * 其他页面切换子类的方法
   * @param sub {
   *  selectedObj:{
   *   "类型":{
   *    "": false
   *    6s4f4293-6a96-4264-aacf-6e5afe1a91b3: true
   *    6s4f4294-6a96-4264-aacf-6e5afe1a91b4: true
   *    6s4f4295-6a96-4264-aacf-6e5afe1a91b5: true}
   *  }
   * }
   * theAllId:''
   * @param params {currentPage: 1,undefined: ",25"}
   */
  @action
  async otherPageSubType(sub, params) {
    // 切换大类
    await this.setSelectSub(sub);
    await this.changeStatus(params);
  }

  /**
   *  IP类型 切换时调用
   * ipType   当前所属哪个大类的中文名字
   * subitem为 需要切换到指定二级类型的参数 {ipTypeSuperiorNumber:？,ipType:？}  ipType//二级分类中文名字
   */

  @action
  async ipTypeNav(ipType, subitem) {
    await this.getlistMainType();
    await this.setloadingType(true);
    const subTypeList_top = this.head_list_top['subTypeList_top'];
    let _ipTypeSuperiorNumbers = '',
      _ipType = '';
    if (subitem) {
      _ipTypeSuperiorNumbers = subitem.ipTypeSuperiorNumber + ',';
      _ipType = subitem.ipType;
      // this.setselected({ case_: 1 ,nav: '哪个类别', show: ''}) //case_是否被认证 1未认证 3 已认证  nav:哪个类别 show: ''
    } else {
      subTypeList_top && subTypeList_top[ipType] && subTypeList_top[ipType].map((item: any, index) => {
        _ipTypeSuperiorNumbers += `${item.ipTypeNumber},`; // ?
        index <= 1 ? _ipType = item.ipType : _ipType = '';
      });
    }
    await this.clearIpTypeListData();
    await this.changeStatus({
      currentPage: 1,
      selected: ipType,
      ipTypeSuperiorNumbers: _ipTypeSuperiorNumbers,
    });
    this.otherViewSetselected({ nav: _ipType, show: _ipType, nav_number: _ipTypeSuperiorNumbers });
  }

  // 判断当前大类下边多少子类 如果只有一个子类，不显示类别，
  @action
  getSubType(subTypeList_top) {
    let Type = this.customStatus.selected;
    let _ipType = '';
    subTypeList_top && subTypeList_top[Type] && subTypeList_top[Type].map((item: any, index) => {
      index <= 1 ? _ipType = Type : _ipType = '';
    });
    return _ipType;
  }

  @action
  async setSelectedchild(params: object) {
    this.selectedchild = { ...this.selectedchild, ...params };
  }

  // 其他页面选择哪个类别（2级类型）

  @action
  async otherViewSetselected(item) {
    if (item.show !== true) {
      item.show = item.show === '';
    }
    await this.setSelectedchild(item);
  }

  // 本页面选择哪个类别（2级类型） 更新正在加载的状态

  @action
  async setselected(item) {
    this.customStatus.currentPage = 1;
    this.setloadingType(true);
    if (item.show !== true) {
      item.show = item.show === '';
    }
    await this.setSelectedchild(item);
  }

  @action
  async setStatus(params: IStatus) {
    // 清空数据
    this.customStatus = { ...this.customStatus, ...params };
  }

  @action
  async getCountryList() {
    const { errorCode, result }: any = await listCountry();
    if (errorCode === "200") {
      this.listCountry = result;
    }
  }

  @action
  async getlistMainType() {
    await this.getCountryList();
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      const subTypeList_top: object = {};
      const typeSecond_top: object[] = [];
      let ipTypeGuidObj: object = [];
      result.forEach((item: any) => {
        const type = item.typeName;
        subTypeList_top[type] = item.childTypeList;
        const typeGuid = item.mainTypeGuid;
        ipTypeGuidObj = { ipTypeNumber: typeGuid, ipType: type };
        typeSecond_top.push(ipTypeGuidObj);
      });
      this.head_list_top = { subTypeList_top, typeSecond_top };
    }
  }

  @action
  async ipTypeList() {
    const { errorCode, result }: any = await reqIpTypeList();
    if (errorCode === "200") {
      const subTypeList: object = {};
      const typeSecond: object[] = [];
      let ipTypeGuidObj: object = [];
      result.forEach((item: any) => {
        const type = item.ipType;
        subTypeList[type] = item.sublist;
        const typeGuid = item.ipTypeNumber;
        ipTypeGuidObj = { ipTypeNumber: typeGuid, ipType: type };
        typeSecond.push(ipTypeGuidObj);
      });
      this.head_list = { subTypeList, typeSecond };

    }
  }

  @action
  async ipList() {
    const { errorCode, result }: any = await reqIpList();
    errorCode === "200" && (this.ipItemList = result);
  }

  @action
  async ipTypeListTab() {
    const {
      ipTypeSuperiorNumbers, ipLocation, ipTypeNumber, countryType,
      ipFormNumber, benginShowDate, endShowDate, ipIsAuthenticated,
      ipStatus, ipSex, currentPage, pageSize,
    } = this.customStatus;
    let { errorCode, result }: any = await reqIpTypeListTab({
      ipTypeSuperiorNumbers, ipLocation, ipTypeNumber, ipIsAuthenticated, countryType,
      ipFormNumber, benginShowDate, endShowDate,
      ipStatus, ipSex, currentPage, pageSize,
    });
    await this.setloadingType(false);
    if (errorCode === "200" && !_isEmpty(result)) {
      const { ipQueryInfoVOs, totalCount } = result;
      await this.pages(totalCount);

      if (_isEmpty(ipQueryInfoVOs)) {
        this.isNoResult = true;
        this.openLoading = false;
        await this.setloadingType(false);
      } else if (!_isEmpty(ipQueryInfoVOs) && ipQueryInfoVOs.length < 24) {
        this.isNoResult = true;
        this.openLoading = false;
        await this.setloadingType(false);
      } else {
        this.isNoResult = false;
        this.openLoading = true;
      }

      if (currentPage === 1) {
        this.ipTypeListData = ipQueryInfoVOs;
        return false;
      }
      this.ipTypeListData = [...this.ipTypeListData, ...ipQueryInfoVOs];

    }
  }

  // 截流分页加载
  async setloadingType(bole) {
    this.isloading = bole;
  }

  @action
  async pages(totalCount) {
    const { currentPage, pageSize } = this.customStatus;
    if (Number(totalCount) > 20) {
      const end = (totalCount % pageSize) > 0 ? 1 : 0;
      const lastPage = parseInt((totalCount / pageSize) + "") + end;
      let numbers = [];
      if (lastPage > 13) {
        let tmp = ["1", "2", "..."];
        if (currentPage > 6 && currentPage < lastPage - 6) {
          const last = ["...", `${lastPage - 1}`, `${lastPage}`];
          const new_arr: string[] = [
            `${currentPage - 3}`,
            `${currentPage - 2}`,
            `${currentPage - 1}`,
            "" + currentPage,
            `${currentPage + 1}`,
            `${currentPage + 2}`,
            `${currentPage + 3}`
          ];
          numbers = tmp.concat(new_arr);
          numbers.push(...last);
        } else if (currentPage > 6 && currentPage >= lastPage - 6) {
          numbers = Array.from({ length: 9 }, (v, i) => lastPage - i);
          numbers.reverse();
          numbers = tmp.concat(numbers);
        } else if (currentPage <= 6) {
          tmp = ["...", `${lastPage - 1}`, "" + lastPage];
          numbers = Array.from({ length: 9 }, (v, i) => `${i + 1}`);
          numbers.push(...tmp);
        }
      } else {
        numbers = Array.from({ length: lastPage }, (v, i) => `${i + 1}`);
      }
      this.page = {
        numbers,
        lastPage,
        totalCount,
        currentPage,
      };
    } else {
      this.page = {
        totalCount,
      };
    }
  }

}

export default new IpListStore();
