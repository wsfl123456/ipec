import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/personal_homepage.scss";
import ScrollTop from "@components/scroll-top";
import {
  updateFocus,
  sendPrivateLetter,
  invitationSave, invitePersonalTime
} from '@utils/api';
import { Link } from "react-router-dom";
import { message, Modal, Input, Radio } from 'antd';
import _isEmpty from 'lodash/isEmpty';

const { TextArea } = Input;
import auth from "../../assets/images/user/attestation.svg";
import ic_no_result from "@assets/images/contrast/ic_result_iveness.png";
import default_img_ip from "@assets/images/user.svg";
import default_img from '@assets/images/default/ic_default_shu.png';
import DateTimePicker from '@components/date-time-picker';
import ic_hjhy from '@assets/images/user/ic_hjhy.svg';
import ic_zshy from '@assets/images/user/ic_zshy.svg';
import { toJS } from "mobx";

interface IPersonalHomePageState {
  hadLogin: boolean,
  letterShow: boolean,
  messageContent: string,
  visibleShow: boolean,
  teleRadio: number,
  invitationDate: string,
  invitationTime: string,
  invitationContactInformation: string,
  meetReason: string,
  reservation: any[],
}

@inject('personal_home')
@observer
export default class PersonalHomePage extends React.Component<IProps, IPersonalHomePageState> {
  state = {
    hadLogin: false,
    letterShow: false,
    messageContent: "",
    visibleShow: false,
    teleRadio: 2,
    invitationDate: "",
    invitationTime: "",
    invitationContactInformation: "",
    meetReason: "",
    reservation: [],
  };

  async componentDidMount() {
    document.title = "IP二厂-个人主页";
    const { id }: any = this.props.match.params;
    await this.props.personal_home.getPersonalInfo(id);
    await this.props.personal_home.getPersonalVisitor(id);
    const { personalInfo: personalSpaceInfo } = this.props.personal_home;
    const { result }: any = await invitePersonalTime(personalSpaceInfo.exhibitionGuid, personalSpaceInfo.userGuid);
    if (result) {
      this.setState({
        reservation: result,
      });
    }
  }

  // 点击邀TA会面
  private exhibitorBtn() {
    if (!localStorage.getItem("user")) {
      localStorage.setItem('historyUrl', `personal-homepage`);
      this.setState({ hadLogin: true });
    } else {
      this.setState({ visibleShow: true });
    }
  }

  private async sendInvite() {
    const { id: personalUserGuid }: any = this.props.match.params;
    const { personal_home } = this.props;
    const entity = {
      exhibitionCompanyGuid: personal_home.personalInfo.exhibitionCompanyGuid,
      exhibitionGuid: personal_home.personalInfo.exhibitionGuid,
      invitationDate: this.state.invitationDate,
      invitationNotifyContact: this.state.teleRadio,
      invitationContactInformation: this.state.invitationContactInformation,
      invitationPersonnel: JSON.parse(localStorage.getItem("user")).userGuid,
      invitationTime: this.state.invitationTime,
      meetAddress: personal_home.personalInfo.address,
      meetPersonnel: personalUserGuid,
      meetReason: this.state.meetReason
    };
    let { errorCode, result, errorMessage }: any = await invitationSave(entity);
    if (errorCode === '200' && result.errorCode === 200) {
      this.setState({
        visibleShow: !this.state.visibleShow
      });
      setTimeout(() => message.success(result.errorMsg), 1000);
    } else {
      result.errorMsg && message.error(result.errorMsg);
      errorMessage && message.error(errorMessage);
    }
  }

  teleRadioChange = e => {
    this.setState({
      teleRadio: e.target.value,
    });
  };
  inviteCancel = () => {
    this.setState({ visibleShow: false });
  };

  getDateAndTimeData(...args: any[]) {
    this.setState({
      invitationDate: args[0],
      invitationTime: args[1],
    });
  }

  // 点击关注
  async focus(value) {
    if (!localStorage.getItem("user")) {
      // message.warn("未登录，请登录")
      this.setState({ hadLogin: true });
      return;
    }
    const { id }: any = this.props.match.params;
    const userGuid = JSON.parse(window.localStorage.getItem("user")).userGuid;
    const entity = {
      "guid": [id],
      "isFollow": value,
      "type": 2,
      "userGuid": userGuid
    };
    await updateFocus(entity);
    await this.props.personal_home.getPersonalInfo(id);
  }

  focusCancel = () => {
    this.setState({ hadLogin: false });
  };

  // 发送私信
  sendLetter() {
    if (!localStorage.getItem("user")) {
      this.setState({ hadLogin: true });
    } else {
      this.setState({ letterShow: true });
    }
  }

