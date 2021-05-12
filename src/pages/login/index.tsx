import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/login.scss";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import icAll from "@assets/images/ic_AII.svg";
import icTips from "@assets/images/ic_tips.svg";
import ipec_logo from "@assets/images/login/logo.png";
import { onCodeReg } from "@utils/api";

interface ILoginState {
  user_name: string;
  password: string;
  company_password: string;
  v_name: string;
  company_unik: string;
  rememberPassword: boolean;
  show: boolean;
  message: string;
  errorMessage: string;
  type: number;
  user_code: string;
  disabled: boolean;
  count: number;
  liked: boolean;
}

enum ActiveType {
  password = 1,
  verification = 2,
}

@inject("login", "user")
@observer
export default class Login extends React.Component<IProps, ILoginState> {
  state = {
    errorMessage: "",
    user_name: "",
    password: "",
    rememberPassword: false,
    show: false,
    message: "",
    company_unik: "",
    v_name: "",
    company_password: "",
    type: this.props.location.state
      ? this.props.location.state.type
      : ActiveType.password,
    user_code: "",
    count: 60,
    liked: false,
    disabled: false,
  };

  async componentDidMount() {
    document.title = "IP二厂-登陆";
    const { type }: any = this.props.match.params;
    if (Number(type) > ActiveType.password) {
      console.log(type);
      this.setState({ type: Number(type) });
    }
    this.isSign30();
  }

  isSign30() {
    const { login } = this.props;
    if (login.userInfo) {
      const oldTime = login.userInfo.time;
      const nowTime = Math.round(Number(new Date()));
      if (Number(oldTime) + 2592000000 >= nowTime) {
        localStorage.setItem("user", login.userInfo.user);
        login.updateUser(login.userInfo.user);
        this.props.history.push("/index");
      }
    }
  }

