import * as React from "react";
import icon_banner from "@assets/images/ranking/banner.jpg";
import ScrollTop from "@components/scroll-top";
import "@assets/scss/ranking.scss";
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

@inject("ranking_list")
@observer
export default class Ranking extends React.Component<any> {
  async componentDidMount() {
    const { ranking_list } = this.props;
    const { timeList } = ranking_list;
    document.title = "IP二厂-指数";
    ranking_list.setTab("抖音");
    await ranking_list.dateList(1);
    window.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
  }

  scroll = () => {
    const { ranking_list } = this.props;
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
      let currentPage = ranking_list.rankParams.currentPage + 1;
      if (!ranking_list.isLoading && ranking_list.rankingData.length >= ranking_list.rankParams.pageSize) {
        ranking_list.isLoading = true;
        _throttle(ranking_list.changeRankParams({ currentPage }), 3000);
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
    const { ranking_list } = this.props;
    const { tabActive, rankingData, timeList, seeMore, noMore } = ranking_list;
    console.log(thousandSeparator('1234560.4w'));
    return (
      <div className="ranking">
        <div className="g-banner">
          <img src={icon_banner} alt=""/>
        </div>
        <div className="g-container">
          <div className="m-top">
            <div className="m-center justify-content-between ">
              <div className="m-left ">
                {
                  diyShow.rankingTab && diyShow.rankingTab.map((item, index) => {
                    return (
                      <div className="u-tab" key={index}>
                        <span className={tabActive === `${item.tab}` ? 'active' : ''}
                              onClick={async () => {
                                ranking_list.setTab(item.tab);
                                await ranking_list.dateList(item.id);
                                // await ranking_list.changeRankParams({
                                //   platformType: item.id,
                                //   dataRiqi: time,
                                //   currentPage: 1
                                // });
                              }}
                        >{item.tab}</span>
                        {item.title && <img src={icon_doubt} alt=""/>}
                        <p className={`${item.class} hover-box`}>{item.title}</p>
                      </div>
                    );
                  })
                }
              </div>
              <div className="m-right">
                <Select style={{ width: 220 }}
                        placeholder="请选择日期"
                        key={timeList}
                        defaultValue={timeList[0]}
                        onChange={async (value: any) => {
                          let time = value.substring(value.length - 10);
                          let v = moment(time).format("YYYY-MM-DD");
                          await ranking_list.changeRankParams({ dataRiqi: v, currentPage: 1 });
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
                {/*  <DatePicker format={"YYYY-MM-DD"} defaultValue={moment(yesterday, 'YYYY-MM-DD')}
                            placeholder="请选择日期"
                            onChange={async (value: any) => {
                              let v = moment(value).format("YYYY-MM-DD");
                              await ranking_list.changeRankParams({ dataRiqi: v });
                            }}
                />*/}
              </div>
            </div>
          </div>
          <div className="m-rank-table">
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
                        <td>{this.rankingStyle(item.rank)}</td>
                        <td><img src={item.ipPicUrl || default_user} alt=""/>{item.ipName}</td>
                        <td className="text-right">{thousandSeparator(item.dataFans)}</td>
                        <td className="text-right">{thousandSeparator(item.dataFollow)}</td>
                        <td className="text-right">{thousandSeparator(item.dataPraised)}</td>
                        <td className="text-right">{thousandSeparator(item.dataWorks)}</td>
                        <td className="text-right">{thousandSeparator(item.dataDegreeHeat)}</td>
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
                        <td>{this.rankingStyle(i.rank)}</td>
                        <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                        <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                        <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                        <td className="text-right">{thousandSeparator(i.dataWorks)}</td>
                        <td className="text-right">{thousandSeparator(i.dataDegreeHeat)}</td>
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
                        <td>{this.rankingStyle(i.rank)}</td>
                        <td><img src={i.ipPicUrl || default_user} alt=""/>{i.ipName}</td>
                        <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                        <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                        <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                        <td className="text-right">{thousandSeparator(i.dataNote)}</td>
                        <td className="text-right">{thousandSeparator(i.dataDegreeHeat)}</td>
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
                        <td>{this.rankingStyle(i.rank)}</td>
                        <td><img src={i.ipPicUrl || default_user } alt=""/>{i.ipName}</td>
                        <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                        <td className="text-right">{thousandSeparator(i.dataFollow)}</td>
                        <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                        <td className="text-right">{thousandSeparator(i.dataPlay)}</td>
                        <td className="text-right">{thousandSeparator(i.dataRead)}</td>
                        <td className="text-right">{thousandSeparator(i.dataDegreeHeat)}</td>
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
                        <td>{this.rankingStyle(i.rank)}</td>
                        <td><img src={i.ipPicUrl || default_user } alt=""/>{i.ipName}</td>
                        <td className="text-right">{thousandSeparator(i.dataFans)}</td>
                        <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                        <td className="text-right">{thousandSeparator(i.dataWorks)}</td>
                        <td className="text-right">{thousandSeparator(i.dataDegreeHeat)}</td>
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
                  {/*<td>观看人数</td>*/}
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
                        <td>{this.rankingStyle(i.rank)}</td>
                        <td><img src={i.ipPicUrl || default_user } alt=""/>{i.ipName}</td>
                        <td className="text-right">{thousandSeparator(i.dataFansChange)}</td>
                        <td className="text-right">{thousandSeparator(i.dataViewingTimes)}</td>
                        {/*<td className="text-right">{thousandSeparator(i.dataVisitorsNumber)}</td>*/}
                        <td className="text-right">{thousandSeparator(i.dataPraised)}</td>
                        <td className="text-right">{thousandSeparator(i.dataDegreeHeat)}</td>
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
          <ScrollTop/>
        </div>
      </div>
    );
  }
}
