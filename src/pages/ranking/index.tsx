import * as React from "react";
import ScrollTop from "@components/scroll-top";
import "@assets/scss/ranking_new.scss";
import icon_doubt from "assets/images/ip_detail/how.png";
import { DatePicker, Select } from "antd";
import { inject, observer } from 'mobx-react';
import diyShow from "@utils/util";
import { _throttle } from '@utils/util';
import moment from 'moment';
import icon_no1 from "@assets/images/ranking/No1.png";
import icon_no2 from "@assets/images/ranking/No2.png";
import icon_no3 from "@assets/images/ranking/No3.png";
import default_user from "@assets/images/user.svg";
import NoResult from "@components/no_result";
import _isEmpty from "lodash/isEmpty";
import { thousandSeparator } from "@utils/util";

let { Option } = Select;

interface IRankingState {
  tab: number;
}

@inject("ranking", "home")
@observer
export default class Ranking extends React.Component<any, IRankingState> {

  constructor(props: any) {
    super(props);
    this.state = {
      tab: 1,
    };
  }

  async componentDidMount() {
    const { ranking, home } = this.props;
    const { timeList } = ranking;
    document.title = "IP二厂-榜单";
    ranking.setTabTitle(1);
    ranking.setTab("抖音");
    ranking.setTabTypeActive('');
    await ranking.mediaType();
    await ranking.dateList(0);
    await ranking.getTypeRanking();

    window.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
  }

  scroll = () => {
    const { ranking } = this.props;
    const { tabTitle } = ranking;
    let yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    // console.log(yScroll + document.body.clientHeight, "scroll:" + document.body.scrollHeight);
    if ((yScroll + document.body.clientHeight + 300) >= document.body.scrollHeight) {
      let currentPage = ranking.rankParams.currentPage + 1;
      if (tabTitle === 2) {
        if (!ranking.isLoading && ranking.rankingData.length >= ranking.rankParams.pageSize) {
          ranking.isLoading = true;
          _throttle(ranking.changeRankParams({ currentPage }), 3000);
        }
      }

    }
  };

  //  榜三样式 icon
  public rankingStyle(index) {
    if (index === 1) {
      return <img src={icon_no1} alt=""/>;
    } else if (index === 2) {
      return <img src={icon_no2} alt=""/>;
    } else if (index === 3) {
      return <img src={icon_no3} alt=""/>;
    } else {
      return index;
    }
  }

