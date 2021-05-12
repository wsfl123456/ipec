import { action, observable, toJS, } from "mobx";
import {
  editUserInformation,
  onCodeReg,
  resetPassword,
  RealNameAuthentication,
  setUserInformation,
  getMyUpdate, myRelease, deleteMyRelease, deleteMyUpdate,
  getUserInfo, companyCerfication, listCountry,
  getCompanyInfo, getMyCase, getMyCaseLabel, getRelationIP,
  getRelationBrand,
  listMainType,
  saveSchedue, scheduleList, updateSchedule, removeSchedule,
  getCaseDetail,
  getCompanyType, getMyFollow, invitationsList, receiveList, inviterRefuseUrl, inviterAccpetUrl,
  agreeReceive, refuseReceive, personList, orderExhibition, addExhibitionIP, cancelExhibitionIP,
  personalVrifiedinfo, companyVrifiedInfo, getLevelAmount
} from "@utils/api";
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import _isEmpty from 'lodash/isEmpty';

interface IPersonDataState {
  userRealName: string;
  papersPic: string;
  cardPic: string;
  papersPositivePic: string;
}

interface ICompanyinfoState {
  "businessLicenseNum": string, // 营业执照号码 ,
  "companyAbbreviation": string, // 公司简称 ,
  "companyAddress": string, // 公司地址 ,
  "companyCategory": string, // 公司类别 , ? GUID
  "companyCountries": string, // 公司国别 ,
  "companyDate": any, // 成立时间 ,
  "companyDesc": string, // 公司简介 ,
  "companyExhibition": string, // 公司风采 ,
  "companyIndustry": string, // 所属行业 ,
  "companyName": string, // 公司全称 ,
  "companyNature": string, // 公司性质 ,
  "companyProduct": string, // 公司产品 , ?GUID
  "companySize": number, // 公司规模,1,1-20人；2,21-50人；3,51-100人；4,101-500人 ；5,500人以上 ,
  "companyTelephone": string, // 联系电话 ,
  "companyType": string, // 公司类型:1出品公司，2发行公司，3代理方，4出版社，5投资公司,6宣发公司、7版权方、8品牌方、9授权方、10零售商、11服务商 ,
  "companyWebsite": string, // 公司网址 ,
  "email": string, // 邮箱 ,
  "exhibitionUrl": string, // 公司风采url ,
  "faxNumber": string, // 传真号 ,
  "faxArea": string, // 传真号带中文 ,
  "telephoneArea": string, // 手机区号带中文 ,
  "id": number, // 主键 ,
  "interestCategory": string, // 兴趣品类 , ?GUID
  "ipPicGuid": string, // 公司logo- ,
  "isFocus": number, // 是否关注，1是0否 ,
  "otherCategory": string, // 其他类别 ,
  "otherProduct": string, // 其他产品 ,
  "picUrl": string, // 头像url ,
  "pictureMaterial": string, // 证件图片材料，多张用逗号隔开 ,
  "realStatus": number, // 实名认证状态,1已实名，2未实名、3审核中 ,
  "userGuid": string, // 对应用户表guid ,
  "userLogin": string, // 登录名 ,
  "userPass": string, // 登录密码
}

interface IUserinfoState {
  academicTitle: string, // 职称
  country: string,
  province: string,
  address: string, // 住址
  awards: string, // 荣获奖项
  birthday: any, // 生日
  companyDepartment: string, // 公司部门
  companyGuid: string, // 所在公司
  companyName: string, // 公司名称
  education: any, // 学历
  fans: any, // 粉丝
  focus: any, // 关注
  graduationSchool: string, // 毕业院校
  id: number, // 主键
  interestCategory: string, // 兴趣品类
  isApply: string, // 是否申请公司
  mailbox: string, // 邮箱
  mailboxSettingsVisible: any, // 邮箱设置可见
  occupation: string, // 职位
  paperworkNumber: string, // 证件号
  paperworkType: any, // 证件类型
  phoneNumber: string, // 手机号
  phoneSettingsVisible: number, // 手机号设置可见
  picGuid: string, // 头像
  picUrl: string, // 头像URL
  pictureMaterial: string, // 证件图片素材
  qqNumber: string, // QQ号码
  qqSettingsVisible: any, // QQ号码 设置可见
  realStatus: number, // 实名认证装太
  sex: any, // 0:保密,1:男,2:女
  tags: string, // 标签
  userDesc: string, // 个人简介
  userGuid: string, // 对应用户表
  userLogin: string, // 登录名
  userNickname: string, // 昵称
  userPass: string, // 登陆密码
  userRealName: string, // 真实姓名
  wechatNumber: string, // 微信号
  wechatSettingsVisible: any  // 微信号码设置可见
}

