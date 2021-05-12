import * as React from 'react';
import "@assets/scss/receive-invited.scss";
import { inject, observer } from "mobx-react";
import default_img from "@assets/images/default/ic_default_shu.png";
import ic_js from '@assets/images/ic_js.svg';
import ic_jjue from '@assets/images/ic_jjue.svg';
import ic_accept from '@assets/images/ic_accept_pr.svg';
import ic_refuse from '@assets/images/ic_refuse_pr.svg';
import ic_remind from '@assets/images/ic_remind.svg';
import ModalFrame from '@pages/user/components/modal-frame';
import { Select, DatePicker, Input } from 'antd';
import { toJS } from "mobx";
import { Link } from 'react-router-dom';
import _isEmpty from "lodash/isEmpty";
import NoResult from '@components/no_result';

const { Option } = Select;

const { Search } = Input;

interface IReceiveProps extends IComponentProps {
  userGuid?: string,
}

interface IReInvited {
  modalShow: boolean,
  invitationDate: string,
  title: string,
  invitationStatus: string,
  reply: any,
  current?: any,
  currentPage: number,
  pageSize: number,
  testNum: number,
  invitedGuid: string,
  beginDateStr: string,
  endDateStr: string,
  invitedStatus: number,
  exhibitionGuid: string,
  exhibitionCompanyGuid: string,
}

