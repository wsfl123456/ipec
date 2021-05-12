import * as React from "react";
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import default_img_ip from '@assets/images/default/ic_default_shu.png';
import ic_load from '@assets/images/update/timg.gif';
import "assets/scss/ip_search.scss";
import ScrollTop from "@components/scroll-top";
import _isEmpty from 'lodash/isEmpty';
import NoResult from '@components/no_result';
import Alert from '@components/alert';
import { _throttle, sendUserBehavior } from '@utils/util';

interface IIpSearchState {
  currentPage: number,
  tabCurrent: number,
  message: string,
  show: boolean,
  url: any,
  type: any,
}

let ipTypeSuperiorNumber_KV = {
  1: '卡通',
  2: '文创艺术',
  3: '图书',
  4: '网文',
  5: '电视剧',
  6: '电影',
  7: '综艺',
  8: '明星艺人',
  9: '动画',
  10: '漫画',
  334: '生活方式',
  335: '企业品牌',
  336: '体育运动',
  337: '非盈利机构',
  338: '游戏'
};

@inject("ipSearch", "industry", "industry_detail", "login")
@observer
export default class IpSearch extends React.Component <IProps, IIpSearchState> {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      tabCurrent: 1,
      message: '',
      show: false,
      url: '',
      type: 1,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂-搜索";
    const { ipSearch, login } = this.props;
    const { type } = this.state;
    const { keywords } = ipSearch;
    let userGuid;
    if (login.userInfo) {
      userGuid = login.userInfo.userGuid;
    }
    await ipSearch.IpSearch({ type, keyword: keywords, currentPage: 1, pageSize: 20, userGuid });
    window.addEventListener('scroll', this.scrollLoading);
  }

  scrollLoading = () => {
    const { ipSearch, login } = this.props;
    const {
      searchResult: { pageSize },
      ipIsLoading, caseIsLoading, enterIsLoading,
      seeMore, seeMore2, seeMore3,
    } = ipSearch;
    const { keywords: keyword } = ipSearch;
    const { currentPage, tabCurrent, type } = this.state;
    const { userGuid } = login.userInfo || { userGuid: '' };
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if ((yScroll + document.body.clientHeight) >= document.body.scrollHeight) {
      if (tabCurrent === 1 && !ipIsLoading && seeMore) {
        ipSearch.setLoading(true, false, false);
        _throttle(ipSearch.IpSearch({ type, keyword, pageSize, userGuid, currentPage: currentPage + 1 }), 3000);
      } else if (tabCurrent === 2 && !caseIsLoading && seeMore2) {
        ipSearch.setLoading(false, true, false);
        _throttle(ipSearch.IpSearch({ type, keyword, pageSize, userGuid, currentPage: currentPage + 1 }), 3000);
      } else if (tabCurrent === 3 && !enterIsLoading && seeMore3) {
        ipSearch.setLoading(false, false, true);
        _throttle(ipSearch.IpSearch({ type, keyword, pageSize, userGuid, currentPage: currentPage + 1 }), 3000);
      }

      this.setState({ currentPage: currentPage + 1 });
    }
  };

  async setLike(item, index) {
    const { ipSearch, login } = this.props;
    const { keywords: keyword, searchResult: {caseData} } = ipSearch;
    const { userGuid } = login.userInfo;
    if (userGuid) {
      let param = {
        portalPostGuid: item.portalPostGuid, userGuid,
      };
      let isSuccess = await this.props.industry_detail.setLike(param);
      if (caseData[index].isGiveLike !== 1) {
        caseData[index].isGiveLike = 1;
        caseData[index].portalPostLikeCount++;
      }
      if (!(isSuccess.request)) {
        this.setState({ message: isSuccess.result, show: true });
      }
      // await ipSearch.IpSearch({ type: 2, keyword, currentPage: 1, pageSize: 20, userGuid });
    } else {
      this.setState({ message: "您还未登陆", show: true });
    }
  }

  async getSearchType(type) {
    const { ipSearch, login } = this.props;
    let userGuid;
    if (login.userInfo) {
      userGuid = login.userInfo.userGuid;
    }
    const { keywords: keyword } = ipSearch;
    if (userGuid) {
      await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20, userGuid });
    } else {
      await ipSearch.IpSearch({ type, keyword, currentPage: 1, pageSize: 20 });
    }
    window.localStorage.setItem('type', type);
  }

  // 埋点函数
  async getUserBehavior(pageName, pageUrl, remark) {
    const params = {
      pageName,
      pageUrl,
      type: 3,
      remark,
    };
    await sendUserBehavior(params);
  }

  render() {
    const { ipSearch } = this.props;
    const {
      searchResult: { ipData, caseData, enterData, totalCount, ipCount, caseCount, enterCount },
      ipIsLoading, seeMore, noMore,
      caseIsLoading, seeMore2, noMore2,
      enterIsLoading, seeMore3, noMore3,
      keywords
    } = ipSearch;
    const { tabCurrent, show, message } = this.state;

    // console.log("noMore2:" + noMore, "seeMore2:" + seeMore, "caseIsLoading:" + caseIsLoading);
    return (
      <div>
        <div className="search-container">
          <p className="total-count">共搜索到 <i>{totalCount}</i> 条相关信息</p>
          <div className="search-content justify-content-between">
            <div className="tab-change">
              <ul>
                <li className={this.state.tabCurrent === 1 ? "active" : ""}
                    onClick={async () => {
                      this.setState({ currentPage: 1, type: 1, tabCurrent: 1 });
                      await this.getSearchType(1);
                      await this.getUserBehavior(`${keywords}`, '/ip-search', 'ip');
                    }}
                >IP({ipCount})
                </li>
                <li className={this.state.tabCurrent === 2 ? "active" : ""}
                    onClick={async () => {
                      this.setState({ currentPage: 1, type: 2, tabCurrent: 2 });
                      await this.getSearchType(2);
                      await this.getUserBehavior(`${keywords}`, '/ip-search', '案例');
                    }}
                >案例({caseCount})
                </li>
                <li className={this.state.tabCurrent === 3 ? "active" : ""}
                    onClick={async () => {
                      this.setState({ currentPage: 1, type: 3, tabCurrent: 3 });
                      await this.getSearchType(3);
                      await this.getUserBehavior(`${keywords}`, '/ip-search', '企业');
                    }}
                >企业({enterCount})
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div className="tabOne" style={{ display: tabCurrent === 1 ? "inline-block" : "none" }}>
                <div className="content-container flex-column justify-content-center ">
                  <div className="ip-t flex-row  flex-wrap   align-items-center">
                    {
                      ipData && ipData.map((item, index) => {
                        return (
                          <div className="ip-type-list-parent" key={index}>
                            <Link to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`}>
                              <div className="ip-type-list">
                                <div className="ip-type-item">
                                  <img src={item.ipPic || default_img_ip} alt="" className="ip-type-img"/>
                                  <div
                                    className="ipTypeSuperiorNumber">{ipTypeSuperiorNumber_KV[Number(item.ipTypeSuperiorNumber)]}</div>
                                </div>
                                <div className="ip-type-item-text justify-content-around">
                                  <div className="item-name word-ellipsis" title={item.ipName}>{item.ipName}</div>
                                  <div className="item-dou text-right ">
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    }
                  </div>
                  {
                    seeMore && !ipIsLoading && !noMore &&
                    <p className="see-more">
                      下拉查看更多
                    </p>
                  }
                  {
                    noMore && !ipIsLoading &&
                    < p className="is-no-result"><span>没有更多内容</span></p>
                  }
                  {
                    ipIsLoading &&
                    <div className="loading-more"><img src={ic_load} alt=""/></div>
                  }
                  {
                    !ipIsLoading && _isEmpty(ipData) && <NoResult/>
                  }
                </div>
              </div>
              <div className="tab-two" style={{ display: tabCurrent === 2 ? "inline-block" : "none" }}>
                <div className="content-container flex-column justify-content-center ">
                  <div className="ip-t flex-row  flex-wrap   align-items-center">
                    {
                      caseData && caseData.map((item, index) => {
                        return (
                          <div className="case-introduce" key={index}>
                            <Link className="case-top" to={`/industry-detail/${item.portalPostGuid}`}>
                              <img src={item.picUrl || default_img_ip} alt=""/>
                            </Link>
                            <div className="case-bottom">
                              <div className="case-img">
                                <img src={item.ipidPicUrl || default_img_ip} alt=""/>
                              </div>
                              <div className="case-word">
                                <div className="title">{item.postTitle}</div>
                                <div className="bottom-title">
                                <span className={`count attention_num icon iconfont
                                  iconic_praise ${item.isGiveLike === 1 ? 'active' : ''}`}
                                      onClick={async () => {
                                        await this.setLike(item, index);
                                      }}>{item.portalPostLikeCount}</span>
                                  {item.createDateStr && <span className="span-two">{item.createDateStr}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>

                  {
                    seeMore2 && !caseIsLoading &&
                    // !noMore2 &&
                    <p className="see-more">
                      下拉查看更多
                    </p>
                  }
                  {
                    noMore2 && !caseIsLoading &&
                    < p className="is-no-result"><span>没有更多内容</span></p>
                  }
                  {
                    caseIsLoading &&
                    <div className="loading-more"><img src={ic_load} alt=""/></div>
                  }
                  {
                    _isEmpty(caseData) && Number(caseCount) === 0 && <NoResult/>
                  }
                </div>
              </div>
              <div className='tab-three' style={{ display: tabCurrent === 3 ? 'inline-block' : 'none' }}>
                <div className="content-container flex-column justify-content-center ">
                  <div className="ip-t flex-row  flex-wrap   align-items-center">
                    {
                      enterData && enterData.map((item, index) => {
                        return (
                          <div key={index} className='company-type'
                               onClick={() => {
                                 this.props.history.push(`/business-homepage/${item.companyGuid}`);
                               }}>
                            <img src={item.companyLogo || default_img_ip} alt='' className="cooperate-img"/>
                            <div className='company-title'>{item.companyName}</div>
                          </div>
                        );
                      })
                    }

                  </div>
                  {
                    seeMore3 && !enterIsLoading && !noMore3 &&
                    <p className="see-more">
                      下拉查看更多
                    </p>
                  }
                  {
                    noMore3 && !enterIsLoading &&
                    < p className="is-no-result"><span>没有更多内容</span></p>
                  }
                  {
                    enterIsLoading &&
                    <div className="loading-more"><img src={ic_load} alt=""/></div>
                  }
                  {
                    _isEmpty(enterData) && Number(enterCount) === 0 && <NoResult/>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollTop/>
        {show &&
        <Alert message={message}
               onClose={() => {
                 this.setState({ show: false });
               }}
               onSubmit={() => {
                 if (message === '您还未登陆') {
                   this.props.history.push('/login');
                   this.props.ipSearch.keywords = '';
                 } else {
                   this.setState({ show: false });
                 }
               }}/>}
      </div>
    );
  }
}
