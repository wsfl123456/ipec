import * as React from "react";
import "@assets/scss/user.scss";
import { inject, observer } from "mobx-react";
import Toast from "@components/toast";
import ScrollTop from '@components/scroll-top';
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import { listCountry, savePic, setUserInformation } from '@utils/api';
import Alert from '@components/alert';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import ic_user from '@assets/images/user.svg';
import silverNoCircle from '@assets/images/user/silver--no_circle.png';
import filterIcon from '@assets/images/user/vip/filter_icon.png';
import rankIcon from '@assets/images/user/vip/rank_icon.png';
import comparedIcon from '@assets/images/user/vip/compared_icon.png';
import ic_attestation_pr from '@assets/images/user/ic_yrz.svg';
import ic_hjhy from '@assets/images/user/ic_hjhy.svg';
import ic_zshy from '@assets/images/user/ic_zshy.svg';
import test from '@assets/images/user/test.png';
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import {
  PublishedIP,
  PubCase,
  MyConcern,
  MySchedule,
  PersonalData,
  CompanyData,
  Certific,
  ReInvited,
  EnterpriseStaff,
  Invitations,
  BoothReservation,
  VipPage,
  PublishedIpNeeds,
  ForecastData,
  CalculateData, CalculateResult, ShippingAddress,
  UserInformation, BuyerOrder,

} from '@pages/user/components';
import UserVipCard from '@pages/user/components/UserVipCard'
import UserOrder from '@pages/user/components/UserOrder'
import UserShippingAddress from '@pages/user/components/UserShippingAddress'

import moment from 'moment';
import _isNumber from 'lodash/isNumber';

const { Option } = Select;
let children = [];

/**
 * realStatus 实名认证状态  1已实名，2未实名、3审核中 ,
 */

interface IUesrState {
  nextNum: Number | string;
  childNum: Number;
  btnNum: Number;
  emailNumber: any;
  emailCode: any;
  phoneNuber: any;
  phoneCode: any;
  Verification: {
    type: string,
    number: number,
  };
  updatePassword: { oldUserPass: string, userPass: string, userGuid: string, userPassAgain: string };
  RealName: {
    nikeName: string,
    userRealName: string,
    realname: string,
    companyname: string,
    companytype: string,
    dsc: string,
    positions: string,
    email: string,
    code: string,
    file: string,
    cardFile: string,
    cardFanFile: string,
    userPicUrl: string,
    userFile: string,
  };
  iconShow: boolean;
  iconShowNext: boolean;
  show: boolean;
  alertShow: boolean;
  expireShow: boolean;
  message: string;
  expireMessage: string;
  alertMessage: string;
  checkStatus: string;
  papersPicGuid: string;
  papersPositivePicGuid: string;
  pickGuid: string;
  picGuid: string;
  companyGuid: string;
  realStatus: number;
  companyRealStatus: number;
  isEditDate: boolean;
  personRealStatus: number;
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
  reservationState: boolean;
  specialShow: boolean;
  specialMessage: string;
}

