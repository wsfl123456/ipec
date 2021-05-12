import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/invitations.scss";
import _isEmpty from 'lodash/isEmpty';
import NoResult from '@components/no_result';
import RefuseUpdateInvitation from '@pages/user/components/refuse-update-invitation';
import SendInvitationModel from '@pages/user/components/send-invitation-model';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import _isObject from 'lodash/isObject';
import Toast from '@components/toast';
import Search from 'antd/lib/input/Search';
import { Link } from "react-router-dom";

const { Option } = Select;

interface IInvitationState {
  alertShow: boolean,
  message: string,
  userData: object,
  clickable: number,
  refuseInvitation: boolean,
  invitationGuid: string,
  sendModelShow: boolean,
  exhibitionGuid: string,
  invitationStatus: number,
  invitationDate: string,
  meetObj: object,
  toastShow: boolean,
  toastMessage: string,
}

interface IInvitationProps extends IComponentProps {
  userGuid?: string
}

@inject('user')
@observer
export default class Invitations extends React.Component <IInvitationProps, IInvitationState> {
  constructor(props) {
    super(props);
    this.state = {
      alertShow: false,
      message: "",
      userData: JSON.parse(localStorage.getItem('user')),
      clickable: -1,
      refuseInvitation: false,
      invitationGuid: '',
      sendModelShow: false,
      exhibitionGuid: '',
      invitationStatus: 0,
      invitationDate: '',
      meetObj: {
        meetName: '',
        invitationPersonnel: '',
        beginDate: '',
        currentDate: '',
        endDate: '',
        updateMeetName: '',
        updateMeetPersonnel: '',
        exhibitionCompanyGuid: '',
        meetAddress: '',
      },
      toastMessage: '',
      toastShow: false,
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    const { userData } = this.state;
    if (!_isEmpty(userData)) {
      const userGuid = userData['userGuid'];
      const params = { userGuid, currentPage: 1, pageSize: 10 };
      await user.invitationStatusChange(params);
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  _throttle(fun, interval) {
    let timeout, startTime: any = new Date();
    return () => {
      clearTimeout(timeout);
      let curTime: any = new Date();
      if (curTime - startTime <= interval) {
        timeout = setTimeout(() => {
          fun();
        }, curTime - startTime);
      } else {
        startTime = curTime;
      }
    };
  }

  handleScroll = () => {
    const { user } = this.props;
    const { sendIsLoading, sendParams: { currentPage } } = user;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    let clientHeight = document.body.clientHeight;
    if ((yScroll + clientHeight) >= document.body.scrollHeight) {
      if (sendIsLoading) {
        this._throttle(user.invitationStatusChange({ currentPage: currentPage + 1 }), 3000);
      }
    }
  };

  _publicFun(item, a) {
    if (a === 2) {
      return (
        // 对方同意
        <div className="is-reply-detail">
          <p className="is-answer">对方已同意了您的会面邀约，该会面将自动添加到您的日程表里，您可以在我的日程里查看</p>
          {item.meetContactInformation && <p>联系方式：{item.meetContactInformation}</p>}
          {/*<p>电子邮箱：jason@normcore.com</p>*/}
          <div className="is-remark">
            <div className="rk-title">备注说明:</div>
            <div className="rk-answer">
              {item.meetRemarks}
            </div>
          </div>
        </div>
      );
    } else if (a === 3) {
      return (
        // 对方拒绝
        <div className="is-reply-detail refuse-status">
          <p className="is-answer">很抱歉，对方拒绝了您的会面邀约</p>
          <div className="is-remark">
            <div className="rk-title">拒绝原因：</div>
            <div className="rk-answer">
              {item.meetRemarks}
            </div>
          </div>
          {
            !_isEmpty(item.updateMeetName) &&
            <p>建议您邀约企业其他职员：
              <i onClick={() => {
                this.setState({
                  exhibitionGuid: item.exhibitionGuid,
                  meetObj: {
                    ...this.state.meetObj,
                    meetName: item.meetName,
                    invitationPersonnel: item.invitationPersonnel,
                    beginDate: item.beginDateStr,
                    endDate: item.endDateStr,
                    currentDate: item.currentDate,
                    updateMeetName: item.updateMeetName,
                    updateMeetPersonnel: item.updateMeetPersonnel,
                    exhibitionCompanyGuid: item.exhibitionCompanyGuid,
                    meetAddress: item.meetAddress,
                  },
                  sendModelShow: true,
                });
              }}
              >{item.updateMeetName}_{item.updateMeetOccupation} </i> 点击职员名称邀约</p>
          }
        </div>
      );
    } else if (a === 4) {
      return (
        // 对方修改会面时间  2019.10.16 16:00-16:30
        <div className="is-reply-detail update-status">
          <p className="is-answer">对方修改了您的会面邀约时间</p>
          <p>修改时间：{item.updateMeetDate}-{item.updateMeetTime}</p>
          {item.meetContactInformation && <p>联系方式：{item.meetContactInformation}</p>}
          <div className="is-remark">
            <div className="rk-title">备注说明:</div>
            <div className="rk-answer">
              {item.meetRemarks}
            </div>
          </div>
          <div className="button-group">
            <button className="accept"
                    onClick={async () => {
                      const { user } = this.props;
                      const invitationGuid = item.invitationGuid;
                      const _isSuccess: any = await user.inviterAccpect({ invitationGuid });
                      if (_isObject(_isSuccess)) {
                        this.setState({
                          toastShow: true,
                          toastMessage: _isSuccess['message'],
                        });
                      }
                      const params = { currentPage: 1 };
                      await user.invitationStatusChange(params);
                    }}>接受
            </button>
            <button className="refuse" onClick={() => {
              this.setState({
                refuseInvitation: true,
                invitationGuid: item.invitationGuid,
              });
            }}>拒绝
            </button>
          </div>
        </div>
      );
    } else if (a === 5) {
      return (
        // 接受对方修改会面时间
        <div className="is-reply-detail update-status">
          <p className="is-answer">您接受了对方修改的会面时间</p>
          <p>修改时间：{item.updateMeetDate}-{item.updateMeetTime}</p>
          {item.meetContactInformation && <p>联系方式：{item.meetContactInformation}</p>}
          <div className="is-remark">
            <div className="rk-title">备注说明:</div>
            <div className="rk-answer">
              {item.meetRemarks}
            </div>
          </div>
        </div>
      );
    } else if (a === 6) {
      return (
        // 拒绝对方修改会面时间
        <div className="is-reply-detail refuse-update-status">
          <p className="is-answer">您拒绝了对方修改的会面时间</p>
          <p>修改时间：{item.updateMeetDate}-{item.updateMeetTime}</p>
          {item.meetContactInformation && <p>联系方式：{item.meetContactInformation}</p>}
          <div className="is-remark">
            <div className="rk-title">备注说明:</div>
            <div className="rk-answer">
              {item.meetRemarks}
            </div>
          </div>
          <div className="refuse-reason">
            <p>拒绝原因：{item.invitationRemarks}</p>
          </div>
        </div>);
    } else {
      return (
        <div/>
      );
    }

  }

  render() {
    const { clickable, userData, invitationStatus, invitationDate } = this.state;
    const { user } = this.props;
    const { invitationData } = user;
    let userGuid: any;
    if (!_isEmpty(userData)) {
      userGuid = userData['userGuid'];
    }
    return (
      <div className="invitations-container">
        <div className="top-title">发出的邀约</div>
        <div className="invitations-main">
          <div className='invite-search'>
            <div className='select-state'>
              <Select
                className='form-control'
                placeholder='请选择回复的状态'
                optionFilterProp="children"
                onChange={async (value: number) => {
                  const invitationStatus = value;
                  const params = {
                    userGuid,
                    invitationStatus,
                    invitationDate,
                    currentPage: 1,
                  };
                  await user.invitationStatusChange(params);
                  this.setState({
                    invitationStatus
                  });
                }}
                filterOption={(input, option) =>
                  typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                }
              >
                <Option value='0'>全部</Option>
                <Option value='1'>邀约未回复</Option>
                <Option value='2'>邀约已接受</Option>
                <Option value='3'>邀约被拒绝</Option>
              </Select>
              <DatePicker
                placeholder='请选择时间'
                style={{ width: '2rem' }}
                onChange={async (date, dateString) => {
                  const invitationDate = dateString;
                  const params = {
                    userGuid,
                    invitationDate: dateString,
                    invitationStatus
                  };
                  this.setState({
                    invitationDate
                  });
                  await user.invitationStatusChange(params);
                }}
              />
              <Search
                className='form-control'
                placeholder="请输入关键字进行搜索"
                onSearch={async value => {
                  await user.invitationStatusChange({ title: value, currentPage: 1 });
                }}
              />
            </div>
          </div>

          <div className="invitations-list">
            {
              invitationData && invitationData.map((item, index) => {
                return (
                  <div className={clickable === index ? "invitations-single no-border" : "invitations-single"}
                       key={index}>
                    <div className="head-img">
                      <img src={item.meetHeadPortrait} alt=""/>
                    </div>
                    <div className="is-detail">
                      <div style={{ display: 'flex' }} className='flex-row'>
                        <p className="title">{item.meetName}</p>
                        {
                          item.userAttribute === 1
                            ? <Link to={`/personal-homepage/${item.meetPersonnel}`}>
                              <span style={{ color: '#6248ff', marginLeft: '.2rem' }}>查看主页</span>
                            </Link>
                            : <Link to={`/business-homepage/${item.meetPersonnel}`}>
                              <span style={{ color: '#6248ff', marginLeft: '.2rem' }}>查看主页</span>
                            </Link>
                        }
                      </div>
                      {
                        (item.userAttribute === 1)
                          ? (<p>{item.meetOccupation}@{item.meetCompanyDepartment}</p>)
                          : (<p className='long-word'>{item.companyCategory}</p>)
                      }
                      <p>意向会面时间: {moment(item.invitationDate).format("YYYY.MM.DD")} {item.invitationTime}</p>
                      <p>意向会面地址: {item.meetAddress}</p>
                      {item.recommendName && <p>推荐人: {item.recommendName}</p>}
                    </div>
                    {
                      item.invitationStatus === 1 ?
                        <div className="is-reply">
                          <p className="click-disable">暂无回复</p>
                        </div>
                        :
                        <div className="is-reply">
                          {
                            clickable !== index ?
                              <p className="click-able"
                                 onClick={() => {
                                   this.setState({ clickable: index });
                                 }}
                              >查看回复</p> :
                              <p className="click-able"
                                 onClick={() => {
                                   this.setState({ clickable: -1 });
                                 }}
                              >收起回复</p>
                          }
                        </div>
                    }
                    {/*回复状态*/}
                    {clickable === index && this._publicFun(item, item.invitationStatus)}
                  </div>
                );
              })
            }
            {
              _isEmpty(invitationData) && <NoResult/>
            }
          </div>
        </div>
        {
          this.state.refuseInvitation &&
          <RefuseUpdateInvitation invitationGuid={this.state.invitationGuid} onClose={() => {
            this.setState({ refuseInvitation: false });
          }}/>
        }
        {/*发起邀约*/}
        {this.state.sendModelShow &&
        <SendInvitationModel
          exhibitionGuid={this.state.exhibitionGuid}
          meetObj={this.state.meetObj}
          onClose={async () => {
            this.setState({
              sendModelShow: false
            });
            await user.invitationStatusChange({ userGuid });
          }}
        />
        }
        {this.state.toastShow && <Toast
          onClose={() => {
            this.setState({ toastShow: false });
          }}
          duration={3}
          message={this.state.toastMessage}
        />}
      </div>
    );
  }
}
