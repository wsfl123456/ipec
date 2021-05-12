import { action, observable, toJS } from 'mobx';
import {
  listMainType, getCompanyType, getAuthorize,
  reqSubmitCompany, reqSubmitPerson,
  reqEditCompany, reqEditPerson,
  getCompanyInfo, getUserInfo, uploadFile,
} from '@utils/api';
import { message } from 'antd';
import _isArray from 'lodash/isArray';
interface ICompanyState {
  companyName: string,
  companyIndustry: string,
  companyProduct: string,
  purpose: number,
  cooperativeContacts: any[],
  haveIp: any[],
  interestCategory: string,
  purposeIp: any[], // 意向IP
  worksWebsite: string,
  worksUrl: any[],
  designType: string,
  adept: string,
  hasCooperate: number,
  companyAddress: string,
  companyDesc: string,
  companyExhibition: string, // guid
  exhibitionUrl: string, // url
}
const initial: ICompanyState = {
  companyName: '',
  companyIndustry: '', // 行业
  companyProduct: '', // 产品
  purpose: 1,
  cooperativeContacts: [{ name: '', position: '', contactInfo: '' }], // 合作联系人
  haveIp: [{ name: '', ipType: '', authorizeType: '' }], // 拥有/代理的IP  // 1
  interestCategory: '', // 感兴趣的IP品类 // 2
  purposeIp: [''], // 意向IP
  worksWebsite: '', // 作品链接 3
  worksUrl: [], // 作品 3
  designType: '', // 设计类型 3
  adept: '', // 擅长领域 3
  hasCooperate: 1, // 是否已有IP合作案例
  companyAddress: '',
  companyDesc: '',
  companyExhibition: '', // 企业风采guid
  exhibitionUrl: '', // url
};
interface IPersonState {
  userRealName: string,
  contactInfo: string,
  companyName: string,
  purpose: number,
  haveIp: any[],
  interestCategory: string,
  purposeIp: any[], // 意向IP
  worksWebsite: string,
  worksUrl: any[],
  designType: string,
  adept: string,
  hasCooperate: number,
  userDesc: string,
}

const personInit: IPersonState = {
  userRealName: '',
  contactInfo: '',
  companyName: '',
  purpose: 1,
  haveIp: [{ name: '', ipType: '', authorizeType: '' }], // 拥有/代理的IP  // 1
  interestCategory: '', // 感兴趣的IP品类 // 2
  purposeIp: [''], // 意向IP
  worksWebsite: '', // 作品链接 3
  worksUrl: [], // 作品 3
  designType: '', // 设计类型 3
  adept: '', // 擅长领域 3
  hasCooperate: 1, // 是否已有IP合作案例
  userDesc: '',
};
class UserInformationStore {
  @observable platformPurposeList: any = [
    {
      label: '有IP授权',
      value: 1,
    },
    {
      label: '找IP合作',
      value: 2,
    },
    {
      label: '产品设计接单',
      value: 3,
    },
  ];
  @observable platformPurposeTab = 1;

  @observable ipCaseList: any = [
    { label: '是', value: 1 },
    { label: '否', value: 2 },
  ];
  @observable ipCaseTab = 1;

  @observable interestDataList = []; // 感兴趣的品类
  @observable designTypeList = []; // 11 承接设计类型
  @observable areasOfExpertiseList = []; //   12 擅长领域
  @observable intentAuthorizationList = []; // 意向授权品类
  @observable industryList = [];

  @observable companyParams: ICompanyState = initial;
  @observable companyInfo = {}; // 公司信息

  @observable personParams: IPersonState = personInit;
  @observable personInfo = {}; // 个人信息

  @observable worksUrlList = [] ; // 作品
  // 平台目的
  @action
  changePlatformPurposeTab(idx) {
    this.platformPurposeTab = idx;
    this.companyParams.purpose = idx;
    this.personParams.purpose = idx;
  }
 // 案列是否
  @action
  changeIpCaseTab(idx) {
    this.ipCaseTab = idx;
    this.companyParams.hasCooperate = idx;
    this.personParams.hasCooperate = idx;
  }

