import * as React from "react";
import "@assets/scss/model.scss";
import icon_close from "@assets/images/ic_close.png";
import { inject } from 'mobx-react';

interface IModelProps extends IComponentProps {
  onClose: Function,
  ruleShow: any,
}

interface IModelState {
  result: any,
  // uploadBox: boolean;
  // isAlert: boolean;
  // message: string;
}

@inject('register')
export default class Rule extends React.Component<IModelProps, IModelState> {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      // uploadBox: true,
      // isAlert: false,
      // message: "",
    };
  }

  render() {
    const { onClose, ruleShow } = this.props;
    // const { uploadBox, isAlert, message, result } = this.state;
    let isShow = ruleShow ? 'show' : 'hidden';
    return (
      <div className={`mockboxPopup ${isShow}`}>
        <div className="mockbox">
          <div className="content">
            <div className="clearfix"
                 onClick={() => {
                   onClose();
                 }}><img src={icon_close} alt=""/>
            </div>
            <h3>《IP二厂平台用户管理规定及信息处理协议》</h3>
            <br/>
            <p> 我已阅读并同意《IP二厂平台用户管理规定及信息处理协议》，并为本单位所上传IP信息和数据的合法性、真实性负责。</p>
            <br/>
            <p>1） 本单位为所上传IP内容的合法性和真实性负责，且确认所上传IP在登陆本网站之前没有任何知识产权纠纷。</p>

            <p> 2） 本单位同意IP二厂对我方所上传IP进行全网范围的信息收集与分析。</p>
            <p> 3） IP二厂所有数据内容均来自公开引用资源，所有视频及图文版权均归原作者及其网站所有。任何存在于IP二厂上的视频、图文资料均系他人制作或提供，不代表IP二厂立场。</p>
            <p> 4）
              IP二厂展示的任何文本、图片、图形、音频、视频资料均受版权、商标、其它财产所有权法律的保护，未经相关权利人同意，上述资料均不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。IP二厂不就上述资料的不准确、错误和遗漏或由此产生的任何损害赔偿、以任何形式向用户或任何第三方负责。 </p>
            <p>5） IP二厂给予每个用户一个用户帐号及相应密码，该用户帐号和密码由用户负责保管；用户对以其用户帐号进行的所有活动和事件负法律责任。</p>
            <p>6） 用户不应将其帐号、密码转让或出借予他人使用。如用户发现其帐号遭他人非法使用，应立即通知IP二厂。因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用，IP二厂不承担任何责任。</p>
            <p>7） 用户在使用IP二厂平台过程中，必须遵循以下原则：</p>
            <p>a)遵守中国有关的法律和法规；</p>
            <p>b)遵守所有与网络服务有关的网络协议、规定和程序；</p>
            <p>c)不得为任何非法目的而使用网络服务系统；</p>
            <p> d)不得以任何形式使用IP二厂网络服务侵犯IP二厂的商业利益；</p>
            <p>e)不得利用IP二厂网络服务进行任何可能对互联网或移动网正常运转造成不利影响的行为；</p>
            <p>f)不得利用IP二厂提供的网络服务上传、展示或传播任何虚假的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料</p>
            <p>g)不得侵犯其他任何第三方的专利权、著作权、商标权、名誉权或其他任何合法权益；</p>
            <p> h)不得利用IP二厂进行任何不利于IP二厂的行为； </p>
            <p> 8）
              IP二厂有权对用户使用本网站的情况进行审查和监督(包括但不限于对用户存储在IP二厂的内容进行审核)，如用户在使用网络服务时违反任何上述规定，IP二厂有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容等、暂停或终止用户使用网络服务的权利）以减轻用户不当行为造成的影响。 </p>
            <p>9） 保护用户隐私是IP二厂的一项基本政策，IP二厂保证不对外公开或向第三方提供单个用户的注册资料及用户在使用网络服务时存储在IP二厂的非公开内容，但下列情况除外： </p>
            <p>a)事先获得用户的明确授权； </p>
            <p>b)根据有关的法律法规要求；</p>
            <p>c)按照相关政府主管部门的要求；</p>
            <p>d)为维护社会公众的利益； </p>
            <p>e)为维护IP二厂的合法权益。 </p>
            <p>10） IP二厂对于用户上传的外部链接指向的不由IP二厂实际控制的任何网页上的内容不承担任何责任。</p>
            <p>11）
              IP二厂有权随时修改本协议的任何条款，一旦本协议的内容发生变动，IP二厂将会直接在IP二厂网站上公布修改之后的协议内容，该公布行为视为IP二厂已经通知用户修改内容。IP二厂也可通过其他适当方式向用户提示修改内容。 </p>
            <p>12） 用户继续使用网络服务，则视为接受IP二厂对本协议相关条款所做的修改。</p>
            <p>13） 本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。 </p>
            <p>14） 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>
          </div>
        </div>
      </div>
    );
  }
}
