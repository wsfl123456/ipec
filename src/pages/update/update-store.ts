import { action, observable, toJS } from "mobx";
import WangEditor from 'wangeditor';
import {
  listCompany,
  listCountry,
  listMainType, reqCreateIp,
  reqIpTypeList,
  savePic,
  uploadBusinessData,
  uploadUploadFile,
  getAuthorize, getCompanyType, listPlatform, getIpDetail, reqEditIp,
  getHotWords,
} from "@utils/api";
import { IUpdateStore, IUpdateStoreParameter } from "@pages/update/interfaces/i-update-store";
import { message } from "antd";
import _forEach from 'lodash/forEach';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _filter from 'lodash/filter';

enum Authorization {
  AUTHORIZED = 1,
  GRANTED,
  INTENT
}

const initial: IUpdateStoreParameter = {
  ipLeftPic: '',
  ipPicGuid: '',
  ipDesc: '',
  ipName: '',
  ipTypeSuperiorNumber: '',
  // ipTypeNumber: [],
  ipTypeNumber: '',  // IP类型，
  customTag: [], // IP标签

  // countryTypes: [],
  countryTypes: '', // IP所属国家
  countryNames: '',

  ipIsShow: 2,
  showDate: '',
  numberEpisode: '',
  filmLength: '',
  protagonist: '',
  director: '',
  scriptwriter: '',
  companyCps: [],
  companyFxs: [],
  companyXfs: [],
  ipPlatformInfoWls: [],
  ipPlatformInfoDss: [],
  nationality: '',
  nationalityText: '',
  brokerageFirms: [],
  birthDate: '',
  profession: '',
  copyrightAgent: [],
  authorizedLocation: [],
  authorizedAllottedTime: '',
  isTransferable: 0,
  owner: [],
  recordCountry: '',
  intentAuthorization: [],
  grantedType: [],
  authorizedType: [],
  prodect: [],
  cooperationCase: [],
  // prodect: Array(4).fill({ pic: '', title: '' }),
  // cooperationCase: Array(4).fill({ pic: '', title: '' }),
  // ipAccountInfoDTOList: [{ platformType: '', account: '', nickName: '', platformName: '' }], // IP社交平台账号
  ipAccountInfoDTOList: [], // IP社交平台账号
  investmentList: [],

  agencyAgreement: '', // 代理协议地址
  agencyAgreementGuid: '',
  agencyAgreementName: '',
  copyrightCertificate: '', // 版权方
  copyrightCertificateGuid: '',
  copyrightCertificateName: '',
  ownership: '', // IP所有权
  ownershipGuid: '',
  ownershipName: '',

  detail: '',
};

class UpdateStore implements IUpdateStore {

  @observable editor: WangEditor;

  @observable countryList: any[] = [];
  @observable childList: any[] = [];
  @observable selectedType: number = -1;
  @observable readAndAgree: boolean = false;
  @observable authorizedTypeList: any[] = [];
  @observable grantedTypeList: any[] = [];
  @observable intentAuthorizationList: any[] = [];
  @observable authorizedLocationList: any[] = [];

  @observable companyCpsList: any[] = [];
  @observable companyFxsList: any[] = [];
  @observable companyXfsList: any[] = [];

  @observable ipPlatformInfoWlsList: any[] = [];
  @observable ipPlatformInfoDssList: any[] = [];

  @observable rightIPCopyrightList: [];
  @observable rightIPCopyrightList2: [];

  @observable sublist: any[] = [];

  @observable rightIPImageShow: boolean = true;

  @observable rightIPCaseShow: boolean = true;

  private tmpTime: NodeJS.Timeout;

  @observable current: IUpdateStoreParameter = initial;

  @observable backup: IUpdateStoreParameter = initial;
  @observable agencyAgreementName: string = '';
  @observable copyrightCertificateName: string = '';
  @observable ownershipName: string = '';
  // 添加社交平台账号
  @observable platformList: any[] = [];
  @observable socialPlatformList: any[] = [];

  @observable tagList: any[] = [];

  @action
  setPlatformGroups(idx: number, v: any) {
    this.current.ipAccountInfoDTOList[idx].platformType = v;
  }

  @action
  editPlatformGroups(v) {
    this.current.ipAccountInfoDTOList = v;
  }

  @action
  setCurrent(params: any) {
    this.current = { ...this.current, ...params };
  }

  @action
  setDetail(v: any) {
    this.current.detail = v;
  }

  @action
  setEditor(editor: WangEditor) {
    this.editor = editor;
  }

  @action
  setReadAndAgree(checked: boolean): void {
    this.readAndAgree = checked;
  }

  @action
  setIpName(v: string) {
    this.current.ipName = v;
  }