interface ICompanyState {
  companyData: {
    ipPicGuid: string;
    companyName: string;
    companyType: any[];
    companySelected: any[];
    companyCountries: string;
    businessLicenseGuid: string;
    companyTelephone: string;
    companyMailbox: string;
    companyAddress: string;
    companyDesc: string;
    logoPic: string;
    businessLicense: string;
  }
}

interface IAddScheduleState {
  dateTitle?: string;
  remarks?: string;
  startEndTime?: Array<string>;
  infoHours?: string;
}

interface ISendState {
  userGuid?: string,
  invitationDate?: string,
  title?: string,
  invitationStatus?: number,
  currentPage: number,
  pageSize?: number,
}

/**
 * 收到邀约state
 */
interface IReceiveState {
  userGuid?: string,
  invitationStatus?: number,
  invitationDate?: string,
  title?: string,
  currentPage: number,
  pageSize?: number,
}

// 个人认证/ 企业认证
interface IPersonalVerification {
  papersPicGuid: string,
  papersPositivePicGuid: string,
  paperworkNumber: string,
  paperworkType: number,
  picGuid: string,
  pictureMaterial: string,
  sex: number,
  userGuid: string,
  userRealName: string,
  papersPic: any,

  companyName: string,
  businessLicenseNum: string,
  companyNature: string,
  companyAbbreviation: string,

}

// 发布的IP
interface IReleaseIP {
  userGuid: string;
  ipName: string;
  ipTypeSuperiorNumber: string | number;
  ipCheckStatus: string | number;
  currentPage: number;
  pageSize: number;
}

// 修改的IP
interface IUpdateIP {
  userGuid: string;
  ipName: string;
  ipTypeSuperiorNumber: string | number;
  checkStatus: string | number;
  type: number;
  currentPage: number;
  pageSize: number;

}

// 发布的案例和发布的IP需求
interface ICaseAndNeed {
  userGuid: string;
  postTitle: string;
  postType: string | number;
  postStatus: string | number;
  type: number | string;
  currentPage: number;
  pageSize: number;

}

class UserStore {
  @observable
  verification: IPersonalVerification = {
    papersPicGuid: '',
    papersPositivePicGuid: '',
    paperworkNumber: '',
    paperworkType: 1,
    picGuid: '',
    pictureMaterial: '', // 证件guid, 以逗号拼接
    sex: 0,
    userGuid: '',
    userRealName: '',
    papersPic: [], // 图片url,以逗号拼接

    companyName: '',
    businessLicenseNum: '',
    companyNature: '',
    companyAbbreviation: '',
  };

  @observable releaseParams: IReleaseIP = {
    userGuid: '',
    ipName: '',
    ipTypeSuperiorNumber: '',
    ipCheckStatus: '',
    currentPage: 1,
    pageSize: 20,
  };
  @observable updateParams: IUpdateIP = {
    userGuid: '',
    ipName: '',
    ipTypeSuperiorNumber: '',
    checkStatus: '',
    type: 1, // 1:IP内容,2:商务资料
    currentPage: 1,
    pageSize: 20,
  };
  @observable myUpdateList: object[];
  @observable myReleaseList: object[];
  @observable releaseFlag: boolean = true;
  @observable release_noMore: boolean = false;
  @observable updateFlag: boolean = true;
  @observable update_noMore: boolean = false;

  // 发布的案例
  @observable caseAndNeedParams: ICaseAndNeed = {
    userGuid: '',
    postTitle: '',
    postStatus: '',
    postType: 1,
    type: '',
    currentPage: 1,
    pageSize: 20
  };

  @observable myCaseList: object[];
  @observable myCaseLabel: object[];
  @observable caseFlag: boolean = true;

