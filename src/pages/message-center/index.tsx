import * as React from 'react';
import '@assets/scss/message_center.scss';
import { inject, observer } from 'mobx-react';
import headImg from '@assets/images/user.svg';
import follow from '@assets/images/message-center/guanzhu.svg';
import system_message from '@assets/images/message-center/xitongxiaoxi.svg';
import ic_attestation_pr from '@assets/images/user/ic_yrz.svg';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import NoResult from '@components/no_result';
import PrivateLetter from '@pages/message-center/compontents/private_letter';
import { deletePrivateLetter } from '@utils/api';
import Alert from "@components/alert";
import { Modal } from 'antd';
import ic_hjhy from '@assets/images/user/ic_hjhy.svg';
import ic_zshy from '@assets/images/user/ic_zshy.svg';
import { _throttle } from '@utils/util';
import ic_load from '@assets/images/update/timg.gif';

const { confirm } = Modal;

interface IMessageState {
  current: number;
  tabs: Array<string>;
  tabsTitle: Array<string>;
  isShow: boolean;
  message: string;
}

@inject('nav_store', 'message', 'user', 'login')
@observer
export default class MessageCenter extends React.Component<any, IMessageState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      tabs: [
        '私信',
        '关注',
        '系统消息'
      ],
      tabsTitle: [
        '我的私信',
        '关注',
        '系统消息'
      ],
      isShow: false,
      message: '',
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-消息中心";
    const { message, login } = this.props;
    const { messageParams: { messageType } } = message;
    this.setState({
      current: messageType,
    });
    if (!_isEmpty(login.userInfo)) {
      const { userGuid } = login.userInfo;
      // 私信
      if (messageType === 1) {
        await message.getPrivateLetter({ userGuid, currentPage: 1, pageSize: 20 });
      } else {
        await message.changeMessageParams({
          userGuid,
          messageType,
          currentPage: 1,
          pageSize: 20
        });
      }
    }

    await this.setMessageReaded();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { message, login } = this.props;
    const userData = login.userInfo;
    const userGuid = userData['userGuid'];
    const { isLoading, seeMore, messageParams: { currentPage } } = message;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight && !isLoading && seeMore) {
      message.isLoading = true;
      _throttle(message.changeMessageParams({ currentPage: currentPage + 1 }), 3000);

      if (this.state.current === 1) {
        _throttle(message.getPrivateLetter({ currentPage: currentPage + 1, pageSize: 20, userGuid }), 3000);
      }
    }
  };

  async tabChange(index) {
    this.setState({
      current: index
    });
    const { message, login } = this.props;
    const userData = login.userInfo;
    const userGuid = userData['userGuid'];
    if (index === 1) {
      await message.getPrivateLetter({ userGuid, currentPage: 1, pageSize: 20 });
    } else if (index === 2) {
      await message.changeMessageParams({ userGuid, messageType: 2, currentPage: 1 });
    } else if (index === 3) {
      await message.changeMessageParams({ userGuid, messageType: 3, currentPage: 1 });
    }
    // else if (index === 4) {
    //   await message.changeMessageParams({ userGuid, messageType: 3, currentPage: 1 });
    // }
  }

  private static icon(name: string): string {
    let iconObj = {
      1: follow,
      2: follow,
      3: system_message,
    };
    return iconObj[name];
  }

  async setMessageReaded() {
    const { message, login } = this.props;
    if (!_isEmpty(login.userInfo)) {
      const { userGuid } = login.userInfo;
      await message.getMessageReaded(userGuid);
      // 更新session消息状态
      let isReadNumber = 0;
      let userSession = { ...login.userInfo, isReadNumber };
      localStorage.setItem('user', JSON.stringify(userSession));
      login.updateUser(userSession);
      await message.getMessageBox({ userGuid });
    }
  }

  render() {
    let { message, user, login } = this.props;
    const { isLoading, seeMore, noMore } = message;
    const { current, tabsTitle, } = this.state;
    const showTime = new Date();
    const Y = showTime.getFullYear() + '-';
    const M = ((showTime.getMonth() + 1) < 10 ? '0' + (showTime.getMonth() + 1) : showTime.getMonth() + 1) + '-';
    const d = (showTime.getDate() < 10 ? '0' + showTime.getDate() : showTime.getDate());
    const todayTime = Y + M + d;
    let memberLevel: number, expireDataStr: string;
    const { personInfo, companyInfo } = user;
    const { userInfo } = login;
    if (!_isEmpty(userInfo)) {
      memberLevel = userInfo.memberLevel;
      expireDataStr = userInfo.expireDataStr;
    }
    return (
      <div className="message-page">
        <div className="message-container">
          <div className="message-left">
            <div className="message-personal">
              <img className="head-img" src={user.personInfo.picUrl || user.companyInfo.picUrl || headImg} alt=""/>
              <p>{companyInfo.companyName || personInfo.userRealName || userInfo.userLogin}</p>
              {memberLevel === 1 &&
              <p className="rzhy">
                <img src={ic_attestation_pr} alt=""/>
                <span className="proveText">认证会员</span>
              </p>
              }
              {memberLevel === 2 &&
              <p className="hjhy">
                <img src={ic_hjhy} alt=""/>
                <span className="proveText">黄金VIP</span>
              </p>
              }
              {memberLevel === 3 &&
              <p className="zshy">
                <img src={ic_zshy} alt=""/>
                <span className="proveText">钻石VIP</span>
              </p>
              }
              {
                memberLevel > 1 && !_isEmpty(expireDataStr) &&
                <p className="date">{expireDataStr}到期</p>
              }
            </div>
            <div className="message-aside">
              <p
                className={(Number(current) === 1 || Number(current) === 4 || Number(current) === 5) ? "aside-href active" : "aside-href "}
                onClick={async () => {
                  await this.tabChange(1);
                }}
              >私信</p>
              <p className={Number(current) === 2 ? "aside-href active" : "aside-href "}
                 onClick={async () => {
                   await this.tabChange(2);
                 }}
              >关注</p>
              <p className={Number(current) === 3 ? "aside-href active" : "aside-href "}
                 onClick={async () => {
                   await this.tabChange(3);
                 }}
              >系统消息</p>
              {/* {
                tabs && tabs.map((item, index) => {
                    return (
                      <p key={index} className={index + 1 === Number(current) ? ' aside-href active' : 'aside-href'}
                         onClick={async () => {
                           await this.tabChange(index + 1);
                         }}
                      >{item}</p>
                    );
                  }
                )
              }*/}
            </div>
          </div>
          <div className="message-list">
            <div className={current !== 4 ? "tab-change" : "message-none"}>
              <ul>
                {
                  tabsTitle && tabsTitle.map((item, index) => {
                      return (
                        <li key={index}
                            className={index + 1 === Number(current) || current - 4 === index + 1 ? 'active' : ' none'}>{item}</li>
                      );
                    }
                  )
                }
              </ul>
            </div>
            {
              _isEmpty(message.messageData) &&
              (current !== 4 && current !== 1 && current !== 5) &&
              <NoResult/>
            }
            <div className={(current === 3 || current === 2) ? "tab-content" : "message-none"}>
              {
                message.messageData && message.messageData.map((item, index) => {
                    const { messageType: name } = item;
                    const img = MessageCenter.icon(name);
                    return (
                      <div className="message-single" key={index}>
                        <div className="type">
                          <img src={img} alt=".."/>
                        </div>
                        <div className="message">
                          <div className='message-top'>
                            <p className="title">{item.messageTitle}</p>
                            <p className='message-date'>{item.createDateStr}</p>
                          </div>
                          <p className="detail">{item.messageContent}</p>
                          {
                            !_isEmpty(item.createDate) &&
                            <p className="date">{moment(item.createDate).format('YYYY-MM-DD HH:mm')}</p>
                          }
                        </div>
                      </div>
                    );
                  }
                )
              }
              {
                seeMore && !isLoading && !noMore &&
                <div className="loading-more">下拉查看更多</div>
              }
              {
                noMore && !isLoading &&
                < p className="is-no-result"><span>没有更多内容</span></p>
              }
              {
                isLoading &&
                <div className="loading-more"><img src={ic_load} alt=""/></div>
              }
            </div>

            {/*私信*/}
            <div className={current === 1 || current === 5 ? "tab-content private-content" : "message-none"}>
              {
                message.privateData && message.privateData.map((item, index) => {
                    return (
                      <div className='out-message' key={index}>
                        <div className="message-single private-single"
                             key={index}
                             onClick={() => {
                               window.localStorage.setItem('privateLetterGuid', item.privateLetterGuid);
                               window.localStorage.setItem('senderGuid', item.senderGuid); // 发送人的Guid
                               window.localStorage.setItem('receiverGuid', item.receiverGuid); // 接收人的Guid
                               window.localStorage.setItem('userName', item.userName);
                               this.setState({
                                 current: 4,
                               });
                             }}
                        >
                          <div className="type">
                            <img src={item.picUrl || headImg} className="head-img" alt=""/>
                          </div>
                          <div className="message">
                            <p className="title">{item.userName} <span className="fix">与你的私信</span> <span
                              className="date">{todayTime !== item.lastUpdateDateStr.split(' ') [0] ? (item.lastUpdateDateStr).split(' ')[0] : '今天'}</span>
                            </p>
                            <p className="detail word-ellipsis " title="">{item.newContent}</p>
                          </div>
                        </div>
                        <div className="message-button">
                          <button className="sixin"
                                  onClick={async () => {
                                    window.localStorage.setItem('privateLetterGuid', item.privateLetterGuid);
                                    window.localStorage.setItem('senderGuid', item.senderGuid); // 发送人的Guid
                                    window.localStorage.setItem('receiverGuid', item.receiverGuid); // 接收人的Guid
                                    window.localStorage.setItem('userName', item.userName);
                                    this.setState({
                                      current: 4,
                                    });
                                  }}
                          >私信
                          </button>
                          <button
                            className="delete"
                            onClick={async () => {
                              confirm({
                                title: '删除',
                                content: '是否删除该条私信',
                                okText: '删除',
                                okType: 'danger',
                                cancelText: '取消',
                                async onOk() {
                                  const { userGuid, userAttribute } = userInfo;
                                  const params = {
                                    privateLetterGuid: item.privateLetterGuid,
                                    userGuid
                                  };
                                  const { errorCode }: any = await deletePrivateLetter(params);
                                  if (errorCode === '200') {
                                    if (userAttribute === 2) await user.getCompserDataanyInfo(userGuid);
                                    if (userAttribute === 1) await user.getUserInfo(userGuid);
                                    await message.getPrivateLetter({ userGuid, currentPage: 1, pageSize: 20 });
                                  }
                                },
                                onCancel() {
                                }
                              });
                            }}
                          >删除
                          </button>
                        </div>
                      </div>
                    );
                  }
                )
              }
              {
                seeMore && !isLoading && !noMore &&
                <div className="loading-more">下拉查看更多</div>
              }
              {
                noMore && !isLoading &&
                < p className="is-no-result"><span>没有更多内容</span></p>
              }
              {
                isLoading &&
                <div className="loading-more"><img src={ic_load} alt=""/></div>
              }
              {
                message.privateData && message.privateData.length === 0 && <NoResult/>
              }
              {/*  {
                message.privateData && message.privateData.map((item, index) => {
                    return (
                      <div className="message-single" key={index}>
                        <div className="type">
                          <img src={img} alt=".."/>
                        </div>
                        < div className="message">
                          <p className="title">{item.messageTitle}</p>
                          <p className="detail">{item.messageContent}</p>
                          {
                            !_isEmpty(item.createDate) &&
                            <p className="date">{moment(item.createDate).format('YYYY-MM-DD HH:mm')}</p>
                          }
                        </div>
                      </div>
                    );
                  }
                )
              }*/}
            </div>
            {
              current === 4 &&
              <div className={Number(current) === 4 ? "tab-content private" : "message-none"}>
                <PrivateLetter returnFun={async () => {
                  await this.tabChange(1);
                }}/>
              </div>
            }
          </div>
        </div>
        {
          this.state.isShow && <Alert
            message={this.state.message}
            onClose={() => {
              this.setState({ isShow: false });
            }}
            onSubmit={() => {
            }}

          />
        }
      </div>
    )
      ;
  }
}