  private filterUser() {
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!this.state.user_name) {
      this.setState({ errorMessage: "请输入手机号/邮箱" });
      return false;
    }
    if (
      !mPatternEmail.test(this.state.user_name) &&
      !mPattern.test(this.state.user_name)
    ) {
      this.setState({ errorMessage: "请输入正确的手机号/邮箱" });
      return false;
    }
    if (!this.state.password) {
      this.setState({ errorMessage: "请输入密码" });
      return false;
    }
    this.setState({ errorMessage: "" });
    return true;
  }

  private filterCompany() {
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!this.state.v_name) {
      this.setState({ errorMessage: "请输入手机号/邮箱/" });
      return false;
    }
    if (
      !mPatternEmail.test(this.state.v_name) &&
      !mPattern.test(this.state.v_name)
    ) {
      this.setState({ errorMessage: "请输入正确的手机号/邮箱" });
      return false;
    }
    if (!this.state.user_code) {
      this.setState({ errorMessage: "请输入验证码" });
      return false;
    }
    this.setState({ errorMessage: "" });
    return true;
  }

  async handleClick({ userLogin, receiverType, sendType }) {
    let codeType: number;
    // let mPatternEmail = /^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

    if (this.state.v_name === "" || this.state.v_name === null) {
      this.setState({ message: "请输入手机号或邮箱", show: true });
      return;
    }
    if (
      !mPattern.test(this.state.v_name) &&
      !mPatternEmail.test(this.state.v_name)
    ) {
      this.setState({ message: "请输入正确手机号或邮箱", show: true });
      return;
    }
    // if (this.state.liked) {
    //   return;
    // }

    if (mPatternEmail.test(this.state.v_name)) codeType = 2;
    else codeType = 1;

    const data: any = await onCodeReg({
      userLogin,
      receiverType: codeType,
      sendType,
    });
    if (data.errorCode === "200") {
      this.setState({
        // type,
        message: data.result.errorMsg,
        show: true,
      });
      if (data.result.errorCode > 0) {
        this.setState({
          liked: true,
        });
        let count = this.state.count;
        const timer = setInterval(() => {
          this.setState(
            {
              count: count--,
            },
            () => {
              if (count === -1) {
                clearInterval(timer);
                this.setState({
                  liked: false,
                  count: 60,
                });
              }
            }
          );
        }, 1000);
      }
    } else {
      this.setState({ message: data.errorMsg, show: true });
    }
  }
  render() {
    const { login }: any = this.props;
    const { type, disabled } = this.state;
    return (
      <div className="container-all">
        <div className="backHome clearfix">
          <img src={ipec_logo} alt="" />
          <Link to="/">
            <span className="float_text">首页</span>
            <img className="float_img" src={icAll} alt="" />
          </Link>
        </div>
        <div className="container-login">
          <div className="login-content">
            <p className="login-content-title">欢迎登录IP二厂</p>
            <div className="login-main">
              <div className="login-title-area">
                <div
                  className={
                    type === ActiveType.password
                      ? "login-old-title active"
                      : "login-old-title"
                  }
                  onClick={() => {
                    this.setState({
                      type: ActiveType.password,
                      errorMessage: "",
                    });
                  }}
                >
                  <span className="login-p-text">密码登录</span>
                </div>
                <div
                  className={
                    type === ActiveType.verification
                      ? "login-old-title active last"
                      : "login-old-title"
                  }
                  onClick={() => {
                    this.setState({
                      type: ActiveType.verification,
                      errorMessage: "",
                    });
                  }}
                >
                  <span className="login-p-text">验证码登录</span>
                </div>
              </div>
              {this.state.errorMessage !== "" && (
                <p className="messageTip">
                  <img src={icTips} alt="" />
                  <span>{this.state.errorMessage}</span>
                </p>
              )}

              {type === ActiveType.password && (
                <div>
                  <div className="form-group input-area">
                    <label>手机号或邮箱</label>
                    <input
                      type="text"
                      className="form-control"
                      name="user_name"
                      placeholder="请输入手机号/邮箱"
                      onChange={(e) => {
                        this.setState({ user_name: e.currentTarget.value });
                      }}
                    />
                  </div>
                  <div className="form-group input-area">
                    <label>密码</label>
                    <input
                      onChange={(e) => {
                        this.setState({ password: e.currentTarget.value });
                      }}
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="请输入不少于8位的密码，包含数字、字母"
                    />
                  </div>
                </div>
              )}
              {type === ActiveType.verification && (
                <div>
                  <div className="form-group input-area">
                    <label>手机号或邮箱</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company_name"
                      placeholder="请输入手机号或邮箱"
                      onChange={(e) => {
                        this.setState({ v_name: e.currentTarget.value });
                      }}
                    />
                  </div>
                  <div className="form-group code-area">
                    <label>验证码</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="请输入收到的验证码"
                      onChange={(e) => {
                        this.setState({ user_code: e.currentTarget.value });
                      }}
                    />

                    {this.state.liked ? (
                      <button className="btn-primary gray">
                        {this.state.count}秒后重新发送
                      </button>
                    ) : (
                      <button
                        className="btn-primary"
                        disabled={disabled}
                        onClick={async () => {
                          const {
                            v_name: userLogin,
                            btnNum: receiverType,
                            sendNum: sendType,
                          }: Readonly<any> = this.state;
                          await this.handleClick({
                            userLogin,
                            receiverType,
                            sendType: 5,
                          });
                        }}
                      >
                        获取验证码
                      </button>
                    )}
                  </div>
                </div>
              )}
              {type === ActiveType.password && (
                <div className="form-group form-operation">
                  <div className="thirty-checkbox">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        let rememberPassword = e.currentTarget.checked;
                        this.setState({ rememberPassword });
                      }}
                    />
                    <span>30天之内免登录</span>
                  </div>
                  <Link to="/authentication">找回密码</Link>
                </div>
              )}
              <button
                onClick={async () => {
                  let isValidate: any = null;
                  if (type === ActiveType.password) {
                    isValidate = this.filterUser();
                  } else if (type === ActiveType.verification) {
                    isValidate = this.filterCompany();
                  }
                  if (isValidate) {
                    let isSuccess: any;
                    const {
                      user_name,
                      password,
                      v_name,
                      user_code,
                      company_name,
                      company_password,
                      rememberPassword: remember,
                    }: any = this.state;
                    if (type === ActiveType.password) {
                      isSuccess = await login.doLogin({
                        userLogin: user_name,
                        userPass: password,
                        // userAttribute: '1',
                        remember,
                      });
                    } else if (type === ActiveType.verification) {
                      isSuccess = await login.doLogin({
                        userLogin: v_name,
                        code: user_code,
                        // userAttribute: '2',
                        // remember
                      });
                    }
                    if (isSuccess.request) {
                      let historyUrl = localStorage.getItem("historyUrl");
                      if (historyUrl) {
                        this.props.history.push(`/${historyUrl}`);
                      } else {
                        this.props.history.push(`/`);
                      }
                    } else {
                      this.setState({ message: isSuccess.message, show: true });
                    }
                  }
                }}
                className={
                  type === ActiveType.password
                    ? "login-btn-area btn-primary margin55"
                    : "login-btn-area btn-primary margin87"
                }
              >
                <span>立即登录</span>
              </button>

              <div className="form-group no-account">
                还没有账号? <Link to="/register">立即注册</Link>
              </div>
            </div>
          </div>
        </div>
        <span className="bottom-txt">
          Copyright &copy; 2019 沪ICP备18022525号. All rights reserved.
        </span>

        {this.state.show && (
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />
        )}
      </div>
    );
  }
}