  @observable relationIp: object[];
  @observable relationBrand: object[];
  @observable total: number;

  @observable caseDetail: any;
  //  发布的IP需求
  @observable myNeedList: object[];
  @observable needFlag: boolean = true;
  @observable needTotal: number;

  @observable myFocusCompany: object[];
  @observable myFocusPersonal: object[];
  @observable myFocusIp: object[];

  @observable getReceiveList: object[];
  @observable getPersonList: object[];
  @observable gradeData: object[];
  @observable getAgreeReceive: any;
  @observable getRefuseReceive: any;
  @observable realStatus: number = 0;
  @observable totalInvited: number;
  @observable interestDataList: object[] = [];
  @observable personInfo: IUserinfoState = {
    academicTitle: "", // 职称
    country: "",
    province: "",
    address: "", // 住址
    awards: "", // 荣获奖项
    birthday: null, // 生日
    companyDepartment: "", // 公司部门
    companyGuid: "", // 所在公司
    companyName: "", // 公司名称
    education: null, // 学历
    fans: null, // 粉丝
    focus: null, // 关注
    graduationSchool: "", // 毕业院校
    id: 0, // 主键
    interestCategory: "", // 兴趣品类
    isApply: "", // 是否申请公司
    mailbox: "", // 邮箱
    mailboxSettingsVisible: null, // 邮箱设置可见
    occupation: "", // 职位
    paperworkNumber: "", // 证件号
    paperworkType: null, // 证件类型
    phoneNumber: "", // 手机号
    phoneSettingsVisible: 0, // 手机号设置可见
    picGuid: "", // 头像
    picUrl: "", // 头像URL
    pictureMaterial: "", // 证件图片素材
    qqNumber: "", // QQ号码
    qqSettingsVisible: null, // QQ号码 设置可见
    realStatus: null, // 实名认证装太
    sex: null, // 0:保密,1:男,2:女
    tags: "", // 标签
    userDesc: "", // 个人简介
    userGuid: "", // 对应用户表
    userLogin: "", // 登录名
    userNickname: "", // 昵称
    userPass: "", // 登陆密码
    userRealName: "", // 真实姓名
    wechatNumber: "", // 微信号
    wechatSettingsVisible: null  // 微信号码设置可见
  };
  @observable companyInfo: ICompanyinfoState = {
    businessLicenseNum: '', // 营业执照号码 ,
    companyAbbreviation: '', // 公司简称 ,
    companyAddress: '', // 公司地址 ,
    companyCategory: '', // 公司类别 ,
    companyCountries: '', // 公司国别 ,
    companyDate: null, // 成立时间 ,
    companyDesc: '', // 公司简介 ,
    companyExhibition: '', // 公司风采 ,
    companyIndustry: '', // 所属行业 ,
    companyName: '', // 公司全称 ,
    companyNature: '', // 公司性质 ,
    companyProduct: '', // 公司产品 ,
    companySize: 1, // 公司规模,1,1-20人；2,21-50人；3,51-100人；4,101-500人 ；5,500人以上 ,
    companyTelephone: '', // 联系电话 ,
    companyType: '', // 公司类型:1出品公司，2发行公司，3代理方，4出版社，5投资公司,6宣发公司、7版权方、8品牌方、9授权方、10零售商、11服务商 ,
    companyWebsite: '', // 公司网址 ,
    email: '', // 邮箱 ,
    exhibitionUrl: '', // 公司风采url ,
    faxNumber: '', // 传真号 ,
    faxArea: '', // 传真号区号 带中文 ,
    telephoneArea: '', // 手机区号带中文 ,
    id: 0, // 主键 ,
    interestCategory: '', // 兴趣品类 ,
    ipPicGuid: '', // 公司logo- ,
    isFocus: 0, // 是否关注，1是0否 ,
    otherCategory: '', // 其他类别 ,
    otherProduct: '', // 其他产品 ,
    picUrl: '', // 头像url ,
    pictureMaterial: '', // 证件图片材料，多张用逗号隔开 ,
    realStatus: null, // 实名认证状态,1已实名，2未实名、3审核中 ,
    userGuid: '', // 对应用户表guid ,
    userLogin: '', // 登录名 ,
    userPass: '', // 登录密码
  };
  @observable companyType: any[];

