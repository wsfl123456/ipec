import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/update_password.scss";
import icTips from "@assets/images/ic_tips.svg";
import icAll from "@assets/images/ic_AII.svg";
import {Link} from "react-router-dom";
import Toast from "@components/toast";
import _isObject from "lodash/isObject";

interface IUpPasswordState {
  user_name: string;
  firstPassword: string;
  lastPassword: string;
  errorMassege: string;
  code: string;
  show: boolean;
  message: string;
}

@inject("upPassword")
@observer
export default class Login extends React.Component<IProps, IUpPasswordState> {
  constructor(props: any) {
    super(props);
    this.state = {
      errorMassege: '',
      user_name: "",
      firstPassword: "",
      lastPassword: "",
      code: "",
      show: false,
      message: "",
    };
  }

  componentDidMount() {
    this.getUserCode();
  }

  private filterParams() {
    if (!this.state.firstPassword) {
      this.setState({ errorMassege: "请输入新密码" });
      return false;
    }
    let mPatternPass = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)[a-zA-Z\d!@#$%^&*_]+$/;
    if (!mPatternPass.test(this.state.firstPassword) || this.state.firstPassword.length < 8) {
      this.setState({ errorMassege: "密码格式错误！(长度不小于8位数的数字、字母或特殊字符组合)" });
      return false;
    }
    if (!this.state.lastPassword) {
      this.setState({ errorMassege: "请重复输入一次新密码" });
      return false;
    }
    if (this.state.firstPassword !== this.state.lastPassword) {
      this.setState({ errorMassege: "请输入相同密码"});
      return false;
    }
    this.setState({ errorMassege: ''});
    return true;
  };

  getUserCode() {
    let code = localStorage.getItem("code");
    let user_name = localStorage.getItem("userLogin");
    console.log(localStorage.getItem("code"), localStorage.getItem("userLogin"));
    if (`${code}` !== `${JSON.stringify(this.state.code)}` && `${user_name}` !== `${JSON.stringify(this.state.user_name)}`) {
      if (code && user_name) {
        code = JSON.parse(code);
        user_name = JSON.parse(user_name);
      }
      this.setState({
        code, user_name
      });
    }
  }

  render() {
    const { upPassword: { onForgetPassWord } }: any = this.props;
    return (
      <div className="container-all">
        <div className="backHome clearfix">
            {/* <img src={ipec_logo} alt="" /> */}
            <Link to="/">
              <span className="float_text" >IP二厂首页</span>
              <img className="float_img" src={icAll} alt=""/>
            </Link>
        </div>
        <div className="container-upPass">
          <div className="upPass_img">
          </div>
          <div className="upPass-content">
            {/* <img src={ipec_logo} alt=""/> */}
            <div className="upPass-title-area">
              <div className="upPass-title">
                <span className="upPass-p-text">修改密码</span>
              </div>
            </div>
            {
                this.state.errorMassege !== '' && <p className="messageTip">
                <img src={icTips} alt=""/>
                <span>{this.state.errorMassege}</span>
              </p>
            }
            <div className="form-group input-area">
              <input
                type="password"
                className="form-control"
                name="firstPassword"
                placeholder="请输入您的新密码"
                onChange={e => {
                  this.setState({ firstPassword: e.currentTarget.value });
                }}
              />
            </div>
            <div className="form-group input-area">
              <input
                type="password"
                className="form-control"
                name="lastPassword"
                placeholder="请重复一次新密码"
                onChange={e => {
                  this.setState({ lastPassword: e.currentTarget.value });
                }}
              />
            </div>
            <button
              className="form-group upPass-btn-area btn-primary"
              onClick={
                async () => {
                  let isValidate = this.filterParams();
                  if (isValidate) {
                    const { user_name: userLogin, firstPassword: userPass, code: code }: Readonly<any> = this.state;
                    let isSuccess = await onForgetPassWord({ userLogin, userPass, code });
                    if (_isObject(isSuccess)) {
                      this.setState({ message: (isSuccess as any).message, show: true });
                    } else if (typeof isSuccess === "boolean" && this.state.firstPassword === this.state.lastPassword) {
                      this.props.history.push("/login-old");
                    }
                  }
                }}
            >
              <span>完成</span>
            </button>
          </div>
        </div>
        <span className="bottom-txt">Copyright &copy; 2018 www.indexip.cn</span>
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