  letterCancel() {
    this.setState({ messageContent: "", letterShow: false });
  }

  async sendLetters() {
    const messageContent = this.state.messageContent;
    const { id: receiveUserGuid }: any = this.props.match.params;
    const sendUserGuid = JSON.parse(localStorage.getItem("user")).userGuid;
    const entity = {
      newContent: messageContent,
      receiverGuid: receiveUserGuid,
      senderGuid: sendUserGuid
    };
    if (!messageContent) {
      message.warning("请输入您想要对TA说的话");
      return;
    }
    const { result, errorCode }: any = await sendPrivateLetter(entity);
    if (errorCode === '200') {
      this.setState({ messageContent: "", letterShow: false });
      message.success(result.errorMsg);
    } else {
      message.error(result.errorMsg);
    }
  }

  async componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IPersonalHomePageState>, snapshot?: any) {
    const { id }: any = this.props.match.params;
    if (prevProps.match.params['id'] !== this.props.match.params['id']) {
      await this.props.personal_home.getPersonalInfo(id);
      await this.props.personal_home.getPersonalVisitor(id);
    }
  }

  render() {
    const { personal_home } = this.props;
    const { teleRadio } = this.state;
    const { personalInfo: personalSpaceInfo, visitorList, } = personal_home;
    let memberLevel: number;
    let realStatus: number;
    if (!_isEmpty(personalSpaceInfo)) {
      memberLevel = personalSpaceInfo.memberLevel;
      realStatus = personalSpaceInfo.realStatus;
    }
    return (
      <div className="body">
        <div className="personal-homepage-container">
          {/* 封面及个人信息 */}
          <div className="cover">
            {/* 封面 粉丝 头像 关注 */}
            <div className="coverTop">
              <div className="fans">粉丝<span>{personalSpaceInfo.fans || 0}</span></div>
              <div className="Avatar">
                <img src={personalSpaceInfo.picUrl || default_img_ip} alt=''/>
              </div>
              <div className="attention">关注<span>{personalSpaceInfo.focus || 0}</span></div>
            </div>
            {/* 姓名 公司 三个Btn */}
            <div className="coverBottom">
              <div className="name">{personalSpaceInfo.userRealName}</div>
              {memberLevel === 1 && realStatus === 1 && <img src={auth} className="realStatus" alt=''/>}
              {memberLevel === 2 && <img src={ic_hjhy} className="realStatus" alt=''/>}
              {memberLevel === 3 && <img src={ic_zshy} className="realStatus" alt=''/>}
              {personalSpaceInfo.companyName &&
              <div className="job">
                {personalSpaceInfo.occupation}@
                <Link to={`/business-homepage/${personalSpaceInfo.companyGuid}`}>
                  <span>{personalSpaceInfo.companyName}</span>
                </Link>
              </div>
              }
              {personalSpaceInfo.isSelf !== 1 &&
              <div className="threeButton">
                {personalSpaceInfo.isExhibitor === 1 &&
                <div onClick={this.exhibitorBtn.bind(this)}>邀TA会面</div>
                }
                {
                  <div onClick={async () => {
                    const val = personalSpaceInfo.isFocus !== 1 ? 1 : 2;
                    await this.focus(val);
                  }}>{personalSpaceInfo.isFocus !== 1 ? '关注' : '已关注'}</div>
                }
                <div onClick={this.sendLetter.bind(this)}>私信</div>
              </div>
              }
            </div>
          </div>
          {/* 基本资料 */}
          <div className="information">
            <div className="title">基本资料</div>
            {
              !personalSpaceInfo.userDesc
              && !personalSpaceInfo.graduationSchool
              && !personalSpaceInfo.companyName
              && !personalSpaceInfo.occupation
              && !personalSpaceInfo.address
              && !personalSpaceInfo.interestCategory
              && !personalSpaceInfo.awards
              && !personalSpaceInfo.tags
              && <div className="ic_no_resultDiv">
                <img src={ic_no_result} className="ic_no_result" alt=''/>暂无数据！
              </div>
            }
            <div className="informationText">{personalSpaceInfo.userDesc}</div>
            <div className="informationList">
              {personalSpaceInfo.graduationSchool && <div>毕业院校：{personalSpaceInfo.graduationSchool}</div>}
              {personalSpaceInfo.companyName && <div>任职公司：{personalSpaceInfo.companyName}</div>}
              {personalSpaceInfo.occupation && <div>职位：{personalSpaceInfo.occupation}</div>}
              {personalSpaceInfo.address && <div>联系地址：{personalSpaceInfo.address}</div>}
              {personalSpaceInfo.interestCategory && <div>感兴趣的IP类型：{personalSpaceInfo.interestCategory}</div>}
              {personalSpaceInfo.awards && <div>获得奖项：{personalSpaceInfo.awards}</div>}
              {personalSpaceInfo.tags && <div>个人标签：{personalSpaceInfo.tags}</div>}
            </div>
          </div>
          {/* 最近访客 */}
          <div className="visitors">
            <div className="title">最近访客</div>
            <div className='all-list'>
              {(visitorList || []).map((item, i) => {
                return (
                  <div className="visitorsList" key={i}>
                    {item.userAttribute === 1
                      ? <Link to={`/personal-homepage/${item.userGuid}`}>
                        <img className="visitorsAvatar" src={item.picUrl || default_img_ip} alt=''/>
                        <div className='per-right'>
                          <div className="name">
                            <span className='per-realName'>{item.realName}</span>
                            {item.memberLevel === 1 && item.realStatus === 1 && <img src={auth} alt=''/>}
                            {item.memberLevel === 2 && <img src={ic_hjhy} alt=''/>}
                            {item.memberLevel === 3 && <img src={ic_zshy} alt=''/>}
                            <span className="lastTime">{item.visitDate}</span>
                          </div>
                          <div className="company">
                            {item.occupation && item.companyDepartment &&
                            <div>{item.occupation}@{item.companyDepartment}</div>}
                          </div>
                        </div>
                      </Link>
                      : <Link to={`/business-homepage/${item.userGuid}`}>
                        <img className="visitorsAvatar" src={item.picUrl || default_img} alt=''/>
                        <div className='per-right'>
                          <div className="name">
                            <span className='per-realName'>{item.companyAbbreviation || item.realName}</span>
                            {item.realStatus === 1 && <img src={auth} alt=''/>}
                            <span className="lastTime">{item.visitDate}</span>
                          </div>
                          {item.companyName && <div className="company">{item.companyName}</div>}
                        </div>
                      </Link>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ScrollTop/>

        {/* 登录提示 */}
        <Modal title="登录提示" visible={this.state.hadLogin} onCancel={this.focusCancel} footer={null}>
          <p style={{ textAlign: 'center' }}>您还未登陆,请先登陆</p>
          <Link to={'/login'}>
            <div className="toLogin">去登录</div>
          </Link>
        </Modal>
        {/* 私信 */}
        <Modal title="私信TA" width={520} visible={this.state.letterShow} onCancel={() => this.letterCancel()}
               footer={null}
               className="letterDiv">
          <div className="modal-main">
            <div className="userRealName">{personalSpaceInfo.userRealName}</div>
            <TextArea rows={4} placeholder="请在此输入您想要对TA说的话（800字内）" value={this.state.messageContent} onChange={(e) => {
              this.setState({ messageContent: e.currentTarget.value.replace(/ /g, '') });
            }}/>
          </div>
          <div className="twoBtn">
            <div className="submitBtn" onClick={() => this.sendLetters()}>确认</div>
            <div className="cancelBtn" onClick={() => this.letterCancel()}>取消</div>
          </div>
        </Modal>
        {/* 邀TA会面弹窗 */}
        <Modal
          className="inviteDiv" width={600} title="邀TA会面" visible={this.state.visibleShow}
          onCancel={this.inviteCancel}
          footer={null}
        >
          <div className="modal-main">

            <div className="label">会面人员<span>*</span></div>
            <Input size="large" disabled value={personalSpaceInfo.userRealName}/>
            <div className="label">选择会面时间段<span>*</span></div>
            <DateTimePicker
              begin={personalSpaceInfo.beginDateStr}
              end={personalSpaceInfo.endDateStr}
              dateTime={this.getDateAndTimeData.bind(this)}
              reservation={this.state.reservation}
            />
            <div className="label">会面原因<span>*</span></div>
            <TextArea placeholder="请在此输入您想要和他会面的原因（400字内）" value={this.state.meetReason} onChange={(e) => {
              this.setState({ meetReason: e.currentTarget.value });
            }}/>
            <div className="label">是否愿意将联系方式告知TA<span>*</span></div>
            <Radio.Group onChange={this.teleRadioChange} value={this.state.teleRadio}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
            {teleRadio === 1 &&
            <Input size="large" className="teleInput" value={this.state.invitationContactInformation} onChange={(e) => {
              this.setState({ invitationContactInformation: e.currentTarget.value });
            }}/>
            }
          </div>
          <div className="twoBtn">
            <div className="submitBtn" onClick={this.sendInvite.bind(this)}>发送会面邀请</div>
            <div className="cancelBtn" onClick={this.inviteCancel}>取消</div>
          </div>
        </Modal>

      </div>
    );
  }
}
