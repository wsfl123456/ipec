import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/register_old.scss";
// import ipec_logo from "@assets/images/logo2.0.png";
import ipec_logo from "@assets/images/logo1.png";
import mobile_register from "@assets/images/user/ic_iphone_pre.svg";
import email_register from "@assets/images/user/ic_mail_pre.svg";
import icAll from "@assets/images/ic_AII.svg";
import icTips from "@assets/images/ic_tips.svg";
import { onCodeReg } from "@utils/api";
import Toast from "@components/toast";
import { Link } from "react-router-dom";
import {
  Rule,
} from "@pages/register-old/components";

interface IRegisterState {
  user_mobile: string; // 登陆名-手机号
  email_number: string; // 登陆名-手机号
  company_name: string; // 公司名称
  btnNum: Number; // 登陆名-邮箱
  sendNum: Number; // 1.注册 2.修改密码 3.实名认证
  user_code: string; // 1.手机 2.邮箱
  email_code: string; // 1.手机 2.邮箱
  user_firstPassword: string; // 登陆密码
  user_lastPassword: string; // 重复密码
  email_firstPassword: string; // 登陆密码
  email_lastPassword: string; // 重复密码
  errorMsg: string;
  count: number; // 验证码秒数为30秒
  countEmail: number; // 验证码秒数为30秒
  liked: boolean;
  likedEmail: boolean;
  read: boolean; // 是否阅读-手机
  readEmail: boolean; // 是否阅读-邮箱
  message: string;
  show: boolean;

  Type: number;
  ruleShow: boolean;
  disabled: boolean;
}