@inject('user', 'login')
@observer
export default class ReInvited extends React.Component <IReceiveProps, IReInvited> {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      invitationDate: '',
      title: '',
      invitationStatus: '',
      reply: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      currentPage: 1,
      pageSize: 10,
      testNum: 1,
      invitedGuid: '',
      beginDateStr: '',
      endDateStr: '',
      invitedStatus: 1,
      exhibitionGuid: '',
      exhibitionCompanyGuid: '',
    };
    this.calendarRef = React.createRef();
  }

  calendarRef = null;

  async componentDidMount() {
    document.title = "IP二厂-收到的邀约";
    const { user, login } = this.props;
    const { currentPage, pageSize, invitationStatus, invitationDate, title } = this.state;
    const params = {
      userGuid: login.userInfo.userGuid,
      currentPage,
      pageSize,
      invitationStatus,
      invitationDate,
      title
    };
    await user.receiveInvitedChange(params);
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
    const url = window.location.href;
    if (url.split('/')[5] === '9') {
      const { user } = this.props;
      const { ReceiveIsLoading, receiveParams: { currentPage } } = user;
      let yScroll;
      if (self.pageYOffset) {
        yScroll = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) {
        yScroll = document.documentElement.scrollTop;
      } else if (document.body) {
        yScroll = document.body.scrollTop;
      }
      if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
        if (ReceiveIsLoading) {
          this._throttle(user.receiveInvitedChange({ currentPage: currentPage + 1 }), 3000);
        }
      }
    }
  };

  render() {
    const { reply, invitationDate, invitationStatus, currentPage, pageSize, title } = this.state;
    const { user, login } = this.props;
    const { getReceiveList } = this.props.user;
    return (
      <div className='invited-List'>
        <div className='invited-title'>收到的邀约</div>
        <div className='invited-search'>
          <div className='select-state'>
            <Select
              className='form-control'
              placeholder='请选择回复的状态'
              optionFilterProp="children"
              onChange={async (value: string) => {
                const params = {
                  userGuid: login.userInfo.userGuid,
                  invitationStatus: value,
                  invitationDate,
                  currentPage,
                  pageSize,
                  title
                };
                await user.receiveInvitedChange(params);
                this.setState({
                  invitationStatus: value,
                });
              }}
              filterOption={(input, option) =>
                typeof option.props.children === "string" ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
              }
            >
              <Option value=''>全部</Option>
              <Option value='1'>待处理</Option>
              <Option value='2'>已接受</Option>
              <Option value='3'>已拒绝</Option>
            </Select>
            <DatePicker
              placeholder='请选择时间'
              format="YYYY-MM-DD"
              style={{ width: '2rem', marginRight: '0.2rem' }}
              onChange={async (date, dateString) => {
                const invitationDate = dateString;
                const params = {
                  userGuid: login.userInfo.userGuid,
                  invitationDate: dateString,
                  invitationStatus,
                  currentPage,
                  pageSize,
                  title
                };
                this.setState({
                  invitationDate,
                });
                await user.receiveInvitedChange(params);
              }}
            />
            <Search
              className='form-control'
              style={{ width: '3.2rem' }}
              placeholder='请输入关键字进行搜索'
              onSearch={async (e: string) => {
                const title = e;
                const params = {
                  userGuid: login.userInfo.userGuid,
                  invitationDate,
                  invitationStatus,
                  currentPage,
                  pageSize,
                  title
                };
                this.setState({
                  title,
                });
                await user.receiveInvitedChange(params);
              }}
            />
          </div>
        </div>
        {
          (toJS(getReceiveList) || []).map((item, index) => {
            return (
              <div className='yy-list' key={index}>
                <div className='yy-content'>
                  <div className='yy-img'>
                    <img src={item.invitationHeadPortrait || default_img} alt=''/>
                  </div>
                  <div className='yy-introduce'>
                    <ul className='yy-ul'>
                      <li>{item.invitationName}的会面邀约</li>
                      <Link to={`/personal-homepage/${item.invitationPersonnel}`}>
                        <span style={{ color: '#6248ff' }}>查看主页</span>
                      </Link>
                      {
                        item.invitationOccupation !== '' ?
                          <li>{item.invitationOccupation}@{item.invitationCompanyDepartment}</li>
                          : ''
                      }
                      <li>意向会面时间：<span
                        style={{ marginRight: '.2rem' }}>{item.invitationDate}</span><span>{item.invitationTime}</span>
                      </li>
                      <li>意向会面地址：<span>{item.meetAddress}</span></li>
                      {
                        item.invitationContactInformation &&
                        <li>邀约人员手机号：<span>{item.invitationContactInformation}</span></li>
                      }
                      <li>意向会面原因：
                        <div className='reason'>{item.meetReason}</div>
                      </li>
                    </ul>
                  </div>
                  <div className='right-btn'>
                    {
                      item.invitationStatus === 1 &&
                      <div style={{ display: 'flex' }}>
                        <div className='invited-accept'
                             onClick={() => {
                               this.setState({
                                 modalShow: true,
                                 invitedGuid: item.invitationGuid,
                                 beginDateStr: item.beginDateStr,
                                 endDateStr: item.endDateStr,
                                 invitedStatus: 1,
                                 exhibitionGuid: item.exhibitionGuid,
                               });
                             }}
                        >
                          <img src={ic_js} alt=''/>
                          <span>接受邀约</span>
                        </div>
                        <div className='invited-refuse'
                             onClick={() => {
                               this.setState({
                                 modalShow: true,
                                 invitedGuid: item.invitationGuid,
                                 invitedStatus: 2,
                                 exhibitionGuid: item.exhibitionGuid,
                                 exhibitionCompanyGuid: item.exhibitionCompanyGuid
                               });
                             }}
                        >
                          <img src={ic_jjue} alt=''/>
                          <span>拒绝邀约</span>
                        </div>
                      </div>
                    }
                    {
                      item.invitationStatus === 2 &&
                      <div className='accepted-refuse'>
                        <img src={ic_accept} alt=''/>
                        <span style={{ color: '#adb5bd' }}>已接受邀约</span>
                      </div>
                    }
                    {
                      item.invitationStatus === 3 &&
                      <div className='accepted-refuse'>
                        <img src={ic_refuse} alt=''/>
                        <span style={{ color: '#adb5bd' }}>已拒绝邀约</span>
                      </div>
                    }
                    {
                      item.invitationStatus === 4 &&
                      <div className='update-time'>
                        <img src={ic_remind} alt=''/>
                        <span style={{ color: '#adb5bd' }}>您修改了会面时间</span>
                      </div>
                    }
                    {
                      item.invitationStatus === 5 &&
                      <div className='update-time'>
                        <img src={ic_remind} alt=''/>
                        <span style={{ color: '#ADB5BD' }}>对方同意了新的会面时间</span>
                      </div>
                    }
                    {
                      item.invitationStatus === 6 &&
                      <div className='update-time'>
                        <img src={ic_remind} alt=''/>
                        <span style={{ color: '#ADB5BD' }}>对方拒绝了新的会面时间</span>
                      </div>
                    }
                  </div>
                  {
                    item.invitationStatus !== 1 &&
                    <div className='reply-box'>
                      {/*更改第index项*/}
                      {reply[index] === 1 ?
                        <div className='look-reply'
                             onClick={() => {
                               let arr = this.state.reply;
                               arr[index] = 0;
                               this.setState({ reply: arr });
                             }}
                        >收起回复</div>
                        :
                        <div className='close-reply'
                             onClick={() => {
                               let arr = this.state.reply;
                               arr[index] = 1;
                               this.setState({ reply: arr });
                             }}
                        >查看回复</div>
                      }
                    </div>
                  }
                </div>
                {
                  item.invitationStatus === 2 && reply[index] === 1 &&
                  <div className='close-content'>
                    <p className='replay-title'>您已同意了对方的会面邀约，该会面将自动添加到您的日程表里，您可以在我的日程里查看</p>
                    <ul className='replay-ul'>
                      {
                        item.meetContactInformation &&
                        <li>联系方式：<span>{item.meetContactInformation}</span></li>
                      }
                      <li>备注说明：<span>{item.meetRemarks}</span></li>
                    </ul>
                  </div>
                }
                {
                  item.invitationStatus === 3 && reply[index] === 1 &&
                  <div className='close-content'>
                    <p className='replay-title'>您已拒绝了对方的会面邀约</p>
                    <ul className='replay-ul'>
                      <li>拒绝原因：<span>{item.meetRemarks}</span></li>
                    </ul>
                  </div>
                }
                {
                  item.invitationStatus === 4 && reply[index] === 1 &&
                  <div className='close-content'>
                    <p className='replay-title'>您已同意了对方的会面邀约，但修改了会面时间，等待回访回复中</p>
                    <ul className='replay-ul'>
                      <li>新会面时间：<span
                        style={{ marginRight: '0.2rem' }}>{item.updateMeetDate}</span><span>{item.updateMeetTime}</span>
                      </li>
                      {
                        item.meetContactInformation &&
                        <li>联系方式：<span>{item.meetContactInformation}</span></li>
                      }
                      <li>备注说明：<span>{item.meetRemarks}</span></li>
                    </ul>
                  </div>
                }
                {
                  item.invitationStatus === 5 && reply[index] === 1 &&
                  <div className='close-content'>
                    <p className='replay-title'>对方同意了您修改的新的会面时间，该会面将自动添加到您的日程表里，您可以在我的日程里查看</p>
                    <ul className='replay-ul'>
                      <li>新会面时间：<span
                        style={{ marginRight: '0.2rem' }}>{item.updateMeetDate}</span><span>{item.updateMeetTime}</span>
                      </li>
                      {
                        item.meetContactInformation &&
                        <li>联系方式：<span>{item.meetContactInformation}</span></li>
                      }
                      <li>备注说明：<span>{item.meetRemarks}</span></li>
                    </ul>
                  </div>
                }
                {
                  item.invitationStatus === 6 && reply[index] === 1 &&
                  <div className='close-content'>
                    <p className='replay-title'>对方拒绝了您修改的新的会面时间</p>
                    <ul className='refuse-ul'>
                      <li>新会面时间：<span
                        style={{ marginRight: '0.2rem' }}>{item.updateMeetDate}</span><span>{item.updateMeetTime}</span>
                      </li>
                      {
                        item.meetContactInformation &&
                        <li>联系方式：<span>{item.meetContactInformation}</span></li>
                      }
                      <li>备注说明：<span>{item.meetRemarks}</span></li>
                    </ul>
                    {/*这里的拒绝原因是邀请人的拒绝原因：invitationRemarks*/}
                    <div className='refuse-div'>对方的拒绝原因：<span>{item.invitationRemarks}</span></div>
                  </div>
                }
              </div>
            );
          })
        }
        {
          this.state.modalShow && <ModalFrame
            exhibitionCompanyGuid={this.state.exhibitionCompanyGuid}
            invitedStatus={this.state.invitedStatus}
            beginDateStr={this.state.beginDateStr}
            endDateStr={this.state.endDateStr}
            invitedGuid={this.state.invitedGuid}
            onClose={
              () => {
                this.setState({
                  modalShow: false
                });
              }}
          />
        }
        {
          _isEmpty(getReceiveList) && <NoResult/>
        }
      </div>
    );
  }
}
