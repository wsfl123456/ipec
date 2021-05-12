import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/login_old.scss";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import icAll from "@assets/images/ic_AII.svg";
import icTips from "@assets/images/ic_tips.svg";

interface ILoginState {
  user_name: string,
  password: string,
  company_password: string,
  company_name: string,
  company_unik: string,
  rememberPassword: boolean,
  show: boolean,
  message: string,
  errorMessage: string,
  type: number,
}

enum ActiveType {
  Person = 1,
  Company = 2,
}

@inject("login", 'user')
@observer
export default class Login extends React.Component<IProps, ILoginState> {
  state = {
    errorMessage: '',
    user_name: "",
    password: "",
    rememberPassword: false,
    show: false,
    message: "",
    company_unik: "",
    company_name: "",
    company_password: "",
    type: this.props.location.state ? this.props.location.state.type : ActiveType.Person,
  };

  async componentDidMount() {
    document.title = "IP二厂-登陆";
    const { type }: any = this.props.match.params;
    if (Number(type) > ActiveType.Person) {
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
      if ((Number(oldTime) + 2592000000) >= nowTime) {
        localStorage.setItem("user", login.userInfo.user);
        login.updateUser(login.userInfo.user);
        this.props.history.push('/index');
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
    if (!mPatternEmail.test(this.state.user_name) && !mPattern.test(this.state.user_name) ) {
      this.setState({ errorMessage: "请输入正确的手机号/邮箱" });
      return false;
    }
    if (!this.state.password) {
      this.setState({ errorMessage: "请输入密码" });
      return false;
    }
    this.setState({ errorMessage: '' });
    return true;
  }

  private filterCompany() {
    let mPatternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
    // let mPatternEmail = /^([a-z0-9A-Z]+[_|.]?)+[a-z0-9A-Z]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let mPattern = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!this.state.company_name) {
      this.setState({ errorMessage: "请输入注册的企业邮箱/手机号" });
      return false;
    }
    if (!mPatternEmail.test(this.state.company_name) && !mPattern.test(this.state.company_name)) {
      this.setState({ errorMessage: "请输入正确的手机号/邮箱" });
      return false;
    }
    if (!this.state.company_password) {
      this.setState({ errorMessage: "请输入密码" });
      return false;
    }
    this.setState({ errorMessage: '' });
    return true;
  }

  render() {
    const { login }: any = this.props;
    const { type } = this.state;
    return (
      <div className="container-all">
        <div className="backHome clearfix">
          <Link to="/">
            <span className="float_text">IP二厂首页</span>
            <img className="float_img" src={icAll} alt=""/>
          </Link>
        </div>
        <div className="container-login">
          <div className="login_img">
          </div>
          <div className="login-content">
            <div className="login-title-area">
              <div
                className={type === ActiveType.Person ? "login-old-title active" : "login-old-title"}
                onClick={() => {
                  this.setState({
                    type: ActiveType.Person,
                    errorMessage: ''
                  });
                }}>
                <span className="login-p-text">个人登录</span>
              </div>
              <div
                className={type === ActiveType.Company ? "login-old-title active" : "login-old-title"}
                onClick={() => {
                  this.setState({
                    type: ActiveType.Company,
                    errorMessage: ''
                  });
                }}>
                <span className="login-p-text">企业登录</span>
              </div>
            </div>
            {
              this.state.errorMessage !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMessage}</span>
              </p>
            }

            {
              type === ActiveType.Person && <div>
                <div className="form-group input-area">
                  <input
                    type="text"
                    className="form-control"
                    name="user_name"
                    placeholder="请输入手机号/邮箱"
                    onChange={e => {
                      this.setState({ user_name: e.currentTarget.value });
                    }}/>
                </div>
                <div className="form-group input-area">
                  <input
                    onChange={e => {
                      this.setState({ password: e.currentTarget.value });
                    }}
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="请输入不少于8位的密码，包含数字、字母"/>
                </div>
              </div>
            }
            {
              type === ActiveType.Company && <div>
                <div className="form-group input-area">
                  <input
                    type="text"
                    className="form-control"
                    name="company_name"
                    placeholder="请输入注册的企业邮箱/手机号"
                    onChange={e => {
                      this.setState({ company_name: e.currentTarget.value });
                    }}/>
                </div>
                <div className="form-group input-area">
                  <input
                    onChange={e => {
                      this.setState({ company_password: e.currentTarget.value });
                    }}
                    type="password"
                    className="form-control"
                    name="company_password"
                    placeholder="请输入不少于8位的密码，包含数字、字母"/>
                </div>
              </div>
            }
            <div className="form-group form-operation">
              <div className="thirty-checkbox">
                <input
                  type="checkbox"
                  onChange={e => {
                    let rememberPassword = e.currentTarget.checked;
                    this.setState({ rememberPassword });
                  }}
                />
                <span>30天之内免登录</span>
              </div>
              <Link to="/authentication">忘记密码?</Link>
            </div>

            <button
              onClick={async () => {
                let isValidate: any = null;
                if (type === ActiveType.Person) {
                  isValidate = this.filterUser();
                } else if (type === ActiveType.Company) {
                  isValidate = this.filterCompany();
                }
                if (isValidate) {
                  let isSuccess: any;
                  const { user_name, password, company_name, company_password, rememberPassword: remember }: any = this.state;
                  if (type === ActiveType.Person) {
                    isSuccess = await login.doLogin({
                      userLogin: user_name,
                      userPass: password,
                      userAttribute: '1',
                      remember
                    });
                  } else if (type === ActiveType.Company) {
                    isSuccess = await login.doLogin({
                      userLogin: company_name,
                      userPass: company_password,
                      userAttribute: '2',
                      remember
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
              className="login-btn-area btn-primary">
              <span>立即登录</span>
            </button>

            <div className="form-group no-account">
              还没有账号? <Link to="/register">立即注册</Link>
            </div>
            <div className="chinaUnion">
              {/*<p>中国品牌授权联盟账号登录</p>*/}
              {/*<div className="img" onClick={() => this.props.history.push('/login-old-other')}/>*/}
            </div>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2019 沪ICP备18022525号. All rights reserved.</span>

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
