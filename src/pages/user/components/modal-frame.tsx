import * as React from 'react';
import "@assets/scss/modal_accept.scss";
import { Input, Radio, Select, message } from 'antd';
import close from "assets/images/ic_close.svg";
import { inject, observer } from "mobx-react";
import Alert from "@components/alert";
import { toJS } from "mobx";
import moment from 'moment';
import DateTimePicker from '@components/date-time-picker';
import { agreeReceive } from '@utils/api';

const { TextArea } = Input;
const { Option } = Select;

interface IModalProps extends IComponentProps {
  onClose: Function;
  userGuid?: string;
  exhibitionCompanyGuid?: string,
}

interface IModalState {
  isShow: boolean,
  message: string,
  acceptReceive: {
    meetNotifyContact: any,
    isUpdateMeetDate: any,
    meetContactInformation: string,
    meetRemarks: string,
    updateMeetDate: string,
    updateMeetTimeStart: string,
    updateMeetTimeEnd: string,
    endTime: string,
  },
  refuseReceive: {
    meetRemarks: string,
    updateMeetPersonnel: string,
    isUpdateMeetPersonnel: number,
  }
}

@inject('user', 'login')
@observer
export default class ModalFrame extends React.Component<IModalProps, IModalState> {
  state = {
    isShow: false,
    message: '',
    acceptReceive: {
      meetNotifyContact: 1,
      meetContactInformation: '',
      meetRemarks: '',
      isUpdateMeetDate: 1,
      updateMeetDate: '',
      updateMeetTimeStart: '',
      updateMeetTimeEnd: '',
      endTime: '',
    },
    refuseReceive: {
      meetRemarks: '',
      updateMeetPersonnel: '',
      isUpdateMeetPersonnel: 1,
    }
  };

  async componentDidMount() {
    const { user, login } = this.props;
    const userGuid = login.userInfo ? login.userInfo['userGuid'] : '';
    // 筛选掉本人
    const params = {
      userGuid,
      exhibitionGuid: this.props.exhibitionGuid,
      exhibitionCompanyGuid: this.props.exhibitionCompanyGuid,
    };
    await user.personList(params);
  }

  /**
   * 接受邀请
   */
  async submitBtn() {
    const { acceptReceive } = this.state;
    const iPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    const params = {
      invitationGuid: this.props.invitedGuid,
      meetNotifyContact: acceptReceive.meetNotifyContact,
      meetContactInformation: acceptReceive.meetNotifyContact === 1 ? acceptReceive.meetContactInformation : '',
      meetRemarks: acceptReceive.meetRemarks,
      isUpdateMeetDate: acceptReceive.isUpdateMeetDate,
      updateMeetDate: acceptReceive.isUpdateMeetDate === 1 ? acceptReceive.updateMeetDate : '',
      updateMeetTime: acceptReceive.isUpdateMeetDate === 1 ? acceptReceive.updateMeetTimeStart : '',
    };
    if (acceptReceive.meetNotifyContact === 1 && !iPhone.test(params.meetContactInformation)) {
      this.setState({ isShow: true, message: '请填入正确的手机号' });
      return false;
    } else if (acceptReceive.meetNotifyContact === 1 && !params.meetContactInformation) {
      this.setState({ isShow: true, message: '请填入联系方式' });
      return false;
    } else if (!params.meetRemarks) {
      this.setState({ isShow: true, message: '请填写备注说明' });
      return false;
    } else if (acceptReceive.isUpdateMeetDate === 1 && !params.updateMeetDate) {
      this.setState({ isShow: true, message: '请选择新的会面时间' });
    } else {
      const { result }: any = await agreeReceive(params);
      if (result.errorCode === 200) {
        this.setState({ isShow: true, message: result.errorMsg });
        const { userGuid } = this.props.login.userInfo;
        await this.props.user.receiveInvitedChange({ currentPage: 1, pageSize: 12, userGuid });
      } else {
        message.error(result.errorMsg);
      }
      return true;
    }
  }

  /**
   * 拒绝邀请
   */
  async submitBtnRefuse() {
    const { refuseReceive } = this.state;
    const { user } = this.props;
    const is = refuseReceive.isUpdateMeetPersonnel;
    const params = {
      invitationGuid: this.props.invitedGuid,
      meetRemarks: refuseReceive.meetRemarks,
      isUpdateMeetPersonnel: refuseReceive.isUpdateMeetPersonnel,
      updateMeetPersonnel: is === 1 ? refuseReceive.updateMeetPersonnel : '',
    };
    if (!params.meetRemarks) {
      this.setState({ isShow: true, message: '请填写拒绝原因' });
      return false;
    } else if (params.isUpdateMeetPersonnel === 1 && !params.updateMeetPersonnel) {
      this.setState({ isShow: true, message: '其选择其他职员' });
      return false;
    } else {
      await user.refuseReceive(params);
      this.setState({ isShow: true, message: '拒绝成功' });
      const { userGuid } = this.props.login.userInfo;
      await this.props.user.receiveInvitedChange({ currentPage: 1, pageSize: 12, userGuid });
      return true;
    }
  }

  // 接受邀请开始时间 - 当前日期前不可选
  disabledChangeDateStart = (current) => {
    return current && current < moment().subtract(1, 'days');
  };

