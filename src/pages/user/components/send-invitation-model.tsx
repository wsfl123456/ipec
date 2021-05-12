/**
 * blance.xue -- Darren 授权展代码,
 *  发起邀约弹窗
 */
import * as React from 'react';
import close from "assets/images/ic_close.svg";
import '@assets/scss/send_invitation_model.scss';
import Alert from '@components/alert';
import { invitationSave, invitePersonalTime } from '@utils/api';
import { message } from 'antd';
import DateTimePicker from '@components/date-time-picker';

interface ISendInvitationModelProp extends IComponentProps {
  onClose: Function;
  exhibitionGuid: string;
  meetObj: any;
}

interface ISendInvitationModelState {
  moboxChildren: any[];
  forbidden_index: number,
  selectMouth: string,
  selectDay: string,
  selectMouthDay: string,
  meetingWhy: string,
  isCall: boolean,
  callNumber: any,
  show: boolean,
  message: string,
  invitationDate: string,
  invitationTime: string,
  reservation: any[],
}

export default class SendInvitationModel extends React.Component<ISendInvitationModelProp, ISendInvitationModelState> {
  state = {
    selectMouthDay: "",
    isCall: false,
    callNumber: null,
    meetingWhy: '',
    selectMouth: '',
    selectDay: '',
    moboxChildren: [],
    forbidden_index: -1,
    show: false,
    message: '',
    invitationDate: '',
    invitationTime: '',
    reservation: [],
  };

  getDateAndTimeData(...args: any[]) {
    this.setState({
      invitationDate: args[0],
      invitationTime: args[1],
    });
  }

  async putMeetingDate() {
    let { meetingWhy, isCall, callNumber, invitationDate, invitationTime } = this.state;
    const { meetObj: { invitationPersonnel, updateMeetPersonnel: meetPersonnel, meetAddress, exhibitionCompanyGuid, }, exhibitionGuid } = this.props;
    let param = {
      exhibitionCompanyGuid,
      exhibitionGuid,
      invitationPersonnel,
      invitationNotifyContact: isCall ? 1 : 2,
      invitationDate,
      invitationTime,
      meetAddress,
      meetPersonnel,
      meetReason: meetingWhy,
    };
    if (isCall) {
      param['invitationContactInformation'] = callNumber;
    }
    let { errorCode, result: { errorCode: eCode, errorMsg }, errorMessage }: any = await invitationSave(param);
    if (errorCode === '200') {
      this.props.onClose();
      if (eCode < 0) {
        message.error(errorMsg);
      } else {
        message.success(errorMsg);
      }
    } else {
      message.error(errorMessage);
    }
  }

  async componentDidMount() {
    const { exhibitionGuid, updateMeetPersonnel } = this.props;
    const { result }: any = await invitePersonalTime(exhibitionGuid, updateMeetPersonnel);
    if (result) {
      this.setState({
        reservation: result,
      });
    }
  }

  render() {
    const { moboxChildren } = this.state;
    const { meetObj: { beginDate, endDate } } = this.props;
    return (
      <div className="invitation-model">
        <div className="invitation-content">
          <div className="title">
            邀TA会面
            <img src={close} onClick={async () => this.props.onClose()} alt=""/>
          </div>
          <div className="center">
            <div className="form-group flex-column">
              <label className="input-label">{moboxChildren.length > 0 ? "选择会面人员" : "会面人员"}<span
                className="label-dot">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="请选择该企业里你想要会面的人员"
                defaultValue={this.props.meetObj['updateMeetName']}
                disabled
              />
            </div>
            <div className="form-group   flex-column">
              <label className="input-label">会面推荐人<span className="label-dot">*</span></label>
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.meetObj['meetName']}
                disabled
              />
            </div>
            <div
              className="form-group selectMeeting flex-column"
              onClick={e => e.stopPropagation()}
            >
              <label className="input-label">选择会面时间段<span className="label-dot">*</span>
                <i>（该时间为对方未被预约的可用时间）</i>
              </label>
              <DateTimePicker
                begin={beginDate} end={endDate}
                dateTime={this.getDateAndTimeData.bind(this)}
                reservation={this.state.reservation}
              />
            </div>
            <div className="form-group flex-column">
              <label className="input-label">会面原因<span className="label-dot">*</span></label>
              <textarea placeholder="请在此输入您想要和他会面的原因（400字内）" value={this.state.meetingWhy} onChange={e => {
                if (e.target.value.length > 400) {
                  this.setState({
                    show: true,
                    message: '原因不能超出400字'
                  });
                  return;
                }
                this.setState({
                  meetingWhy: e.target.value
                });
              }} name="" id="" cols={30} rows={10}/>
            </div>

            <div className="form-group   flex-column">
              <label className="input-label">是否愿意将联系方式告知TA<span className="label-dot">*</span></label>
              <div className="radio-group  flex-row flex-wrap">

                <div className={`ip-radio flex-row align-items-center ${this.state.isCall && "radio-selected"}`}>
                  <div className="limit-custom-radio" onClick={() => {
                    this.setState({
                      isCall: true,
                    });
                  }}/>
                  <span className="radio-text">是</span>
                </div>
                <div className={`ip-radio flex-row align-items-center ${!this.state.isCall && 'radio-selected'}`}>
                  <div className="limit-custom-radio" onClick={() => {
                    this.setState({
                      isCall: false,
                    });
                  }}/>
                  <span className="radio-text">否</span>
                </div>
              </div>
              {
                this.state.isCall && <input
                  type="number"
                  className="form-control margin-top5"
                  placeholder="请输入联系方式"
                  value={this.state.callNumber}
                  onChange={async e => {
                    this.setState({
                      callNumber: e.target.value
                    });
                  }}
                />
              }
            </div>
          </div>
          <div className="footer">
            <button onClick={this.putMeetingDate.bind(this)}>发送会面邀请
            </button>
            <button className="resolve" onClick={() => this.props.onClose()}>取消
            </button>
          </div>
        </div>
        {
          this.state.show &&
          <Alert
            message={this.state.message}
            onClose={() => {
              this.setState({
                show: false
              });
            }}/>
        }
      </div>
    );
  }

}
