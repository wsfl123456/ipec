import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Add from '@assets/images/add.svg';
import Ring from '@assets/images/ring.svg';
import icon_upload from '@assets/images/copyright-center/header_upload@2x.png';
import sixin from '@assets/images/message-center/sixin.svg';
import follow from '@assets/images/message-center/guanzhu.svg';
import system_message from '@assets/images/message-center/xitongxiaoxi.svg';
import ic_no_result from "@assets/images/contrast/ic_result_iveness.png";
import '@assets/fonts/iconfont.css';
import _isObject from 'lodash/isObject';
import ipec_logo from '@assets/images/ip_logo/logo_10.20.png';
import animation from '@assets/images/common/animation.svg';
import design from '@assets/images/common/design.svg';
import art from '@assets/images/common/art.svg';
import book from '@assets/images/common/book.svg';
import brand from '@assets/images/common/brand.svg';
import entertainment from '@assets/images/common/entertainment.svg';
import life from '@assets/images/common/life.svg';
import sport from '@assets/images/common/sport.svg';
import play from '@assets/images/common/play.svg';
import star from '@assets/images/common/star.svg';
import { inject, observer } from 'mobx-react';
import _isEmpty from 'lodash/isEmpty';
import ic_user from '@assets/images/user.svg';
import Alert from '@components/alert';
import { message } from 'antd';
import ic_rzhy from '@assets/images/user/ic_yrz.svg';
import ic_hjhy from '@assets/images/user/ic_hjhy.svg';
import ic_zshy from '@assets/images/user/ic_zshy.svg';
import silverNoCircle from '@assets/images/user/silver--no_circle.png';
import ic_attestation_pr from '@assets/images/user/ic_yrz.svg';
import '@assets/scss/header.scss';
import { sendUserBehavior } from '@utils/util';

const subTypeObj = {
  '卡通动漫': animation,
  '文化艺术': art,
  '生活方式': life,
  '影视娱乐': entertainment,
  '企业品牌': brand,
  '体育运动': sport,
  '名人明星': star,
  '非营利机构': design,
  '网络游戏': play,
  '网文图书': book,
};

interface IHeaderState {
  // 用户名
  mouseIsOpen: string,
  searchValue: string,
  pullDown: boolean,
  infoShow: string,
  show: boolean,
  showLogin: boolean,
  showWord: boolean,
  lowerAlert: boolean,
  message: string,
  lowerMsg: string,
  circleShow?: boolean,
  hotWordsShow: boolean,
  authorityShow: boolean,
  authorityMsg: string,
}

@inject('ip_list', "ipSearch", 'industry', 'user', 'nav_store', 'message', 'login', 'update_store')
@observer
export default class Header extends React.Component<IProps, IHeaderState> {
  state = {
    mouseIsOpen: 'none',
    searchValue: '',
    pullDown: false,
    infoShow: 'none',
    show: false,
    showLogin: false,
    showWord: false,
    lowerAlert: false,
    message: '',
    lowerMsg: '',
    circleShow: false,
    hotWordsShow: true,
    authorityShow: false,
    authorityMsg: ''
  };

  async componentDidMount() {
    await this.props.nav_store.navList();
    //  公司和个人的基本信息包括会员等级
    await this.getUserInfo();
    await this.getMessage();
  }

