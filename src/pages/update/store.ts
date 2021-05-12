import { action, observable } from "mobx";
import {
  reqIpTypeList,
  upload,
  getIpDetail,
  getDownload,
  delMaterial,
  uploadBusinessData, listCompany, listMainType, listCountry, getCompanyType
} from "@utils/api";

interface IUpdateStatus {
  pub: object,
  sub: object,
  showDate: object,
}

interface IUpdateState {
  ipName: string, // IP名称
  ipTypeSuperiorNumber: string, // IP分类 IP形象等一级类型guid
  brokerageFirmGuid: string, // 下拉公司类型
  ipDesc: string, // IP 简介
  detail: string, // 图文详情
  ipLocation: string, // 废弃
  countryNames: string, // 国家名字
  countryTypes: string, // 国家编号
  ipTypeNumber: string, // IP类型 ip二级类型guid，
  owner: string, // IP版权方
  copyrightAgent: string, // ip版权代理方
  recordCountry: string, // ip备案国
  grantedType: string, // 已授权品类
  authorizedType: string, // 可授权品类
  intentAuthorization: string, // 意向授权品类
  authorizedLocation: string, // 可授权区域
  authorizedAllottedTime: string, // 可授权期限日期
  isTransferable: Number, // 是否可以转授权
  ipMaterialGuidList: string, // 商务资料
  ipFormNumber: string,
  ipPicGuid: string,
  sex?: string,
  height?: number,

  prodect: Array<object>;
  cooperationCase: Array<object>,
}

class CreateStore {
  @observable
  previousData: any = {};
  // 记录新添加类别的状态
  @observable typeListCase: object = {
    selected: '',
    clearditor: false,
  };
  @observable typeList: object[];
  @observable typeListTop: object[];
  @observable subTypeList: object[];
  @observable locationList: object[];
  @observable authorityZone: object[];
  @observable modalityList: object[] = [];
  // @observable updateList: {};
  @observable updateList: IUpdateState = {
    ipName: "",
    ipTypeSuperiorNumber: '',
    brokerageFirmGuid: '',
    ipLocation: '1',
    ipTypeNumber: '',
    ipDesc: "",
    detail: '',
    ipFormNumber: '',
    ipPicGuid: '', // 左侧背景图片
    countryNames: '',
    countryTypes: '',
    owner: '', // IP版权方
    copyrightAgent: '',
    recordCountry: '',
    grantedType: undefined, // 已授权品类
    authorizedType: undefined, // 可授权品类
    intentAuthorization: undefined, // 意向授权品类
    authorizedLocation: undefined, // 可授权区域
    authorizedAllottedTime: '', // 可授权期限日期
    isTransferable: 0, // 是否可以转授权
    ipMaterialGuidList: '', // 商务资料
    prodect: [
      { pic: '', title: '' },
      { pic: '', title: '' },
      { pic: '', title: '' },
      { pic: '', title: '' },
    ],
    cooperationCase: [
      { pic: '', title: '' },
      { pic: '', title: '' },
      { pic: '', title: '' },
      { pic: '', title: '' },
    ],
  };
  @observable businessList: [];
  @observable companyData: [];
  @observable brokerageFirmGuid: '';

  @observable status: IUpdateStatus = {
    pub: {
      ipName: '',
      ipTypeSuperiorNumber: '',
      ipLocation: '',
      ipTypeNumber: [],
      ipTypeName: [], // IP类型 ip二级类型中文名
      ipDesc: '',
      ipFormNumber: [],
      countryTypes: '',
      ipPicGuid: ''
    },
    sub: {},
    showDate: {},
  };

  // 切换IP分类时 仅限新增IP 清空参数值
  clearSub() {
    let _updateList: any = JSON.stringify(this.updateList);
    //  JSON.
    _updateList = JSON.parse(_updateList);
    delete _updateList.ipName;
    delete _updateList.ipTypeSuperiorNumber;
    delete _updateList.ipDesc;
    for (let val in _updateList) {
      if (_updateList.hasOwnProperty(val)) {
        if (val === 'authorizedLocation' || val === 'authorizedType' || val === 'grantedType' || val === 'intentAuthorization') {
          _updateList[val] = undefined;
        } else if (val === 'prodect' || val === 'cooperationCase') {
          _updateList[val] = [
            { pic: '', title: '' },
            { pic: '', title: '' },
            { pic: '', title: '' },
            { pic: '', title: '' },
          ];
        } else {
          _updateList[val] = '';
        }
      }
    }
    this.updateList = { ...this.updateList, ..._updateList };
  }

