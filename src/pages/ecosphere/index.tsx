import * as React from "react";
import { inject, observer } from 'mobx-react';
import '@assets/scss/ecosphere.scss';
import NoResult from '@components/no_result';
import default_img from "@assets/images/default/ic_default_shu.png";
import ScrollTop from '@components/scroll-top';
import { Link } from 'react-router-dom';
import ic_load from '@assets/images/update/timg.gif';
import { _throttle, sendUserBehavior } from '@utils/util';
import Alert from '@components/alert';

interface IEcosphereStatus {
  tabCurrent: number;
  companyTypeActive: string;
  resourceKey: string;
  typeKey: string;
  show: boolean;
  buttonValue: string;
  url: string;
  message: string;
}

@inject('user', 'login', 'ecosphere')
@observer
export default class Ecosphere extends React.Component<IProps, IEcosphereStatus> {
  constructor(props: any) {
    super(props);
    this.state = {
      tabCurrent: 2,
      companyTypeActive: '',
      resourceKey: '',
      typeKey: '',
      show: false,
      buttonValue: '去登陆',
      url: '/login',
      message: '您还未登陆,请先登陆后进行操作',
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-生态圈";
    const { user, ecosphere } = this.props;
    // 人
    // await user.getCompanyType({ type: 1 });
    await ecosphere.receiveChange_i({ ecosphereType: 2, currentPage: 1 });
    window.addEventListener('scroll', this.scrollLoading);
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollLoading);
  }