@inject("register")
@observer
export default class Register extends React.Component<IProps, IRegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      Type: 1,
      errorMsg: '',
      ruleShow: false,
      user_mobile: "",
      company_name: '',
      email_number: '',
      sendNum: 1,
      btnNum: 1,
      user_firstPassword: "",
      user_lastPassword: "",
      email_firstPassword: "",
      email_lastPassword: "",
      user_code: "",
      email_code: '',
      count: 60,
      countEmail: 60,
      liked: false,
      likedEmail: false,
      read: false,
      readEmail: false,
      message: "",
      show: false,
      disabled: false,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-注册";
  }

  his = (where) => {
    this.props.history.push(where);
  };

  private filterParams() {
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ errorMsg: "请输入手机号" });
      return false;
    }
    if (!mPattern.test(this.state.user_mobile) && !mPatternEmail.test(this.state.user_mobile)) {
      this.setState({ errorMsg: "请输入正确邮箱或手机号" });
      return false;
    }
    if (!this.state.user_code) {
      this.setState({ errorMsg: "请输入验证码" });
      return false;
    }
    if (!this.state.user_firstPassword) {
      this.setState({ errorMsg: "请输入密码" });
      return false;
    }
    // let mPatternPass = /^(?![0-9]+$)(?![a-zA-Z]+$)(_+)[0-9A-Za-z_#@!~%^&*]{8,16}$/;
    // 强：字母+数字+特殊字符
    let mPatternPass1 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*_]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*_]+$/;
    // 中：字母+数字，字母+特殊字符，数字+特殊字符
    let mPatternPass2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)[a-zA-Z\d!@#$%^&*_]+$/;
    // 弱：纯数字，纯字母，纯特殊字符
    let mPatternPass3 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*_]+)$/;
    if (!mPatternPass2.test(this.state.user_firstPassword) || this.state.user_firstPassword.length < 8) {
      this.setState({ errorMsg: "密码格式错误！(长度不小于8位数的数字、字母或特殊字符组合)" });
      return false;
    }
    if (!this.state.user_lastPassword) {
      this.setState({ errorMsg: "请重复密码" });
      return false;
    }
    if (this.state.user_firstPassword !== this.state.user_lastPassword) {
      this.setState({ errorMsg: "请输入相同密码" });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入相同密码"/>;
      return false;
    }
    if (!this.state.read) {
      this.setState({ errorMsg: "请阅读相关协议并勾选" });
      return false;
    }
    this.setState({ errorMsg: '' });
    return true;
  }

  private filterEmailParams() {

    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!this.state.company_name) {
      this.setState({ errorMsg: "请输入企业名称" });
      return false;
    }
    if (!this.state.email_number) {
      this.setState({ errorMsg: "请输入企业邮箱或手机号，它将用于登陆或找回密码" });
      return false;
    }
    if (!mPatternEmail.test(this.state.email_number) && !mPattern.test(this.state.email_number)) {
      this.setState({ errorMsg: "请输入正确企业邮箱或手机号" });
      return false;
    }
    if (!this.state.email_code) {
      this.setState({ errorMsg: "请输入验证码" });
      return false;
    }
    if (!this.state.email_firstPassword) {
      this.setState({ errorMsg: "请输入密码" });
      return false;
    }
    // 强：字母+数字+特殊字符
    let mPatternPass1 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*_]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*_]+$/;
    // 中：字母+数字，字母+特殊字符，数字+特殊字符
    let mPatternPass2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)[a-zA-Z\d!@#$%^&*_]+$/;
    // 弱：纯数字，纯字母，纯特殊字符
    let mPatternPass3 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*_]+)$/;
    if (!mPatternPass2.test(this.state.email_firstPassword) || this.state.email_firstPassword.length < 8) {
      this.setState({ errorMsg: "密码格式错误！(长度不小于8位数的数字、字母或特殊字符组合)" });
      return false;
    }
    if (!this.state.email_lastPassword) {
      this.setState({ errorMsg: "请重复密码" });
      return false;
    }
    if (this.state.email_firstPassword !== this.state.email_lastPassword) {
      this.setState({ errorMsg: "请输入相同密码" });
      return false;
    }
    if (!this.state.readEmail) {
      this.setState({ errorMsg: "请阅读相关协议并勾选" });
      return false;
    }
    this.setState({ errorMsg: '' });
    return true;
  }

  setMenuNum = (num: number) => {
    this.setState({
      btnNum: num,
      errorMsg: '',
    });
  };

  // personal 获取验证码倒计时-手机
  async handleClick({ userLogin, receiverType, sendType }) {
    let { Type } = this.state;
    // let mPatternEmail = /^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
      this.setState({ errorMsg: "请输入手机号或邮箱", message: "请输入手机号或邮箱", show: true });
      return;
    }
    if (!mPattern.test(this.state.user_mobile) && !mPatternEmail.test(this.state.user_mobile)) {
      this.setState({ errorMsg: "请输入正确手机号或邮箱", message: "请输入正确手机号或邮箱", show: true });
      return;
    }
    if (this.state.liked) {
      return;
    }
    if (mPattern.test(this.state.user_mobile)) Type = 1;
    if (mPatternEmail.test(this.state.user_mobile)) Type = 2;
    if (this.state.user_mobile) {
      const data: any = await onCodeReg({ userLogin, receiverType: Type, sendType });
      if (data.errorCode === "200") {
        this.setState({
          Type,
          message: data.result.errorMsg,
          show: true
        });
        if (data.result.errorCode > 0) {
          this.setState({
            liked: true,

          });
          let count = this.state.count;
          const timer = setInterval(() => {
            this.setState({
              count: (count--)
            }, () => {
              if (count === -1) {
                clearInterval(timer);
                this.setState({
                  liked: false,
                  count: 60
                });
              }
            });
          }, 1000);
        }
      } else {
        this.setState({ message: data.errorMsg, show: true });
      }

    }

  };

  // company 获取验证码倒计时-邮箱
  async handleClickEmail({ userLogin, receiverType, sendType }) {
    let { Type } = this.state;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.email_number === "" || this.state.email_number === null) {
      this.setState({ message: "请输入邮箱号", show: true });
      return;
    }
    if (!mPatternEmail.test(this.state.email_number) && !mPattern.test(this.state.email_number)) {
      this.setState({ message: "请输入正确邮箱号或手机号", show: true });
      return;
    }
    if (this.state.likedEmail) {
      return;
    }
    if (mPattern.test(this.state.email_number)) Type = 1;
    if (mPatternEmail.test(this.state.email_number)) Type = 2;
    if (this.state.email_number) {
      const data: any = await onCodeReg({ userLogin, receiverType: Type, sendType });
      if (data.errorCode === "200") {
        this.setState({ Type, message: data.result.errorMsg, show: true });
        if (data.result.errorCode > 0) {
          let countEmail = this.state.countEmail;
          this.setState({
            likedEmail: true,
          });
          const timer = setInterval(() => {
            this.setState({
              countEmail: (countEmail--)
            }, () => {
              if (countEmail === -1) {
                clearInterval(timer);
                this.setState({
                  likedEmail: false,
                  countEmail: 60
                });
              }
            });
          }, 1000);
        }
      } else {
        this.setState({ message: data.errorMsg, show: true });
      }
    }
  };

  render() {
    const { register: { onRegister } }: any = this.props;
    const { ruleShow, Type, disabled }: any = this.state;
    return (
      <div className="container-all">
        <div className="backHome clearfix">
          {/* <img src={ipec_logo} alt="" /> */}
          <Link to="/">
            <span className="float_text">IP二厂首页</span>
            <img className="float_img" src={icAll} alt=""/>
          </Link>
        </div>
        <div className="container-register">
          <div className="register_img">
          </div>
          <div className="register-content">
            <ul className="login-title-area">
              <li className={this.state.btnNum === 1 ? "login-old-title" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(1)}>
                <span className="login-p-text">个人注册</span>
              </li>
              <li className={this.state.btnNum === 2 ? "login-old-title-email" : "input-mobile-display"}
                  onClick={() => this.setMenuNum(2)}>
                <span className="login-p-text">企业注册</span>
              </li>
            </ul>
            {
              this.state.errorMsg !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMsg}</span>
              </p>
            }
            <div className={this.state.btnNum === 1 ? "input-form-mobile" : "input-display"}>

              <div className="form-group input-area isPhone">
                <input
                  type="text"
                  className="form-control
                  register-phone"
                  placeholder="请输入邮箱或手机号"
                  onChange={e => {
                    this.setState({ user_mobile: e.currentTarget.value });
                  }}
                  onBlur={() => {
                    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
                    // let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
                    if (this.state.user_mobile === "" || this.state.user_mobile === null) {
                      this.setState({
                        errorMsg: "请输入手机号或邮箱",
                        disabled: true,
                      });
                      return;
                    } else {
                      this.setState({
                        errorMsg: '',
                        disabled: false
                      });
                    }
                    if (!mPattern.test(this.state.user_mobile) && !mPatternEmail.test(this.state.user_mobile)) {
                      this.setState({
                        errorMsg: "请输入正确手机号或邮箱",
                        disabled: true,
                      });
                      return;
                    } else {
                      this.setState({
                        errorMsg: '',
                        disabled: false,
                      });
                    }
                  }}
                />
              </div>
              <input type="text" name="user_code" className="fillNone"/>
              <input type="password" name="firstPassword" className="fillNone"/>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入收到的验证码"
                  onChange={(e) => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />

                {this.state.liked ? <button
                  className="btn-primary gray"
                >
                  {this.state.count}秒后重新发送
                </button> : <button
                  className="btn-primary"
                  disabled={disabled}
                  onClick={
                    async () => {
                      const { user_mobile: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                      await this.handleClick({ userLogin, receiverType, sendType });

                    }
                  }
                >
                  获取验证码
                </button>}
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  // name="firstPassword"
                  placeholder="请输入不少于8位的密码，包含数字、字母"
                  onChange={(e) => {
                    this.setState({ user_firstPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  // name="lastPassword"
                  placeholder="请重复密码"
                  onChange={e => {
                    this.setState({ user_lastPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-operation">
                <div className="thirty-checkbox">
                  <input
                    type="checkbox"
                    onChange={e => {
                      let remember = e.currentTarget.checked;
                      if (remember) {
                        this.setState({
                          read: true
                        });
                      } else {
                        this.setState({
                          read: false
                        });
                      }
                    }}
                  />
                  <span>我已阅读并同意</span>
                  <Link to="/rule" target="_blank">IP二厂服务协议</Link>
                  <Link to="/use" target="_blank">法律声明</Link>
                  <span>和</span>
                  <Link to="/rights" target="_blank">隐私政策</Link>
                </div>
              </div>
            </div>
            <div className={this.state.btnNum === 2 ? "input-form-email" : "input-display"}>

              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入企业名称"
                  onChange={e => {
                    this.setState({ company_name: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入企业邮箱或手机号，它将用于登陆或找回密码"
                  onChange={e => {
                    this.setState({ email_number: e.currentTarget.value });
                  }}
                />
              </div>

              <input type="text" name="email_code" className="fillNone"/>
              <input type="password" name="password" className="fillNone"/>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  // name="email_code"
                  placeholder="请输入收到的验证码"
                  onChange={(e) => {
                    this.setState({ email_code: e.currentTarget.value });
                  }}
                />
                {this.state.likedEmail ? <button
                  className="btn-primary gray"
                  id="getMessage"
                >
                  {this.state.countEmail}秒后重新发送
                </button> : <button
                  className="btn-primary"
                  id="getMessage"
                  onClick={async () => {
                    const { email_number: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                    await this.handleClickEmail({ userLogin, receiverType, sendType });
                  }}
                >
                  获取验证码
                </button>}
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  // name="password"
                  placeholder="请输入不少于8位的密码，包含数字、字母"
                  onChange={(e) => {
                    this.setState({ email_firstPassword: e.currentTarget.value });
                  }}
                />
              </div>

              <div className="form-group input-pass">
                <input
                  type="password"
                  className="form-control"
                  // name="lastPassword"
                  placeholder="请重复密码"
                  onChange={(e) => {
                    this.setState({ email_lastPassword: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-operation">
                <div className="thirty-checkbox">
                  <input
                    type="checkbox"
                    onChange={e => {
                      let remember = e.currentTarget.checked;
                      if (remember) {
                        this.setState({
                          readEmail: true
                        });
                      } else {
                        this.setState({
                          readEmail: false
                        });
                      }
                    }}
                  />
                  <span>我已阅读并同意</span>
                  <Link to="/rule" target="_blank">IP二厂服务协议</Link>
                  <Link to="/use" target="_blank">法律声明</Link>
                  <span>和</span>
                  <Link to="/rights" target="_blank">隐私政策</Link>
                </div>
              </div>
            </div>

            <div className={this.state.btnNum === 1 ? "backWhite paddingTop74" : 'backWhite'}>
              <button
                className="form-group login-btn-area"
                onClick={
                  async () => {
                    // this.checkPassword();
                    let isSuccess: any = null;
                    let isValidate: any = null;
                    let path = '';
                    if (this.state.btnNum === 1) {
                      isValidate = this.filterParams();
                    } else if (this.state.btnNum === 2) {
                      isValidate = this.filterEmailParams();
                    }
                    if (isValidate) {
                      if (this.state.btnNum === 1) { // 个人注册
                        const { user_mobile, user_code, user_firstPassword, btnNum }: Readonly<any> = this.state;
                        isSuccess = await onRegister({
                          userLogin: user_mobile,
                          code: user_code,
                          userPass: user_firstPassword,
                          userAttribute: btnNum,
                          type: Type
                        });
                        path = '/login-old';
                      } else if (this.state.btnNum === 2) { // 企业注册
                        const { company_name, email_number, email_code, email_firstPassword, btnNum }: Readonly<any> = this.state;
                        isSuccess = await onRegister({
                          userLogin: email_number,
                          code: email_code,
                          userPass: email_firstPassword,
                          userAttribute: btnNum,
                          companyName: company_name,
                          type: Type
                        });
                      }

                      if (isSuccess.request) {
                        this.setState({ message: isSuccess.message, show: true });
                        setTimeout(() => {
                          this.state.btnNum === 2 ? this.props.history.push('/login-old/2') : this.props.history.push('/login-old');
                        }, 800);
                      } else {
                        this.setState({ message: isSuccess.message, show: true });
                      }
                    }
                  }}>
                <span>立即注册</span>
              </button>
            </div>

            <div className="form-group no-account">
              已经有账号? <Link to="login">立即登录</Link>
            </div>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy;2019 沪ICP备18022525号. All rights reserved. </span>
        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={2}
          message={this.state.message}
        />}
        <Rule
          onClose={() => {
            this.setState({
              ruleShow: false
            });
          }}
          ruleShow={ruleShow}
        />
      </div>
    );
  }
}