  @observable countryData: object[];

  @observable personData: IPersonDataState = {
    userRealName: '',
    papersPic: '',
    cardPic: '',
    papersPositivePic: '',
  };

  @observable companyData: ICompanyState = {
    companyData: {  // 公司认证字段
      ipPicGuid: '',
      companyName: '',
      companyType: [],
      companySelected: [
        { name: "版权方", id: 7, },
        { name: "代理方", id: 3, },
        { name: "品牌方", id: 8, },
        { name: "授权方", id: 9, },
        { name: "零售商", id: 10, },
        { name: "服务商", id: 11, },
      ],
      companyCountries: '',
      businessLicenseGuid: '',
      companyTelephone: '',
      companyMailbox: '',
      companyAddress: '',
      companyDesc: '',
      logoPic: '',
      businessLicense: '',
    }
  };

  /**
   * balance.xue  添加日程参数
   */
  @observable scheduleParams: IAddScheduleState = {
    dateTitle: '',
    remarks: '',
    startEndTime: [],
    infoHours: '',
  };

  @observable scheduleData = [];
  @observable invitationData: object[];
  /**
   * balance.xue  发出邀约参数
   */
  @observable sendParams: ISendState = {
    userGuid: '',
    invitationDate: '',
    title: '',
    invitationStatus: 0,
    currentPage: 1,
    pageSize: 10,
  };
  @observable sendIsLoading: boolean;

  /**
   * 收到邀约参数
   */
  @observable receiveParams: IReceiveState = {
    userGuid: '',
    invitationStatus: undefined,
    invitationDate: '',
    title: '',
    currentPage: 1,
    pageSize: 10
  };

  @observable ReceiveIsLoading: boolean;
  // 预测数据状态
  @observable calculateFlag: boolean = true;

  @action
  changeSchedule(params: IAddScheduleState) {
    this.scheduleParams = { ...this.scheduleParams, ...params };
  }

  @action
  async userInformation({ code, email, mobile, receiverType, userGuid }: { code: string, email: string, mobile: string, receiverType: number, userGuid: string }) {
    const { errorCode, result = {} }: any = await editUserInformation({ code, email, mobile, receiverType, userGuid });
    if (errorCode === "200" && result.errorCode === 200) {
      return { result, request: true };
    } else {
      return { result, request: false };
    }
  }