  async componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IHeaderState>, snapshot?: any) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      await this.getMessage();
    }

  }

  /**
   * 消息盒
   */
  async getMessage() {
    const { message, login } = this.props;
    const userData = login.userInfo;
    if (!_isEmpty(userData)) {
      const userGuid = userData['userGuid'];
      await message.getMessageBox({ userGuid });
    }
  }

  // 基本信息包括会员等级
  async getUserInfo() {
    const { login, user } = this.props;
    if (!_isEmpty(login.userInfo)) {
      const { userGuid, userAttribute }: any = login.userInfo;
      if (userAttribute === 1) {
        const person = await user.reqPersonInfo(userGuid);
        let data = { ...login.userInfo, ...person };
        localStorage.setItem("user", JSON.stringify(data));
        login.updateUser(data);
      }
      if (userAttribute === 2) {
        const companyInfo = await user.reqCompanyInfo(userGuid);
        let data = { ...login.userInfo, ...companyInfo };
        localStorage.setItem("user", JSON.stringify(data));
        login.updateUser(data);
      }
    }
  }

  async logout() {
    this.props.ipSearch.keywords = '';
    this.props.history.push('/login');
    await this.props.login.logout();
  }

  private handleMouseEnter = () => {
    this.setState({
      mouseIsOpen: 'block',
    });
  };

  private handleMouseOut = () => {
    this.setState({
      mouseIsOpen: 'none',
    });
  };

  /**
   * 设置已读
   */
  async setMessageReaded() {
    const { message: msg, login } = this.props;
    const userData = login.userInfo;
    if (!_isEmpty(userData)) {
      const userGuid = userData['userGuid'];
      const object: any = await msg.getMessageReaded(userGuid);
      if (_isObject(object) && object['show']) {
        message.error(object['message']);
      }
      // 更新session消息状态
      let isReadNumber = 0;
      let userSession = { ...userData, isReadNumber };
      localStorage.setItem('user', JSON.stringify(userSession));
      login.updateUser(userSession);
      await msg.getMessageBox({ userGuid });
    }
  }

  private showLinks(item: any, person: any, company: any) {
    const { login, ip_list } = this.props;
    const exhibitionGuid = person.exhibitionGuid ? person.exhibitionGuid : company.exhibitionGuid;

    let toPath = item.navUrl || '';
    if (item.navName === '商贸配对' || item.navName === '生态圈') {
      if (!!login.userInfo && item.navName === '商贸配对') {
        toPath = `${item.navUrl || ''}/${exhibitionGuid || ''}`;
      }
      if (!login.userInfo) {
        return (
          <div
            className="nav-link custom-nav-pointer"
            onClick={() => {
              this.setState({
                showLogin: true,
                message: "您还未登录 请先登录后进行操作"
              });
            }}
          >
            {item.navName || ''}
          </div>
        );
      }
    }

    if (item.navName === '排行榜') {
      // if (login.userInfo) {
      //   const authorityArr = [',3,', ',5,'];
      //   const visibleAuthrioty = authorityArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
      //   if (!visibleAuthrioty) {
      //     return (
      //       <div
      //         className="nav-link custom-nav-pointer"
      //         onClick={() => {
      //           this.setState({
      //             authorityShow: true,
      //             authorityMsg: "该数据仅为钻石VIP会员用户可见，如需查看请先升级员"
      //           });
      //         }}
      //       >
      //         {item.navName || ''}
      //       </div>
      //     );
      //   }
      // } else {
        if (!login.userInfo) {
          return (
            <div
              className="nav-link custom-nav-pointer"
              onClick={() => {
                this.setState({
                  showLogin: true,
                  message: "您还未登录 请先登录后进行操作"
                });
              }}
            >
              {item.navName || ''}
            </div>
          );
        }

      // }
    }

  /*  if (item.navName === '筛选器') {
      if (login.userInfo) {
        const authorityArr = [',3,', ',4,'];
        const visibleAuthrioty = authorityArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
        if (!visibleAuthrioty) {
          return (
            <div
              className="nav-link custom-nav-pointer"
              onClick={() => {
                this.setState({
                  authorityShow: true,
                  authorityMsg: "该数据仅为钻石VIP会员用户可见，如需查看请先升级会员"
                });
              }}
            >
              {item.navName || ''}
            </div>
          );
        }
      } else {
        return (
          <div
            className="nav-link custom-nav-pointer"
            onClick={() => {
              this.setState({
                showLogin: true,
                message: "您还未登录 请先登录后进行操作"
              });
            }}
          >
            {item.navName || ''}
          </div>
        );
      }

    }*/

    return (
      <NavLink
        exact={item.navName === '首页'}
        className="nav-link"
        activeClassName="active"
        to={toPath}
        onClick={async () => {
          const params = {
            pageName: item.navName,
            pageUrl: toPath,
            type: 2,
            remark: '',
          };
          await sendUserBehavior(params);
          if (item.navName === 'IP库') {
            ip_list.setbackRout();
          }
          if (item.navName === '商贸配对' && !login.userInfo.exhibitionGuid) {
            this.setState({ lowerMsg: '当前展会已下架 敬请期待下一次展会!', lowerAlert: true });
          }
        }}
      >
        {item.navName || ''}
      </NavLink>
    );
  }

  render() {
    const { ip_list, industry, ipSearch, nav_store, message, login, user } = this.props;
    const info = user.personInfo;
    const infoCompany = user.companyInfo;
    const { mouseIsOpen, searchValue, pullDown, hotWordsShow } = this.state;
    let { hotWords } = industry;
    const { headerNav: data } = nav_store;
    let userGuid: string, userAttribute: number, memberLevel: number, expireDataStr: string, realStatus: number;
    if (!_isEmpty(login.userInfo)) {
      userGuid = login.userInfo.userGuid;
      userAttribute = login.userInfo.userAttribute;
      memberLevel = login.userInfo.memberLevel;
      expireDataStr = login.userInfo.expireDataStr;
      realStatus = login.userInfo.realStatus;
    }
    const type = window.localStorage.getItem('type');

    return (
      <div className={!data ? 'aboutRule' : 'top-header'}>
        <ul className="header-container nav flex-row justify-content-center align-items-center">
          <li className="nav-item logo">
            <NavLink to="/index">
              <img src={ipec_logo} alt="" style={{ height: '0.62rem' }}/>
            </NavLink>
          </li>
          {
            (data || []).map((item, index) => {
              return (
                <li className="nav-item" key={index}
                    onClick={() => {
                      this.props.ipSearch.clearKeyword();
                      if (!login.userInfo) {
                        localStorage.setItem("historyUrl", item.navUrl.replace(/[/]/, ""));
                      }
                    }}
                >
                  {this.showLinks(item, info, infoCompany)}
                  <div className="main-top-hover">
                    {
                      item.navName === 'IP库' && item.sublist.length > 1 && item.sublist.map((val) => {
                        const { typeName: name } = val;
                        return (
                          <div key={name} className="hover-sub-item flex-row justify-content-start align-items-center">
                            <img src={subTypeObj[name]} className="iconimg" alt=""/>
                            <Link className="sub-type-a" to="/ip-list"
                                  onClick={async () => {
                                    await ip_list.setInRout();
                                    await ip_list.ipTypeNav(name);
                                  }}>{name}</Link>
                          </div>
                        );
                      })
                    }
                    {
                      item.navName !== 'IP库' && item.sublist.length > 1 && item.sublist.map((val) => {
                        const { navName: name } = val;
                        return (
                          <div key={name} className="hover-sub-item flex-row justify-content-start align-items-center">
                            <Link to={item.navUrl} className="sub-type-a" key={name}>{name}</Link>
                          </div>
                        );
                      })
                    }
                  </div>
                </li>
              );
            })
          }
          <li className="nav-item search-input-area">
            <input type="password" className="search-input positionleftNull"/>
            <input type="text" autoComplete="off" className="search-input" placeholder="搜索影片、剧集、IP名称…"
                   value={ipSearch.keywords || ''}
                   onChange={async (e) => {
                     let value = (e.currentTarget.value).replace(/ /g, '');
                     if (value) {
                       this.setState({ hotWordsShow: false });
                     } else {
                       this.setState({ hotWordsShow: true });
                     }
                     this.setState({
                       searchValue: e.currentTarget.value,
                     });
                     await ipSearch.changeKeyWords(e.currentTarget.value);
                   }}
                   onKeyDown={async (e) => {
                     if (e.keyCode === 13) {
                       if (e.currentTarget.value) {
                         let value = (e.currentTarget.value).replace(/ /g, '');
                         e.persist();
                         this.setState({
                           pullDown: false,
                           searchValue: value,
                         });
                         if (this.props.history.location.pathname !== '/ip-search') {
                           this.props.history.push(`/ip-search`);
                         }
                         await ipSearch.changeKeyWords(value);
                         const keyword = searchValue;
                         if (userGuid) {
                           await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20, userGuid });
                         } else {
                           await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20 });
                         }
                         const params = {
                           pageName: value,
                           pageUrl: '/ip-search',
                           type: 3,
                           remark: 'ip',
                         };
                         await sendUserBehavior(params);
                       } else {
                         this.setState({
                           showWord: true,
                           message: '请输入搜索关键词',
                         });
                       }
                     }

                   }}
                   onClick={async () => {
                     this.setState({
                       pullDown: true,
                     });
                     const params = { hotWordsType: 1 };
                     await industry.getHotWords(params);
                   }}
                   onBlur={(e) => {
                     if (e.target.className !== 'search-input') {
                       this.setState({
                         pullDown: false,
                       });
                     }
                   }}
            />
            {data === '' ?
              <i className="icon iconfont icon-search"/> :
              <i className="icon iconfont icon-search"
                 onClick={async () => {
                   if (searchValue.replace(/ /g, '')) {
                     if (this.props.history.location.pathname !== '/ip-search') {
                       this.props.history.push(`/ip-search`);
                     }
                     const keyword = searchValue;
                     if (userGuid) {
                       await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20, userGuid });
                     } else {
                       await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20 });
                     }
                     const params = {
                       pageName: 'keyword',
                       pageUrl: '/ip-search',
                       type: 3,
                       remark: 'ip',
                     };
                     await sendUserBehavior(params);
                   } else {
                     this.setState({
                       showWord: true,
                       message: '请输入搜索关键词',
                     });
                   }
                 }}/>}
            {(pullDown && hotWordsShow) &&
            <div className="search_pulldown"
                 onMouseLeave={() => {
                   this.setState({
                     pullDown: false,
                   });
                 }}>
              <ul>
                <li className="hot-title">热门搜索</li>
                {
                  (hotWords && hotWordsShow) && hotWords.map((item, index) => {
                    return (
                      <li key={index}
                          onClick={async () => {
                            const params = {
                              pageName: item.hotWords,
                              pageUrl: '/ip-search',
                              type: 3,
                              remark: 'ip',
                            };
                            await sendUserBehavior(params);
                            ipSearch.changeKeyWords(item.hotWords);
                            await ipSearch.IpSearch({
                              type: 1,
                              keyword: item.hotWords,
                              currentPage: 1,
                              pageSize: 20,
                              userGuid
                            });
                            if (this.props.history.location.pathname !== '/ip-search') {
                              this.props.history.push(`/ip-search`);
                            }
                            this.setState({
                              pullDown: false,
                            });
                          }}>{item.hotWords}</li>
                    );
                  })
                }
              </ul>
            </div>
            }
          </li>
          {!login.userInfo ?
            <li className="nav-item user-operation justify-content-center align-items-center">
              <Link to="/register" className="register-btn">注册</Link>
              <span className="separate-symbol">|</span>
              <Link to="/login" className="login-btn">登录</Link>
            </li>
            :
            <li
              className={login.userInfo.userAttribute === 2 ? "login-success" : " login-success padding-left15"}>
              {
                login.userInfo.userAttribute === 2 &&
                <a onClick={() => {
                  if (login.userInfo.realStatus !== 1) {
                    this.setState({
                      show: true,
                      message: '您还未认证，请先去认证'
                    });
                  } else {
                    this.props.update_store.reset();
                    this.props.ipSearch.clearKeyword();
                    this.props.history.push('/update');
                  }
                }}>
                  <div className="login-add">
                    <img src={Add} alt=""/>
                    <p className="add-ip">上传IP</p>
                  </div>
                </a>
              }
              <Link to="/copyright">
                <div className="login-copyright">
                  <img src={icon_upload} alt="" className="icon-msg"/>
                  <p>版权中心</p>
                </div>
              </Link>

              <div
                className={(_isEmpty(message.messageBox) || this.state.circleShow) ? "login-ring" : "login-ring hasMsg"}
                onMouseEnter={() => {
                  this.setState({
                    infoShow: "block",
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    infoShow: "none",
                  });
                }}>
                <span className="circle-img"/>
                <img src={Ring} alt="" className="icon-msg"/>
                <p className="add-ip">消息</p>
                {/*消息下拉框*/}
                <div className="info-hover"
                     style={{ display: this.state.infoShow }}
                     onMouseOver={() => {
                       this.setState({
                         infoShow: "block",
                       });
                     }}
                     onMouseOut={() => {
                       this.setState({
                         infoShow: "none",
                       });
                     }}
                >
                  <div className={_isEmpty(message.messageBox) ? "hover-box no-message" : "hover-box"}>
                    <div className="info-header">消息盒
                      <i onClick={async () => {
                        this.setState({
                          circleShow: false
                        });
                        await this.setMessageReaded();
                      }}>清空</i>
                    </div>
                    <div className="info-main">

                      {
                        message.messageBox && message.messageBox.map((item, index) => {
                            return (
                              <div key={index}>
                                {
                                  item.messageType === 1 &&
                                  <div className="info-single"
                                       onClick={async () => {
                                         await message.changeMessageParams({ messageType: 1 });
                                         this.setState({
                                           circleShow: false
                                         });
                                         this.props.ipSearch.clearKeyword();
                                         this.props.history.push('/message-center');
                                       }}>
                                    <div className="img-box">
                                      <img src={sixin} alt=".."/>
                                    </div>
                                    <div className="single-detail">
                                      <p className="single-type">私信</p>
                                      <p className="word-ellipsis">{item.messageContent}</p>
                                    </div>
                                    {
                                      item.msgCount > 0 &&
                                      <span className='single-num'>{item.msgCount}</span>
                                    }
                                  </div>
                                }
                                {
                                  item.messageType === 2 &&
                                  <div className="info-single"
                                       onClick={async () => {
                                         await message.changeMessageParams({ messageType: 2, userGuid });
                                         this.setState({
                                           circleShow: false
                                         });

                                         this.props.ipSearch.clearKeyword();
                                         this.props.history.push('/message-center');
                                       }}>
                                    <div className="img-box">
                                      <img src={follow} alt=".."/>
                                    </div>
                                    <div className="single-detail">
                                      <p className="single-type">关注</p>
                                      <p className="word-ellipsis">{item.messageContent}</p>
                                    </div>
                                    {
                                      item.msgCount > 0 &&
                                      <span className='single-num'>{item.msgCount}</span>
                                    }
                                  </div>
                                }
                                {
                                  item.messageType === 3 &&
                                  <div className="info-single"
                                       onClick={async () => {
                                         await message.changeMessageParams({ messageType: 3 });
                                         this.props.ipSearch.clearKeyword();
                                         this.props.history.push('/message-center');
                                       }}>
                                    <div className="img-box">
                                      <img src={system_message} alt=".."/>
                                    </div>
                                    <div className="single-detail">
                                      <p className="single-type">系统消息</p>
                                      <p className="word-ellipsis">{item.messageContent}</p>
                                    </div>
                                    {
                                      item.msgCount > 0 &&
                                      <span className='single-num'>{item.msgCount}</span>
                                    }
                                  </div>
                                }
                              </div>);
                          }
                        )
                      }
                    </div>
                    <div className="no-data">
                      <img src={ic_no_result} alt="" className="img-no-data"/>
                      <p>没有新消息</p>
                    </div>
                    <div className="info-footer justify-content-between">
                        <span onClick={async () => {
                          await this.setMessageReaded();
                        }}>全部标记为已读 </span>
                      <span onClick={async () => {
                        this.setState({
                          circleShow: false
                        });
                        await message.changeMessageParams({ messageType: 1 });
                        this.props.ipSearch.clearKeyword();
                        this.props.history.push('/message-center');
                      }}>查看全部</span>
                    </div>
                  </div>
                </div>
              </div>
              < div className="login-user" onMouseLeave={this.handleMouseOut} onMouseEnter={this.handleMouseEnter}>
                <div>
                  {
                    userAttribute === 1
                      ? <Link to="/user/0"> < img src={info.picUrl || ic_user} alt=""/></Link>
                      : <Link to="/user/10"> < img src={infoCompany.picUrl || ic_user} alt=""/></Link>
                  }
                </div>
                <ul className="login-hover" style={{ display: mouseIsOpen }}>
                  <li>
                    <div className="flex flex-column membership ">
                      {
                        userAttribute === 1
                          ? <img className="small-head" src={info.picUrl || ic_user} alt=""/>
                          : <img className="small-head" src={infoCompany.picUrl || ic_user} alt=""/>
                      }
                      <div className="membership-right">
                        <p>
                          {
                            userAttribute === 1 &&
                            <span
                              className="membership-name word-ellipsis"
                              title={info.userRealName || login.userInfo.userLogin}>
                            {info.userRealName ? info.userRealName : login.userInfo.userLogin}</span>
                          }
                          {
                            userAttribute === 2 &&
                            <span
                              className="membership-name word-ellipsis"
                              title={infoCompany.companyName || login.userInfo.userLogin}>
                              {infoCompany.companyName ? infoCompany.companyName : login.userInfo.userLogin}</span>
                          }
                          {
                          realStatus === 1 &&
                          <span className=" membership-level rzhy">
                          <img src={ic_attestation_pr} style={{width: '12px', height: '12px'}} alt=""/>
                          {/*认证*/}
                        </span>
                          }
                          {memberLevel === 1 &&
                          <span className=" membership-level rzhy">
                            <img src={silverNoCircle} width='16' height='15' alt=""/>
                            {/*白银VIP*/}
                          </span>
                          }
                          {memberLevel === 2 &&
                          <span className="membership-level hjhy">
                            <img src={ic_hjhy} alt=""/>
                            {/*黄金VIP*/}
                          </span>
                          }
                          {memberLevel === 3 &&
                          <span className="membership-level zshy">
                            <img src={ic_zshy} alt=""/>
                            {/*钻石VIP*/}
                          </span>
                          }
                        </p>
                        {
                          memberLevel > 0 && !_isEmpty(expireDataStr) &&
                          <p className="date">{expireDataStr}到期</p>
                        }
                      </div>
                    </div>
                  </li>

                  {
                    <Link to="/vip-card-buy" className="hover-li">VIP数据权限卡购买</Link>
                  }
                  {
                    <Link to="/user/13" className="hover-li">VIP卡包</Link>
                  }
                  {
                    <Link to="/user/15" className="hover-li">我的订单</Link>
                  }
                  {
                    <Link to="/user/20" className="hover-li">收货地址</Link>
                  }
                  {
                    login.userInfo.userAttribute === 1 &&
                    <Link to="/user/0" className="hover-li">个人资料</Link>
                  }
                  {
                    login.userInfo.userAttribute === 2 &&
                    <Link to="/user/10" className="hover-li">企业信息</Link>
                  }

                  {/* {
                    <Link to="/user/12" className="hover-li">VIP会员服务</Link>
                  } */}

                  {
                    login.userInfo.userAttribute === 2 &&
                    <Link to="/user/11" className="hover-li">企业员工</Link>
                  }
                  {
                    login.userInfo.userAttribute === 2 &&
                    <Link to="/user/1" className="hover-li border-top">发布IP</Link>
                  }
                  {
                    login.userInfo.userAttribute === 2 &&
                    <Link to="/user/5" className="hover-li">发布的案例</Link>
                  }
                  {
                    login.userInfo.userAttribute === 2 &&
                    <Link to="/user/14" className="hover-li">发布的IP需求</Link>
                  }
                 {/* {
                    memberLevel === 3 &&
                    <Link to="/user/15" className="hover-li">IP筛选器</Link>
                  }*/}
                 {/* {
                    memberLevel === 3 &&
                    <Link to="/user/16" className="hover-li" onClick={() => user.setCalculateStatus(true)}>预测数据</Link>
                  }*/}
                  {/* <Link to="/user/8" className="hover-li border-top">发出的邀约</Link> */}
                  {/* <Link to="/user/9" className="hover-li">收到的邀约</Link> */}
                  <Link to="/user/7" className="hover-li">我的日程</Link>
                  <Link to="/user/6" className="hover-li">我的关注</Link>
                  <Link to="/user/2" className="hover-li border-top">账号认证</Link>
                  <Link to="/user/3" className="hover-li">账号安全</Link>

                  <li
                    className="hovli"
                    onClick={async () => await this.logout()}
                  >退出
                  </li>
                </ul>
              </div>
            </li>
          }
        </ul>
        {
          this.state.show &&
          <Alert
            message={this.state.message}
            buttonValue="去认证"
            onClose={() => this.setState({ show: false })}
            onSubmit={() => this.props.history.push('/user/2')}
          />
        }
        {
          this.state.showLogin &&
          <Alert message={this.state.message} onClose={() => {
            this.setState({
              showLogin: false
            });
          }} onSubmit={() => {
            this.props.history.push('/login');
          }}/>
        }
        {
          this.state.showWord &&
          <Alert message={this.state.message} onClose={() => {
            this.setState({
              showWord: false
            });
          }} onSubmit={() => {

          }}/>
        }
        {this.state.lowerAlert &&
        <Alert message={this.state.lowerMsg}
               onClose={() => {
                 this.setState({ lowerAlert: false });
                 this.props.history.push('/');
               }}
               onSubmit={() => {
                 this.props.history.push('/');
               }}/>
        }
                {this.state.authorityShow &&
        <Alert message={this.state.authorityMsg}
               onClose={() => {
                 this.setState({ authorityShow: false, authorityMsg: '' });
               }}
               buttonValue={"去升级"}
               onSubmit={() => {
                 this.props.history.push('/user/12');
               }}
        />
        }
      </div>
    );
  }
}