  scrollLoading = () => {
    const { ecosphere, login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: '' };
    const { tabCurrent } = this.state;
    const {
      isLoading, getParams: { currentPage }, noMore,
      isLoading_i, getParams_i: { currentPage: currentPage_i }, noMore_i,
    } = ecosphere;
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      if (!isLoading && !noMore && tabCurrent === 3) {
        ecosphere.isLoading = true;
        _throttle(ecosphere.receiveChange({ currentPage: currentPage + 1, pageSize: 12 }), 3000);
      }
      if (!isLoading_i && !noMore_i && tabCurrent === 2) {
        if (!userGuid) {
          this.setState({
            show: true,
          });
          return;
        }
        ecosphere.isLoading_i = true;

        _throttle(ecosphere.receiveChange_i({
          ecosphereType: 2,
          currentPage: currentPage_i + 1,
        }), 3000);
      }

    }
  };

  tabSet(num) {
    this.setState({ tabCurrent: num });
  }

  render() {
    let { user, ecosphere } = this.props;
    const {
      isLoading, seeMore, noMore,
      isLoading_i, seeMore_i, noMore_i,
    } = ecosphere;
    const { typeKey, tabCurrent, show, message } = this.state;
    const { listCompany, listIndustry, listUser } = ecosphere;
    const { companyType } = user;
    return (
      <div className="main-container">
        <div className="ecosphere-container">
          {
            <div className="ecosphere-content">
              <div className="type-tab">
                <span className={tabCurrent === 1 ? "active" : ""} style={{ display: 'none' }}
                      onClick={async () => {
                        this.tabSet(1);
                        await ecosphere.receiveChange_i({ ecosphereType: 1, currentPage: 1 });
                      }}>顾问团</span>
                <span className={tabCurrent === 2 ? "active" : ""}
                      onClick={async () => {
                        this.tabSet(2);
                        await ecosphere.receiveChange_i({ ecosphereType: 2, currentPage: 1 });
                      }}>人</span>
                <span className={tabCurrent === 3 ? "active" : ""}
                      onClick={async () => {
                        this.tabSet(3);
                        // 企业类型
                        await user.getCompanyType({ type: 1 });
                        await ecosphere.receiveChange({ type: '', currentPage: 1 });
                      }}>企业</span>

              </div>
              {/* 企业-筛选条件 - start */}
              <div className='type-list' style={{ display: tabCurrent === 3 ? 'block' : 'none' }}>
                <div className='type-content'>
                  <span className='type-name'>企业类型：</span>
                  <ul className='type-ul'>
                    <li className={typeKey === '' ? 'active' : ''}
                        onClick={async () => {
                          const typeKey = '';
                          this.setState({ typeKey });
                          await ecosphere.receiveChange({ type: '', currentPage: 1 });
                        }}
                    >全部
                    </li>
                    {
                      companyType && companyType.map((item, index) => {
                        return (
                          <li key={index}
                              className={`${item.resourceKey}` === typeKey ? 'active' : ''}
                              onClick={async () => {
                                const typeKey = item.resourceKey;
                                const type = typeKey;
                                this.setState({ typeKey });
                                await ecosphere.receiveChange({ type, currentPage: 1 });
                              }}
                          >
                            {item.resourceValue}
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
              {/* 企业-筛选条件 - end */}

              <div className="tab-content">

                <div className="tab-list" style={{ display: tabCurrent === 1 ? 'flex' : 'none' }}>
                  {
                    listIndustry && listIndustry.map((item, index) => {
                      return (
                        <div key={index} onClick={() => {
                          window.localStorage.setItem('personalUserGuid', item.userGuid);
                        }}>
                          <Link to={'/personal-homepage'}
                                onClick={async () => {
                                  await sendUserBehavior({
                                    pageName: item.companyName,
                                    pageUrl: `/business-homepage/${item.userGuid}`,
                                    type: 8,
                                    remark: item.userGuid,
                                  });
                                }}
                          >
                            <div className="user-card">
                              <img src={item.picUrl || default_img} alt=""/>
                              <p className="name word-ellipsis">{item.userRealName}</p>
                              <p className="position">{item.academicTitle}</p>
                              <p className="introduce">
                                {item.userDesc}
                              </p>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  }

                  {
                    seeMore_i && !isLoading_i && !noMore_i &&
                    <div className="loading-more">下拉查看更多</div>
                  }
                  {
                    noMore_i && !isLoading_i &&
                    < p className="is-no-result"><span>没有更多内容</span></p>
                  }
                  {
                    isLoading_i &&
                    <div className="loading-more"><img src={ic_load} alt=""/></div>
                  }

                  {
                    listIndustry && listIndustry.length === 0 && <NoResult/>
                  }
                </div>

                <div className="tab-list" style={{ display: tabCurrent === 2 ? 'flex' : 'none' }}>
                  {
                    listIndustry && listIndustry.map((item, index) => {
                      return (
                        <div key={index} className="person-card-parent" onClick={() => {
                          window.localStorage.setItem('personalUserGuid', item.userGuid);
                        }}>

                          <div
                            onClick={async () => {
                              await sendUserBehavior({
                                pageName: item.companyName,
                                pageUrl: `/personal-homepage/${item.userGuid}`,
                                type: 8,
                                remark: item.userGuid,
                              });
                              // if false 假数据
                              if (item.userGuid) {
                                this.props.history.push(`/personal-homepage/${item.userGuid}`);
                              } else {
                                ecosphere.keepData(item);
                                this.props.history.push(`/personal-home`);
                              }
                            }}
                          >
                            <div className="person-card">
                              <img src={item.picUrl || default_img} alt=""/>
                              <p className="name word-ellipsis" title={item.userRealName}>{item.userRealName}</p>
                              <p className="position">{item.academicTitle}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  {
                    seeMore_i && !isLoading_i && !noMore_i &&
                    <div className="loading-more">下拉查看更多</div>
                  }
                  {
                    noMore_i && !isLoading_i &&
                    < p className="is-no-result"><span>没有更多内容</span></p>
                  }
                  {
                    isLoading_i &&
                    <div className="loading-more"><img src={ic_load} alt=""/></div>
                  }

                  {
                    listIndustry && listIndustry.length === 0 && <NoResult/>
                  }
                </div>

                <div className="tab-list  flex" style={{ display: tabCurrent === 3 ? 'flex' : 'none' }}>
                  {
                    listCompany && listCompany.map((item, index) => {
                      return (
                        <div key={index} className='company-type'
                             onClick={async () => {
                               await sendUserBehavior({
                                 pageName: item.companyName,
                                 pageUrl: `/business-homepage/${item.userGuid}`,
                                 type: 8,
                                 remark: item.userGuid,
                               });
                               this.props.history.push(`/business-homepage/${item.userGuid}`);
                             }}>
                          <img src={item.picUrl || default_img} alt='' className="cooperate-img"/>
                          <div className='company-title'>{item.companyName}</div>
                        </div>
                      );
                    })
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
                    listCompany && listCompany.length === 0 && <NoResult/>
                  }
                </div>

              </div>
            </div>
          }</div>
        <ScrollTop/>
        {show &&
        <Alert message={message}
               buttonValue={this.state.buttonValue}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.props.history.push(this.state.url);
               }}
        />
        }
      </div>
    );
  }
}
