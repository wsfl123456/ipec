import * as React from "react";
import "@assets/scss/login_old.scss";
import Toast from "@components/toast";
import icTips from "@assets/images/ic_tips.svg";
import second_logo from '@assets/images/ip_logo/logo.jpg';
import icAll from "@assets/images/ic_AII.svg";
import { onCodeReg, reqLoginThree } from '@utils/api';
import { Link } from 'react-router-dom';
import { message, } from 'antd';

interface ILoginState {
  user_name: string;
  code: string;
  show: boolean;
  message: string;
  errorMsg: string;
  count: number; // 验证码秒数为30秒
  liked: boolean;
}

export default class LoginOther extends React.Component<IProps, ILoginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user_name: "",
      code: "",
      show: false,
      message: "",
      errorMsg: "",
      count: 60,
      liked: false,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-第三方登陆";
  }

  private filterUser() {
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!this.state.user_name) {
      this.setState({ errorMsg: "请输入手机号" });
      return false;
    }
    if (!mPattern.test(this.state.user_name)) {
      this.setState({ errorMsg: "请输入正确的手机号" });
      return false;
    }
    if (!this.state.code) {
      this.setState({ errorMsg: "请输入验证码" });
      return false;
    }
    this.setState({ errorMsg: '' });
    return true;
  }

  // 获取验证码倒计时-手机
  async handleClick() {
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (this.state.user_name === "" || this.state.user_name === null) {
      this.setState({ errorMsg: "请输入手机号", message: "请输入手机号", show: true });
      return;
    }
    if (!mPattern.test(this.state.user_name)) {
      this.setState({ errorMsg: "请输入正确手机号", message: "请输入正确手机号", show: true });
      return;
    }
    if (this.state.liked) {
      return;
    }
    if (this.state.user_name) {
      const data: any = await onCodeReg({ userLogin: this.state.user_name, receiverType: 1, sendType: 5 });
      if (data.errorCode === "200") {
        this.setState({ message: data.result.errorMsg, show: true });
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
    } else {
      this.setState({
        errorMsg: "请输入正确手机号",
      });
    }
  };

  render() {
    return (
      <div className="container-all">
        <div className="backHome clearfix">
          <Link to="/">
            <span className="float_text">IP二厂首页</span>
            <img className="float_img" src={icAll} alt=""/>
          </Link>
        </div>
        <div className="container-login">
          <div className="login_img"/>
          <div className="login-content login-other">
            <div className="login-logo-container">
              <img src={second_logo} alt=""/>
              <p>欢迎使用中国品牌授权者联盟账号登录IP二厂</p>
            </div>
            {
              this.state.errorMsg !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMsg}</span>
              </p>
            }
            <div className="form-group input-area">
              <input
                type="text"
                className="form-control"
                name="user_name"
                placeholder="请输入手机号"
                onChange={e => {
                  this.setState({ user_name: e.currentTarget.value });
                }}/>
            </div>
            <div className="form-group code-area-other">
              <input type="text" className="form-control code-other-input" placeholder="请输入收到的验证码"
                     onChange={(e) => {
                       this.setState({ code: e.currentTarget.value });
                     }}/>
              {this.state.liked ?
                <button className="btn-primary gray">
                  {this.state.count}秒后重新发送
                </button>
                :
                <button className="btn-primary" onClick={
                  async () => {
                    await this.handleClick();
                  }}>
                  获取验证码
                </button>}
            </div>
            <button
              onClick={async () => {
                const isValidate = this.filterUser();
                if (isValidate) {
                  const { user_name, code } = this.state;
                  const result: any = await reqLoginThree({
                    userLogin: user_name,
                    code
                  });
                  if (result.errorCode === "200" && result.result.errorCode === 200) {
                    localStorage.setItem("user", JSON.stringify(result.result.data));
                    this.props.history.push("/");
                  } else if (result.errorCode === "200" && result.result.errorCode === -1) {
                    message.warning(result.result.errorMsg);
                    this.props.history.push("/register-old");
                  } else {
                    message.error(result.result.errorMsg);
                  }
                }
              }}
              className=" login-btn-area btn-primary">
              <span>立即登录</span>
            </button>
            <p className="form-group no-account">IP二厂账号 <Link to='/login'>登陆</Link></p>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2019 京ICP备05031553号-14</span>
        {this.state.show &&
        <Toast
          onClose={() => {
            this.setState({ show: false });
          }}
          duration={2}
          message={this.state.message}/>}
      </div>
    );
  }
}
