import * as React from 'react';
import { inject, observer } from 'mobx-react';
import ic_sjzl from '@assets/images/ip_detail/ic_sjzl.svg';
import _isEmpty from 'lodash/isEmpty';
import { thousandSeparator } from '@utils/util';
import ic_yxpf from '@assets/images/ip_detail/ic_yxpf.svg';
import ic_ptqs from '@assets/images/ip_detail/ic_ptqs.svg';
import ic_search from '@assets/images/ip_detail/ic_search.svg';
import ic_kbxx from '@assets/images/ip_detail/ic_kbxx.svg';

import ic_media from '@assets/images/ip_detail/ic_media.svg';
import ic_follower from '@assets/images/ip_detail/ic_follower.svg';
import douban from '@assets/images/ip_detail/douban.png';
import iqiyi from '@assets/images/ip_detail/iqiyi_logo.png';
import leshi from '@assets/images/ip_detail/LeTV_logo.png';
import mangguo from '@assets/images/ip_detail/mangguo.png';
import tengxun from '@assets/images/ip_detail/tengxun.png';
import youku from '@assets/images/ip_detail/youku.png';
import souhu from '@assets/images/ip_detail/souhu.png';
import maoyan from '@assets/images/ip_detail/maoyan.png';

import ic_sjptzl from '@assets/images/ip_detail/ic_sjptzl.png';
import ic_jqzps from '@assets/images/ip_detail/ic_jqzps.png';
import ic_xsze from '@assets/images/ip_detail/ic_xsze.png';
import ic_pfsjzl from '@assets/images/ip_detail/ic_pfsjzl.png';
import weChatArrKV from './basic-arr';
import {
  EchartDataZoomBoxOffice, EchartDataZoom, EchartDataZoomTwo, NoResult,
  EchartBar, EchartLine,

} from './index';
import { Select } from 'antd';
import xsze from '@assets/images/ip_detail/icon_xsze.png';
import cjdj from '@assets/images/ip_detail/icon_cjdj.png';
import spjj from '@assets/images/ip_detail/icon_spjj.png';
import dsqd from '@assets/images/ip_detail/icon_dsqd.png';
import moment from 'moment';
import fss from '@assets/images/ip_detail/icon_fss.png';
import gzs from '@assets/images/ip_detail/icon_gzs.png';
import wbs from '@assets/images/ip_detail/icon_wbs.png';
import httls from '@assets/images/ip_detail/icon_httls.png';
import htyds from '@assets/images/ip_detail/icon_htyds.png';
import chtzs from '@assets/images/ip_detail/icon_chtzs.png';
import chyds from '@assets/images/ip_detail/icon_chyds.png';
import hzs from '@assets/images/ip_detail/icon_hzs.png';
import zps from '@assets/images/ip_detail/icon_zps.png';
import bfzl from '@assets/images/ip_detail/icon_bfzl.png';
import bjs from '@assets/images/ip_detail/icon_bjs.png';
import { toJS } from 'mobx';
import NoEchart from '@pages/detail/components/no-echart';

interface IBasicTabProps extends IComponentProps {
  ipTypeNumber: string | number,
  isShow2: any,
  id: string | number,
}

const { Option } = Select;

const icon_k_v = {
  up: "ic_rise iconic_rise up",
  blance: "ic_ unbiased iconic_unbiased blance",
  down: "ic_decline iconic_decline down",
};