  render() {
    const { ranking } = this.props;
    const {
      tabTitle, tabTypeActive, tabActive,
      tenType, typeRankingData,
      rankingData, timeList, seeMore, noMore
    } = ranking;
    console.log(rankingData);
    return (
      <div className="ranking">
        <div className="g-tab">
          <div className="tab-div">
            <span className={tabTitle === 1 ? 'active' : ''}
                  onClick={async () => {
                    ranking.setTabTitle(1);
                    await ranking.dateList(0);
                  }}
            >战力榜</span>
            <span className={tabTitle === 2 ? 'active' : ''}
                  onClick={async () => {
                    ranking.setTabTitle(2);
                    await ranking.dateList(1);
                  }}
            >顶流榜</span>
          </div>
        </div>
        {
          tabTitle === 1 &&
          <div className="g-container">
            <div className="m-top">
              <div className="m-center justify-content-between ">
                <div className="m-left ">
                  <span>分类:</span>
                  {
                    tenType && tenType.map((item, index) => {
                      let { typeName, mainTypeGuid } = item;
                      return (
                        <span key={index} className={tabTypeActive === typeName ? 'active' : ''}
                              onClick={async () => {
                                ranking.tabTypeActive = typeName;
                                await ranking.changeTypeRank({ mainTypeGuid });
                              }}
                        >{typeName}</span>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            <div className="m-rank-table">
              <div className="condition">
                <div className="c-title">
                  <span>{tabTypeActive}排行榜</span>
                  <img src={icon_doubt} alt=""/>
                  <p className="hover-box">
                    综合反应全品类IP的战力值排名，IP火热度一榜打尽。基于独家大数据算法，对IP的搜索关键数据、媒体指数、跨平台热度等数据进行多维计算得出。
                  </p>
                </div>
                <div className="c-time">
                  {/*<div className="tab-rank">
                    <span className='active'>日榜</span>
                    <span>周榜</span>
                    <span>月榜</span>
                  </div>*/}
                  <Select style={{ width: 220, height: 40 }}
                          placeholder="请选择日期"
                          key={timeList}
                          defaultValue={timeList[0]}
                          onChange={async (value: any) => {
                            let time = value.substring(value.length - 10);
                            let v = moment(time).format("YYYY-MM-DD");
                            await ranking.changeTypeRank({ dataRiqi: v });
                          }}
                  >
                    {
                      timeList && timeList.map((item, index) => {
                        return (
                          <Option key={index} value={item}>{item}</Option>
                        );
                      })
                    }
                  </Select>
                </div>
              </div>
              {!_isEmpty(typeRankingData) ?
                <table className="table table-bordered type-table">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>IP名称</td>
                    <td>版权归属</td>
                    <td>媒体指数</td>
                    <td>平台热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    typeRankingData && typeRankingData.map((item, index) => {
                      return (
                        <tr className="u-body" key={index}
                            onClick={() => this.props.history.push(`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(item.rankNo)}</div>
                          </td>
                          <td><img className="img-square" src={item.picUrl || default_user} alt=""/>{item.ipName}</td>
                          <td>{item.companyName}</td>
                          <td className="text-right">{item.mediaAnalysis}</td>
                          <td className="text-right">
                            <div>{item.arithmaticHotspotPrice}</div>
                          </td>
                        </tr>
                      );
                    })
                  }

                  </tbody>
                </table>
                :
                <NoResult/>
              }
            </div>
          </div>
        }
        {
          tabTitle === 2 &&
          <div className="g-container">
            <div className="m-top">
              <div className="m-center justify-content-between ">
                <div className="m-left ">
                  <span>平台：</span>
                  {
                    diyShow.rankingTab && diyShow.rankingTab.map((item, index) => {
                      return (
                        <span key={index} className={tabActive === `${item.tab}` ? 'active' : ''}
                              onClick={async () => {
                                ranking.setTab(item.tab);
                                await ranking.dateList(item.id);
                              }}
                        >{item.tab}</span>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            <div className="m-rank-table">
              <div className="condition">
                <div className="c-title">
                  <span>{tabActive}排行榜</span>
                  {
                    diyShow.rankingTab.find(e => e.tab === tabActive).title &&
                    <img src={icon_doubt} alt=""/>
                  }
                  {
                    diyShow.rankingTab.find(e => e.tab === tabActive).title &&
                    <p className="hover-box">
                      {diyShow.rankingTab.find(e => e.tab === tabActive).title}
                    </p>
                  }
                </div>
                <div className="c-time">
                  <Select style={{ width: 220, height: 40 }}
                          placeholder="请选择日期"
                          key={timeList}
                          defaultValue={timeList[0]}
                          onChange={async (value: any) => {
                            let time = value.substring(value.length - 10);
                            let v = moment(time).format("YYYY-MM-DD");
                            await ranking.changeRankParams({ dataRiqi: v, currentPage: 1 });
                          }}
                  >
                    {
                      timeList && timeList.map((item, index) => {
                        return (
                          <Option key={index} value={item}>{item}</Option>
                        );
                      })
                    }
                  </Select>
                </div>
              </div>

              {
                tabActive === "抖音" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝数</td>
                    <td>关注数</td>
                    <td>获赞数</td>
                    <td>作品数</td>
                    <td>平台热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((item, index) => {
                      return (
                        <tr className="u-body" key={index}
                            onClick={() => this.props.history.push(`/detail/8/${item.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(item.rank)}</div>
                          </td>
                          <td><img src={item.ipPicUrl || default_user} alt=""/>{item.ipName}</td>
                          <td className="text-right">{thousandSeparator(item.dataFans)}</td>
                          <td className="text-right">{thousandSeparator(item.dataFollow)}</td>
                          <td className="text-right">{thousandSeparator(item.dataPraised)}</td>
                          <td className="text-right">{thousandSeparator(item.dataWorks)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(item.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                tabActive === "火山" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝数</td>
                    <td>关注数</td>
                    <td>作品数</td>
                    <td>平台热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((i, k) => {
                      return (
                        <tr className="u-body" key={k}
                            onClick={() => this.props.history.push(`/detail/8/${i.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(i.rank)}</div>
                          </td>
                          <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                          <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                          <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                          <td className="text-right">{thousandSeparator(i.dataWorks)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(i.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                tabActive === "小红书" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝数</td>
                    <td>关注数</td>
                    <td>获赞收藏数</td>
                    <td>笔记数</td>
                    <td>平台热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((i, k) => {
                      return (
                        <tr className="u-body" key={k}
                            onClick={() => this.props.history.push(`/detail/8/${i.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(i.rank)}</div>
                          </td>
                          <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                          <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                          <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                          <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                          <td className="text-right">{thousandSeparator(i.dataNote)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(i.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                tabActive === "B站" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝数</td>
                    <td>关注数</td>
                    <td>获赞数</td>
                    <td>播放量</td>
                    <td>阅读数</td>
                    <td>平台热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((i, k) => {
                      return (
                        <tr className="u-body" key={k}
                            onClick={() => this.props.history.push(`/detail/8/${i.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(i.rank)}</div>
                          </td>
                          <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                          <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                          <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                          <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                          <td className="text-right">{thousandSeparator(i.dataPlay)}</td>
                          <td className="text-right">{thousandSeparator(i.dataRead)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(i.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                tabActive === "快手" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝数</td>
                    <td>获赞数</td>
                    <td>作品数</td>
                    <td>粉丝增量</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((i, k) => {
                      return (
                        <tr className="u-body" key={k}
                            onClick={() => this.props.history.push(`/detail/8/${i.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(i.rank)}</div>
                          </td>
                          <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                          <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                          <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                          <td className="text-right">{thousandSeparator(i.dataWorks)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(i.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                tabActive === "淘宝直播" && !_isEmpty(rankingData) &&
                <table className="table table-bordered">
                  <thead>
                  <tr className="u-head">
                    <td>排行榜</td>
                    <td>平台IP名称</td>
                    <td>粉丝变化数</td>
                    <td>观看次数</td>
                    <td>获赞数</td>
                    <td>DRI热度</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    rankingData && rankingData.map((i, k) => {
                      return (
                        <tr className="u-body" key={k}
                            onClick={() => this.props.history.push(`/detail/8/${i.ipid}`)}
                        >
                          <td>
                            <div>{this.rankingStyle(i.rank)}</div>
                          </td>
                          <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                          <td className="text-right">{thousandSeparator(i.dataFansChange)}</td>
                          <td className="text-right">{thousandSeparator(i.dataViewingTimes)}</td>
                          <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                          <td className="text-right">
                            <div>{thousandSeparator(i.dataDegreeHeat)}</div>
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              }
              {
                seeMore &&
                <p className="ofTheBottom">下拉查看更多</p>
              }
              {
                noMore &&
                <p className="ofTheBottom">没有更多内容</p>
              }
              {
                _isEmpty(rankingData) &&
                <NoResult/>
              }
            </div>
          </div>
        }
        <ScrollTop/>
      </div>
    );
  }
}