  @action
  async getCountryList() {
    const { result }: any = await listCountry();
    this.countryList = result;
  }

  @action
  async getAuthorize(type: Authorization) {
    const { result }: any = await getAuthorize(type);
    if (type === Authorization.AUTHORIZED) {
      this.authorizedTypeList = result;
    } else if (type === Authorization.GRANTED) {
      this.grantedTypeList = result;
    } else if (3 === Authorization.INTENT) {
      this.intentAuthorizationList = result;
    }
  }

  @action
  async getAuthorizedLocationList() {
    const { result }: any = await getCompanyType({ type: 9 });
    this.authorizedLocationList = result;
  }

  @action
  async getListPlatform(type: number) {
    let { errorCode, result }: any = await listPlatform(type);
    if (errorCode === '200') {
      if (type === 1) {
        this.ipPlatformInfoWlsList = result;
      } else if (type === 2) {
        this.ipPlatformInfoDssList = result;
      }
    }
  }

  @action
  async getIpSublist() {
    const { result }: any = await reqIpTypeList();
    this.sublist = result;
  }

  @action
  setIpType(val: number) {
    this.selectedType = val;
    this.clearSecond();
  }

  /**
   * 只会执行一次 放心使用
   * @param typeNumber
   */
  @action
  async setDefaultType(typeNumber: string) {
    let { result }: any = await listMainType();
    const v = Number(typeNumber);
    this.selectedType = (result
      .findIndex(item => (item.childTypeList.findIndex(val => val.ipTypeNumber === v) > -1)));
    this.childList = ((this.sublist.find(val => val.ipTypeNumber === v).sublist || []).find(ele => ele.ipType === '类型') || { sublist: [] }).sublist;
    this.current.ipTypeSuperiorNumber = typeNumber;
  }

  // ip标签
  @action
  async getIpTagList(ipTypeSuperiorNumber: string | number) {
    try {
      const { result }: any = await getHotWords({ ipTypeSuperiorNumber });
      this.tagList = result;
    } catch (e) {
      console.log(e);
    }

  }

  @action
  clearSecond() {
    this.current.ipTypeSuperiorNumber = '';
  }

  @action
  clearCheck() {
    // this.current.ipTypeNumber = [];
    // this.current.countryTypes = [];
    this.current.ipTypeNumber = '';
    this.current.countryTypes = '';
    this.current.customTag = [];
  }

  // ip分类子列表
  @action
  setSecondType(v: number) {
    const children = ((this.sublist.find(val => val.ipTypeNumber === v).sublist || []).find(ele => ele.ipType === '类型') || { sublist: [] }).sublist;
    this.current.ipTypeSuperiorNumber = v + '';
    this.childList = children;
    this.clearCheck();
    // IP标签
    this.getIpTagList(v);
  }

  @action
  changeIpDesc(text: string) {
    this.current.ipDesc = text;
  }

  @action
  setIpTypeNumber(v: string) {
    this.current.ipTypeNumber = v;
  }

  @action
  setIpTags(v: string[]) {
    this.current.customTag = v;
  }

  // setIpCountry(v: string[]) {
  @action
  setIpCountry(v: string) {
    this.current.countryTypes = v;
  }

  @action
  setShowDate(v: string) {
    this.current.showDate = v;
  }

  @action
  setNumberEpisode(v: string) {
    this.current.numberEpisode = v;
  }

  @action
  setFilmLength(v: string) {
    this.current.filmLength = v;
  }

  @action
  setProtagonist(v: string) {
    this.current.protagonist = v;
  }

  @action
  setDirector(v: string) {
    this.current.director = v;
  }

  @action
  setScriptWriter(v: string) {
    this.current.scriptwriter = v;
  }

  @action
  async searchCompany(companyName: string, companyType: number, stateName: string) {
    !!this.tmpTime && clearTimeout(this.tmpTime);
    this.tmpTime = setTimeout(async () => {
      const { result }: any = await listCompany({ companyName, companyType });
      this[stateName] = result;
    }, 400);
  }

  @action
  setCompanyCps(companyName: string[]) {
    this.current.companyCps = companyName;
  }

  @action
  setCompanyFxs(companyName: string[]) {
    this.current.companyFxs = companyName;
  }

  @action
  setCompanyXfs(companyName: string[]) {
    this.current.companyXfs = companyName;
  }

  @action
  setIpPlatformInfoWls(v: string[]) {
    this.current.ipPlatformInfoWls = v;
  }

  @action
  setIpPlatformInfoDss(v: string[]) {
    this.current.ipPlatformInfoDss = v;
  }

  @action
  setIpIsShow(v: number) {
    this.current.ipIsShow = v;
  }

  @action
  setNationality(v: string) {
    this.current.nationality = v;
  }

