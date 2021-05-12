import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/authentication.scss";
// import ipec_logo from "@assets/images/logo2.0.png";
import ipec_logo from "@assets/images/logo1.png";
import mobile_register from "@assets/images/user/ic_iphone_pre.svg";
import email_register from "@assets/images/user/ic_mail_pre.svg";
import icTips from "@assets/images/ic_tips.svg";
import icAll from "@assets/images/ic_AII.svg";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";
import { Link } from "react-router-dom";
import { onCodeReg } from "@utils/api";

interface IBackState {
  btnNum: Number;
  sendNum: Number;
  user_code: string;
  user_pass: string;
  user_rpass: string;
  user_name: string;
  errorMassege: string;
  count: number;
  countEmail: number;
  liked: boolean;
  likedEmail: boolean;
  userLogin: string;
  message: string;
  show: boolean;
}

@inject("authentication")
@observer
export default class Register extends React.Component<IProps, IBackState> {
  constructor(props: any) {
    super(props);
    this.state = {
      errorMassege: '',
      btnNum: 1,
      sendNum: 2, // 1.注册 2.修改密码 3.实名认证
      user_name: "",
      user_code: "",
      user_pass: "",
      user_rpass: "",
      count: 60, // 秒数为30秒
      countEmail: 60, // 验证码秒数为30秒
      liked: false,
      likedEmail: false,
      userLogin: "",
      message: "",
      show: false,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-忘记密码";
  }

  onSubmitResult(code: any, userLogin: any) {
    localStorage.setItem("code", JSON.stringify(code)); // 验证码
    localStorage.setItem("userLogin", JSON.stringify(userLogin)); // 保存用户名
  }

  setMenuNum = (num: number) => {
    this.setState({
      btnNum: num,
      errorMassege: '',
    });
  };

  private filterParams(bolen: boolean) {
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.user_name === "" || this.state.user_name === null) {
      this.setState({ errorMassege: "请输入手机号"});
      return false;
    }
    if (!mPattern.test(this.state.user_name)) {
      this.setState({ errorMassege: "请输入正确手机号"});
      return false;
    }
    if (bolen) {
      if (this.state.user_code === "" || this.state.user_code === null) {
        this.setState({ errorMassege: "请输入验证码"});
        return false;
      }
    }
    this.setState({ errorMassege: ""});
    return true;
  }