  @action
  async getEditCode({ userLogin, receiverType, sendType }) {
    const { errorCode, result = {} }: any = await onCodeReg({ userLogin, receiverType, sendType });
    if (errorCode === "200" && result.errorCode === 200) {
      return { message: result.errorMsg, request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  @action
  async updataPassword({ oldUserPass, userGuid, userPass }) {
    const { errorCode, result = {} }: any = await resetPassword({ oldUserPass, userGuid, userPass });
    if (errorCode === "200" && result.errorCode === 200) {
      return { request: true };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false };
    }
  }

  @action
  getlistMainType = async () => {
    const { errorCode, result }: any = await listMainType();
    if (errorCode === "200") {
      this.interestDataList = result;
    }
  };

  // 企业和个人认证
  @action
  changeVerification(params: IPersonalVerification) {
    this.verification = { ...this.verification, ...params };
  }

  // 个人认证信息
  @action
  async getPersonalVerification(id) {
    const { result: { data, errorCode: eCode }, errorMessage }: any = await personalVrifiedinfo(id);
    if (eCode === 200) {
      this.verification = data;
    } else {
      return { message: errorMessage };
    }
  }

// 企业认证信息
  @action
  async getCompanyVerification(id) {
    const { result: { data, errorCode } }: any = await companyVrifiedInfo(id);
    if (errorCode === 200) {
      this.verification = data;
    }
  }

  /**
   * 实名认证
   * @param papersPicGuid
   * @param papersPositivePicGuid
   * @param picGuid
   * @param userGuid
   * @param userRealName
   * @constructor
   */
  @action
  async RealAuthentication(
    { papersPicGuid, papersPositivePicGuid, picGuid, userGuid, userRealName }:
      { papersPicGuid: string, papersPositivePicGuid: string, picGuid: string, userGuid: string, userRealName: string }
  ) {
    const { errorCode, result = {} }: any = await RealNameAuthentication({
      papersPicGuid, papersPositivePicGuid,
      picGuid,
      userGuid,
      userRealName
    });
    if (errorCode === "200" && result.errorCode > 0) {
      return { result: "审核信息成功提交，请耐心等待!", request: true };
    } else {
      return { result: result.errorMsg, request: false };
    }
  }

  @action
  async setInformation({ companyGuid, companyName, companyType, desc, job, picGuid, userGuid, userNickname, userRealName }) {
    const { errorCode, result = {} }: any = await setUserInformation({
      companyGuid,
      companyName,
      companyType,
      desc,
      job,
      picGuid,
      userGuid,
      userNickname,
      userRealName
    });
    if (errorCode === "200" && result.errorCode === 200) {
      return { result, request: true };
    } else if (result.errorCode < 0) {
      return { result, request: false };
    }
  }

  // 修改的IP
  @action
  changeUpdateParams(params) {
    this.updateParams = { ...this.updateParams, ...params };
  }

  @action
  setMyUpdateFlag(param) {
    this.updateFlag = param;
  }

  @action
  async getUpdate() {
    const { userGuid, ipName, ipTypeSuperiorNumber, type, checkStatus, currentPage, pageSize } = this.updateParams;
    this.setMyUpdateFlag(false);
    const { errorCode, result }: any = await getMyUpdate({
      userGuid, ipName, ipTypeSuperiorNumber, type, checkStatus, currentPage, pageSize
    });
    if (errorCode === '200') {
      currentPage === 1 ? this.myUpdateList = result : this.myUpdateList = [...this.myUpdateList, ...result];

      if (!_isEmpty(result) && result.length < pageSize) {
        this.setMyUpdateFlag(false);
        this.update_noMore = true;
      }
      // this.setMyUpdateFlag(_isEmpty(result));
    }
  }

  /**
   * 我发布的IP
   * ipCheckStatus 审核状态：1审核通过，2审核不通过，3审核中
   */

  @action
  changeReleaseParams(params: IReleaseIP) {
    this.releaseParams = { ...this.releaseParams, ...params };
  }

  @action
  setMyReleaseFlag(param) {
    this.releaseFlag = param;
  }

  @action
  async myRelease() {
    const { userGuid, ipTypeSuperiorNumber, ipCheckStatus, ipName, currentPage, pageSize } = this.releaseParams;
    this.setMyReleaseFlag(false);
    const { errorCode, result }: any = await myRelease({
      userGuid,
      ipTypeSuperiorNumber,
      ipCheckStatus,
      ipName,
      currentPage,
      pageSize,
    });
    if (errorCode === '200') {
      currentPage === 1 ? this.myReleaseList = result : this.myReleaseList = [...this.myReleaseList, ...result];

      if (!_isEmpty(result) && result.length < pageSize) {
        this.setMyReleaseFlag(false);
        this.release_noMore = true;
      }
      // this.setMyReleaseFlag(_isEmpty(result));
    }
  }

  //  删除我发布的IP
  @action
  async deleteMyRelease(params) {
    const { errorCode, result: { errorMsg, errorcode: eCode }, errorMessage }: any = await deleteMyRelease(params);
    if (errorCode === '200') {
      if (eCode < 0) {
        return { msg: errorMsg, show: true };
      }
      return { msg: errorMsg, show: false, };
    } else {
      return { msg: errorMessage, show: true };
    }
  }

  @action
  async deleteMyUpdate(params) {
    const { errorCode, result: { errorMsg, errorCode: eCode }, errorMessage }: any = await deleteMyUpdate(params);
    if (errorCode === '200') {
      if (eCode < 0) {
        return { msg: errorMsg, show: true };
      }
      return { msg: errorMsg, show: false, };
    } else {
      return { msg: errorMessage, show: true };
    }
  }

  /**
   * 发布的案例/ 发布的IP需求
   * @param params  postType:1案例，4需求。
   */

  @action
  changeCaseAndNeed(params) {
    this.caseAndNeedParams = { ...this.caseAndNeedParams, ...params };
  }

  @action
  async getMyCase() {
    const {
      userGuid, postType, postStatus,
      postTitle, type, currentPage, pageSize
    } = this.caseAndNeedParams;
    this.caseFlag = true;
    this.needFlag = true;
    const { errorCode, result: { data } }: any = await getMyCase({
      userGuid, postType,
      postStatus, postTitle,
      type, currentPage, pageSize,
    });
    if (errorCode === '200') {

      if (postType === 1) {
        currentPage === 1 ? this.myCaseList = data : this.myCaseList = [...this.myCaseList, ...data];
        if (data.length < pageSize) {
          this.caseFlag = false;
        }
        this.caseFlag = _isEmpty(data);

      } else if (postType === 4) {
        currentPage === 1 ? this.myNeedList = data : this.myNeedList = [...this.myNeedList, ...data];
        if (data.length < pageSize) {
          this.needFlag = false;
        }
        this.needFlag = _isEmpty(data);
      }

    }
  }

  @action
  async getMyCaseLabel(params) {
    const { errorCode, result }: any = await getMyCaseLabel(params);
    if (errorCode === '200') {
      this.myCaseLabel = result;
    }
  }

  @action
  async getRelationIP(params) {
    const { errorCode, result }: any = await getRelationIP(params);
    if (errorCode === '200') {
      this.relationIp = result;
    }
  }

  @action
  async getRelationBrand(params) {
    const { errorCode, result }: any = await getRelationBrand(params);
    if (errorCode === '200') {
      this.relationBrand = result;
    }
  }

  changeDetail(params) {
    this.caseDetail = { ...this.caseDetail, ...params };
  }

  /**
   * 编辑发布的案例 获取发布案例详情数据
   */
  @action
  async getCaseDetail(params) {
    const { errorCode, result }: any = await getCaseDetail(params);
    if (errorCode === '200') {
      this.caseDetail = result.data;
    }
  }

  /**
   * 获取 企业信息
   * （类型：1企业类别、2企业经营业务、3所属行业、
   * 4企业规模、5企业性质、6证件类型、7参展目的、8意向参展面积）
   */
  @action
  async getCompanyType(params) {
    const { errorCode, result }: any = await getCompanyType(params);
    if (errorCode === '200') {
      this.companyType = result;
    }
  }

  /**
   * 我的关注-企业，个人，IP,
   * 路径: user/6
   */
  @action
  async getMyFollow(params) {
    const { errorCode, result }: any = await getMyFollow(params);
    if (errorCode === '200') {
      this.myFocusCompany = result.data.myFocusCompany;
      this.myFocusPersonal = result.data.myFocusPersonal;
      this.myFocusIp = result.data.myFocusIp;
    }
  }

  @action
  async receiveInvitedChange(params: IReceiveState) {
    this.receiveParams = { ...this.receiveParams, ...params };
    await this.receiveList(this.receiveParams);
  }

  /**
   * 获取收到邀约列表信息
   */
  @action
  async receiveList(receiveParams) {
    const { userGuid, invitationStatus, invitationDate, currentPage, pageSize, title } = receiveParams;
    this.ReceiveIsLoading = true;
    const { errorCode, result }: any = await receiveList({
      userGuid, invitationStatus, invitationDate, currentPage, pageSize, title
    });
    if (errorCode === '200') {
      if (currentPage === 1) {
        this.getReceiveList = result.data;
      } else {
        this.getReceiveList = _uniqWith(this.getReceiveList.concat(result.data), _isEqual);
      }
      if (result.data.length === 0 || result.data.length < pageSize) {
        this.ReceiveIsLoading = false;
      }
    } else {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * 被邀约人同意
   */
  @action
  async agreeReceive(params) {
    const { errorCode, result }: any = await agreeReceive(params);
    if (errorCode === '200') {
      this.getAgreeReceive = result;
    }
  }

  /**
   * 被邀约人拒绝
   */
  @action
  async refuseReceive(params) {
    const { errorCode, result }: any = await refuseReceive(params);
    if (errorCode === '200') {
      this.getRefuseReceive = result;
    }
  }

  /**
   * 展会公司人员列表
   */
  @action
  async personList(params) {
    const { errorCode, result }: any = await personList(params);
    if (errorCode === '200') {
      this.getPersonList = result;
    }
  }

  @action
  setUserinfo = (param) => {
    this.personInfo = { ...this.personInfo, ...param };
  };

  @action
  setCompanyinfo = async (param) => {
    this.companyInfo = { ...this.companyInfo, ...param };
  };

  /**
   * 获取个人信息
   * @param userGuid
   */
  @action
  async getUserInfo(userGuid: string) {
    const { errorCode, result }: any = await getUserInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.personInfo = result.data;
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: true };
    }
  }

  @action
  async reqPersonInfo(userGuid: string) {
    const { errorCode, result }: any = await getUserInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.setUserinfo(result.data);
      return result.data;
    }
  }

  @action
  async reqCompanyInfo(userGuid: string) {
    const { errorCode, result }: any = await getCompanyInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.setCompanyinfo(result.data);
      return result.data;
    }
  }