  @action
  setNationalityText(v: string) {
    this.current.nationalityText = v;
  }

  @action
  setBirthDate(v: string) {
    this.current.birthDate = v;
  }

  @action
  setBrokerageFirms(v: string[]) {
    this.current.brokerageFirms = v;
  }

  @action
  setProfession(v: string) {
    this.current.profession = v;
  }

  @action
  setAuthorizedAllottedTime(v: string) {
    this.current.authorizedAllottedTime = v;
  }

  @action
  setAuthorizedLocation(v: string[]) {
    this.current.authorizedLocation = v;
  }

  @action
  setAuthorizedType(v: string[]) {
    console.log(v);
    this.current.authorizedType = v;
  }

  @action
  setCopyrightAgent(v: string[]) {
    this.current.copyrightAgent = v;
  }

  @action
  setGrantedType(v: string[]) {
    this.current.grantedType = v;
  }

  @action
  setIntentAuthorization(v: string[]) {
    this.current.intentAuthorization = v;
  }

  @action
  setIsTransferable(v: number) {
    this.current.isTransferable = v;
  }

  @action
  setOwner(v: string[]) {
    this.current.owner = v;
  }

  @action
  setRecordCountry(v: string) {
    this.current.recordCountry = v;
  }

  @action
  setRightIPImageShow(show: boolean) {
    this.rightIPImageShow = show;
  }

  @action
  unUploadImgProdect(idx: number) {
    // this.current.prodect[idx].pic = '';
    this.current.prodect.splice(idx, 1);
  }

  /**
   * 修改 IP素材图库 的文字
   * @param v
   * @param idx
   */
  @action
  setProdectTitle(v: string, idx: number) {
    this.current.prodect[idx].title = v;
  }

  private static async upload(file: any) {
    const fileMaxsize = 5 * 1024 * 1024;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append('file', file);
    if (file.size < fileMaxsize) {
      const params = { file: formData, picType: 2 };
      const { errorCode, result = {} }: any = await savePic(params);
      if (errorCode === '200' && result.errorCode === 200) {
        return result;
      } else {
        message.warning(result.errorMsg);
      }
    } else {
      message.warning('图片过大请重新上传');
    }
  }

  @action
  async uploadImgProdect(file: any, idx?: number) {
    const { mapDate = {} }: any = await UpdateStore.upload(file);
    // this.current.prodect[idx].pic = mapDate.picUrl;

    this.current.prodect = [...this.current.prodect, mapDate.picUrl];
    // if (this.current['isProdect'] === undefined) {
    //   // add
    //   this.current.prodect = [...this.current.prodect, mapDate.picUrl];
    // } else {
    //   //  edit
    //   if (this.current['isProdect'] === 2) {
    //     this.current.prodect && this.current.prodect.map(v => {
    //       let arr = [];
    //       if (v.pic !== '') {
    //         arr.push(v.pic);
    //       }
    //       this.current.prodect = [...arr, mapDate.picUrl];
    //     });
    //   } else {
    //     this.current.prodect = [...this.current.prodect, mapDate.picUrl];
    //   }
    //
    // }
  }

  @action
  async uploadLeft(file: any) {
    const { data, mapDate = {} }: any = await UpdateStore.upload(file);
    this.current.ipPicGuid = data;
    this.current.ipLeftPic = mapDate.picUrl;
  }