  render() {
    const { onClose, invitedStatus, beginDateStr, endDateStr } = this.props;
    const { isShow, message } = this.state;
    const { getPersonList } = this.props.user;
    const t = this.state.acceptReceive;
    const r = this.state.refuseReceive;
    return (
      <div className='modal-box'>
        <div className='modal-bg'/>
        <div className='modal-accept'>
          <div className='top'>
            {
              invitedStatus === 1 ?
                <div className='accept-title'>接受会面邀约</div> :
                <div className='accept-title'>拒绝会面邀约</div>
            }
            <button
              className='acc-close'
              onClick={() => {
                onClose();
              }}>
              <img src={close} alt=''/>
            </button>
          </div>
          {
            invitedStatus === 1 ?
              <div className='modal-content'>
                <div className='modal-label'>是否愿意将联系方式告知TA<span>*</span></div>
                <Radio.Group
                  value={t.meetNotifyContact}
                  onChange={async (e) => {
                    const { acceptReceive } = this.state;
                    acceptReceive.meetNotifyContact = e.target.value;
                    this.setState({ acceptReceive });
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={2} style={{ marginLeft: '1rem' }}>否</Radio>
                  {
                    t.meetNotifyContact === 1 ?
                      <div className='input-radio'>
                        <Input
                          type='number'
                          value={t.meetContactInformation}
                          onChange={async (e) => {
                            const { acceptReceive } = this.state;
                            acceptReceive.meetContactInformation = e.currentTarget.value;
                            this.setState({ acceptReceive });
                          }}
                        />
                      </div>
                      : ''
                  }
                </Radio.Group>
                <div className='modal-label'>备注说明<span>*</span></div>
                <TextArea
                  placeholder='请在此输入您想要对TA说的话（400字内）' rows={4}
                  className='modal-text'
                  value={t.meetRemarks}
                  onChange={async (e) => {
                    const { acceptReceive } = this.state;
                    acceptReceive.meetRemarks = e.currentTarget.value;
                    this.setState({ acceptReceive });
                  }}
                />
                <div className='modal-label'>是否需要修改会面时间<span>*</span></div>
                <Radio.Group
                  value={t.isUpdateMeetDate}
                  onChange={(e) => {
                    const { acceptReceive } = this.state;
                    acceptReceive.isUpdateMeetDate = e.target.value;
                    this.setState({ acceptReceive });
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0} style={{ marginLeft: '1rem' }}>否</Radio>
                  {
                    t.isUpdateMeetDate === 1 &&
                    <div style={{ marginTop: '0.1rem' }}>
                      <DateTimePicker
                        begin={beginDateStr}
                        end={endDateStr}
                        dateTime={(updateMeetDate, updateMeetTimeStart) => {
                          const { acceptReceive } = this.state;
                          acceptReceive.updateMeetDate = updateMeetDate;
                          acceptReceive.updateMeetTimeStart = updateMeetTimeStart;
                          this.setState({
                            acceptReceive
                          });
                        }}
                      />
                    </div>
                  }
                </Radio.Group>
              </div> :
              <div className='modal-content'>
                <div className='modal-label'>拒绝原因<span>*</span></div>
                <TextArea
                  placeholder='请在此输入您想要对TA说的话（400字内）' rows={4}
                  className='modal-text'
                  value={r.meetRemarks}
                  onChange={async (e) => {
                    const { refuseReceive } = this.state;
                    r.meetRemarks = e.currentTarget.value;
                    this.setState({ refuseReceive });
                  }}
                />
                <div className='modal-label'>是否建议TA预约企业其他职员<span>*</span></div>
                <Radio.Group
                  value={r.isUpdateMeetPersonnel}
                  onChange={(e) => {
                    const { refuseReceive } = this.state;
                    refuseReceive.isUpdateMeetPersonnel = e.target.value;
                    this.setState({ refuseReceive });
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0} style={{ marginLeft: '1rem' }}>否</Radio>
                  {
                    r.isUpdateMeetPersonnel === 1 ?
                      <Select
                        style={{ width: 520, marginTop: '0.1rem' }}
                        className='time-input'
                        placeholder='请选择您建议TA预约的职员名称'
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                        onChange={async (updateMeetPersonnel: string) => {
                          const { refuseReceive } = this.state;
                          refuseReceive.updateMeetPersonnel = updateMeetPersonnel;
                          this.setState({ refuseReceive });
                        }}
                      >
                        {
                          (toJS(getPersonList) || []).map((item) => {
                            return (
                              <Option
                                value={item.userGuid} key={item.userGuid}>
                                {item.userRealName}
                              </Option>
                            );
                          })
                        }
                      </Select>
                      : ''
                  }
                </Radio.Group>
              </div>
          }

          <div className='modal-bottom'>
            {
              invitedStatus === 1 ?
                <button
                  className='btn-submit'
                  onClick={async () => {
                    await this.submitBtn();
                  }}
                >确认
                </button> :
                <button
                  className='btn-submit'
                  onClick={async () => {
                    await this.submitBtnRefuse();
                  }}
                >确认
                </button>
            }
            <button className='btn-reset'
                    onClick={() => {
                      onClose();
                    }}>取消
            </button>
          </div>
        </div>
        {
          isShow &&
          <Alert
            message={message}
            onClose={() => {
              this.setState({ isShow: false });
              this.props.onClose();
            }}
          />
        }
      </div>
    );
  }

}