const selectFans = [
  { name: "总量", type: 1 },
  { name: "分量", type: 2 },
];
const selectOnline = [
  { name: "总量", type: 1 },
  { name: "分量", type: 2 },
];
let weChatArr = [];
@inject('detail', 'login')
@observer
export default class BasicTab extends React.Component<IBasicTabProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      derivativeTabs: [
        { id: 0, name: '全部平台' },
        { id: 1, name: '淘宝' },
        { id: 2, name: '天猫' },
        { id: 3, name: '京东' },
      ],
      derivativeCurrent: 0,

      weChatTabs: [
        { id: 1, name: '微博' },
        { id: 2, name: 'B站' },
        { id: 3, name: '抖音' },
        { id: 4, name: '小红书' },
        { id: 5, name: '快手' },
      ],
      dataViewCurrent: 1,
      dataViewName: '微博',

      fansType: 1,
      onlineType: 1,
      currentPage: 1,
    };
  }

  // 数据总览-切换平台类型
  async _changeTotalPlatform(li) {
    const { detail, id: ipid } = this.props;
    await detail.getStarPlatformData({ platform_type: li.platformType, ipid });
  }

  _totalDataClass(item) {
    if (item === 1) {
      return <i className={`iconfont ${icon_k_v.up}`}/>;
    } else if (item === 2) {
      return <i className={`iconfont `}/>;
    } else if (item === 3) {
      return <i className={`iconfont  ${icon_k_v.down}`}/>;
    } else {
      return;
    }
  }

  _totalDataTag(ipTypeNumber) {
    if (ipTypeNumber === 6) {
      return '票房';
    } else if (ipTypeNumber === 5 || ipTypeNumber === 7) {
      return '播放';
    } else {
      return '';
    }
  }

  _totalData(item: any) {
    if (item === 5 || item === 7) {
      return (
        <tr>
          <td>上线天数</td>
          <td>累计播放量</td>
          <td>累计热度值</td>
        </tr>
      );
    } else if (item === 6) {
      return (
        <tr>
          <td>上映天数</td>
          <td>票房累计</td>
          <td>首映日票房</td>
          <td>首周票房</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>全网热度值</td>
          <td>媒体指数</td>
          <td>全网搜索量</td>
        </tr>
      );
    }
  }

  _totalContentData(data, item: any) {
    if (item === 5 || item === 7) {
      return (
        <tr>
          <td>{data.daysOnline}</td>
          <td>{data.accumulatedPlayVolume}</td>
          <td>{data.cumulativeHeatValue}</td>
        </tr>
      );
    } else if (item === 6) {
      return (
        <tr>
          <td>{data.releaseDays}</td>
          <td>{data.totalBoxOffice}</td>
          <td>{data.firstDayBoxOffice}</td>
          <td>{data.firstWeekBoxOffice}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{data.arithmatic_hotspot_price}</td>
          <td>{data.media_analysis}</td>
          <td>{data.total_web_searches}</td>
        </tr>
      );
    }
  }

  _noResultFun = (data) => {
    if (_isEmpty(data)) {
      return <NoResult/>;
    }
  };

  private icon(name: string): string {
    let iconObj = {
      豆瓣评分: douban,
      爱奇艺评分: iqiyi,
      乐视评分: leshi,
      芒果评分: mangguo,
      腾讯评分: tengxun,
      优酷评分: youku,
      搜狐评分: souhu,
      猫眼评分: maoyan,
    };
    return iconObj[name];
  }

  // 社交平台数据总览
  private dataViewIcon(name: string) {
    const obj = {
      '微博粉丝数': fss,
      '抖音粉丝数': fss,
      'B站粉丝数': fss,
      '小红书粉丝数': fss,
      '快手粉丝数': fss,
      '关注数': gzs,
      '发微博数': wbs,
      '话题讨论数': httls,
      '话题阅读数': htyds,
      '超话帖子数': chtzs,
      '超话阅读数': chyds,
      '获赞数': hzs,
      '作品数': zps,
      '播放总量': bfzl,
      '笔记数': bjs,
    };
    return obj[name];
  }

  private dataViewArr(dataViewCurrent: number) {
    let dataViewObj = {
      9: weChatArrKV.webo,
      2: weChatArrKV.bili,
      3: weChatArrKV.douyin,
      4: weChatArrKV.xhs,
      5: weChatArrKV.ks,
    };
    return dataViewObj[dataViewCurrent];
  }

  render() {
    const { fansType, onlineType, currentPage } = this.state;
    const { detail, ipTypeNumber, isShow2, login, id: ipid } = this.props;
    const {
      onlinePlatformTabs, derivativesSalesTabs, socialPlatformTabs, fansTrendTabs, recentWorksTabs, searchBasicTabs, mediaFocusTabs,
      onlinePlatformCurrent, derivativesSalesCurrent, socialPlatformCurrent, fansTrendCurrent, recentWorksCurrent, searchBasicCurrent, mediaFocusCurrent,
      recentWorksCurrentName, searchBasicCurrentName, mediaFocusCurrentName,
      onlinePlatformData, derivativesSalesData, socialPlatformData, fansTrendData, recentWorksData, searchBasicData, mediaFocusData,
      dataViewData, publicPraiseData, boxOfficeData, boxOfficeSelect, boxOfficeNumber,
    } = detail;
    const { userGuid } = login.userInfo || { userGuid: "" };
    const filmTVNumber = ipTypeNumber === 6 || ipTypeNumber === 5 || ipTypeNumber === 7;
    // console.log('data1', toJS(dataViewData));
    return (
      <div className="tab-content" style={{ display: isShow2 }}>
        {
          !_isEmpty(dataViewData) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ipTypeNumber === 6 ? ic_pfsjzl : ic_sjzl} alt=""/>
              {this._totalDataTag(ipTypeNumber)}数据总览
            </p>
            <div className="area-content basic-content">
              <table className="table  text-center">
                <tbody>
                {this._totalData(ipTypeNumber)}
                {this._totalContentData(dataViewData, ipTypeNumber)}
                </tbody>
              </table>
            </div>
          </div>
        }

        {ipTypeNumber === 6 && !_isEmpty(boxOfficeData) &&
        <div className="module-box">
          <p className="area-title">
            <img src={ic_yxpf} alt=""/>
            院线票房趋势
          </p>
          <div className="area-content hot-content" style={{ padding: "0.3rem 0.2rem" }}>
            <div className="box-office-condition">
              <p>第 {currentPage}周累计票房: <span className="number">{boxOfficeNumber}</span>(万)</p>
              {
                !_isEmpty(boxOfficeSelect) &&
                <Select className="condition-right" defaultValue={boxOfficeSelect[0]} style={{ width: 280 }}
                        onChange={async (value, option) => {
                          this.setState({
                            currentPage: value,
                          });
                          await detail.getBasicData({
                            userGuid,
                            ipTypeSuperiorNumber: ipTypeNumber,
                            ipid,
                            moduleNumber: 10,
                            platformNumber: '',
                            currentPage: value
                          });
                        }}
                >
                  {
                    boxOfficeSelect && boxOfficeSelect.map((item, index) => {
                      return <Option value={index + 1} key={index}>{item}</Option>;
                    })
                  }
                </Select>
              }
            </div>
            {!_isEmpty(boxOfficeData) &&
            <EchartLine
              container="echart-line"
              data={boxOfficeData}
              subtext="院线票房趋势(万)"
            />
            }
            {this._noResultFun(boxOfficeData)}
          </div>
        </div>
        }
        {filmTVNumber &&
        !_isEmpty(onlinePlatformTabs) &&
        <div className="module-box">
          <p className="area-title">
            <img src={ic_ptqs} alt=""/>
            在线平台趋势
          </p>
          <div className="area-content hot-content">
            <ul>
              {onlinePlatformTabs && onlinePlatformTabs.map((item, k) => {
                return (
                  <li className={onlinePlatformCurrent === item.platformNumber ? "active" : ""} key={k}
                      onClick={async () => {
                        detail.onlinePlatformCurrent = item.platformNumber;
                        await detail.getBasicData({
                          userGuid,
                          ipTypeSuperiorNumber: ipTypeNumber,
                          ipid,
                          moduleNumber: 1,
                          platformNumber: item.platformNumber,
                          type: onlineType,
                        });
                      }}
                  >
                    {item.name}
                  </li>
                );
              })}
              <li className="li-select">
                <Select defaultValue="总量" style={{ width: 100 }}
                        onChange={async (value) => {
                          this.setState({
                            onlineType: value
                          });
                          await detail.getBasicData({
                            userGuid,
                            ipTypeSuperiorNumber: ipTypeNumber,
                            ipid,
                            moduleNumber: 1,
                            platformNumber: onlinePlatformCurrent,
                            type: value,
                          });
                        }}>
                  {
                    selectOnline && selectOnline.map((item, index) => {
                      return <Option value={item.type} label={item.name} key={index}>{item.name}</Option>;
                    })
                  }
                </Select>
              </li>
            </ul>
            <div>
              {_isEmpty(onlinePlatformData) && <NoEchart subtext={"播放量(万)"} container="echart-line"/>}
              {!_isEmpty(userGuid) && !_isEmpty(onlinePlatformData) && (
                <EchartLine
                  container="echart-line"
                  data={onlinePlatformData}
                  subtext="播放量(万)"
                />
              )}
            </div>
          </div>
        </div>
        }
        {filmTVNumber && !_isEmpty(publicPraiseData) &&
        <div className="module-box">
          <p className="area-title">
            <img src={ic_kbxx} alt=""/>
            口碑信息
          </p>
          <div className="area-content movie-content hot-content">
            {_isEmpty(publicPraiseData) && <NoResult/>}
            {!_isEmpty(publicPraiseData) &&
            publicPraiseData.map((item, index) => {
              let icon = this.icon(item.data_type);
              return (
                <div
                  className="cups flex justify-content-between"
                  key={index}
                >
                  <img src={icon} alt=""/>
                  <div className=" score flex justify-content-between flex-column">
                    <span>{item.data_type}</span>
                    <span>{item.data_number}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        }
        {
          !_isEmpty(derivativesSalesTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_xsze} alt=""/>
              衍生品销售数据
            </p>
            <div className="area-content hot-content">
              <ul className="margin-bottom30">
                {
                  derivativesSalesTabs && derivativesSalesTabs.map((item, index) => {
                    return <li className={derivativesSalesCurrent === item.platformNumber ? "active" : ""}
                               onClick={async () => {
                                 detail.derivativesSalesCurrent = item.platformNumber;
                                 await detail.getBasicData({
                                   userGuid,
                                   ipTypeSuperiorNumber: ipTypeNumber,
                                   ipid,
                                   moduleNumber: 2,
                                   platformNumber: item.platformNumber,
                                 });
                               }}
                               key={index}>{item.name}</li>;
                  })
                }
              </ul>
              {
                !_isEmpty(derivativesSalesData) &&
                <div className="area-content-child">
                  <div>
                    <img src={xsze} alt=""/>
                    <p>IP月销总单额</p>
                    <h4>{derivativesSalesData.salesTotalAmount}</h4>
                  </div>
                  <div>
                    <img src={cjdj} alt=""/>
                    <p>月成交总单额</p>
                    <h4>{derivativesSalesData.monthlyTransactionTotal}</h4>
                  </div>
                  <div>
                    <img src={spjj} alt=""/>
                    <p>商品均价</p>
                    <h4>{derivativesSalesData.goodsAveragePrice}</h4>
                  </div>
                  <div>
                    <img src={dsqd} alt=""/>
                    <p>电商渠道</p>
                    <h4>{derivativesSalesData.sellerNumber}</h4>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        {
          !_isEmpty(socialPlatformTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_sjptzl} alt=""/>
              社交平台数据总览
            </p>
            <div className="area-content hot-content">
              <ul className="margin-bottom30">
                {
                  socialPlatformTabs && socialPlatformTabs.map((item, index) => {
                    return <li className={socialPlatformCurrent === item.platformNumber ? "active" : ""}
                               onClick={async () => {
                                 detail.socialPlatformCurrent = item.platformNumber;
                                 await detail.getBasicData({
                                   userGuid,
                                   ipTypeSuperiorNumber: ipTypeNumber,
                                   ipid,
                                   moduleNumber: 3,
                                   platformNumber: item.platformNumber,
                                 });
                               }}
                               key={index}>{item.name}</li>;
                  })
                }
              </ul>
              {
                !_isEmpty(socialPlatformData) ?
                  <div className="area-content-child">
                    {
                      socialPlatformData && socialPlatformData.map((item, index) => {
                        return (
                          <div key={index}>
                            <img src={this.dataViewIcon(item.name)} alt=""/>
                            <p>{item.name}</p>
                            <h4>{item.value}</h4>
                          </div>
                        );
                      })
                    }
                    {/* {
                  this.dataViewArr(dataViewCurrent) && this.dataViewArr(dataViewCurrent).map((item, index) => {
                    return (
                      <div key={index} className={index + 1 === this.dataViewArr(dataViewCurrent).length ? 'last' : ''}>
                        <img src={item.icon} alt=""/>
                        <p>{item.name}</p>
                        <h4>410万</h4>
                      </div>
                    );
                  })
                }*/}
                  </div>
                  :
                  <NoResult/>
              }

            </div>
          </div>
        }
        {
          !_isEmpty(fansTrendTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_follower} alt=""/>
              粉丝趋势
            </p>
            <div className="area-content media-content">
              <ul>
                {fansTrendTabs && fansTrendTabs.map((item, k) => {
                  return (
                    <li className={fansTrendCurrent === item.platformNumber ? "active" : ""} key={k}
                        onClick={async () => {
                          detail.fansTrendCurrent = item.platformNumber;
                          await detail.getBasicData({
                            userGuid,
                            ipTypeSuperiorNumber: ipTypeNumber,
                            ipid,
                            moduleNumber: 4,
                            platformNumber: item.platformNumber,
                            type: fansType,
                          });
                        }}
                    >
                      {item.name}粉丝数
                    </li>
                  );
                })}
                <li className="li-select">
                  <Select defaultValue="总量" style={{ width: 100 }} onChange={async (value, option) => {
                    this.setState({
                      fansType: value
                    });
                    await detail.getBasicData({
                      userGuid,
                      ipTypeSuperiorNumber: ipTypeNumber,
                      ipid,
                      moduleNumber: 4,
                      platformNumber: fansTrendCurrent,
                      type: value,
                    });
                  }}>
                    {
                      selectFans && selectFans.map((item, index) => {
                        return <Option value={item.type} label={item.name} key={index}>{item.name}</Option>;
                      })
                    }
                  </Select>
                </li>
              </ul>
              {!_isEmpty(userGuid) && !_isEmpty(fansTrendData) && (
                <EchartLine
                  container="echart-line"
                  data={fansTrendData}
                  subtext="粉丝数"
                />
              )}
              {
                _isEmpty(fansTrendData) &&
                <NoEchart subtext="粉丝数" container="echart-line"/>
              }
              {/*{this._noResultFun(fansTrendData)}*/}
            </div>
          </div>
        }
        {
          !_isEmpty(recentWorksTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_jqzps} alt=""/>
              社交平台近期作品数据
            </p>
            <div className="area-content hot-content">
              <ul>
                {
                  recentWorksTabs && recentWorksTabs.map((item, index) => {
                    return <li className={recentWorksCurrent === item.platformNumber ? "active" : ""}
                               onClick={async () => {
                                 detail.recentWorksCurrent = item.platformNumber;
                                 detail.recentWorksCurrentName = item.name;
                                 await detail.getBasicData({
                                   userGuid,
                                   ipTypeSuperiorNumber: ipTypeNumber,
                                   ipid,
                                   moduleNumber: 5,
                                   platformNumber: item.platformNumber,
                                 });
                               }}
                               key={index}>{item.name}</li>;
                  })
                }
              </ul>
              {
                !_isEmpty(recentWorksData) && (detail.recentWorksCurrentName === '抖音' || detail.recentWorksCurrentName === "快手") &&
                <div className="table-recent">
                  <table>
                    <tr>
                      <td>日期</td>
                      <td>作品名称</td>
                      <td>点赞数</td>
                      <td>评论数</td>
                      <td>分享数</td>
                    </tr>
                    {
                      recentWorksData && recentWorksData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="u-style">{moment(item.works_date).format('YYYY/MM/DD')}</td>
                            <td>
                              <div>{item.works_title}</div>
                            </td>
                            <td>{item.works_praised}</td>
                            <td>{item.works_comment}</td>
                            <td>{item.works_share}</td>
                          </tr>
                        );
                      })
                    }
                  </table>
                </div>
              }
              {
                !_isEmpty(recentWorksData) && detail.recentWorksCurrentName === '小红书' &&
                <div className="table-recent">
                  <table>
                    <tr>
                      <td>日期</td>
                      <td>作品名称</td>
                      <td>点赞数</td>
                      <td>评论数</td>
                      <td>收藏数</td>
                    </tr>
                    {
                      recentWorksData && recentWorksData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="u-style">{moment(item.works_date).format('YYYY/MM/DD')}</td>
                            <td>
                              <div>{item.works_title}</div>
                            </td>
                            <td>{item.works_praised}</td>
                            <td>{item.works_comment}</td>
                            <td>{item.works_collection}</td>
                          </tr>
                        );
                      })
                    }
                  </table>
                </div>
              }
              {
                !_isEmpty(recentWorksData) && detail.recentWorksCurrentName === 'B站' &&
                <div className="table-recent">
                  <table>
                    <tr>
                      <td>日期</td>
                      <td>作品名称</td>
                      <td>点赞数</td>
                      <td>评论数</td>
                      <td>收藏数</td>
                      <td>转发数</td>
                      <td>投币数</td>
                    </tr>
                    {
                      recentWorksData && recentWorksData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="u-style">{moment(item.works_date).format('YYYY/MM/DD')}</td>
                            <td>
                              <div>{item.works_title}</div>
                            </td>
                            <td>{item.works_praised}</td>
                            <td>{item.works_comment}</td>
                            <td>{item.works_collection}</td>
                            <td>{item.works_forward}</td>
                            <td>{item.works_coin}</td>
                          </tr>
                        );
                      })
                    }
                  </table>
                </div>
              }
              {this._noResultFun(recentWorksData)}
            </div>
          </div>
        }
        {
          !_isEmpty(searchBasicTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_search} alt=""/>
              搜索基础数据
            </p>
            <div className="area-content hot-content">
              <ul>
                {searchBasicTabs && searchBasicTabs.map((li, k) => {
                  return (
                    <li key={k}
                        className={searchBasicCurrent === li.platformNumber ? "active" : ""}
                        onClick={async () => {
                          detail.searchBasicCurrent = li.platformNumber;
                          detail.searchBasicCurrentName = li.name;
                          await detail.getBasicData({
                            userGuid,
                            ipTypeSuperiorNumber: ipTypeNumber,
                            ipid,
                            moduleNumber: 6,
                            platformNumber: li.platformNumber,
                          });
                        }}
                    >
                      {li.name}
                    </li>
                  );
                })}
              </ul>
              {!_isEmpty(userGuid) && !_isEmpty(searchBasicData) &&
              <EchartBar
                container="echart-bar"
                data={searchBasicData}
                subtext={searchBasicCurrentName}
              />
              }
              {
                _isEmpty(searchBasicData) &&
                <NoEchart subtext={searchBasicCurrentName} container="echart-bar"/>
              }
              {/*{_isEmpty(searchBasicData) && <NoResult/>}*/}
            </div>
          </div>
        }
        {
          !_isEmpty(mediaFocusTabs) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_media} alt=""/>
              媒体关注基础数据
            </p>
            <div className="area-content media-content">
              <ul>
                {mediaFocusTabs && mediaFocusTabs.map((item, k) => {
                  return (
                    <li className={mediaFocusCurrent === item.platformNumber ? "active" : ""} key={k}
                        onClick={async () => {
                          detail.mediaFocusCurrent = item.platformNumber;
                          detail.mediaFocusCurrentName = item.name;
                          await detail.getBasicData({
                            userGuid,
                            ipTypeSuperiorNumber: ipTypeNumber,
                            ipid,
                            moduleNumber: 7,
                            platformNumber: item.platformNumber,
                          });
                        }}
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
              {_isEmpty(mediaFocusData) && <NoEchart subtext={mediaFocusCurrentName} container="echart-line"/>}
              {!_isEmpty(userGuid) && !_isEmpty(mediaFocusData) && (
                <EchartLine
                  container="echart-line"
                  data={mediaFocusData}
                  subtext={mediaFocusCurrentName}
                />
              )}
            </div>
          </div>
        }
      </div>
    );
  }
}