  // 获取最新 IP 分类
  @action
  async getlistMainType() {
    await this.getLocation();
    await this.getAuthorityZone({ type: 9 });
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      let typeList: object[] = [];
      let _typeListTop: object[] = [];
      result.forEach(element => {
        let { childTypeList, mainTypeGuid, picUrl, typeName } = element;
        childTypeList && childTypeList.forEach(val => {
          val['mainTypeGuid'] = mainTypeGuid;
          val['type'] = val.ipType;
          typeList.push(val);
        });
        _typeListTop.push({ mainTypeGuid, picUrl, typeName });
      });
      this.typeList = typeList;
      this.typeListTop = _typeListTop;
    }
  }

  // 修改之前的 IP分类 (二级分类菜单)
  @action
  async ipTypeList() {
    let { errorCode, result }: any = await reqIpTypeList();
    if (errorCode === "200") {
      let subTypeList: object[] = [];
      let modalityList: object[] = [];

      result.forEach((item: any) => {
        let { ipTypeNumber, sublist } = item;
        sublist.forEach((val: any) => {
          let { ipType, sublist: sub } = val;

          if (ipType === "类型") {
            let subtype = { [ipTypeNumber]: sub };
            subTypeList.push(subtype);
          }
          if (ipType === "形式") {
            let modality = { [ipTypeNumber]: sub };
            modalityList.push(modality);
          }
        });
      });
      this.subTypeList = subTypeList;
      this.modalityList = modalityList;
    }
  }

  // 设置修改 页面的三级 IP类型
  async setchildType(pub, item, subTypeList, callback) {
    let { ipTypeNumber } = pub;
    ipTypeNumber = ipTypeNumber ? ipTypeNumber : [];
    let count = false;
    let index_ = 0;
    ipTypeNumber.forEach((val, indx) => {
      if (val === item.ipTypeNumber) {
        index_ = indx;
        count = true;
      }
    });
    if (count) {
      ipTypeNumber.splice(index_, 1);
    } else {
      ipTypeNumber.push(item.ipTypeNumber);
    }

    // 匹配中文名字
    let ipTypeName = [];
    ipTypeNumber.forEach(val => {
      subTypeList.map((item: any) => {
        if (val === item.ipTypeNumber) {
          ipTypeName.push(item.ipType);
        }
      });
    });
    callback({ ...pub, ipTypeNumber, ipTypeName });
    let _ipTypeNumber = ipTypeNumber.join(',');
    let _ipTypeName = ipTypeName.join(',');
    let reg = /,{1+}/g;
    _ipTypeNumber.replace(reg, ",");
    _ipTypeName.replace(reg, ",");
    await this.setStatus({ ipTypeNumber: _ipTypeNumber, ipTypeName: _ipTypeName });
  }

  // 页面设置国家
  async setContry(boole, item, locationList, pub, callback) {
    function replaceStr(oldStr, childStr) {
      let re = new RegExp(childStr, "g"); // 通过RegExp使用变量
      return oldStr.replace(re, '');
    }

    let countryTypes = this.updateList.countryTypes;
    if (boole) {
      countryTypes = replaceStr(countryTypes, item.resourceKey);
    } else {
      countryTypes = countryTypes + ',' + item.resourceKey;
    }
    // 匹配中文名字
    let contryName = [];
    countryTypes.split(',').forEach(val => {
      locationList.map((item: any) => {
        if (val === item.resourceKey) {
          contryName.push(item.resourceValue);
        }
      });
    });
    let countryNames = contryName.join('/');
    callback({ ...pub, countryTypes, countryNames });

    await this.setStatus({ countryTypes, countryNames });
  }

  /**
   * 国家地区
   */
  @action
  async getLocation() {
    let { errorCode, result }: any = await listCountry();
    let _locationList: object[] = [];
    if (errorCode === "200") {
      result.forEach((item: any) => {
        _locationList.push(item);
      });
      this.locationList = _locationList;
      return _locationList;
    }
  }

  /**
   * 可授权区
   * @param params
   */
  @action
  async getAuthorityZone(params) {
    let { errorCode, result }: any = await getCompanyType(params);
    let _authorityZone: object[] = [];
    if (errorCode === "200") {
      result.forEach((item: any) => {
        _authorityZone.push(item);
      });
      this.authorityZone = _authorityZone;
      return _authorityZone;
    }
  }

  @action
  async upload(params) {
    let { errorCode }: any = await upload(params);
    if (errorCode === 200) {
    }
  }

  @action
  async doRest() {
    this.updateList = {
      ipName: "",
      ipTypeSuperiorNumber: '',
      brokerageFirmGuid: '',
      ipLocation: '1',
      ipTypeNumber: '',
      ipDesc: "",
      detail: '',
      ipFormNumber: '',
      ipPicGuid: '',
      countryNames: '',
      countryTypes: '',
      owner: '', // IP版权方
      copyrightAgent: '',
      recordCountry: '',
      grantedType: undefined, // 已授权品类
      authorizedType: undefined, // 可授权品类
      intentAuthorization: undefined, // 意向授权品类
      authorizedLocation: undefined, // 可授权区域
      authorizedAllottedTime: '', // 可授权期限日期
      isTransferable: 0, // 是否可以转授权
      ipMaterialGuidList: '', // 商务资料
      prodect: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
      cooperationCase: [
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
        { pic: '', title: '' },
      ],
    };
  }

  @action
  async getBasic(params: IUpdateStatus, param) {
    await this.setStatus(params);
    await this.getUpdateDetail(param);
  }

  // 获取编辑页的基本信息
  @action
  async getUpdateDetail(params) {
    const { ipid, ipTypeNumber, userGuid }: { ipid: number, ipTypeNumber: number, userGuid: any } = params;
    let { errorCode, result }: any = await getIpDetail({
      ipid, ipTypeNumber, userGuid
    });
    if (errorCode === '200') {
      if (result.errorCode === 200) {
        for (let val in result.data) {
          if (result.data.hasOwnProperty(val)) {
            if (val === 'authorizedLocation' || val === 'authorizedType' || val === 'grantedType' || val === 'intentAuthorization') {
              if (result.data[val] === '' || result.data[val] === undefined) result.data[val] = undefined;
            }
          }
        }
        this.updateList = result.data;
        this.brokerageFirmGuid = result.data && result.data.brokerageFirmGuid;
        return {
          request: true,
        };
      } else {
        return {
          request: false,
          message: result.errorMsg,
        };
        // alert(result.errorMsg)
      }
    }
  }

  @action

  async setStatus(params) {
    this.updateList = { ...this.updateList, ...params };
  }

  async setStatus2(params) {
    this.updateList = { ...this.updateList, ...params };
  }

  // 招商资料列表
  @action
  async getDownload({ ipid }: { ipid: number }) {
    const { errorCode, result }: any = await getDownload(ipid);
    if (errorCode === "200") {
      this.businessList = result;
    }
  }

  /**
   * 上传商务资料
   * @param params
   */
  @action
  async getBusiness(params) {
    const { errorCode, result }: any = await uploadBusinessData(params);
    if (errorCode === '200' && result.errorCode === 200) {

    } else if (result.errorCode < 0) {
      return { message: result.message };
    }
  }

  // 下载招商资料
  // async downloadMaterial(params) {
  //   const { errorCode, result }: any = await getDownloadMaterial(params);
  //   if (errorCode === '200' && result.errorCode === 200) {
  //   } else if (result.errorCode < 0) {
  //     return { message: result.errorMsg };
  //   }
  // }

  /**
   *  删除
   * 刷新页面
   * @param params
   */
  @action
  async deleteMaterial(params) {
    const { errorCode, result }: any = await delMaterial(params);
    if (errorCode === '200' && result.errorCode === 200) {

    } else if (result.errorCode < 0) {
      return { message: result.errorMsg };
    }
  }

  /**
   * 经济公司 Ip版权代理方 版权方
   * @param dataURI
   */
  @action
  async companyList({ companyName, currentPage, pageSize, companyType }) {
    const { errorCode, result }: any = await listCompany({ companyName, currentPage, pageSize, companyType });
    if (errorCode === '200' && companyName !== "") {
      this.companyData = result;
      return result;
    } else {
      this.companyData = [];
    }
  }

// 清空
  @action
  async setCompanyNull() {
    this.companyData = [];
  }

  // base64 转二进制文件
  @action
  async dataURItoBlob(dataURI: any) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}

export default new CreateStore();