  /**
   * 获取公司信息
   * @param userGuid
   */
  @action
  async getCompanyInfo(userGuid: string) {
    const { errorCode, result }: any = await getCompanyInfo(userGuid);
    if (errorCode === "200" && result.errorCode === 200) {
      this.companyInfo = result.data;
      return { message: result.errorMsg, request: true, };
    } else if (result.errorCode < 0) {
      return { message: result.errorMsg, request: false, };
    }
  }

  @action
  async setStatus(params: ICompanyState) {
    // const { companyData: { params } } = this.companyData;
    this.companyData['companyType'] = { ...params };
  }

  /**
   * 企业认证
   * @param params
   */
  @action
  async companyCerfiticate(params) {
    const { errorCode, result }: any = await companyCerfication(params);
    if (errorCode === "200") {
      return { message: result.errorMsg, request: true };
    } else {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * 国别
   */
  @action
  async listCountry() {
    const { errorCode, result }: any = await listCountry();
    if (errorCode === "200") {
      this.countryData = result;
    }
  }

  /**
   *  blance.xue
   *  我的日程- 添加日程
   */
  @action
  async addSchedules(params) {
    const { errorCode, result, errorMessage }: any = await saveSchedue(params);
    if (errorCode === "200") {
      if (result.errorCode < 0) {
        return { message: result.errorMsg, request: true, close: false };
      } else if (result.errorCode === 200) {
        return { message: result.errorMsg, request: true, close: true };
      }
      return { message: result.errorMsg, request: false };
    } else {
      return { message: errorMessage, request: false };
    }
  }

  /**
   * 日程列表
   * @param params
   */
  @action
  async scheduleEvents(params) {
    const { errorCode, result, errorMessage }: any = await scheduleList(params);
    if (errorCode === "200") {
      this.scheduleData = result.map((item) => {
        if (item.id === null) {
          return {
            id: item.vid,
            color: "#ced4da",
            picUrl: item.picUrl,
            title: "(待定)" + item.title,
            start: item.scheduleBeginTime,
            end: item.scheduleEndTime,
            type: item.scheduleType, // 日程类型：0代表日程，1代表邀约 ,
            head: item.picUrl,
            post: item.occupation,
            company: item.companyDepartment,
            address: item.remarks,
            reason: item.matterExplain,
            invitationGuid: item.invitationGuid, // 邀约Guid
            infoHours: item.reminderTime, // 提醒时间
          };
        } else {
          return {
            id: (item.id).toString(),
            color: '#6248ff',
            picUrl: item.picUrl,
            title: item.title,
            start: item.scheduleBeginTime,
            end: item.scheduleEndTime,
            type: item.scheduleType, // 日程类型：0代表日程，1代表邀约 ,
            head: item.picUrl,
            post: item.occupation,
            company: item.companyDepartment,
            address: item.remarks,
            reason: item.matterExplain,
            invitationGuid: item.invitationGuid, // 邀约Guid
            infoHours: item.reminderTime, // 提醒时间
          };
        }

      });
      // console.log(toJS(this.scheduleData));
      localStorage.setItem('scheduleData', JSON.stringify(toJS(this.scheduleData)));
    } else {
      return { message: errorMessage, request: false };
    }
  }

  /**
   * blance.xue
   * 编辑日程
   * @param params
   */
  @action
  async editSchedule(params) {
    const { errorCode, result: { errorMsg, errorCode: code, }, errorMessage }: any = await updateSchedule(params);
    if (errorCode === '200') {
      if (code < 0) {
        return { message: errorMsg, request: true, close: false };
      } else if (code === 200) {
        return { message: errorMsg, request: true, close: true };
      }
      return { message: errorMsg, request: false };
    } else {
      return { message: errorMessage, flag: false };
    }
  }

  /**
   * blance.xue
   * 删除日程
   * @param param
   */
  @action
  async removeSchedule(param) {
    const { errorCode, result }: any = await removeSchedule(param);
    if (errorCode === '200') {
      console.log(result);
    } else {
      return { message: result.errorMsg, request: false };
    }
  }

  /**
   * blance.xue
   * 发出的邀请列表
   */
  @action
  async invitationStatusChange(params: ISendState) {
    this.sendParams = { ...this.sendParams, ...params };
    await this.getInvitationList(this.sendParams);
  };

  @action
  async getInvitationList({ userGuid, invitationDate, title, invitationStatus, currentPage = 1, pageSize = 10 }: ISendState) {
    this.sendIsLoading = true;
    const { errorCode, result: { data: result, currentPage: current }, errorMessage }: any = await invitationsList({
      userGuid,
      invitationDate,
      title,
      invitationStatus,
      currentPage,
      pageSize,
    });
    if (errorCode === '200') {
      if (!_isEmpty(result)) {
        current === 1 ? this.invitationData = result : this.invitationData = _uniqWith(this.invitationData.concat(result), _isEqual);
      }
      // || current >= totalPage
      if (_isEmpty(result) || result.length < pageSize) {
        this.sendIsLoading = false;
      }
    } else {
      return { message: errorMessage, request: false };
    }
  }

  /**
   * blance.xue
   * 邀请人拒绝原因
   */
  @action
  async inviterRefuse(params) {
    const { errorCode, result, errorMessage }: any = await inviterRefuseUrl(params);
    if (errorCode === '200') {
      return result;
    } else {
      return { message: errorMessage };
    }
  }

  /**
   * blance.xue
   * 邀请人接受
   */
  @action
  async inviterAccpect({ invitationGuid }: { invitationGuid: string }) {
    const { errorCode, result: { errorMsg }, errorMessage }: any = await inviterAccpetUrl({
      invitationGuid
    });
    if (errorCode === '200') {
      return { message: errorMsg, request: true };
    } else {
      return { message: errorMessage, request: true };
    }
  }

  /**
   * 预定展位
   */
  @action
  async boothReservation(params) {
    const { result: { errorMsg }, errorCode }: any = await orderExhibition(params);
    if (errorCode === "200") {
      return { message: errorMsg };
    } else {
      return { message: errorMsg };
    }
  }

  /**
   * 添加参展IP
   */
  async addExhibitionIPs(params) {
    const { result: { errorCode: eCode, errorMsg, }, errorMessage, errorCode }: any = await addExhibitionIP(params);
    if (errorCode === "200") {
      if (eCode < 0) {
        return { message: errorMsg, isShow: false };
      }
      return { message: errorMsg, isShow: true };
    } else {
      return { message: errorMessage, isShow: true };

    }
  }

  /**
   * 删除参展IP
   */
  async deleteExhibitionIPs(params) {
    const { result: { errorCode: eCode, errorMsg, }, errorMessage, errorCode }: any = await cancelExhibitionIP(params);
    if (errorCode === "200") {
      if (eCode < 0) {
        return { message: errorMsg, isShow: false };
      }
      return { message: errorMsg, isShow: true };
    } else {
      return { message: errorMessage, isShow: true };

    }
  }

  /**
   *  Ip数据 会员等级数据
   */
  async getGradeData() {
    const { errorCode, result }: any = await getLevelAmount({});
    if (errorCode === '200') {
      this.gradeData = result;
    }
  }

  /**
   * 预测数据状态 true:列表页，false:结果页
   */
  @action
  setCalculateStatus(param: boolean) {
    this.calculateFlag = param;
  }
}

export default new UserStore();