  @action
  async uploadInvestment(file: any, id: string, ipId: string, type: number) {
    console.log(file);
    // 商务资料
    if (type === 1) {
      if (!file) {
        return;
      } else if ((file.size / (1024 * 1024)) > 50) {
        message.warning("上传失败，请选择单个文件大小50M以内的文件");
      } else if (ipId) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          let formData = new FormData();
          formData.append("file", file);
          let params = { file: formData, userGuid: id, ipid: ipId, type: 1 };
          let { errorCode, result = {} }: any = await uploadBusinessData(params);
          if (errorCode === "200" && result.errorCode === 200) {
            message.success("招商资料上传成功！");
            let investmentListOnly = {
              ipMaterialGuid: result.data,
              ipFile: file.name,
              createDate: Math.round(Number(new Date()))
            };
            this.current.investmentList.push(investmentListOnly);
          }
        };
      } else {
        // 上传IP 的招商资料
        const formData = new FormData();
        formData.append("file", file);
        let { errorCode, result = {} }: any = await uploadUploadFile({
          file: formData,
          userGuid: id, type: 1
        });
        if (errorCode === "200" && result.errorCode === 200) {
          message.success("招商资料上传成功！");
          this.current.investmentList.push({
            ipMaterialGuid: result.data,
            ipFile: file.name,
            createDate: Math.round(Number(new Date()))
          });
        }
      }
    }

    // 2 代理协议 3版权 4IP所有权 5经济合同
    if (type !== 1) {
      if (!file) {
        return;
      } else if ((file.size / (1024 * 1024)) > 10) {
        message.warning("上传失败，请选择单个文件大小10M以内的文件");
      } else if (file.type !== "application/zip" && file.type !== "application/x-zip" && file.type !== "application/x-zip-compressed") {
        message.warning('文件格式不对，请重新选择上传');
        return false;
      } else {
        // 上传
        const formData = new FormData();
        formData.append("file", file);
        let { errorCode, result = {} }: any = await uploadUploadFile({
          file: formData,
          userGuid: id, type
        });
        if (errorCode === "200" && result.errorCode === 200) {
          message.success("文件上传成功！");
          if (type === 2) {
            this.current.agencyAgreementGuid = result.data;
            this.agencyAgreementName = file.name;
            this.current.agencyAgreementName = file.name;
          }
          if (type === 3) {
            this.current.copyrightCertificateGuid = result.data;
            this.copyrightCertificateName = file.name;
            this.current.copyrightCertificateName = file.name;
          }
          if (type === 4 || type === 5) {
            this.current.ownershipGuid = result.data;
            this.ownershipName = file.name;
            this.current.ownershipName = file.name;
          }

        }
      }
    }
  }

  @action
  setRightIPCaseShow(v: boolean) {
    this.rightIPCaseShow = v;
  }

  /**
   * 删除 衍生品/合作案例 的图片
   * @param idx
   */
  @action
  unUploadImgCooperationCase(idx: number) {
    // this.current.cooperationCase[idx].pic = '';
    this.current.cooperationCase.splice(idx, 1);
  }

  @action
  async uploadImgCooperationCase(file: any, idx: number) {
    const { mapDate = {} } = await UpdateStore.upload(file);
    // this.current.cooperationCase[idx].pic = mapDate.picUrl;
    this.current.cooperationCase = [...this.current.cooperationCase, mapDate.picUrl];
  }

  /**
   * 修改 衍生品/合作案例 的文字
   * @param title
   * @param idx
   */
  @action
  setCooperationCaseTitle(title: string, idx: number) {
    this.current.cooperationCase[idx].title = title;
  }

  @action
  deleteInvestmentList(index: number) {
    this.current.investmentList.splice(index, 1);

  }

  /**
   * 更新 ip
   */
  @action
  async beforeEditIp(ipid: string, userGuid: string): Promise<{ data?: any, status: boolean }> {
    const params = this.collectEdit(ipid, userGuid);
    const o = this.collectParams(userGuid);
    if (!_isEmpty(params.modifyContent)) {
      // // 协议更改之后,判断guid 存在有值，agencyAgreement(url)、agencyAgreeName 删除
      let modifyContent = params.modifyContent;
      if (modifyContent) {

        delete modifyContent['agencyAgreement'];
        delete modifyContent['agencyAgreementName'];
        delete modifyContent['copyrightCertificate'];
        delete modifyContent['copyrightCertificateName'];
        delete modifyContent['ownership'];
        delete modifyContent['ownershipName'];

      }
      const isReq = this.doCheck(o);
      if (isReq) {
        // console.log(params);

        const { errorCode, result }: any = await reqEditIp(params);
        return { status: errorCode === '200', data: result };

      }
    } else {
      return { data: '', status: true };
    }
    return { status: false };
  }

  // 对比数据是否更改
  private collectEdit(id: string, userGuid: string) {
    const modifyContent = {};
    let backup = toJS(this.backup); // 获取得编辑数据
    let current = toJS(this.current); // 更改过后得编辑数据

    backup.prodect = JSON.stringify(backup.prodect);
    backup.cooperationCase = JSON.stringify(backup.cooperationCase);
    current.prodect = JSON.stringify(current.prodect);
    current.cooperationCase = JSON.stringify(current.cooperationCase);

    // console.log(backup, current);
    _forEach(current, (item, key) => {

      if (!_isEqual(backup[key], item)) {
        modifyContent[key] = item;
      }
    });
    // console.log("mo" + JSON.stringify(modifyContent));
    return this.remark({
      ipid: id,
      userGuid,
      modifyContent,
      remark: '',
    });
  }

  private collectParams(userGuid: string) {
    !_isEmpty(this.current.ipAccountInfoDTOList) ?
      this.current.ipAccountInfoDTOList.map((v, index) => {
        if (v.platformType === '' && v.account === '' && v.nickName === '') {
          this.current.ipAccountInfoDTOList.splice(index, 1);
        }
      })
      : this.current.ipAccountInfoDTOList ;
    return {
      ...toJS(this.current),
      userGuid,
      ipPicGuid: !!this.current.ipPicGuid ? this.current.ipPicGuid : (this.current.ipLeftPic.match(/(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/) || [])[1],
      ipTypeNumber: (this.current.ipTypeNumber || ''), // ip类型 取frontend-ip-library/type-list接口匹配
      customTag: (this.current.customTag || []).join(','), // IP标签hhh
      // ipAccountInfoDTOList: !_isEmpty(this.current.ipAccountInfoDTOList) ? toJS(this.current.ipAccountInfoDTOList.filter(v => delete v.platformName)) : [], // IP社交平台账号
      ipAccountInfoDTOList: toJS(this.current.ipAccountInfoDTOList), // IP社交平台账号
      prodect: this.current.prodect && JSON.stringify(this.current.prodect),
      cooperationCase: this.current.cooperationCase && JSON.stringify(this.current.cooperationCase),
      // countryNames: (this.current.countryTypes || '').split('').map(v => v.split('_')[1]).join('/'), // 多选 以/分隔 从frontend-common/list-country获取resourceValue
      countryNames: this.current.countryTypes ?
        (this.current.countryTypes || '').split(',').map(v =>
          this.countryList.find(i => i.resourceKey === v).resourceValue
        ).join(',')
        : '',
      countryTypes: this.current.countryTypes || '',
      // countryTypes: (this.current.countryTypes || '').split('').map(v => v.split('_')[0]).join(','), // 多选 以,分隔 从frontend-common/list-country获取resourceKey
      owner: (this.current.owner || []).join(','), // IP版权方 公共接口不同type
      copyrightAgent: (this.current.copyrightAgent || []).join(','), // IP版权代理方 公共接口不同type 非必填项
      authorizedType: (this.current.authorizedType || []).join(','), // 可授权品类 公共接口不同type 多选以,分隔
      grantedType: (this.current.grantedType || []).join(','), // 已授权品类 对上同接口type 有子关系 多选以,分隔
      intentAuthorization: (this.current.intentAuthorization || []).join(','), // 意向授权品类 对上同接口type 多选以,分隔
      authorizedLocation: (this.current.authorizedLocation || []).join(','), // 可授权区域 公共接口不同type 多选以,分隔
      companyGuidCp: (this.current.companyCps || []).join(','), // 出品公司
      companyGuidFx: (this.current.companyFxs || []).join(','), // 发行公司
      companyGuidXf: (this.current.companyXfs || []).join(','), // 宣发公司
      ipPlatformInfoGuidWl: (this.current.ipPlatformInfoWls || []).join(','), // 在线播放平台
      ipPlatformInfoGuidDs: (this.current.ipPlatformInfoDss || []).join(','), // 首播电视平台
      nationality: ((this.current.nationality === "欧洲其他国家" || this.current.nationality === "其他") ? this.current.nationalityText : this.current.nationality), // 国籍
      brithDate: this.current.birthDate, // 生日
      brokerageFirmGuid: (this.current.brokerageFirms || []).join(','), // 经纪公司
      ipMaterialGuidList: (this.current.investmentList || []).map(v => v.ipMaterialGuid).join(','), // 招商资料 guid list 多个以,分隔
    };
  }

  private doCheck(params: any): boolean {
     if (!params.userGuid) {
      message.warning("登录信息失效，请重新登录后再上传IP");
      return false;
    } else if (!params.ipPicGuid) {
      message.warning("请先上传ip封面图");
      return false;
    } else if (!params.ipName) {
      message.warning("请先填写ip名称");
      return false;
    } else if (!params.ipTypeSuperiorNumber) {
      message.warning("请先选择ip分类");
      return false;
    }
      // else if (!params.ipTypeNumber) {
      //   message.warning("请先选择ip类型");
      //   return false;
    // }
    else if (!params.customTag) {
      message.warning("请选择下方标签或输入新的标签");
      return false;
    }
    else if (params.ipTypeSuperiorNumber !== '8' && !params.countryTypes) {
      message.warning("请先选择ip所属国家地区");
      return false;
    } else if ((params.ipTypeSuperiorNumber === '5'
      || params.ipTypeSuperiorNumber === '6'
      || params.ipTypeSuperiorNumber === '7')
      && !params.companyGuidCp) {
      message.warning("请先选择ip出品公司");
      return false;
    } else if (!params.owner) {
      message.warning("请先填写ip版权方");
      return false;
    } else if (!params.recordCountry) {
      console.log("哈哈哈哈哈哈，必须要写");
      message.warning("请先选择ip备案国家");
      return false;
    } else if (!params.authorizedType) {
      message.warning("请先选择可授权品类");
      return false;
    } else if (!params.grantedType) {
      message.warning("请先选择已授权品类");
      return false;
    } else if (!params.intentAuthorization) {
      message.warning("请先选择意向授权品类");
      return false;
    } else if (!params.authorizedLocation) {
      message.warning("请先选择可授权区域");
      return false;
    } else if (!params.authorizedAllottedTime) {
      message.warning("请先选择可授权截止时间");
      return false;
    } else if (params.ipTypeSuperiorNumber === '8' && !params.nationality) {
      message.warning("请先选择国籍");
      return false;
    } else if (params.ipTypeSuperiorNumber === '8' && !params.profession) {
      message.warning("请先选择职业");
      return false;
    } else if (params.ipTypeSuperiorNumber === '8' && !params.brokerageFirmGuid) {
      message.warning("请先选择经纪公司");
      return false;
    } else if (params.ipAccountInfoDTOList) {
       const platformObj = {
         1: '微博',
         2: '微信',
         3: '抖音',
         4: '火山',
         5: '小红书',
         6: 'B站',
         7: '快手',
         8: '微博',
       };
       let tmp = false, platform = '';
       params.ipAccountInfoDTOList && params.ipAccountInfoDTOList.map((v, i) => {
         if (v.platformType !== '') {
           if (v.nickName === '' || v.account === '') {
             platform = platformObj[v.platformType];
             tmp = true;
           }
         }
       });
       if (tmp) {
         message.warning(`请输入${platform}昵称或账号`);
         return false;
       }
     }
     if (!this.readAndAgree) {
      message.warning("请先阅读并同意《IP二厂平台用户管理规定及信息处理协议》");
      return false;
    }
     return true;
  }

  // 提交IP
  async beforeCreateIp(userGuid: string): Promise<{ status: boolean, data?: any }> {
    const params = this.collectParams(userGuid);
    // console.log('params', params);
    const isReq = this.doCheck(params);
    if (isReq) {
      const { errorCode, result }: any = await reqCreateIp(params);
      return { status: errorCode === '200' && result.errorCode === 200, data: result };
    }
    return { status: false };
  }

  /**
   * 获取编辑页的基本信息
   * @param userGuid
   * @param id
   * @param ipTypeSuperiorNumber
   */
  @action
  async getIpEdit(userGuid: string, id: number, ipTypeSuperiorNumber: string) {
    let { errorCode, result: { data } }: any = await getIpDetail({
      ipid: id,
      ipTypeNumber: Number(ipTypeSuperiorNumber),
      userGuid
    });
    if (errorCode === "200") {

      let arr = [], arr1 = [];

      arr = data.countryTypes && data.countryTypes.split(",").map((v) => {
        return this.countryList.filter(i => i.resourceKey === v);
      });
      arr1 = arr && arr.map((i, k) => {
        if (!_isEmpty(i)) {
          return i[0].resourceKey;
        }
      });
      // console.log(arr, arr1, data.countryTypes, this.countryList);
      /**
       * 上述arr,arr1,可合并为如下:但由于之前网站数据已存在原来的错误数据，避免报错的发生，因此这样写.
       *  data.countryTypes.split(',').map((val: string) => this.countryList.find(item => val === item.resourceKey).resourceValue)
       *  isCooperationCase 合作案例 1空 2老数据 3新数据;
       */
      const tmp = {
        ...data,
        ipLeftPic: data.picUrl,
        owner: data.owner.split(','),
        // ipTypeNumber: data.ipTypeNumber.split(","),
        ipTypeNumber: data.ipTypeNumber || '',
        countryTypes: arr1 && arr1.join(',') || '',
        // countryTypes: data.countryTypes.split(",").map((v, i) => v + '_' + this.countryList[i].resourceValue),

        countryNames: data.countryNames && data.countryNames.map((val: string) =>
          this.countryList.find(item => val === item.resourceKey).resourceValue
        ).join(',') || '',
        customTag: data.customTag ? data.customTag.split(',') : [], // ip标签
        ipAccountInfoDTOList: !_isEmpty(data.ipAccountInfoDTOList) ? data.ipAccountInfoDTOList : [{
          platformType: '',
          account: '',
          nickName: ''
        }], // IP的社交平台
        copyrightAgent: (data.copyrightAgent ? data.copyrightAgent.split(",") : []), // 修改 IP版权代理方
        authorizedType: data.authorizedType.split(","), // 修改 可授权品类
        grantedType: data.grantedType.split(","), // 修改 已授权品类
        intentAuthorization: data.intentAuthorization.split(","), // 修改 意向授权品类
        authorizedLocation: data.authorizedLocation.split(","), // 修改 可授权区域
        prodect: data.isProdect > 1 && data.prodect && JSON.parse(data.prodect) || [], // 修改 IP素材图库
        cooperationCase: data.isCooperationCase > 1 && data.cooperationCase && JSON.parse(data.cooperationCase) || [], // 修改 衍生品/合作案例
        // prodect: data.isProdect === 3 ? data.prodect && data.prodect.split(',') : data.prodect && JSON.parse(data.prodect), // 修改 IP素材图库
        // cooperationCase: data.isCooperationCase === 3 ? data.cooperationCase && data.cooperationCase.split(',')  : data.cooperationCase && JSON.parse(data.cooperationCase), // 修改 衍生品/合作案例
        investmentList: (data.ipMaterialList ? data.ipMaterialList : []), // 招商资料的List
        companyCps: (data.companyCps ? data.companyCps.split(",") : []), // 出品公司
        companyFxs: (data.companyFxs ? data.companyFxs.split(",") : []), // 发行公司
        companyXfs: (data.companyXfs ? data.companyXfs.split(",") : []), // 宣发公司
        ipPlatformInfoWls: (data.ipPlatformInfoGuidWl ? data.ipPlatformInfoGuidWl.split(",") : []), // 在线播放平台
        ipPlatformInfoDss: (data.ipPlatformInfoGuidDs ? data.ipPlatformInfoGuidDs.split(",") : []), // 首播电视平台
        brokerageFirms: (data.brokerageFirms ? data.brokerageFirms.split(",") : []), // 经纪公司
        birthDate: data.brithDate,

      };
      this.current = tmp;
      this.backup = tmp;
      // console.log('tmp', tmp);
    }
  }

  @action
  reset() {
    this.selectedType = -1;
    this.readAndAgree = false;
    this.current = initial;
    !!this.editor && this.editor.txt.html(this.current.detail || '');
  }

  private remark(entity: any) {

    const current = toJS(this.current);
    const ipTypeSuperiorNumber = current.ipTypeSuperiorNumber;

    if (!_isEmpty(entity.modifyContent)) {

      _forEach(entity.modifyContent, (value, i) => {
        if (i === "ipPicGuid") {
          entity.remark = entity.remark + '"图片Guid":' + JSON.stringify(value) + '^';
        } else if (i === "ipName") {
          entity.remark = entity.remark + '"ip名称":' + JSON.stringify(value) + '^';
        } else if (i === "ipDesc") {
          entity.remark = entity.remark + '"ip简介":' + JSON.stringify(value) + '^';
        } else if (i === "ipTypeNumber") {
          // 匹配中文名字
          const ipTypeName = value.split(',').map(val => this.childList.find(item => Number(val) === item.ipTypeNumber).ipType);
          entity.remark = entity.remark + '"ip类型":' + ipTypeName.join(',') + '^';
        } else if (i === "customTag") {
          entity.remark = entity.remark + '"ip标签":' + JSON.stringify(value) + '^';
        } else if (i === "ipAccountInfoDTOList") {
          entity.remark = entity.remark + '"ip社交平台账号:有改动^"';
        } else if (i === "countryTypes") {
          // 匹配地区名
          const countryList = toJS(this.countryList) || [];
          const countryNames = value && value.split(',')
            .map((val: string) => countryList.find(item => val.split('_')[0] === item.resourceKey).resourceValue);
          if (!value) {
            entity.remark = entity.remark + '"IP所属国家地区":' + JSON.stringify(value) + '^';
          } else {
            entity.remark = entity.remark + '"IP所属国家地区":' + countryNames.join(',') + '^';
          }
        } else if (i === "owner") {
          entity.remark = entity.remark + '"IP版权方":' + JSON.stringify(value) + '^';
        } else if (i === "copyrightAgent") {
          entity.remark = entity.remark + '"IP版权代理方":' + JSON.stringify(value) + '^';
        } else if (i === "recordCountry") {
          entity.remark = entity.remark + '"IP备案国家":' + JSON.stringify(value) + '^';
        } else if (i === "isTransferable") {
          entity.remark = entity.remark + '"是否可以转授权":' + JSON.stringify(value) + '^';
        } else if (i === "authorizedType") {
          entity.remark = entity.remark + '"可授权品类":' + JSON.stringify(value) + '^';
        } else if (i === "grantedType") {
          entity.remark = entity.remark + '"已授权品类":' + JSON.stringify(value) + '^';
        } else if (i === "intentAuthorization") {
          entity.remark = entity.remark + '"意向授权品类":' + JSON.stringify(value) + '^';
        } else if (i === "authorizedLocation") {
          entity.remark = entity.remark + '"可授权区域":' + JSON.stringify(value) + '^';
        } else if (i === "authorizedAllottedTime") {
          entity.remark = entity.remark + '"可授权截止期限":' + JSON.stringify(value) + '^';
        } else if (i === "prodect") {
          let objIsNull = _filter(value, { 'title': '', 'value': '' });
          // console.log("as" + objIsNull);
          // entity.remark = entity.remark + '"ip素材图库:\"' + JSON.stringify(value) + '\"^';
          entity.remark = entity.remark + '"ip素材图库":"有改动"^';
        } else if (i === "cooperationCase") {
          // entity.remark = entity.remark + '"衍生品/合作案例:\"' + JSON.stringify(value) + '\"^';
          entity.remark = entity.remark + '"衍生品/合作案例":"有改动"^';
        } else if (i === "detail") {
          // entity.remark = entity.remark + '"图文详情":' + JSON.stringify(value) + '^';
          entity.remark = entity.remark + '"图文详情":"有改动"^';
        } else if (i === "ipIsShow") {
          entity.remark = entity.remark + '"是否已经上映":' + JSON.stringify(value) + '^';
        } else if (i === "showDate") {
          entity.remark = entity.remark + '"上映时间":' + JSON.stringify(value) + '^';
        } else if (i === "numberEpisode") {
          entity.remark = entity.remark + '"集数":' + JSON.stringify(value) + '^';
        } else if (i === "filmLength") {
          entity.remark = entity.remark + '"片长":' + JSON.stringify(value) + '^';
        } else if (i === "protagonist") {
          entity.remark = entity.remark + '"主演":' + JSON.stringify(value) + '^';
        } else if (i === "director") {
          entity.remark = entity.remark + '"导演":' + JSON.stringify(value) + '^';
        } else if (i === "scriptwriter") {
          entity.remark = entity.remark + '"编剧":' + JSON.stringify(value) + '^';
        } else if (i === "companyCps") {
          entity.remark = entity.remark + '"出品公司":' + JSON.stringify(value) + '^';
        } else if (i === "companyFxs") {
          entity.remark = entity.remark + '"发行公司":' + JSON.stringify(value) + '^';
        } else if (i === "ipPlatformInfoWls") {
          entity.remark = entity.remark + '"在线播放平台":' + JSON.stringify(value) + '^';
        } else if (i === "ipPlatformInfoDss") {
          entity.remark = entity.remark + '"首播电视平台":' + JSON.stringify(value) + '^';
        } else if (i === "nationality") {
          entity.remark = entity.remark + '"国籍":' + JSON.stringify(value) + '^';
        } else if (i === "profession") {
          entity.remark = entity.remark + '"职业":' + JSON.stringify(value) + '^';
        } else if (i === "brithDate") {
          entity.remark = entity.remark + '"生日":' + JSON.stringify(value) + '^';
        } else if (i === "brokerageFirmGuid") {
          entity.remark = entity.remark + '"经纪公司":' + JSON.stringify(value) + '^';
        } else if (i === "agencyAgreementGuid" && _isEmpty(value)) {
          entity.remark = entity.remark + '"代理商请提供与版权方签署的代理协议":"删除"^';
        } else if (i === "agencyAgreementGuid" && !_isEmpty(value)) {
          entity.remark = entity.remark + '"代理商请提供与版权方签署的代理协议":' + JSON.stringify(current.agencyAgreementName) + '^';
        } else if (i === "copyrightCertificateGuid" && _isEmpty(value)) {
          entity.remark = entity.remark + '"版权方请提供国家版权登记证或境外版权证明文件":"删除"^';
        } else if (i === "copyrightCertificateGuid" && !_isEmpty(value)) {
          entity.remark = entity.remark + '"版权方请提供国家版权登记证或境外版权证明文件":' + JSON.stringify(current.copyrightCertificateName) + '^';
        } else if (i === "ownershipGuid" && _isEmpty(value) && Number(ipTypeSuperiorNumber) !== 8) {
          entity.remark = entity.remark + '" 能够证明IP所有权的相关文件":"删除"^';
        } else if (i === "ownershipGuid" && !_isEmpty(value) && Number(ipTypeSuperiorNumber) !== 8) {
          entity.remark = entity.remark + '" 能够证明IP所有权的相关文件":' + JSON.stringify(current.ownershipName) + '^';
        } else if (i === "ownershipGuid" && _isEmpty(value) && Number(ipTypeSuperiorNumber) === 8) {
          entity.remark = entity.remark + '" 经纪公司请提供与艺人签署的经纪合同":"删除"^';
        } else if (i === "ownershipGuid" && !_isEmpty(value) && Number(entity.ipTypeSuperiorNumber) === 8) {
          entity.remark = entity.remark + '" 经纪公司请提供与艺人签署的经纪合同":' + JSON.stringify(current.ownershipName) + '^';
        }

      });
      entity.remark = entity.remark.substring(0, entity.remark.length - 1);
    }
    return entity;
  }
}

export default new UpdateStore();
