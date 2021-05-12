/**
 * 预测数据- 详情tab 页面
 * author:Balance.xue
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/forecast_detail.scss";
import Alert from "@components/alert";
import _isEmpty from "lodash/isEmpty";
import icon_doubt from "@assets/images/ip_detail/how.png" ;
import {
  EchartBarCategory,
  EchartScatterCard,
  EchartDoubleLines,
  EchartLines,
  EchartScatter
} from '@pages/forecast-detail/components';
// import NoResult from '@components/no_result';
import InDevelopment from '@components/in_development';
import ScrollTop from "@components/scroll-top";
// import { Spin } from "antd";
import icon_load from "@assets/images/update/timg.gif";

interface IForecaseDetailState {
  message: string;
  isShow: boolean;
  alertMessage: string;
  spinning: boolean,
  count: number,
}

@inject('login', 'filter_forecast', 'forecast_detail')
@observer
export default class ForecastDetail extends React.Component <IProps, IForecaseDetailState> {

  constructor(props: any) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      alertMessage: '',
      spinning: true,
      count: 5,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- 分析数据详情页";
    const { forecast_detail, match: { params } } = this.props;
    forecast_detail.clearData();

    if (params['ipids']) {
      forecast_detail.setTabTitle(1);
      let ipids = unescape(params['ipids']);
      forecast_detail.setIpids(ipids);
      await forecast_detail.funTGI();

      // await forecast_detail.funLife();
      await forecast_detail.funGrowthCycle();
      await forecast_detail.funWavePath();

      await forecast_detail.funQuadrant();
      await forecast_detail.funHeat();

      // setTimeout(() => {
      //   this.setState({ spinning: false });
      // }, 5000);

    }

  }

  render() {
    const { forecast_detail, filter_forecast } = this.props;
    const {
      tabTitle, fansSexData, fansAgeData,
      basicInfo,
      growthCycle, wavePath, heatData,
      quadrant: { matchData, famousData },
    } = forecast_detail;
    const { isShow, message, } = this.state;
    let ipTypeSuperiorNumber = Number(localStorage.getItem("ipType"));
    let year = new Date().getFullYear();
    let year2 = year - 1;
    let year3 = year - 2;
    const loadIcon = <Icon/>;
    return (
      <div className="main-container">
        <div className='detail-forecast'>
          <div className="g-top">
            <div className="tab align-items-center justify-content-start">
              <span className={tabTitle === 1 ? "span-active" : ""}
                    onClick={() => forecast_detail.setTabTitle(1)}>
               IP概况
              </span>
              <span className={tabTitle === 2 ? "span-active" : ""}
                    onClick={() => forecast_detail.setTabTitle(2)}>
               粉丝分析
              </span>
              <span className={tabTitle === 3 ? "span-active" : ""}
                    onClick={() => forecast_detail.setTabTitle(3)}>
                热度分析
              </span>
              <span className={tabTitle === 4 ? "span-active" : ""}
                    onClick={() => forecast_detail.setTabTitle(4)}>
                发展评估
              </span>
              <span className={tabTitle === 5 ? "span-active" : ""}
                    onClick={() => forecast_detail.setTabTitle(5)}>
               定性标签
              </span>

            </div>
          </div>
          <div className="g-content">
            {/* TGI明星表*/}
            <div className={tabTitle === 1 ? "m-star show" : "hide"}>
              {/*<Spin indicator={loadIcon} spinning={this.state.spinning}>*/}
                {
                  !_isEmpty(basicInfo) &&
                  <div className="basic-info">
                    {
                      ipTypeSuperiorNumber === 8 ?
                        <table className="table-bordered text-left">
                          <thead>
                          <tr>
                            <th>IP基本信息</th>
                            <th>
                              <div className="u-hover">IP热度
                                <img src={icon_doubt} alt=""/>
                                <div className="hover-box">
                                  此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大
                                  数据计算，百分制表示。
                                </div>
                              </div>
                            </th>
                            <th>
                              <div className="u-hover  wb">微博粉丝
                                <img src={icon_doubt} alt=""/>
                                <div className="hover-box">
                                  此IP当前在微博平台所拥有的粉丝总数。
                                </div>
                              </div>
                            </th>
                            <th>{year}年作品</th>
                            <th>{year2}年作品</th>
                            <th>{year3}年作品</th>
                          </tr>
                          </thead>
                          <tbody>
                          {
                            basicInfo && basicInfo.map((i, k) => {
                              return (
                                <tr key={k}>
                                  <td>
                                    <div className="">
                                      <img src={i.picUrl} alt="" className="ip-pic"/>
                                      <div>
                                        <span>{i.ipName}</span>
                                        <span>{i.brithDate}</span>
                                        <span>{i.profession.replace(',', '、')}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="td-math">{i.arithmaticHotspotPrice.toLocaleString()}</td>
                                  <td className="td-math">{i.dataNumber.toLocaleString()}</td>
                                  <td>{i.nowYearWorks ? i.nowYearWorks : "--"} </td>
                                  <td>{i.lastYearWorks ? i.lastYearWorks : "--"}</td>
                                  <td>{i.beforeLastYearWorks ? i.beforeLastYearWorks : "--"}</td>
                                </tr>
                              );
                            })
                          }
                          </tbody>
                        </table>
                        :
                        <table className="table-bordered text-left">
                          <thead>
                          <tr>
                            <th>IP名称</th>
                            <th>所属企业</th>
                            <th>
                              <div className="u-hover">IP热度
                                <img src={icon_doubt} alt=""/>
                                <div className="hover-box">
                                  此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大
                                  数据计算，百分制表示。
                                </div>
                              </div>
                            </th>
                            <th>
                              <div className="u-hover">微博粉丝
                                <img src={icon_doubt} alt=""/>
                                <div className="hover-box">
                                  此IP当前在微博平台所拥有的粉丝总数。
                                </div>
                              </div>
                            </th>
                            <th>类型</th>
                          </tr>
                          </thead>
                          <tbody>
                          {
                            basicInfo && basicInfo.map((i, k) => {
                              return (
                                <tr key={k}>
                                  <td>
                                    <div>
                                      <img src={i.picUrl} alt="" className="ip-pic"/>
                                      <span>{i.ipName}</span>
                                    </div>
                                  </td>
                                  <td>{i.companyName}</td>
                                  <td className="td-math">{i.arithmaticHotspotPrice.toLocaleString()}</td>
                                  <td className="td-math">{i.dataNumber.toLocaleString()}</td>
                                  <td>
                                    <div className="word-ellipsis" title={i.ipTypeNumberNames}>
                                      {i.ipTypeNumberNames ? i.ipTypeNumberNames : '--'}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          }
                          </tbody>
                        </table>
                    }
                  </div>
                }
              {/*</Spin>*/}
            </div>

            <div className={tabTitle === 2 ? "m-star show" : "hide"}>
              {
                !_isEmpty(fansSexData) &&
                <div className="fans-sex">
                  <div className="title">粉丝性别对比
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>
                        含义：对比展示IP粉丝中男女占比，百分制表示。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <EchartDoubleLines container="echart" data={fansSexData}/>
                  </div>
                </div>
              }
              {
                !_isEmpty(fansAgeData) &&
                <div className="fans-age">
                  <div className="title ">
                    粉丝年龄段平均比例对比
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>
                        含义：IP个体在某年龄段（70后、80后、90后、00后）粉丝画像（年龄段占比）与全网该IP类别
                        用户画像的差值，正数代表IP个体高于全网平均水平即在该年龄段受欢迎，百分制表示。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    {
                      !_isEmpty(fansAgeData) &&
                      <EchartBarCategory container="echart" data={fansAgeData}/>
                    }
                  </div>
                </div>
              }
            </div>

            {/* 热度分析*/}
            <div className={tabTitle === 3 ? "m-heat-trend show" : "hide"}>
              {
                !_isEmpty(heatData.series) &&
                <div className="heart-chart">

                  <div className="title">热度趋势分析
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box"> 含义：基于全网社交平台如百度、微博、微信等热度指数加权计算。
                    </div>
                  </div>
                  <div className="chart">
                    <EchartLines container="echart" data={heatData} title={"热度值"}/>
                  </div>
                </div>
              }
              {
                // 名人
                Number(localStorage.getItem('ipTypeNumber')) === 8 &&
                !_isEmpty(famousData.series) &&
                <div className="famous-heat">
                  <div className="title">知名度VS热度
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>
                        知名度：IP知名度为基础数据，百分制表示。
                      </p>
                      <p>
                        热度：此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大
                        数据计算，百分制表示。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <EchartScatter container="echart" data={famousData} xAxisName="知名度"/>
                  </div>
                </div>
              }

              {
                !_isEmpty(matchData.series) &&
                <div className="match-heat">
                  <div className="title">匹配度VS热度
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>匹配度：TGI为目标群体指数。
                        算法说明：基于全网搜索数据，对此IP用户聚类分析，展示用户性别年龄分布，
                        TGI是指定年龄（性别）中此IP用户所占比例/总体年龄（全部性别）中此IP
                        用户所占比例。
                      </p>
                      <p>
                        热度：此IP热度指数，对全网社交平台，用户的讨论数、讨论热度，经过大
                        数据计算，百分制表示。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <EchartScatter container="echart" data={matchData} xAxisName={"匹配度"}/>
                  </div>
                </div>
              }
            </div>
            {/* 发展评估*/}
            <div className={tabTitle === 4 ? "m-develop show" : "hide"}>
              {
                !_isEmpty(growthCycle) &&
                <div className="wave-value">
                  <div className="title"> 发展阶段评估
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>
                        含义：根据IP某段时间内热度波动情况及IP粉丝量定义
                        IP所处的成长阶段，G0到G7为平缓到高速成长的八个阶段，依次递增。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <EchartScatterCard container="echart" data={growthCycle}/>
                  </div>
                </div>
              }

              {
                !_isEmpty(wavePath.series) &&
                <div className="wave-value">
                  <div className="title">发展波动轨迹
                    <img src={icon_doubt} alt="" className="icon_detail"/>
                    <div className="hover-box">
                      <p>
                        含义：IP在某段时间内热度的波动状况。
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <EchartLines container="echart" data={wavePath} title={"波动轨迹"}/>
                  </div>
                </div>
              }
            </div>
            {/*定性标签*/}
            <div className={tabTitle === 5 ? "m-life-cycle show" : "hide"}>
              <InDevelopment/>
            </div>
          </div>
          {
            isShow && <Alert
              message={message}
              onClose={() => {
                this.setState({ isShow: false });
              }}
              onSubmit={() => {
              }}
            />
          }
        </div>
        <ScrollTop/>
      </div>
    );
  }
}

class Icon extends React.Component<any, any> {
  render() {
    return <img src={icon_load} style={{ width: 24, height: 24 }} alt=""/>;
  }
}