@inject('user', 'update', 'login', 'ipSearch')
@observer
export default class User extends React.Component<IProps, IUesrState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isEditDate: false,
      iconShow: false,
      iconShowNext: false,
      Verification: {
        type: '',
        number: 0,
      },
      btnNum: 1, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      childNum: 0, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      nextNum: 1, // 1.我的发布 2.个人信息 3.账号安全，4.企业信息
      phoneNuber: '', // 修改的手机号
      phoneCode: '', // 修改的手机号验证e
      emailNumber: '',
      emailCode: '', // 修改的邮箱验证码
      message: "",
      expireMessage: '',
      show: false,
      alertMessage: "",
      alertShow: false,
      expireShow: false,
      updatePassword: { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' }, // 更新密码
      RealName: {
        nikeName: '',
        userRealName: '',
        realname: '',
        companyname: '',
        companytype: '',
        dsc: '',
        positions: '',
        email: '',
        code: '',
        file: '',
        cardFile: '',
        cardFanFile: '',
        userPicUrl: '',
        userFile: ''
      },
      companyGuid: '',
      papersPicGuid: '',
      papersPositivePicGuid: '',
      picGuid: '',
      pickGuid: '',
      checkStatus: '',
      realStatus: 0,
      companyRealStatus: 0,
      personRealStatus: 0,
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
      },

      reservationState: false,
      specialShow: false,
      specialMessage: '',
    };

  }

  async componentDidMount() {
    document.title = "IP二厂-个人中心";
    const { match: { params }, user, login, ipSearch } = this.props;
    let type = Number(params['type']);
    ipSearch.clearKeyword();
    if (login.userInfo.userAttribute === 1) {
      await this.getPersonInfo();
    } else {
      await this.getCompanyInfo();
    }

    if (type === 4) {
      await user.listCountry();
    }
    user.setCalculateStatus(true);

  }

  async componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IUesrState>, snapshot?: any) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const type = Number(this.props.match.params['type']);
      if (type === 1) {
      } else if (type === 2) {
        await this.getPersonInfo();
      } else if (type === 4) {
        await this.getCompanyInfo();
        await User.listCountry();
      } else if (type === 7) {
        await this.scheduleEventsFun();
      }
    }

  }

  /**
   * 日历列表
   */
  async scheduleEventsFun() {
    const { user } = this.props;
    const userGuid = this.props.login.userInfo['userGuid'] || null;
    const params = {
      userGuid,
      displayType: 0,
      chooseDate: moment().format('YYYY-MM-DD'),
    };
    await user.scheduleEvents(params);
  };

  static async listCountry() {
    const { errorCode, result }: any = await listCountry();
    if (errorCode === "200") {
      for (let item of result) {
        children = _uniqWith([...children,
          <Option value={item.resourceValue}
                  key={item.id + item.createUserGuid}>{item.resourceValue}</Option>], _isEqual);
      }
    }
  }

  async getDataInfo(userAttribute) {
    if (userAttribute === 1) {
      await this.getPersonInfo();
    } else if (userAttribute === 2) {
      // await User.getCompanyInfo(this.state.userinfo.userGuid)
      await this.getCompanyInfo();
    }
  }

  /**
   * 回显个人信息-账号认证
   */
  async getPersonInfo() {
    const { user, login } = this.props;
    const { personInfo } = user;
    const person = await user.reqPersonInfo(login.userInfo.userGuid);
    const userSession = { ...login.userInfo, ...person };
    localStorage.setItem('user', JSON.stringify(userSession));
    login.updateUser(userSession);
    const { RealName } = this.state;
    RealName.userRealName = personInfo.userRealName;
    RealName.file = personInfo.cardPic;
    RealName.cardFile = personInfo.papersPositivePic;
    RealName.cardFanFile = personInfo.papersPic;
    let papersPicGuid = personInfo.papersPicGuid;
    let papersPositivePicGuid = personInfo.papersPositivePicGuid;
    let picGuid = personInfo.picGuid;
    this.setState({
      RealName,
      papersPicGuid,
      papersPositivePicGuid,
      picGuid
    });
  }

  /**
   * 回显公司信息-账号认证
   */
  async getCompanyInfo() {
    const { user, login } = this.props;
    let companyInfo = await user.reqCompanyInfo(login.userInfo.userGuid);

    let companyRealStatus = companyInfo.realStatus;
    if (companyRealStatus === 1) {
      let userSession = { ...login.userInfo, ...companyInfo };
      localStorage.setItem('user', JSON.stringify(userSession));
      login.updateUser(userSession);
    }
    if (!_isEmpty(companyInfo)) {
      this.setState({
        companyData: {
          ipPicGuid: companyInfo.ipPicGuid,
          companyName: companyInfo.companyName,
          companyType: companyInfo.companyType.split(','),
          companySelected: [
            { name: "版权方", id: 7, },
            { name: "代理方", id: 3, },
            { name: "品牌方", id: 8, },
            { name: "授权方", id: 9, },
            { name: "零售商", id: 10, },
            { name: "服务商", id: 11, },
          ],
          companyCountries: companyInfo.companyCountries,
          businessLicenseGuid: companyInfo.businessLicenseGuid,
          companyTelephone: companyInfo.companyTelephone,
          companyMailbox: companyInfo.companyMailbox,
          companyAddress: companyInfo.companyAddress,
          companyDesc: companyInfo.companyDesc,
          logoPic: companyInfo.logoPic,
          businessLicense: companyInfo.businessLicense,
        },
      });
    }
  }

  /**
   * 上传图片
   * @param e
   * @param field
   * @param picType 1首页幻灯片，2ip海报图，3个人头像/企业logo，4名片，5证件照，6ppt页面，7 营业执照
   * @param el
   */
  uploadImg = async (e, field, picType, el) => {
    const { user, login } = this.props;
    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 10;
    let reader = new FileReader();
    let _RealName = this.state.RealName;
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, picType };
      if (file.size > max_size) {
        this.setState({ alertMessage: '图片过大,请重新上传！', alertShow: true });
        return;
      } else {
        const { errorCode, result = {} }: any = await savePic(params);
        if (errorCode === '200' && result.errorCode === 200) {
          if (picType === 7 || field === "ipPicGuid") {
            let companyData = this.state.companyData;
            companyData[el] = e.target['result'];
            companyData[field] = result.data;
            this.setState({
              companyData,
            });
          } else {
            _RealName[el] = e.target['result'];
            _RealName[field] = result.data;
            this.setState({
              RealName: _RealName
            });
            // 修改个人信息-头像
            if (field === "userPicUrl") {
              const params = {
                userGuid: login.userInfo.userGuid,
                picGuid: _RealName.userPicUrl,
              };
              const { errorCode, result }: any = await setUserInformation(params);
              if (errorCode === "200" && result.errorCode === 200) {
                _RealName.userPicUrl = result.data;
                await user.getUserInfo(login.userInfo.userGuid);
                let picUrl = result.data;
                let userinfoData = { ...login.userInfo, picUrl };

                localStorage.setItem('user', JSON.stringify(userinfoData));
                login.updateUser(userinfoData);
                this.setState({
                  RealName: _RealName,
                  message: result.errorMsg,
                  show: true,
                });
              } else {
                this.setState({
                  message: result.errorMsg,
                  show: true,
                });
              }
            }
          }
          // 动态设置setState 的值
          const data = {};
          data[field] = result.data;
          this.setState(data);
          return true;
        } else {
          this.setState({
            show: true,
            message: result.errorMsg
          });
        }
      }

    };
  };

  // 获取验证码
  async editCode({ type }) {
    /**
     * 获取验证码
     * @param userLogin 登陆名
     * @param receiverType  1手机 2邮箱
     * @param sendType    1注册 2修改密码 3实名认证 4修改绑定
     */
    let param = {
        userLogin: "",
        receiverType: 0,
        sendType: 0
      },
      validation = null,
      _this = this;
    if (type === 'editPhone') {
      validation = _this.state.phoneNuber;
    } else if (type === 'editEmail') {
      validation = _this.state.emailNumber;
    }
    switch (type) {
      case 'editPhone':
        param.receiverType = 1;
        param.sendType = 4;
        param.userLogin = _this.state.phoneNuber;
        break;
      case 'editEmail':
        param.receiverType = 2;
        param.sendType = 4;
        param.userLogin = _this.state.emailNumber;
        break;
      case 'editinformation':
        param.receiverType = 2;
        param.sendType = 3;
        break;
      default:
    }
    if (this.reglPhoneEamil(type, validation)) return false;
    let isSuccess = await this.props.user.getEditCode({
      userLogin: param.userLogin,
      receiverType: param.receiverType,
      sendType: param.sendType
    });
    // 如果成功 开始倒计时
    if (isSuccess.request) {
      let _Verification = {
        type,
        number: 60,
      };
      this.setState({
        Verification: _Verification
      });
      let interval = setInterval(() => {
        if (this.state.Verification.number === 0) {
          clearInterval(interval);
          this.setState({
            Verification: {
              type: '',
              number: 0,
            }
          });
        } else {
          let Verification_ = this.state.Verification;
          Verification_.number--;
          this.setState({
            Verification: Verification_
          });
        }
      }, 1000);
    }
    this.setState({ message: isSuccess.message, show: true });
  }

  /**
   * 公司认证
   */
  async companyCertification() {
    const { user, login } = this.props;
    const { companyData } = this.state;
    let param = {
      companyName: companyData.companyName,
      companyDesc: companyData.companyDesc,
      userGuid: login.userInfo.userGuid,
      companyType: companyData.companyType.join(','),
      ipPicGuid: companyData.ipPicGuid,
      companyCountries: companyData.companyCountries,
      businessLicenseGuid: companyData.businessLicenseGuid,
      companyTelephone: companyData.companyTelephone,
      companyMailbox: companyData.companyMailbox,
      companyAddress: companyData.companyAddress,
    };
    // 检测param 是否符合提交条件
    for (let key in param) {
      if (param[key] === "") {
        switch (key) {
          case 'ipPicGuid':
            this.setState({ alertMessage: '请上传公司标志', alertShow: true });
            return false;
          case 'companyName':
            this.setState({ alertMessage: '请填写公司名称', alertShow: true });
            return;
          case 'companyType':
            this.setState({ alertMessage: '请至少选择一个公司性质', alertShow: true });
            return false;
          case 'companyCountries':
            this.setState({ alertMessage: '请选择公司国别', alertShow: true });
            return false;
          case 'businessLicenseGuid':
            this.setState({ alertMessage: '请上传公司的营业执照', alertShow: true });
            return false;
          case 'companyTelephone':
            this.setState({ alertMessage: '请填写公司的联系电话', alertShow: true });
            return false;
          case 'companyMailbox':
            this.setState({ alertMessage: '请填写公司的联系邮箱', alertShow: true });
            return false;
          case 'companyAddress':
            this.setState({ alertMessage: '请填写公司地址', alertShow: true });
            return false;
          case 'companyDesc':
            this.setState({ alertMessage: '请填写公司简介', alertShow: true });
            return false;
        }
        this.setState({ alertMessage: '请填写完整表单信息', alertShow: true });
        return false;
      } else {
        let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          emailPattern = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/ || /^1\d{10}$/;
        if ((param['companyTelephone'] !== "" && !emailPattern.test(param['companyTelephone']))) {
          this.setState({ alertMessage: '请填写正确的公司联系电话', alertShow: true });
          return false;
        }
        if (param['companyTelephone'] !== "" && !mPatternEmail.test(param['companyMailbox'])) {
          this.setState({ alertMessage: "请填写正确的公司联系邮箱", alertShow: true });
          return false;
        }
      }
    }
    let isSuccess = await user.companyCerfiticate(param);
    this.setState({ alertMessage: isSuccess.message, alertShow: true });
    if (isSuccess.request) {
      await this.getCompanyInfo();
      this.setState({
        companyRealStatus: 3
      });
    }
  }

  /**
   * 清空公司认证的数据
   */
  async clearCompanyCertification() {
    const { companyData } = this.state;
    companyData.ipPicGuid = "";
    companyData.companyName = "";
    companyData.companyType = [];
    companyData.companyCountries = "";
    companyData.businessLicenseGuid = "";
    companyData.companyTelephone = "";
    companyData.companyMailbox = "";
    companyData.companyAddress = "";
    companyData.companyDesc = "";
    companyData.logoPic = "";
    companyData.businessLicense = "";
    this.setState({
      companyData
    });
  }

  // 修改手机号邮箱 确认发送
  async editPhoneNumber({ type }) {
    const { user, login } = this.props;
    let receiverType = 0,
      code = null,
      number = null;
    if (type === 'editPhone') {
      receiverType = 1;
      number = this.state.phoneNuber;
      code = this.state.phoneCode;
    } else if (type === 'editEmail') {
      receiverType = 2;
      number = this.state.emailNumber;
      code = this.state.emailCode;
    }
    if (this.reglPhoneEamil(type, number)) return false;
    if (code === '') {
      this.setState({ message: "请输入验证码", show: true });
      return false;
    }
    let isSuccess = await user.userInformation({
      email: this.state.emailNumber,
      code,
      mobile: this.state.phoneNuber,
      receiverType,
      userGuid: login.userInfo.userGuid
    });
    if (isSuccess.request) {
      this.props.history.push('/user/3');
      // 更新缓存里面的邮箱
      const { emailNumber, phoneNuber: phone } = this.state;
      if (type === 'editEmail') {
        login.userInfo.email = emailNumber;
        user.setUserinfo({ 'email': emailNumber });
      } else {
        login.userInfo.mobile = phone;
        user.setUserinfo({ 'mobile': phone });
      }
      localStorage.setItem('user', JSON.stringify(login.userInfo));

      this.setState({ message: '修改成功', show: true, phoneNuber: '', emailCode: '', emailNumber: '', phoneCode: '' });
    } else {
      this.setState({ message: isSuccess.result.errorMsg, show: true });
    }
  };

  // 修改密码 确认提交接口

  async updatePassword() {
    let { updatePassword } = this.state;
    updatePassword.userGuid = this.props.login.userInfo.userGuid;
    if (updatePassword['userPass'] === '' || updatePassword['userPassAgain'] === '') {
      this.setState({ message: '请把密码输入完整', show: true });
      return false;
    }
    if (updatePassword['userPass'] !== updatePassword['userPassAgain']) {
      this.setState({ message: '两次输入密码不一致', show: true });
      return false;
    }
    let isSuccess = await this.props.user.updataPassword(updatePassword);
    if (isSuccess.request) {
      updatePassword = { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' };
      this.setState({ message: '修改成功', show: true, updatePassword });
      this.props.history.push("/login-old");
    } else {
      this.setState({ message: isSuccess.message, show: true });
    }
  }

  // 验证密码长度
  invalidatapass = (e: any) => {
    if (!!e.target.value && e.target.value.length < 8) {
      this.setState({ message: '密码长度不能少于8', show: true });
    }
  };
  // 手机号邮箱号验证
  reglPhoneEamil = (type: string, value: any) => {
    if (type === 'editPhone') {
      if (value === '') {
        this.setState({ message: "请填写手机号", show: true });
        return true;
      }
      if (!(/^1[34578]\d{9}$/.test(value))) {
        this.setState({ message: "请输入正确手机号", show: true });
        return true;
      }
    } else if (type === 'editEmail') {
      if (value === '') {
        this.setState({ message: "请填写邮箱号", show: true });
        return true;
      }
      if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))) {
        this.setState({ message: "请输入正确邮箱", show: true });
        return true;
      }
    }
    return false;
  };

  // 切换左侧菜单
  nextMenuNum = (num: number | string, nextNum: any) => {
    if (nextNum === 30 && num === 3 && this.state.nextNum === 30) return false;
    let _RealName = this.state.RealName;
    _RealName.cardFile = '';
    _RealName.file = '';
    _RealName.realname = '';
    let _state = {
      RealName: _RealName,
      iconShow: false,
      iconShowNext: false,
      Verification: {
        type: '',
        number: 0,
      },
      btnNum: this.state.btnNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      childNum: this.state.childNum, // 1.我发布的ip 2.我上船的 3.我更新的 4.我参与的
      nextNum: num, // 1.我的发布 2.个人信息 3.账号安全,4.企业信息
      phoneNuber: '', // 修改的手机号
      phoneCode: '', // 修改的手机号验证码
      emailNumber: '',
      emailCode: '', // 修改的邮箱验证码
      message: "",
      show: false,
      updatePassword: { oldUserPass: '', userPass: '', userGuid: '', userPassAgain: '' }, // 更新密码
      papersPicGuid: '',
      pickGuid: '',
    };
    if (num === 3) {
      this.setState(_state);
      this.props.history.push("/user/3");
    } else {
      this.setState({
        nextNum: num
      });
    }
  };
  //  账号安全-选择模块按钮
  setchildNum = (num: number) => {
    this.setState({
      childNum: num,
    });
    this.props.history.push("/user/30");
  };

  /**
   * 获取公司认证字段value
   */
  async getInputValue(inputName, e) {
    const { companyData } = this.state;
    companyData[inputName] = e.target.value;
    this.setState({
      companyData
    });
  }

  childIsEdit = async (boole) => {
    this.setState({
      isEditDate: boole
    });
  };

  /** 用户名显示 */
  private showName(): string {
    const { user, login } = this.props;
    if (login.userInfo.userAttribute === 1) {
      return user.personInfo.userRealName ? user.personInfo.userRealName : user.personInfo.userLogin;
    }
    return user.companyInfo.companyName ? user.companyInfo.companyName : user.companyInfo.userLogin;
  }

  render() {
    const { user, login, match: { params } } = this.props;
    const { personInfo, companyInfo } = user;
    const { RealName, updatePassword, iconShowNext, iconShow, companyData } = this.state;
    const { userInfo } = login;
    let type = Number(params['type']) ;
    let typeString = params['type'];

    let realStatus, memberLevel, expireDataStr, rankPremision, filterPremision, comparedPremision;
    if (userInfo && userInfo.userAttribute === 2) {
      realStatus = companyInfo.realStatus || userInfo.realStatus;
    } else {
      realStatus = personInfo.realStatus || userInfo.realStatus;
    }
    if (!_isEmpty(userInfo)) {
      memberLevel = userInfo.memberLevel;
      expireDataStr = userInfo.expireDataStr;
    }
    filterPremision = !!userInfo.userJurisdiction && (userInfo.userJurisdiction.indexOf(',4,') !== -1);
    rankPremision = !!userInfo.userJurisdiction && (userInfo.userJurisdiction.indexOf(',5,') !== -1);
    comparedPremision = !!userInfo.userJurisdiction && (userInfo.userJurisdiction.indexOf(',6,') !== -1);
    const { userGuid } = userInfo || { userGuid: '' };
    if (userInfo) {
      return (
        <div className="user-bg">
          <div className="my-release">
            <div className="row">
              <div className="row-left">
                <div className="user-head">
                  <div className="img-circle">
                    <img className="head-img"
                         src={userInfo.picUrl || RealName.userPicUrl || personInfo.picUrl || ic_user}
                         alt=""/>
                    {
                      <div className="span">
                        <p className="word-ellipsis"
                           title={companyInfo.companyName || personInfo.userRealName || userInfo.userLogin}>
                          {companyInfo.companyName || personInfo.userRealName || userInfo.userLogin}
                        </p>
                        <div className='vip'>
                          {
                            realStatus === 1 &&
                            <img src={ic_attestation_pr} alt=''/>
                          }
                          {
                            !!filterPremision &&
                            <img src={filterIcon} width='12' height='12' alt=''/>
                          }
                          {
                            !!rankPremision &&
                            <img src={rankIcon} width='12' height='12' alt=''/>
                          }
                          {
                            !!comparedPremision &&
                            <img src={comparedIcon} width='12' height='12' alt=''/>
                          }
                          {
                            memberLevel === 1 &&
                            <div>
                              <img src={silverNoCircle} width='16' height='' alt=""/>
                              <span className='silver'>白银VIP</span>
                            </div>
                          }
                          {
                            memberLevel === 2 &&
                            <div>
                              <img src={ic_hjhy} width='16' height='15' alt=""/>
                              <span className='gold'>黄金VIP</span>
                            </div>
                          }
                          {
                            memberLevel === 3 &&
                            <div>
                              <img src={ic_zshy} width='16' height='15' alt=""/>
                              <span className='diamond'>钻石VIP</span>
                            </div>
                          }
                        </div>
                        {
                          memberLevel > 0 && !_isEmpty(expireDataStr) &&
                          <p className="date">{expireDataStr}到期</p>
                        }
                      </div>
                    }
                  </div>
                </div>
                < ul className="list-bottom">
                  <li className={type === 0 || type === 10 ? 'active' : ''} onClick={() => this.nextMenuNum(0, null)}>
                    {
                      userInfo.userAttribute === 1
                        ? <Link
                          to="/user/0"
                          onClick={async () => {
                            this.childIsEdit(false);
                          }}>个人资料</Link>
                        : <Link
                          to="/user/10"
                          onClick={async () => {
                            this.childIsEdit(false);
                          }}>企业信息</Link>
                    }
                  </li>
                  <li className={type === 21 ? 'active' : ''} onClick={() => this.nextMenuNum(21, null)}>
                   <Link
                    to="/user/21"
                    onClick={async () => {
                      this.childIsEdit(false);
                    }}>用户信息</Link>
                  </li>

                  {
                    userInfo.userAttribute === 2 &&
                    <li className={type === 11 ? 'active' : ''} onClick={() => this.nextMenuNum(1, null)}>
                      <div className={type === 11 ? "left-border" : "left-display"}/>
                      <Link to="/user/11">企业员工</Link>
                    </li>
                  }

                  {/* {
                    <li
                      className={type === 12 ? 'active' : ''}
                      onClick={() => {
                        this.nextMenuNum(11, null);
                      }}
                    >
                      <div className={type === 12 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/12">VIP会员服务</Link>
                    </li>
                  } */}
                  {
                    <li
                      className={`border-top ${type === 13 ? 'active' : ''}`}
                      onClick={() => {
                        this.nextMenuNum(13, null);
                      }}
                    >
                      <div className={type === 13 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/13">VIP卡包</Link>
                    </li>
                  }
                    <li className={type === 22 ? 'active' : ''}
                      onClick={() => {
                        this.nextMenuNum(22, null);
                      }}>
                      <div className={type === 22 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/22">授权购买订单</Link>
                    </li>

                  {
                    <li
                      className={type === 15 ? 'active' : ''}
                      onClick={() => {
                        this.nextMenuNum(15, null);
                      }}
                    >
                      <div className={type === 15 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/15">我的订单</Link>
                    </li>
                  }
                  {
                    <li
                      className={type === 20 ? 'active' : ''}
                      onClick={() => {
                        this.nextMenuNum(20, null);
                      }}
                    >
                      <div className={type === 20 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/20">收货地址</Link>
                    </li>
                  }
                 {/* <li className={typeString === 'address' ? 'active' : ''}
                      onClick={() => {
                        this.nextMenuNum('address', null);
                      }}
                  >
                    <div className={typeString === 'address' ? "left-border-three" : "left-display"}/>
                    <Link to="/user/address">收货地址</Link>
                  </li>*/}

                  {
                    userInfo.userAttribute === 2 &&
                    <li className={type === 1 ? 'border-top-spass-top' : 'border-top'}
                        onClick={() => this.nextMenuNum(1, null)}>
                      <div className={type === 1 ? "left-border" : "left-display"}/>
                      <Link to="/user/1">发布IP</Link>
                    </li>
                  }
                  {
                    userInfo.userAttribute === 2 &&
                    <li className={type === 5 ? 'active' : ''} onClick={() => {
                      this.nextMenuNum(5, null);
                      user.changeCaseAndNeed({ postTitle: '', postStatus: '', type: '', postType: 1, currentPage: 1 });
                      user.getMyCase();
                    }}>
                      <div className={type === 5 ? "left-border-three" : "left-display"}/>
                      <Link to="/user/5">发布的案例</Link>
                    </li>
                  }

                  {
                    userInfo.userAttribute === 2 &&
                    <li className={type === 14 ? 'active' : ''} onClick={() => {
                      this.nextMenuNum(14, null);
                      user.changeCaseAndNeed({ postTitle: '', postStatus: '', type: '', postType: 4, currentPage: 1 });
                      user.getMyCase();
                    }}>
                      <div className={type === 14 ? "left-border" : "left-display"}/>
                      <Link to="/user/14">发布的IP需求</Link>
                    </li>
                  }
                  {/*  {
                    memberLevel === 3 &&
                    <li className={type === 16 ? 'active' : ''}
                        onClick={() => this.setState({ nextNum: 6 })}>
                      <div className={type === 16 ? "left-border" : "left-display"}/>
                      <Link to="/user/16" onClick={() => user.setCalculateStatus(true)}>预测数据</Link>
                    </li>
                  }*/}
                  {/* <li className={type === 8 ? 'border-top-spass' : 'border-top'}
                      onClick={() => this.nextMenuNum(8, null)}>
                    <div className={type === 8 ? "left-border-three" : "left-display"}/>
                    <Link to="/user/8">发出的邀约</Link>
                  </li>

                  <li className={type === 9 ? 'active' : ''} onClick={() => this.nextMenuNum(9, null)}>
                    <div className={type === 9 ? "left-border-three" : "left-display"}/>
                    <Link to="/user/9">收到的邀约</Link>
                  </li> */}

                  <li className={`border-top ${type === 7 ? 'active' : ''}`} onClick={() => this.nextMenuNum(7, null)}>
                    <div className={type === 7 ? "left-border-three" : "left-display"}/>
                    <Link to="/user/7">我的日程</Link>
                  </li>

                  <li className={type === 6 ? 'active' : ''} onClick={() => this.nextMenuNum(6, null)}>
                    <div className={type === 6 ? "left-border-three" : "left-display"}/>
                    <Link to="/user/6">我的关注</Link>
                  </li>
                  < li className={type === 2 ? 'border-top-spass-bottom' : 'border-top'} onClick={async () => {
                    this.nextMenuNum(2, null);
                    this.getDataInfo(userInfo.userAttribute);
                  }}>
                    <div className={type === 2 ? "left-border" : "left-display"}/>
                    <Link to="/user/2">账号认证</Link>
                  </li>
                  <li className={type === 3 || type === 30 ? 'active' : ''} onClick={() => this.nextMenuNum(3, null)}>
                    <div className={type === 3 || type === 30 ? "left-border-three" : "left-display"}/>
                    <Link to="/user/3">账号安全</Link>
                  </li>
                </ul>
                {/*授权展*/}
                {
                  userInfo.userAttribute === 1 &&
                  <div
                    className={login.userInfo.exhibitionGuid ? 'authorized-box' : 'authorized-none'}>
                    <img src={personInfo.backgroundImage || test} alt=""/>
                    {
                      personInfo.isAdmissionTicket === 1 ?
                        <button
                          onClick={() => this.props.history.push('/authorized-exhibition/confirm')}>
                          查看门票
                        </button> :
                        personInfo.isExpireExhibition ?
                          <button onClick={() => {
                            this.setState({
                              expireShow: true,
                              expireMessage: "您来晚了展会已过期"
                            });
                          }}
                          >预登记观展</button>
                          : (personInfo.isAdmissionTicket !== 1 &&
                          personInfo.userRealName !== "" && personInfo.mobile !== "" && personInfo.email !== "" &&
                          personInfo.address !== "" && personInfo.country !== "" && personInfo.province !== "") ?
                          <button
                            onClick={() =>
                              this.props.history.push('/authorized-exhibition/ticket')}>
                            预登记观展</button>
                          : <button onClick={() => {
                            this.setState({
                              specialShow: true,
                              specialMessage: "请先完善个人资料"
                            });
                          }}
                          >预登记观展</button>
                    }
                  </div>
                }
                {
                  userInfo.userAttribute === 2 &&
                  <div className={companyInfo.exhibitionGuid ? "authorized-box" : "authorized-none"}>
                    <img src={companyInfo.backgroundImage || test} alt=""/>
                    {(!companyInfo.isExpireExhibition || !companyInfo.exhibitionGuid) &&
                    companyInfo.isBoothReservation !== 1 ?
                      <button onClick={async () => {
                        await user.getCompanyType({ type: 8 });
                        this.setState({ reservationState: true });
                      }}>预定展位</button>
                      :
                      <button>已预定</button>
                    }
                    {
                      (companyInfo.isExpireExhibition || companyInfo.exhibitionGuid) && companyInfo.isBoothReservation !== 1 &&
                      <button onClick={() => {
                        this.setState({
                          expireShow: true,
                          expireMessage: "您来晚了展会已过期"
                        });
                      }}>预定展位</button>
                    }
                  </div>
                }
              </div>
              {
                this.state.reservationState &&
                <BoothReservation
                  onClose={() => {
                    this.setState({
                      reservationState: false
                    });
                  }}
                  companyLogo={companyInfo.picUrl}
                  exhibitionGuid={companyInfo.exhibitionGuid}
                  companyName={companyInfo.companyName}
                />
              }
              {
                type === 0 &&
                <div className="row-right-white">
                  <PersonalData RealName={RealName} isEditDate={this.state.isEditDate} childIsEdit={this.childIsEdit}
                                uploadImg={this.uploadImg}/>
                </div>
              }
              {
                 type === 21 &&
                   <div className="row-right-white">
                    <UserInformation />
                   </div>
              }
              {
                type === 22 &&
                 <div className="row-right-white">
                     <BuyerOrder/>
                 </div>
              }
              <div className={type === 1 ? "row-right-my" : "row-display"}>
                <PublishedIP
                  userGuid={userGuid}
                  realStatus={realStatus}
                  history={this.props.history}
                  exhibitionGuid={companyInfo.exhibitionGuid}
                  isExhibitor={companyInfo.isExhibitor}
                  match={this.props.match}
                />

              </div>
              {
                type === 2 &&
                <Certific RealName={RealName} realStatus={realStatus} userAttribute={userInfo.userAttribute} companyRealStatus={userInfo.companyRealStatus}
                          companyInfo={companyInfo} personInfo={personInfo} userGuid={userGuid}/>

              }
              {
                type === 10 &&
                <div className="row-right-white">
                  <CompanyData userGuid={userGuid} RealName={RealName} isEditDate={this.state.isEditDate}
                               childIsEdit={this.childIsEdit}/>
                </div>
              }
              {
                type === 11 &&
                <div className="row-right-white">
                  <EnterpriseStaff userGuid={userGuid} RealName={RealName} isEditDate={this.state.isEditDate}
                                   childIsEdit={this.childIsEdit}/>
                </div>
              }

              {/* VIP 会员服务 */}
              {
                type === 12 &&
                <div className='row-right-personal-data'>
                  <VipPage
                    history={this.props.history}
                    callback={[this.getPersonInfo.bind(this), this.getCompanyInfo.bind(this)]}
                  />
                </div>
              }
              {
                type === 13 &&
                <div className='row-right-personal-data'>
                  <UserVipCard/>
                </div>
              }
              {
                type === 15 &&
                <div className='row-right-personal-data'>
                  <UserOrder/>
                </div>
              }
              {
                type === 20 &&
                <div className='row-right-personal-data'>
                  <UserShippingAddress/>
                </div>
              }
              {
                typeString === 'address' &&
                <div className='row-right-personal-data'>
                  <ShippingAddress/>
                </div>
              }
              {
                type === 14 &&
                <div className='row-right-white'>
                  <PublishedIpNeeds history={this.props.history} realStatus={realStatus}/>
                </div>
              }
              {
                type === 16 && user.calculateFlag && memberLevel === 3 &&
                <div className='row-right-white'>
                  <CalculateData history={this.props.history} realStatus={realStatus}/>
                </div>
              }
              {
                type === 16 && !(user.calculateFlag) && memberLevel === 3 &&
                <div className='row-right-white'>
                  <CalculateResult history={this.props.history} realStatus={realStatus}/>
                </div>
              }
              {
                (!companyInfo.realStatus || companyInfo.realStatus === 2) &&
                <div className={type === 4 ? "row-right-info" : "row-display"}>
                  <div className="right-head realname-detail">
                    <div className="form-group">
                      <label>公司标志 <i className="span_imp">*</i>
                        <span>(请上传的logo清晰可见，不超过10m，格式为：bmp,jpg,png)</span>
                      </label>
                      <div className="upload">
                        <div className="load">
                          <img src={companyData.logoPic} alt=""/>
                          {companyData.logoPic === "" ? <span>点击上传</span> : ""}
                          <input type="file" className="btn_file"
                                 accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                 style={{ width: "100%", height: "100%", opacity: 0 }}
                                 onChange={async (e) => {
                                   await this.uploadImg(e, 'ipPicGuid', 3, 'logoPic');
                                 }}/>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>公司名称<i className="span_imp">*</i></label>
                      <input type="text" autoComplete="off" className="form-control"
                             value={companyData.companyName}
                             placeholder="填写公司名称"
                             onChange={async (e) => {
                               await this.getInputValue("companyName", e);
                             }}/>
                    </div>
                    <div className="form-group company-type">
                      <label>公司性质(可多选)<i className="span_imp">*</i></label>
                      <div className="check">
                        <ul>
                          {companyData.companySelected && companyData.companySelected.map((item, index) => {
                            const { companyData: { companyType: tmp } } = this.state;
                            let checkboxClicked = !!_find(tmp, val => item.id === Number(val)) ? "checkedimg" : "";
                            return (
                              <li key={index}>
                                <div className={`check-img ${checkboxClicked}`} onClick={async () => {
                                  let companyType = companyData.companyType;
                                  if (!_find(companyType, val => item.id === Number(val))) {
                                    companyType.push(item.id);
                                  } else {
                                    const idx = companyType.findIndex(o => Number(o) === item.id);
                                    delete companyType[idx];
                                  }
                                  this.setState({
                                    companyData: { ...companyData, companyType }
                                  });
                                  // await user.setStatus(companyType);
                                }}/>
                                <div className="checktxt">{item.name}</div>
                              </li>
                            );
                          })
                          }
                        </ul>
                      </div>
                    </div>
                    <div className="form-group ">
                      <label>公司国别<i className="span_imp">*</i></label>
                      <div className="antdSlect">
                        {
                          companyData.companyCountries &&
                          <Select
                            // showSearch
                            style={{ width: 200 }}
                            placeholder="请选择公司国别"
                            optionFilterProp="children"
                            defaultValue={companyData.companyCountries}
                            onChange={async (value: string) => {
                              companyData['companyCountries'] = value;
                              this.setState({
                                companyData,
                              });
                            }}
                            filterOption={(input, option) =>
                              typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                            }
                          >
                            {children}
                          </Select>
                        }
                        {
                          _isEmpty(companyData.companyCountries) && <Select
                            // showSearch
                            style={{ width: 200 }}
                            placeholder="请选择公司国别"
                            optionFilterProp="children"
                            onChange={async (value: string) => {
                              companyData['companyCountries'] = value;
                              this.setState({
                                companyData,
                              });
                            }}
                            filterOption={(input, option) =>
                              typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                            }
                          >
                            {children}
                          </Select>
                        }
                      </div>
                    </div>
                    <div className="form-group">
                      <label>营业执照<i className="span_imp">*</i>
                        <span>(请上传的logo清晰可见，不超过10m，格式为: bmp,jpg,png)</span>
                      </label>
                      <div className="upload">
                        <div className="load">
                          <img src={companyData.businessLicense} alt=""/>
                          {companyData.businessLicense === "" ? <span>点击上传</span> : ""}
                          <input type="file" className="btn_file"
                                 accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                                 style={{ width: "100%", height: "100%", opacity: 0 }}
                                 onChange={async (e) => {
                                   await this.uploadImg(e, 'businessLicenseGuid', 7, 'businessLicense');
                                 }}/>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>联系电话<i className="span_imp">*</i></label>
                      <input type="text" autoComplete="off" className="form-control"
                             value={companyData.companyTelephone}
                             onChange={async (e) => {
                               await this.getInputValue("companyTelephone", e);
                             }}
                             placeholder="请输入联系电话"/>
                    </div>
                    <div className="form-group">
                      <label>联系邮箱<i className="span_imp">*</i></label>
                      <input type="text" autoComplete="off" className="form-control"
                             value={companyData.companyMailbox}
                             onChange={async (e) => {
                               await this.getInputValue("companyMailbox", e);
                             }}
                             placeholder="请输入联系邮箱"/>
                    </div>
                    <div className="form-group">
                      <label>公司地址<i className="span_imp">*</i></label>
                      <input type="text" autoComplete="off" className="form-control"
                             value={companyData.companyAddress}
                             onChange={async (e) => {
                               await this.getInputValue("companyAddress", e);
                             }}
                             placeholder="请输入公司地址"/>
                    </div>
                    <div className="form-group">
                      <label>公司简介<i className="span_imp">*</i></label>
                      <textarea className="form-control textarea" placeholder="写点什么吧"
                                value={companyData.companyDesc}
                                onChange={async (e) => {
                                  await this.getInputValue("companyDesc", e);
                                }}/>
                    </div>
                    {/*<div className="form-group">
                  <label>企业主页编辑权限关联账号</label>
                  <input type="text" placeholder="请输入关联账号，如有多个请以； 进行区分" className="form-control"/>
                </div>*/}

                  </div>
                  <div className="form-group">
                    <div className="user_btn_primary">
                      <button className="btn btn-primary" onClick={async () => {
                        await this.companyCertification();
                      }}>提交审核
                      </button>
                      <button className="btn btn-default" onClick={async () => {
                        await this.clearCompanyCertification();
                      }}>重置
                      </button>
                    </div>
                  </div>
                </div>}
              {
                (!!companyInfo.realStatus && companyInfo.realStatus !== 2) &&
                <div className={type === 4 ? "row-right-info" : "row-display"}>
                  <div className="right-head realname-detail">
                    <div className="form-group form-detail">
                      <label>公司标志:</label>
                      <div className="img-gray">
                        <img src={companyInfo.picUrl} alt=""/>
                      </div>
                    </div>
                    <div className="form-group form-detail">
                      <label>公司名称:</label>
                      {companyInfo.companyName}
                    </div>
                    <div className="form-group form-detail">
                      <label>公司性质:</label>
                      <span>{companyInfo.companyTypes}</span>
                    </div>
                    <div className="form-group form-detail">
                      <label>公司国别:</label>
                      {companyInfo.companyCountries}
                    </div>
                    <div className="form-group form-detail">
                      <label>营业执照:</label>
                      <div className="img-gray">
                        <img src={companyInfo.businessLicense} alt=""/>
                      </div>
                    </div>
                    <div className="form-group form-detail">
                      <label>联系电话:</label>
                      {companyInfo.companyTelephone}
                    </div>
                    <div className="form-group form-detail">
                      <label>联系邮箱:</label>
                      {companyInfo.companyMailbox}
                    </div>
                    <div className="form-group form-detail">
                      <label>公司地址:</label>
                      {companyInfo.companyAddress}
                    </div>
                    <div className="form-group form-detail">
                      <label>公司简介:</label>
                      <p dangerouslySetInnerHTML={{ __html: companyData.companyDesc }}/>
                    </div>
                  </div>
                  {
                    companyInfo.realStatus === 3 && <div className="form-group">
                      <div className="user_btn_primary">
                        <button className="btn btn-disabled" disabled>审核中</button>
                      </div>
                    </div>
                  }
                </div>
              }
              <div className={type === 3 ? "row-right-admin" : "row-display"}>
                <div className="box-style">

                  {userInfo.email ? (
                    <div className="email-val">
                      <div className="first-style">
                        邮箱账号
                      </div>
                      <div className="last-style">
                        已验证邮箱 <span> {userInfo.email}</span>
                      </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(3)}>更改</button>
                      </div>
                    </div>
                  ) : (
                    <div className="email-val">
                      <div className="first-style">
                        邮箱账号
                      </div>
                      <div className="last-style">
                        未绑定邮箱
                      </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(3)}>绑定</button>
                      </div>
                    </div>
                  )}

                  {userInfo.mobile ? (
                    <div className="phone-num">
                      <div className="first-style">
                        手机账号
                      </div>
                      <div className="last-style">
                        已绑定的手机号 <span> {userInfo.mobile}</span>
                      </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(2)}>更改</button>
                      </div>
                    </div>
                  ) : (
                    <div className="phone-num">
                      <div className="first-style">
                        手机账号
                      </div>
                      <div className="last-style">
                        未绑定手机号
                      </div>
                      <div className="user-btn">
                        <button className="btn btn-primary" onClick={() => this.setchildNum(2)}>绑定</button>
                      </div>
                    </div>
                  )}
                  <div className="email-val mt58">
                    <div className="first-style">
                      登录密码
                    </div>
                    <div className="last-style">
                      密码要求至少8位
                    </div>
                    <div className="user-btn">
                      <button className="btn btn-primary" onClick={() => this.setchildNum(1)}>更改</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={type === 30 ? "row-right-admin" : "row-display"}>
                <div className="box-style">
                  <div className={this.state.childNum === 1 ? "password-detail" : "row-display"}>
                    <div className="col-sm-8 box_center_style" id="moidify_password">
                      <p className="text-left margin-top46">修改密码</p>
                      <div className="form-group yc_relative">
                        <i className={iconShow ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                           onClick={() => {
                             this.setState({ iconShow: !iconShow });
                           }}/>
                        <input type={iconShow ? 'text' : 'password'} className="form-control " id="password"
                               placeholder="输入原先密码"
                               value={updatePassword.oldUserPass}
                               onBlur={(e) => {
                                 this.invalidatapass(e);
                               }}
                               onChange={(e) => {
                                 updatePassword.oldUserPass = e.target.value;
                                 this.setState({
                                   updatePassword
                                 });
                               }}/>
                      </div>
                      <div className="form-group yc_relative">
                        <i
                          className={iconShowNext ? "icon iconfont  icon-ic_block" : "icon iconfont  icon-ic_hidden"}
                          onClick={() => {
                            this.setState({ iconShowNext: !iconShowNext });
                          }}/>
                        <input type={iconShowNext ? 'text' : 'password'} className="form-control " id="pwd_first"
                               placeholder="输入至少8位的新密码"
                               value={updatePassword.userPass}
                               onBlur={(e) => {
                                 this.invalidatapass(e);
                               }}
                               onChange={(e) => {
                                 updatePassword.userPass = e.target.value;
                                 this.setState({
                                   updatePassword
                                 });
                               }}/>
                      </div>
                      <div className="form-group">
                        <input type="password" className="form-control " id="pwd_second" placeholder="重复一次新密码"
                               value={updatePassword.userPassAgain}
                               onBlur={(e) => {
                                 this.invalidatapass(e);
                               }}
                               onChange={(e) => {
                                 updatePassword.userPassAgain = e.target.value;
                                 this.setState({
                                   updatePassword
                                 });
                               }}/>
                      </div>
                      <div className="form-group margin-top56">
                        <div className="user_btn_primary inline_block_btn">
                          <button className="btn btn-primary" onClick={() => {
                            this.updatePassword();
                          }}>确定
                          </button>
                        </div>
                        <div className="user_btn_primary inline_block_btn left">
                          <button className="btn btn-default" onClick={() => {
                            this.nextMenuNum(3, null);
                          }}>返回
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={this.state.childNum === 2 ? "phone-detail" : "row-display"}>
                    <div className="col-sm-8 box_center_style" id="moidify_phone">
                      {userInfo.mobile ? (
                        <p className="text-left margin-top46">修改手机号码</p>
                      ) : (
                        <p className="text-left margin-top46">绑定手机号码</p>
                      )}
                      {userInfo.mobile ? (
                        <div className="form-group">
                          <input type="text" className="form-control disabled old_phone" disabled placeholder=""
                                 value={userInfo.mobile}
                          />
                        </div>
                      ) : ('')}
                      <div className="form-group">
                        <input type="text" className="form-control input-hid" placeholder="新手机号"
                               value={this.state.phoneNuber}
                               onChange={(e) => {
                                 this.setState({ phoneNuber: e.target.value });
                               }}/>
                      </div>
                      <div className="form-group code-area">
                        <input type="text" className="form-control input-hid right_box"
                               value={this.state.phoneCode}
                               onChange={(e) => {
                                 this.setState({ phoneCode: e.target.value });
                               }}
                               style={{ width: '73%' }}
                               placeholder="填写手机收到验证码"/>
                        {this.state.Verification.type === 'editPhone' ? (
                          <div className="input-group-addon disabled" id="btn_phone_code">
                            {this.state.Verification.number}s后重新发送
                          </div>) : (
                          <div className="input-group-addon" id="btn_phone_code" onClick={async () => {
                            await this.editCode({ type: 'editPhone' });
                          }}>
                            获取验证码
                          </div>)}

                      </div>
                      <div className="form-group margin-top56">
                        <div className="user_btn_primary inline_block_btn">
                          <button className="btn btn-primary" onClick={() => {
                            this.editPhoneNumber({ type: 'editPhone' });
                          }}>确定
                          </button>
                        </div>
                        <div className="user_btn_primary inline_block_btn left">
                          <button className="btn btn-default " onClick={() => {
                            this.nextMenuNum(3, null);
                          }}>返回
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={this.state.childNum === 3 ? "email-detail" : "row-display"}>
                    <div className="col-sm-8 box_center_style" id="moidify_phone">
                      {userInfo.email ? (
                        <p className="text-left margin-top46">修改邮箱账号</p>
                      ) : (
                        <p className="text-left margin-top46">绑定邮箱账号</p>
                      )}
                      {userInfo.email ? (
                        <div className="form-group">
                          <input type="text" className="form-control disabled old_phone" disabled placeholder=""
                                 value={userInfo.email}
                          />
                        </div>
                      ) : ('')}
                      <div className="form-group">
                        <input type="text" className="form-control input-hid" placeholder="新邮箱账号"
                               value={this.state.emailNumber}
                               onChange={(e) => {
                                 this.setState({ emailNumber: e.target.value });
                               }}/>
                      </div>
                      <div className="form-group code-area">
                        <input type="text" className="form-control input-hid right_box"
                               value={this.state.emailCode}
                               onChange={(e) => {
                                 this.setState({ emailCode: e.target.value });
                               }}
                               style={{ width: '73%' }}
                               placeholder="填写邮箱收到的验证码"/>
                        {this.state.Verification.type === 'editEmail' ? (
                          <div className="input-group-addon disabled" id="btn_phone_code">
                            {this.state.Verification.number}s后重新发送
                          </div>) : (
                          <div className="input-group-addon" id="btn_phone_code" onClick={async () => {
                            await this.editCode({ type: 'editEmail' });
                          }}>
                            获取验证码
                          </div>
                        )}
                      </div>
                      <div className="form-group margin-top56">
                        <div className="user_btn_primary inline_block_btn">
                          <button className="btn btn-primary" onClick={() => {
                            this.editPhoneNumber({ type: 'editEmail' });
                          }}>确定
                          </button>
                        </div>
                        <div className="user_btn_primary inline_block_btn left">
                          <button className="btn btn-default " onClick={() => {
                            this.nextMenuNum(3, null);
                          }}>返回
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={type === 5 ? "row-right-white" : "row-display"}>
                <PubCase history={this.props.history} realStatus={realStatus}/>
              </div>
              <div className={type === 6 ? "row-right-concern" : "row-display"}>
                <MyConcern/>
              </div>
              <div className={type === 7 ? "row-my-day" : "row-display"}>
                <MySchedule/>
              </div>
              <div className={type === 8 ? "invitations" : "row-display"}>
                <Invitations/>
              </div>
              <div className={type === 9 ? "receive-invited" : "row-display"}>
                <ReInvited/>
              </div>
            </div>
          </div>
          {this.state.show &&
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />}

          {this.state.alertShow &&
          <Alert message={this.state.alertMessage}
                 onClose={() => {
                   this.setState({ alertShow: false });
                 }}
                 onSubmit={() => {
                   this.setState({ alertShow: false });
                 }}
          />
          }
          {/*  个人预定门票，姓名、手机号、邮箱、地址 必填，===》 个人编辑信息*/}
          {this.state.specialShow &&
          <Alert message={this.state.specialMessage}
                 onClose={() => {
                   this.setState({ specialShow: false });
                 }}
                 onSubmit={() => {
                   this.setState({
                     specialShow: false,
                     isEditDate: true,
                   });
                   this.props.history.push('/user/0');
                 }}/>
          }
          {this.state.expireShow &&
          <Alert
            message={this.state.expireMessage}
            onClose={() => {
              this.setState({ expireShow: false });
            }}
            onSubmit={() => {
              this.setState({ expireShow: false });
            }}
          />
          }
          <ScrollTop/>
        </div>
      );
    }
  }
}