  private filterEmailParams(bolen: boolean) {
    // let mPatternEmail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|\.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    if (this.state.user_name === "" || this.state.user_name === null) {
      this.setState({ errorMassege: "请输入邮箱号"});
      return false;
    }
    if (!mPatternEmail.test(this.state.user_name)) {
      this.setState({ errorMassege: "请输入正确邮箱号"});
      return false;
    }
    if (bolen) {
      if (this.state.user_code === "" || this.state.user_code === null) {
        this.setState({ errorMassege: "请输入验证码"});
        return false;
      }
    }
    this.setState({ errorMassege: ""});
    return true;
  }

  // 获取验证码倒计时-手机
  async handleClick({ userLogin, receiverType, sendType }) {
    if (this.state.liked) {
      return;
    }
    if (this.state.user_name) {

      const data: any = await onCodeReg({ userLogin, receiverType, sendType });
      if (data.errorCode === "200") {
        this.setState({ message: data.result.errorMsg, show: true });
        if (data.result.errorCode > 0) {
          let count = this.state.count;
          this.setState({
            liked: true
          });
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

    } else {
      this.setState({ message: "请输入正确手机号", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入正确手机号" />;
    }

  };

  // 获取验证码倒计时-邮箱
  async handleClickEmail({ userLogin, receiverType, sendType }) {
    if (this.state.likedEmail) {
      return;
    }
    if (this.state.user_name) {
      const data: any = await onCodeReg({ userLogin, receiverType, sendType });
      if (data.errorCode === "200") {
        this.setState({ message: data.result.errorMsg, show: true });
        if (data.result.errorCode > 0) {
          let countEmail = this.state.countEmail;
          this.setState({
            likedEmail: true
          });
          const timer = setInterval(() => {
            this.setState({
              countEmail: (countEmail--)
            }, () => {
              if (countEmail === -1) {
                clearInterval(timer);
                this.setState({
                  liked: false,
                  countEmail: 60
                });
              }
            });
          }, 1000);
        }
      } else {
        this.setState({ message: data.errorMsg, show: true });
      }

    } else {
      this.setState({ message: "请输入正确邮箱", show: true });
      <Toast onClose={() => {
        this.setState({ show: false });
      }} duration={2} message="请输入正确邮箱" />;
    }
  };

  render() {
    const { authentication: { onForgetPassWordNext, onCodeReg } }: any = this.props;
    return (
      <div className="container-all">
        <div className="backHome clearfix">
            {/* <img src={ipec_logo} alt="" /> */}
            <Link to="/">
              <span className="float_text" >IP二厂首页</span>
              <img className="float_img" src={icAll} alt=""/>
            </Link>
        </div>
        <div className="container-authentication">
          <div className="authentication_img">
          </div>

          <div className="authentication-content">
            {/* <img src={ipec_logo} alt="" /> */}
            <ul className="authentication-title-area">
              <li className={this.state.btnNum === 1 ? "authentication-title" : "input-mobile-display"}
                onClick={() => this.setMenuNum(1)}>
                <img src={mobile_register} className="mobile_img" />
                <span className="authentication-p-text">手机</span>
              </li>
              <li className={this.state.btnNum === 2 ? "authentication-title-email" : "input-mobile-display"}
                onClick={() => this.setMenuNum(2)}>
                <img src={email_register} className="mobile_img" />
                <span className="authentication-p-text">邮箱</span>
              </li>
            </ul>
            <div className={this.state.btnNum === 1 ? "mobile-auth" : "auth-display"}>

              {
                this.state.errorMassege !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMassege}</span>
              </p>
              }
              <input type="text" name="user_name" className="fillNone" />
              <input type="password" name="user_code" className="fillNone" />
              <div className="form-group input-area isPhone">
                <span>+86</span>
                <input
                  type="text"
                  className="form-control register-phone"
                  // name="user_name"
                  placeholder="请输入您注册的手机号"
                  onChange={e => {
                    this.setState({ user_name: e.currentTarget.value });
                  }} />
              </div>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  // name="user_code"
                  placeholder="输入6位短信验证码"
                  onChange={e => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn btn-primary"
                  id="getMessage"
                  onClick={
                    async () => {
                      let isValidate = this.filterParams(false);
                      if (isValidate) {
                        const { user_name: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                        this.handleClick({ userLogin, receiverType, sendType });
                      }
                    }
                  }
                >
                  {this.state.liked ? `${this.state.count}秒后重新发送` : "获取验证码"}
                </button>
              </div>
              <button
                className="form-group next-btn-area btn-primary"
                onClick={async () => {
                  let isValidate = this.filterParams(true);
                  if (isValidate) {
                    const { user_name: userLogin, user_code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWordNext({ userLogin, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: isSuccess['message'], show: true });
                    } else if (typeof isSuccess === "boolean") {
                      this.props.history.push("/update-password");
                      this.onSubmitResult(code, userLogin);
                    }
                  }
                }}
              >
                <span>下一步</span>
              </button>
              <div className="back-login">
                <Link to="login">返回登录</Link>
              </div>
            </div>

            <input type="text" name="email" className="fillNone" />
            <input type="password" name="code" className="fillNone" />
            <div className={this.state.btnNum === 2 ? "email-auth" : "auth-display"}>

              {
                this.state.errorMassege !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMassege}</span>
              </p>
              }
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control"
                  // name="email"
                  placeholder="请输入您注册的邮箱号"
                  onChange={e => {
                    this.setState({ user_name: e.currentTarget.value });
                  }}
                />
              </div>
              <div className="form-group code-area">
                <input
                  type="text"
                  className="form-control code-input"
                  // name="code"
                  placeholder="输入邮箱中收到的验证码"
                  onChange={e => {
                    this.setState({ user_code: e.currentTarget.value });
                  }}
                />
                <button
                  className="btn btn-primary"
                  id="getMessage"
                  onClick={
                    async () => {
                      let isValidate = this.filterEmailParams(false);
                      if (isValidate) {
                        const { user_name: userLogin, btnNum: receiverType, sendNum: sendType }: Readonly<any> = this.state;
                        this.handleClickEmail({ userLogin, receiverType, sendType });

                      }
                    }
                  }
                >
                  {this.state.likedEmail ? `${this.state.countEmail}秒后重新发送` : "获取验证码"}
                </button>
              </div>
              <button
                className="form-group next-btn-area btn-primary"
                onClick={async () => {
                  let isValidate = this.filterEmailParams(true);
                  if (isValidate) {
                    const { user_name: userLogin, user_code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWordNext({ userLogin, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: isSuccess['message'], show: true });
                    } else if (typeof isSuccess === "boolean") {
                      this.props.history.push("/update-password");
                      this.onSubmitResult(code, userLogin);
                    }
                  }
                }}
              >
                <span>下一步</span>
              </button>
              <div className="back-login">
                <Link to="login">返回登录</Link>
              </div>
            </div>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2019 京ICP备05031553号-14</span>
        {this.state.show &&
          <Toast
            onClose={() => {
              this.setState({ show: false });
            }}
            duration={2}
            message={this.state.message}
          />}
      </div>
    );
  }
}
