import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/ip-research.scss";
import ScrollTop from "@components/scroll-top";
import default_img from "@assets/images/default/ic_default_heng.png";
import default_img_small from "@assets/images/default/ic_default_shu.png";
import ic_user from '@assets/images/user.svg';
import { Link } from 'react-router-dom';
import Alert from '@components/alert';
import ic_load from '@assets/images/update/timg.gif';
import NoResult from '@components/no_result';
import _isEmpty from "lodash/isEmpty";
import { _throttle, sendUserBehavior } from '@utils/util';

interface IIndustryState {
  selectedObj: object,
  selectedObjNeed: object,
  currentPage: number,
  show: boolean,
  isLogin: boolean,
  message: string,
  current: number,
  tabCurrent: number,
}

@inject("industry", "industry_detail", "login")
@observer
export default class IpResearch extends React.Component<IProps, IIndustryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedObj: {
        ipType: "",
        industries: "",
        hotWords: "",
      },
      selectedObjNeed: {
        industries: "",
      },
      currentPage: 1,
      show: false,
      isLogin: true,
      message: "",
      current: 0,
      tabCurrent: 1,
    };
  };

  async componentDidMount() {
    document.title = "IP二厂-行业观察";
    const { industry, login } = this.props;
    await industry.firstOrders();
    await industry.industry();
    // 关键词
    // const params = { hotWordsType: 2 };
    // await industry.getHotWords(params);
    if (!_isEmpty(login.userInfo)) {
      this.setState({
        isLogin: false,
      });
      const { userGuid } = login.userInfo;
      await industry.setStatus({ userGuid });
    } else {
      localStorage.setItem('historyUrl', `ip-research`);
      this.setState({
        isLogin: true
      });
      await industry.setStatus();
    }
    addEventListener('scroll', this.scrollLoading);
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.scrollLoading);
  }

  scrollLoading = () => {
    const { industry } = this.props;
    const {
      currentPage, isLoading, seeMore, industryParams: { postType },
    } = industry;
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight && !isLoading && seeMore) {
      industry.setIsLoading(true);
      _throttle(industry.setStatus({ currentPage: currentPage + 1, postType }), 3000);
    }

  };

  async setLike(item, index) {
    const { login, industry_detail, industry } = this.props;
    if (!_isEmpty(login.userInfo)) {
      const { userGuid } = login.userInfo;
      let param = {
        portalPostGuid: item.portalPostGuid, userGuid,
      };
      if (industry.industryCaseList[index].isGiveLike !== 1) {
        industry.industryCaseList[index].isGiveLike = 1;
        industry.industryCaseList[index].portalPostLikeCount++;
      }
      let isSuccess = await industry_detail.setLike(param);
      if (!(isSuccess.request)) {
        this.setState({ message: isSuccess.result, show: true });
      } else {
        // await industry.setStatus();
      }
    } else {
      localStorage.setItem('historyUrl', `ip-research`);
      this.setState({ message: "您还未登陆", show: true });
    }
  }

  async getUserBehavior() {

  }

  render() {
    const { industry } = this.props;
    const {
      firstOrderList,
      industryList, industryCaseList, isLoading, seeMore, noMore, industryParams: { postType: tabCurrent },
    } = industry;
    let { selectedObj, show, message, selectedObjNeed } = this.state;
    return (
      <div className="bg-color">
        <div className="ip-research">

          {/* tab-title*/}
          <div className="type-of" style={{ paddingBottom: (tabCurrent === 1 || tabCurrent === 5) ? "0.08rem" : "0" }}>
            <div className="type-tab" style={{ borderBottom: "1px solid #ced4da" }}>
            <span className={tabCurrent === 1 ? "active" : ""}
                  onClick={async () => {
                    this.setState({
                      selectedObj: {
                        ipType: "",
                        industries: "",
                        hotWords: "",
                      },
                    });
                    await industry.setStatus({
                      currentPage: 1,
                      postType: 1,
                      ipTypeSuperiorNumber: '',
                      portalCategoryGuid: ''
                    });

                    await sendUserBehavior({
                      pageName: '行业案例',
                      pageUrl: '/ip-research',
                      type: 5,
                      remark: ''
                    });
                  }}
            >行业案例</span>
              <span className={tabCurrent === 5 ? "active" : ""}
                    onClick={async () => {
                      this.setState({
                        selectedObj: {
                          ipType: "",
                          industries: "",
                          hotWords: "",
                        },
                      });
                      await industry.setStatus({
                        currentPage: 1,
                        postType: 5,
                        ipTypeSuperiorNumber: '',
                        portalCategoryGuid: ''
                      });
                      await sendUserBehavior({
                        pageName: '行业趋势',
                        pageUrl: '/ip-research',
                        type: 5,
                        remark: ''
                      });
                    }}
              >行业趋势</span>
              <span className={tabCurrent === 2 ? "active" : ""}
                    onClick={async () => {
                      await industry.setStatus({
                        currentPage: 1,
                        postType: 2,
                        ipTypeSuperiorNumber: '',
                        portalCategoryGuid: ''
                      });
                      await sendUserBehavior({
                        pageName: '行业动态',
                        pageUrl: '/ip-research',
                        type: 5,
                        remark: ''
                      });
                    }}
              >行业动态</span>
              <span className={tabCurrent === 3 ? "active" : ""}
                    onClick={async () => {
                      await industry.setStatus({
                        currentPage: 1,
                        postType: 3,
                        ipTypeSuperiorNumber: '',
                        portalCategoryGuid: ''
                      });
                      await sendUserBehavior({
                        pageName: '任务专访',
                        pageUrl: '/ip-research',
                        type: 5,
                        remark: ''
                      });
                    }}
              >人物专访</span>
              {/* <span className={tabCurrent === 4 ? "active" : ""}
                    onClick={async () => {
                      this.setState({
                        selectedObj: {
                          ipType: "",
                          industries: "",
                          hotWords: "",
                        },
                      });
                      await industry.setStatus({
                        currentPage: 1,
                        postType: 4,
                        portalCategoryGuid: '',
                        ipTypeSuperiorNumber: ''
                      });
                      await sendUserBehavior({
                        pageName: 'IP需求',
                        pageUrl: '/ip-research',
                        type: 5,
                        remark: ''
                      });
                    }}
              >IP需求</span> */}

            </div>
          </div>
          {
            (tabCurrent === 1 || tabCurrent === 4 || tabCurrent === 5) &&
            <div className="type-of">
              {
                (tabCurrent === 1 || tabCurrent === 5) &&
                <div className="type-list">
                  <span className="type-name">IP&nbsp;类&nbsp;&nbsp; 型:</span>
                  <ul className="type-ul">
                    <li className={selectedObj['ipType'] === "" ? "active" : ""}
                        onClick={async () => {
                          this.setState({
                            selectedObj: { ...selectedObj, ipType: '' }
                          }, () => {
                          });
                          await industry.setStatus({ ipTypeSuperiorNumber: '', currentPage: 1 });
                        }}>全部
                    </li>
                    {
                      firstOrderList && firstOrderList.map((item, index) => {
                        return (
                          <li key={index}
                              className={`${item.ipTypeGuid}` === selectedObj['ipType'] ? "active" : ""}
                              onClick={async () => {
                                const ipTypeSuperiorNumber = item.ipTypeNumber;
                                const currentPage = 1;
                                let ipType = item.ipTypeGuid;
                                this.setState({
                                  selectedObj: { ...selectedObj, ipType },
                                });
                                await industry.setStatus({ ipTypeSuperiorNumber, currentPage });
                              }}>{item.ipType}</li>
                        );
                      })
                    }
                  </ul>
                </div>

              }

              <div className="type-list" style={{ paddingTop: tabCurrent === 4 ? '0.12rem' : '' }}>
                <span className="type-name">行业分类:</span>
                <ul className="type-ul">
                  <li className={selectedObj['industries'] === "" ? "active" : ""}
                      onClick={async () => {
                        const portalCategoryGuid = "", currentPage = 1;
                        this.setState({
                          selectedObj: { ...selectedObj, industries: portalCategoryGuid }
                        });
                        if (tabCurrent === 1) {
                          await industry.setStatus({ portalCategoryGuid, currentPage, postType: tabCurrent, });
                        } else {
                          await industry.setStatus({
                            portalCategoryGuid,
                            currentPage,
                            postType: tabCurrent,
                            ipTypeSuperiorNumber: ''
                          });
                        }

                      }}>全部
                  </li>
                  {
                    industryList && industryList.map((item, index) => {
                      return (
                        <li key={index}
                            className={`${item.portalCategoryGuid}` === selectedObj['industries'] ? "active" : ""}
                            onClick={async () => {
                              const portalCategoryGuid = item.portalCategoryGuid;
                              const currentPage = 1;
                              this.setState({
                                selectedObj: { ...selectedObj, industries: portalCategoryGuid }
                              });
                              // console.log("真真假假");
                              if (tabCurrent === 1) {
                                await industry.setStatus({ portalCategoryGuid, currentPage, postType: tabCurrent, });
                              } else {
                                await industry.setStatus({
                                  portalCategoryGuid,
                                  currentPage,
                                  postType: tabCurrent,
                                  ipTypeSuperiorNumber: ''
                                });
                              }
                            }}>{item.portalCategoryName}</li>
                      );
                    })
                  }
                </ul>
              </div>
              {/* <div className="type-list">
                <span className="type-name">热&nbsp; 门&nbsp; 词:</span>
                <ul className="type-ul">
                  <li className={selectedObj['hotWords'] === "" ? "active" : ""}
                      onClick={async () => {
                        this.setState({
                          selectedObj: { ...selectedObj, hotWords: '' }
                        });
                        await industry.setStatus({ hotWords: '', currentPage: 1 });
                      }}>全部
                  </li>
                  {
                    hotWords && hotWords.map((item, index) => {
                      return (
                        <li key={index}
                            className={`${item.hotWords}` === selectedObj['hotWords'] ? "active" : ""}
                            onClick={async () => {
                              let hotWords = item.hotWords;
                              const currentPage = 1;
                              this.setState({
                                selectedObj: { ...selectedObj, hotWords },
                              });
                              await industry.setStatus({ hotWords, currentPage });
                            }}>{item.hotWords}</li>
                      );
                    })
                  }
                </ul>
              </div>*/}
            </div>
          }

          {/* tab-content*/}
          {
            (tabCurrent === 1 || tabCurrent === 5) &&
            <div className="case-list-container">
              <div className="case-list">
                {
                  industryCaseList && industryCaseList.map((item, index) => {
                    return (
                      <div className="case-introduce" key={index}>
                        <Link className="case-top" to={`/industry-detail/${item.portalPostGuid}`}>
                          <img src={item.picUrl || default_img} alt=""/>
                        </Link>
                        <div className="case-bottom">
                          <div className="case-img"
                               onClick={async () => {
                                 await sendUserBehavior({
                                   pageName: item.postTitle,
                                   pageUrl: `/industry-detail/${item.portalPostGuid}`,
                                   type: 7,
                                   remark: item.portalPostGuid
                                 });
                                 this.props.history.push(`/industry-detail/${item.portalPostGuid}`);
                               }}>
                            <img src={item.ipidPicUrl || default_img_small} alt=""/>
                          </div>
                          <div className="case-word">
                            <div className="title"
                                 onClick={() => this.props.history.push(`/industry-detail/${item.portalPostGuid}`)}>
                              {item.postTitle}</div>
                            <div className="bottom-title">
                                <span
                                  className={`count attention_num icon iconfont iconic_praise ${item.isGiveLike === 1 ? 'active' : ''}`}
                                  onClick={async () => {
                                    await this.setLike(item, index);

                                  }}
                                >
                                   {item.portalPostLikeCount}
                                </span>
                              {
                                item.createDateStr &&
                                <span className="span-two">{item.createDateStr}</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
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
                _isEmpty(industryCaseList) && <NoResult/>
              }
            </div>
          }
          {
            tabCurrent === 2 &&
            <div>
              {
                industryCaseList && industryCaseList.map((item, index) => {
                  return (
                    <div className='type-state' key={index}>
                      <div className='type-left'>
                        <Link to={`/industry-detail/${item.portalPostGuid}`}>
                          <img src={item.picUrl || default_img} alt=''/>
                        </Link>
                      </div>
                      <div className='type-right'
                           onClick={async () => {
                             await sendUserBehavior({
                               pageName: item.postTitle,
                               pageUrl: `/industry-detail/${item.portalPostGuid}`,
                               type: 7,
                               remark: item.portalPostGuid
                             });
                             this.props.history.push(`/industry-detail/${item.portalPostGuid}`);
                           }}>
                        <div className='type-title'>
                          {item.postTitle}
                        </div>
                        <div className='type-detail'>
                          {item.postExcerpt}
                        </div>
                        <ul className='type-other'>
                          <li className='type-word'>
                            {item.postSource}
                          </li>
                          <li className='type-time'>
                            {item.createDateStr}
                          </li>
                          {/* <li className='type-look'>
                            <img src={Look} alt='' style={{ width: '0.16rem', marginTop: '-0.04rem' }}/>
                            <span className='type-num'>{item.postHits}</span>
                          </li>*/}
                          <li
                            className={`count attention_num icon iconfont iconic_praise ${item.isGiveLike === 1 ? 'active' : ''}`}
                            onClick={async (e) => {

                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              await this.setLike(item, index);
                              await industry.setStatus();
                            }}
                          >
                            <span className='type-num'>{item.portalPostLikeCount ? item.portalPostLikeCount : 0}</span>
                          </li>
                          {/*<li className='type-comment'>*/}
                          {/*<span className={`count attention_num icon iconfont iconic_praise`}></span>*/}
                          {/*<span className='type-num'>评论</span>*/}
                          {/*</li>*/}
                        </ul>
                      </div>
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
                _isEmpty(industryCaseList) && <NoResult/>
              }
            </div>
          }
          {
            tabCurrent === 3 &&
            <div className='type-people'>
              {
                industryCaseList && industryCaseList.map((item, index) => {
                  return (
                    <div key={index} className='type-inter'>
                      <Link to={`/industry-detail/${item.portalPostGuid}`}>
                        <div className='people-left'>
                          <img src={item.picUrl || ic_user} alt=''/>
                        </div>
                      </Link>
                      <div className='people-right' onClick={async () => {
                        await sendUserBehavior({
                          pageName: item.postTitle,
                          pageUrl: `/industry-detail/${item.portalPostGuid}`,
                          type: 7,
                          remark: item.portalPostGuid
                        });
                        this.props.history.push(`/industry-detail/${item.portalPostGuid}`);
                      }}>
                        <div className='people-title'>
                          {item.postTitle}
                        </div>
                        <div className='people-detail'>
                          {item.postExcerpt}
                        </div>
                        <ul className='people-other'>
                          {
                            item.postSource &&
                            <li className='people-word'>
                              <span>来源：{item.postSource}</span>
                            </li>
                          }
                          <li className='people-time'>
                            {item.createDateStr}
                          </li>
                          {/* <li className='people-look'>
                            <img src={Look} alt='' style={{ width: '0.16rem', marginTop: '-0.04rem' }}/>
                            <span className='people-num'>{item.postHits}</span>
                          </li>*/}
                          <li
                            className={`count attention_num icon iconfont iconic_praise ${item.isGiveLike === 1 ? 'active' : ''}`}
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              await this.setLike(item, index);
                              await industry.setStatus();
                            }}
                          >
                            <span className='type-num'>{item.portalPostLikeCount ? item.portalPostLikeCount : 0}</span>
                          </li>
                          {/*<li className='people-like'>*/}
                          {/*<span className={`count attention_num icon iconfont iconic_praise`}></span>*/}
                          {/*<span className='people-num'>14</span>*/}
                          {/*</li>*/}
                          {/*<li className='people-comment'>*/}
                          {/*<span className={`count attention_num icon iconfont iconic_praise`}></span>*/}
                          {/*<span className='people-num'>评论</span>*/}
                          {/*</li>*/}
                        </ul>
                      </div>
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
                _isEmpty(industryCaseList) && <NoResult/>
              }
            </div>
          }
          {
            tabCurrent === 4 &&
            <div className="needs-list-container">
              <div className="needs-list">
                {
                  industryCaseList && industryCaseList.map((item, index) => {
                    return (
                      <div className="needs-introduce" key={index}>
                        <Link className="needs-top" to={`/needs-detail/${item.portalPostGuid}`}
                              onClick={async () => {
                                await sendUserBehavior({
                                  pageName: item.postTitle,
                                  pageUrl: `/needs-detail/${item.portalPostGuid}`,
                                  type: 7,
                                  remark: item.portalPostGuid
                                });
                              }}>
                          <img src={item.picUrl || default_img} alt=""/>
                        </Link>
                        <div className="needs-bottom">
                          <p className="needs-name">{item.postTitle}</p>
                          <div className="bottom-title">
                            {item.createDateStr &&
                            <span className="date">{item.createDateStr}</span>
                            }
                          </div>

                        </div>
                      </div>
                    );
                  })
                }
              </div>
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
                _isEmpty(industryCaseList) && <NoResult/>
              }

            </div>
          }
        </div>
        {show && this.state.isLogin === true &&
        <Alert message={message}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.props.history.push('/login');
               }}
        />
        }
        {show && this.state.isLogin === false &&
        <Alert message={message}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 this.setState({ show: false });
               }}
        />
        }
        <ScrollTop/>
      </div>
    );
  }
}