  // 感兴趣的品类
  @action
  getListMainType = async () => {
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      this.interestDataList = result;
    }
  };
  // 意向授权品类
  @action
  async getAuthorize(type) {
    const { result }: any = await getAuthorize(type);
    this.intentAuthorizationList = result;
  }
  // 合作联系人
  @action
  editCooperativeContacts(v){
    this.companyParams.cooperativeContacts = v;
  }
  // 代理IP
  @action
  editHaveIp(v){
    this.companyParams.haveIp = v;
    this.personParams.haveIp = v;
  }
  // 意向IP
  @action
  editPurposeIp(v){
    this.companyParams.purposeIp = v;
    this.personParams.purposeIp = v;
  }
  // 公司参数值
  @action
  changeCompanyParams( params) {
    this.companyParams = { ...this.companyParams, ...params} ;
    console.log(this.companyParams);
  }
  @action
  changePersonParams( params) {
    this.personParams = { ...this.personParams, ...params} ;
    console.log(this.personParams);
  }
  /**
   * 获取 企业信息
   * 11 承接设计类型   ，  12 擅长领域
   */
  @action
  async getCompanyType(params) {
    const { errorCode, result }: any = await getCompanyType(params);
    if (errorCode === '200') {
      switch (params.type) {
        case 3:
          this.industryList = result;
          break;
        case 11:
          this.designTypeList = result;
          break;
        case 12:
          this.areasOfExpertiseList = result;
          break;
      }

    }
  }

  @action
  async submitFun(type, userGuid){
    switch (type) {
      case 1:
        await this.personSubmit(userGuid);
        break;
      case 2:
        await this.companySubmit(userGuid);
        break;

    }
  }
  @action
  async editFun(type, userGuid){
    switch (type) {
      case 1:
        await this.personEdit(userGuid);
        break;
      case 2:
        await this.companyEdit(userGuid);
        break;

    }
  }
  // params --- company
  private collectParams(userGuid: string) {
    return {
      ...toJS(this.companyParams),
      userGuid,
      // cooperativeContacts: JSON.stringify(this.companyParams.cooperativeContacts),
      // haveIp: JSON.stringify(this.companyParams.haveIp),
      // purposeIp: JSON.stringify(this.companyParams.purposeIp),

    }
  };

  private doCheck(params: any): boolean {
    if (!params.userGuid){
      message.warning("登录信息失效，请重新登录后再完善用户信息");
      return false;
    }else if (!params.companyName){
      message.warning("请输入企业全称");
      return false;
    } else if (!params.companyIndustry){
      message.warning("请选择企业所属行业");
      return false;
    } else if (!params.companyProduct){
      message.warning("请输入企业经营的业务或产品");
      return false;
    } else if (!params.purpose){
      message.warning("请选择来平台目的");
      return false;
    } else if (params.cooperativeContacts){ // 联系人
      let tmp = false,  title = '';
      params.cooperativeContacts && params.cooperativeContacts.map((v, i) => {
        if (!v.name) {
          tmp = true;
          title = '请输入合作联系人的姓名';
        }
        if (!v.position) {
          tmp = true;
          title = '请输入合作联系人的职位';
        }
        if (!v.position) {
          tmp = true;
          title = '请输入联系方式(手机、邮箱、微信、QQ都可';
        }
      });
      if (tmp) {
        message.warning(`${title}`);
        return false;
      }
    } else if (params.purpose === 1 && params.haveIp){ // 代理ip  :1
      let tmp = false,  title = '';
      params.haveIp && params.haveIp.map((v, i) => {
        if (!v.name) {
          tmp = true;
          title = '请输入IP名称';
        }
        if (!v.ipType) {
          tmp = true;
          title = '请选择IP类型';
        }
        if (!v.authorizeType) {
          tmp = true;
          title = '请选择该IP意向授权的品类';
        }
      });
      if (tmp) {
        message.warning(`${title}`);
        return false;
      }
    }  else if (params.purpose === 2 && !params.interestCategory){ // 感兴趣的IP品类 2
      message.warning("请选择感兴趣的品类");
      return false;
    } else if (params.purpose === 3 && !params.position){ // 作品链接 3
      message.warning("请填写作品链接");
      return false;
    }  else if (params.purpose === 3 && !params.worksUrl){ // 设计作品 3
      message.warning("请至少上传一个设计作品");
      return false;
    } else if (params.purpose === 3 && !params.designType){ //  3
      message.warning("请选择承接设计类型");
      return false;
    }  else if (params.purpose === 3 && !params.adept){ //  3
      message.warning("请选择擅长领域");
      return false;
    } else if (!params.companyAddress){
      message.warning("请输入企业地址");
      return false;
    }else if (!params.companyAddress){
      message.warning("请输入企业简介");
      return false;
    }
    return true;

  }

  @action
  async companySubmit(userGuid){
    const params = this.collectParams(userGuid);
    console.log('company', params);
    const isReq = this.doCheck(params);
    if (isReq) {
      const { errorCode, result }: any = await reqSubmitCompany(params);
      return { status: errorCode === '200' && result.errorCode === 200, data: result }
    } else{
      return  { status: false};
    }
  }
  @action
  async companyEdit(userGuid){
    const params = this.collectParams(userGuid);
    console.log('company edit', params);
    const isReq = this.doCheck(params);
    if (isReq) {
      const { errorCode, result }: any = await reqEditCompany(params);
      return { status: errorCode === '200' && result.errorCode === 200, data: result };
    }else{
      return { status: false}
    }
  }
  @action
  clearCompanyParams() {
    this.companyParams = initial;
    this.platformPurposeTab = 1;
    console.log('company', toJS(initial));
  }

  /**
   * 获取公司信息
   * @param userGuid
   */
  @action
  async getCompanyInfo(userGuid: string) {
    const { errorCode, result }: any = await getCompanyInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      let arr: any[] = [''];
      this.companyInfo = result.data;
      this.companyParams = {...this.companyParams,
        companyName: result.data.companyName,
        companyIndustry: result.data.companyIndustry,
        interestCategory: result.data.interestCategory,
        worksWebsite: result.data.worksWebsite,
        worksUrl: result.data.worksUrl,
        designType: result.data.designType,
        adept: result.data.adept,
        hasCooperate:  result.data.hasCooperate || 0, // 是否已有IP合作案例
        companyAddress: result.data.companyAddress,
        companyDesc: result.data.companyDesc ,
        companyExhibition: result.data.companyExhibition, // 企业风采guid
        exhibitionUrl: result.data.exhibitionUrl, // url
      };

      this.companyParams.purpose = result.data.purpose ? result.data.purpose : 1;
      this.companyParams.purposeIp = _isArray(result.data.purposeIp) ? result.data.purposeIp : arr;
      this.companyParams.haveIp = result.data.haveIp ? result.data.haveIp : [{ name: '', ipType: '', authorizeType: '' }];
      this.companyParams.cooperativeContacts = result.data.cooperativeContacts ? result.data.cooperativeContacts : [{ name: '', position: '', contactInfo: '' }];

      return { message: result.errorMsg, request: true, };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false, };
    }
  }

  // 个人
  private collectPersonParams(userGuid: string) {
    return {
      ...toJS(this.personParams),
      userGuid,
      // haveIp: JSON.stringify(this.companyParams.haveIp),
      // purposeIp: JSON.stringify(this.companyParams.purposeIp),

    }
  };
  private doPersonCheck(params: any): boolean {
    if (!params.userGuid){
      message.warning("登录信息失效，请重新登录后再完善用户信息");
      return false;
    }else if (!params.userRealName ){
      message.warning("请输入姓名");
      return false;
    } else if (!params.contactInfo){
      message.warning("请输入联系方式");
      return false;
    } else if (!params.purpose){
      message.warning("请选择来平台目的");
      return false;
    }  else if (params.purpose === 1 && params.haveIp){ // 代理ip  :1
      let tmp = false,  title = '';
      params.haveIp && params.haveIp.map((v, i) => {
        if (!v.name) {
          tmp = true;
          title = '请输入IP名称';
        }
        if (!v.ipType) {
          tmp = true;
          title = '请选择IP类型';
        }
        if (!v.authorizeType) {
          tmp = true;
          title = '请选择该IP意向授权的品类';
        }
      });
      if (tmp) {
        message.warning(`${title}`);
        return false;
      }
    }  else if (params.purpose === 2 && !params.interestCategory){ // 感兴趣的IP品类 2
      message.warning("请选择感兴趣的品类");
      return false;
    } else if (params.purpose === 3 && !params.worksWebsite){ // 作品链接 3
      message.warning("请填写作品链接");
      return false;
    }  else if (params.purpose === 3 && !params.worksUrl){ // 设计作品 3
      message.warning("请至少上传一个设计作品");
      return false;
    } else if (params.purpose === 3 && !params.designType){ //  3
      message.warning("请选择承接设计类型");
      return false;
    }  else if (params.purpose === 3 && !params.adept){ //  3
      message.warning("请选择擅长领域");
      return false;
    }
    return true;

  }
  @action
  async personSubmit(userGuid){
    const params = this.collectPersonParams(userGuid);
    console.log('person', params);
    const isReq = this.doPersonCheck(params);
    if (isReq) {
      const { errorCode, result }: any = await reqSubmitPerson(params);
      return { status: errorCode === '200' && result.errorCode === 200, data: result }
    }else{
      return { status: false}
    }
  }
  @action
  async personEdit(userGuid){
    const params = this.collectPersonParams(userGuid);
    console.log('person edit', params);
    const isReq = this.doPersonCheck(params);
    if (isReq) {
      const { errorCode, result }: any = await reqEditPerson(params);
      return { status: errorCode === '200' && result.errorCode === 200, data: result }
    }else{
      return { status: false}
    }
  }
  @action
  clearPersonParams() {
    this.personParams = personInit;
    this.platformPurposeTab = 1;
    console.log('person', toJS(personInit));
  }
  /**
   * 获取个人信息
   * @param userGuid
   */
  @action
  async getUserInfo(userGuid: string) {
    const { errorCode, result }: any = await getUserInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      let arr: any[] = [''];
      this.personInfo = result.data;
      this.personParams = {
       ...this.personParams,
        userRealName: result.data.userRealName,
        contactInfo: result.data.contactInfo,
        companyName: result.data.companyName,
        interestCategory: result.data.interestCategory,
        worksWebsite: result.data.worksWebsite,
        worksUrl: result.data.worksUrl,
        designType: result.data.designType,
        adept: result.data.adept,
        hasCooperate: result.data.hasCooperate || 0,
        userDesc: result.data.userDesc,
      };

      this.personParams.purpose = result.data.purpose ? result.data.purpose : 1;
      this.personParams.purposeIp = _isArray(result.data.purposeIp)   ? result.data.purposeIp : arr;
      this.personParams.haveIp = result.data.haveIp ? result.data.haveIp : [{ name: '', ipType: '', authorizeType: '' }];
      console.log( result.data.purposeIp, this.personParams.purposeIp);
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: true };
    }
  }

  // 上传设计作品
  async uploadDesign(e, type, accountType, urlType){
    const file = e.target.files[0];
    const maxSize = 1024 * 1024 * 20;
    const reader = new  FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append('file', file);
      // if ( this.companyParams.worksUrl.length > 5){
      //   message.warning('文件最多不要超过5个！');
      //   return false
      // }
      if ( file.size > maxSize ){
        message.warning('文件过大，请重新上传！');
        return false
      }
      const { errorCode, result }: any = await uploadFile({ file: formData, type, urlType});
      if (+errorCode === 200) {
        const { errorCode: code, data, mapDate: { fileName } } = result;
        if (code === 200) {
          accountType === 2 ?
          this.companyParams.worksUrl = [...this.companyParams.worksUrl, { url: data, name: fileName }]
          :
          this.personParams.worksUrl = [...this.personParams.worksUrl, { url: data, name: fileName }];

          console.log('文件', result, data, this.worksUrlList);
        }else{
          message.warning('文件上传失败！');
        }
      }
    }

  }
  // 删除文件
  @action
  editWorksUrlList(v, accountType){
    switch (accountType) {
      case 2:
        this.companyParams.worksUrl = [...this.companyParams.worksUrl, ...v ];
        break;
      case 1:
        this.personParams.worksUrl = [...this.companyParams.worksUrl, ...v ];
        break
    }
  }

}

export default new UserInformationStore();
