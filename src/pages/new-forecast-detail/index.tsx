/**
 * 预测数据- 详情tab 页面-6.29
 * author:Balance.xue
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/new_forecast_detail.scss";
import Alert from "@components/alert";
import _isEmpty from "lodash/isEmpty";
import icon_doubt from "@assets/images/ip_detail/how.png";
import {
  EchartBarCategory,
  EchartScatterCard,
  EchartBarDouble,
  EchartLines,
  EchartBar,
  EchartWordCloud,
  EchartRadar,
  EchartBarSpecial,
  EchartMap,
  EchartBarSpecial2,
  EchartTree,
} from "@pages/new-forecast-detail/components";
import InDevelopment from "@components/in_development";
import NoResult from "../detail/components/no-result";
import ScrollTop from "@components/scroll-top";
import { toJS } from "mobx";
import DiamondsExample from "@components/diamonds-example";
import Toast from "@components/toast";

interface IForecaseDetailState {
  message: string;
  isShow: boolean;
  alertMessage: string;
  spinning: boolean;
  count: number;
  showToast: boolean;
  toastMsg: string;
}

@inject("login", "new_forecast_detail")
@observer
export default class NewForecastDetail extends React.Component<
  IProps,
  IForecaseDetailState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: "",
      isShow: false,
      alertMessage: "",
      spinning: true,
      count: 5,
      showToast: false,
      toastMsg: "",
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- 分析数据详情页";
    const {
      new_forecast_detail,
      login,
      match: { params },
    } = this.props;
    new_forecast_detail.changeUserInfo(login.userInfo)
    const { tabSearch, tabIdName } = new_forecast_detail;
    const { userGuid } = login.userInfo || { userGuid: "" };
    new_forecast_detail.clearData();

    if (userGuid) {
      if (params["ipids"]) {
        const ipids = unescape(params["ipids"]);
        const {
          errorCode, errorMsg
        } = await new_forecast_detail.getConsumptionToken({
          type: 4,
          ipids,
        });
        if (+errorCode === 200) {
          new_forecast_detail.setTabTitle(1);
          const ipTypeSuperior = localStorage.getItem("ipType");
          console.log(ipTypeSuperior);
          new_forecast_detail.setIpids(ipids);
          // new
          await new_forecast_detail.funBasic(userGuid);
          await new_forecast_detail.funTGI();
          if (ipTypeSuperior === "8") {
            await new_forecast_detail.funFamousDanger({ ipids, typeId: 89 });
          } else if (ipTypeSuperior === "338") {
            await new_forecast_detail.funFamousDanger({ ipids, typeId: 95 });
          } else if (ipTypeSuperior === "370") {
            await new_forecast_detail.funFamousDanger({ ipids, typeId: 97 });
          } else if (
            ipTypeSuperior === "9" ||
            ipTypeSuperior === "10" ||
            ipTypeSuperior === "1,9,10"
          ) {
            await new_forecast_detail.funFamousDanger({ ipids, typeId: 101 });
          } else if (
            ipTypeSuperior === "5" ||
            ipTypeSuperior === "6" ||
            ipTypeSuperior === "7" ||
            ipTypeSuperior === "5,6,7"
          ) {
            await new_forecast_detail.funFamousDanger({ ipids, typeId: 93 });
          }
          await new_forecast_detail.funFamousDanger({ ipids, typeId: 3 });
          await new_forecast_detail.funFamousDanger({ ipids, typeId: 14 });
          await new_forecast_detail.funFamousDanger({ ipids, typeId: 5 });
          await new_forecast_detail.funFamousDanger({
            ipids,
            typeId: tabSearch,
          });
          await new_forecast_detail.funHeatPriceTrend({ ipids, type: 1 });
          await new_forecast_detail.funHeatPriceTrend({ ipids, type: 2 });
          await new_forecast_detail.funHeat();
          await new_forecast_detail.funGrowthCycle();
          await new_forecast_detail.funWavePath();
          await new_forecast_detail.funBusiness();
          await new_forecast_detail.funBusinessEcology();
          await new_forecast_detail.funRecommend();
        } else {
          this.setState({
            showToast: true,
            toastMsg: errorMsg,
          });
        }
      }
    }
  }

  /**
   * 地区分布，调用原来IP详情接口
   */
  async funCityList(ipid) {
    const { new_forecast_detail, login, match: { params }, } = this.props;
    const { consumptionToken } = new_forecast_detail;
    const ipids = unescape(params["ipids"]);

    const { userGuid } = login.userInfo;
    await new_forecast_detail.getFansAreaData({ userGuid, ipid, ipids, typeId: 3, consumptionToken });
  }

  /**
   * IP词云 黑粉词云
   */
  async funWordCloud(ipid, wordType) {
    const { new_forecast_detail, login, match: { params } } = this.props;
    const ipids = unescape(params["ipids"]);

    const { userGuid } = login.userInfo;
    await new_forecast_detail.getWordData({ userGuid, ipid, ipids, wordType });
  }

  render() {
    const {
      new_forecast_detail,
      login,
      match: { params },
    } = this.props;
    const ipids = unescape(params["ipids"]);
    const {
      tabTitle,
      fansSexData,
      fansAgeData,
      basicInfo,
      hotFamousTitle,
      growthCycle,
      wavePath,
      heatData,
      blackPowerData,
      blackPowerDangerData,
      tabBlackFans,
      fansData,
      searchData,
      searchResultData,
      tabSearch,
      tabSearchResult,
      exitTimeData,
      potentialValue,
      mediaFocusData,
      peopleData,
      risingTrend,
      priceTrend,
      tabName,
      tabId,
      tabIdName,
      xProvince,
      yProvince,
      ipProvinceData,
      ipWordCloudData,
      tabWordCloud,
      businessC,
      businessE,
      recommendData,
      consumptionToken,
    } = new_forecast_detail;
    const { isShow, message } = this.state;
    // console.log(JSON.stringify(searchResultData));
    const { userGuid } = login.userInfo || { userGuid: "" };

    if (consumptionToken) {
      return (
        <div className="main-container">
          <div className="detail-forecast">
            <div className="g-top">
              <div className="tab align-items-center justify-content-start">
                <span
                  className={tabTitle === 1 ? "span-active" : ""}
                  onClick={() => new_forecast_detail.setTabTitle(1)}
                >
                  匹配度
                </span>
                <span
                  className={tabTitle === 2 ? "span-active" : ""}
                  onClick={() => new_forecast_detail.setTabTitle(2)}
                >
                  风险评估
                </span>
                <span
                  className={tabTitle === 3 ? "span-active" : ""}
                  onClick={() => new_forecast_detail.setTabTitle(3)}
                >
                  热度&知名度
                </span>
                <span
                  className={tabTitle === 4 ? "span-active" : ""}
                  onClick={() => new_forecast_detail.setTabTitle(4)}
                >
                  商业价值
                </span>
                <span
                  className={tabTitle === 5 ? "span-active" : ""}
                  onClick={() => new_forecast_detail.setTabTitle(5)}
                >
                  推荐指数
                </span>
              </div>
              {tabTitle === 3 && (
                <div className="m-tab-title">
                  <span
                    className={hotFamousTitle === 1 ? "span-active" : ""}
                    onClick={() => (new_forecast_detail.hotFamousTitle = 1)}
                  >
                    热度
                  </span>
                  <span
                    className={hotFamousTitle === 2 ? "span-active" : ""}
                    onClick={() => (new_forecast_detail.hotFamousTitle = 2)}
                  >
                    知名度
                  </span>
                </div>
              )}
            </div>

            <div className="g-content">
              {/*匹配度*/}
              <div className={tabTitle === 1 ? "m-star show" : "hide"}>
                {!_isEmpty(basicInfo) && (
                  <table className="table-bordered text-left">
                    <thead>
                      <tr>
                        <th>IP基本信息</th>
                        {/* <th>价格</th> */}
                        <th>IP故事</th>
                        <th>创造背景</th>
                      </tr>
                    </thead>
                    <tbody>
                      {basicInfo &&
                        basicInfo.map((i, k) => {
                          return (
                            <tr key={k}>
                              <td>
                                <div className="td-info">
                                  <img
                                    src={i.picUrl}
                                    alt=""
                                    className="ip-pic"
                                  />
                                  <div className="td-info-detail">
                                    <p>
                                      名称: <span>{i.ipName}</span>
                                    </p>
                                    <p>
                                      类型：<span>{i.typeName}</span>
                                    </p>
                                    <p>
                                      国别：<span>{i.countryNames}</span>
                                    </p>
                                    <p>
                                      公司：<span>{i.companyName}</span>
                                    </p>
                                  </div>
                                </div>
                              </td>
                              {/* <td className="td-math">
                                {i.ipPrice ? i.ipPrice : "--"}
                              </td> */}
                              <td className="td-detail">
                                <div>{i.ipDesc ? i.ipDesc : "--"}</div>
                              </td>
                              <td className="td-detail">
                                <div>
                                  {i.creationBackground
                                    ? i.creationBackground
                                    : "--"}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
                {!_isEmpty(fansAgeData) && (
                  <div className="fans-age">
                    <div className="title ">
                      粉丝年龄段平均比例对比
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <div className="hover-box">
                        <p>
                          此IP个体在某年龄阶段（70后、80后、90后、00后）粉丝画像（年龄占比）
                          与全网该类IP类别用户画像的差值，正数代表此IP个体高于全网平均水平即在该年龄段受欢迎，百分制表示
                        </p>
                      </div>
                    </div>
                    <div className="chart">
                      <EchartBarCategory
                        container="echart"
                        data={fansAgeData}
                      />
                    </div>
                  </div>
                )}
                {!_isEmpty(fansSexData) && (
                  <div className="fans-sex">
                    <div className="title">
                      粉丝性别对比
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <p className="hover-box">
                        对比展示此IP粉丝中男女占比，百分制表示
                      </p>
                    </div>
                    <div className="chart">
                      <EchartBarDouble container="echart" data={fansSexData} />
                    </div>
                  </div>
                )}
                <div className="fans-sex">
                  <div className="title">
                    地区分布
                    <img src={icon_doubt} alt="" className="icon_detail" />
                    <p className="hover-box" style={{ left: "0.57rem" }}>
                      此IP粉丝的所处地域分布
                    </p>
                  </div>
                  <div className="chart tab-chart tab-chart-map">
                    <div className="tab-title">
                      {tabIdName &&
                        tabIdName.map((item, index) => {
                          return (
                            <span
                              key={index}
                              className={`tab-item ${
                                tabId === item.ipid ? "active" : ""
                              }`}
                              onClick={async () => {
                                new_forecast_detail.tabId = item.ipid;
                                await this.funCityList(item.ipid);
                              }}
                            >
                              {item.ipName}
                            </span>
                          );
                        })}
                    </div>
                    <div className="city-tab-content">
                      <EchartMap data={ipProvinceData} container="echart" />
                      <div className="middle-line" />
                      <EchartBarSpecial2
                        container="echart"
                        subtext=""
                        xData={xProvince}
                        yPercent={yProvince}
                      />
                    </div>
                  </div>
                </div>
                <div className="fans-sex">
                  <div className="title">
                    IP词云
                    <img src={icon_doubt} alt="" className="icon_detail" />
                    <p className="hover-box" style={{ left: "0.4rem" }}>
                      此IP在网络平台被讨论时被提及的高频词汇
                    </p>
                  </div>
                  <div className="chart tab-chart">
                    <div className="tab-title">
                      {tabIdName &&
                        tabIdName.map((item, index) => {
                          return (
                            <span
                              key={index}
                              className={`tab-item ${
                                tabWordCloud === index ? "active" : ""
                              }`}
                              onClick={async () => {
                                new_forecast_detail.tabWordCloud = index;
                                await this.funWordCloud(Number(item.ipid), 1);
                              }}
                            >
                              {item.ipName}
                            </span>
                          );
                        })}
                    </div>
                    {!_isEmpty(ipWordCloudData) ? (
                      <EchartWordCloud
                        container="echart"
                        ipWordCloudData={ipWordCloudData}
                      />
                    ) : (
                      <NoResult />
                    )}
                  </div>
                </div>
              </div>
              {/*风险评估*/}
              <div className={tabTitle === 2 ? "m-star show" : "hide"}>
                {!_isEmpty(blackPowerData.series) && (
                  <div className="black-power">
                    <div className="title">
                      黑粉占比
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <p className="hover-box" style={{ left: "0.57rem" }}>
                        此IP的黑粉数量在粉丝总数中的占比，用百分制表示
                      </p>
                    </div>
                    <div className="chart">
                      <EchartBar
                        container="echart"
                        data={blackPowerData}
                        subtext="黑粉占比"
                      />
                    </div>
                  </div>
                )}
                <div className="black-danger">
                  <div className="title">
                    黑粉风险点
                    <img src={icon_doubt} alt="" className="icon_detail" />
                    <p className="hover-box" style={{ left: "0.75rem" }}>
                      此IP在网上被提及频率较高的负面词汇
                    </p>
                  </div>
                  <div className="chart tab-chart">
                    <div className="tab-title">
                      {tabIdName &&
                        tabIdName.map((item, index) => {
                          return (
                            <span
                              key={index}
                              className={`tab-item ${
                                tabBlackFans === index ? "active" : ""
                              }`}
                              onClick={async () => {
                                new_forecast_detail.tabBlackFans = index;
                                await this.funWordCloud(Number(item.ipid), 2);
                              }}
                            >
                              {item.ipName}
                            </span>
                          );
                        })}
                    </div>
                    {!_isEmpty(blackPowerDangerData) ? (
                      <EchartWordCloud
                        container="echart"
                        ipWordCloudData={blackPowerDangerData}
                      />
                    ) : (
                      <NoResult />
                    )}
                  </div>
                </div>
              </div>

              {/* 热度&知名度*/}
              <div className={tabTitle === 3 ? "m-heat-trend show" : "hide"}>
                {/*热度*/}
                {hotFamousTitle === 1 && (
                  <div className="heat-content">
                    {!_isEmpty(heatData.series) && (
                      <div className="heart-chart">
                        <div className="title">
                          热度趋势分析
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box">
                            此IP基于全网社交平台如百度、微博、微信等热度指数加权计算的热度随时间的变化趋势。
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartLines
                            container="echart"
                            data={heatData}
                            title={"热度值"}
                          />
                        </div>
                      </div>
                    )}
                    {!_isEmpty(risingTrend.series) && (
                      <div className="heart-chart">
                        <div className="title">
                          涨粉趋势
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.58rem" }}>
                            此IP在微博平台的粉丝数量增长情况随着时间的变化趋势
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartLines
                            container="echart"
                            data={risingTrend}
                            title={"涨粉趋势"}
                          />
                        </div>
                      </div>
                    )}
                    {!_isEmpty(peopleData.series) && (
                      <div className="heart-chart">
                        <div className="title">
                          大众热议指数
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box">
                            此IP基于全网社交平台如百度、微博、微信等热度指数加权计算
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartBarSpecial
                            container="echart"
                            data={peopleData}
                            subtext={""}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/*知名度*/}
                {hotFamousTitle === 2 && (
                  <div className="heat-content">
                    {!_isEmpty(mediaFocusData) && (
                      <div className="heart-chart">
                        <div className="title">
                          媒体关注度
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.72rem" }}>
                            此IP的在线媒体的关注，通过过去30天全网新闻中与此IP相关的新闻的数量来计算获得，百分制表示
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartBarSpecial
                            container="echart"
                            data={mediaFocusData}
                            subtext={"媒体关注度"}
                          />
                        </div>
                      </div>
                    )}
                    {!_isEmpty(fansData) && (
                      <div className="heart-chart">
                        <div className="title">
                          粉丝数
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.42rem" }}>
                            此IP在全网拥有的粉丝数
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartBarSpecial
                            container="echart"
                            data={fansData}
                          />
                        </div>
                      </div>
                    )}
                    {!_isEmpty(searchData) && (
                      <div className="heart-chart">
                        <div className="title">
                          搜索量
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.38rem" }}>
                            此IP一段时间内在百度平台上经由网民的不同互相动作加权计算得出的资讯数据的日均值
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartBarSpecial
                            container="echart"
                            data={searchData}
                          />
                        </div>
                      </div>
                    )}

                    <div className="heart-chart">
                      <div className="title">
                        搜索相关结果量
                        <img src={icon_doubt} alt="" className="icon_detail" />
                        <p className="hover-box" style={{ left: "1.05rem" }}>
                          此IP在一段时间内分别在百度、360搜索、搜狗和必应上被搜索的的结果数量
                        </p>
                      </div>
                      <div className=" tab-chart chart-small">
                        <div className="tab-title">
                          {tabSearchResult &&
                            tabSearchResult.map((item, index) => {
                              return (
                                <span
                                  key={index}
                                  className={`tab-item ${
                                    tabSearch === item.id ? "active" : ""
                                  }`}
                                  onClick={async () => {
                                    new_forecast_detail.tabSearch = item.id;
                                    await new_forecast_detail.funFamousDanger({
                                      ipids,
                                      typeId: item.id,
                                    });
                                  }}
                                >
                                  {item.name}
                                </span>
                              );
                            })}
                        </div>
                        {!_isEmpty(searchResultData.series) ? (
                          <EchartBarSpecial
                            container="echart"
                            data={searchResultData}
                          />
                        ) : (
                          <NoResult />
                        )}
                      </div>
                    </div>
                    {!_isEmpty(exitTimeData.series) && (
                      <div className="heart-chart">
                        <div className="title">
                          存在时间
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.57rem" }}>
                            此IP存在至今的时间段
                          </p>
                        </div>
                        <div className="chart-small">
                          <EchartBar
                            container="echart"
                            data={exitTimeData}
                            subtext="存在时间(月)"
                          />
                        </div>
                      </div>
                    )}
                    {!_isEmpty(growthCycle) && (
                      <div className="wave-value">
                        <div className="title">
                          {" "}
                          发展阶段
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <p className="hover-box" style={{ left: "0.57rem" }}>
                            根据IP某段时间内热度波动情况及IP粉丝量定义
                            IP所处的成长阶段，G0到G7为平缓到高速成长的八个阶段，依次递增。
                          </p>
                        </div>
                        <div className="chart">
                          <EchartScatterCard
                            container="echart"
                            data={growthCycle}
                          />
                        </div>
                      </div>
                    )}

                    {!_isEmpty(wavePath.series) && (
                      <div className="wave-value">
                        <div className="title">
                          发展波动轨迹
                          <img
                            src={icon_doubt}
                            alt=""
                            className="icon_detail"
                          />
                          <div className="hover-box">
                            <p>此IP在某段时间内热度的波动情况</p>
                          </div>
                        </div>
                        <div className="chart">
                          <EchartLines
                            container="echart"
                            data={wavePath}
                            title={"波动轨迹"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/*商业价值*/}
              <div className={tabTitle === 4 ? "m-develop show" : "hide"}>
                {!_isEmpty(businessC) && (
                  <div>
                    <div className="title">
                      商业合作
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <p className="hover-box" style={{ left: "0.56rem" }}>
                        此IP合作过的商家和品牌，按照年份排布
                      </p>
                    </div>
                    <div className="chart-parent">
                      {businessC &&
                        businessC.map((item, index) => {
                          return (
                            <div className="chart" key={index}>
                              <EchartTree container="echart" data={item} />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                {!_isEmpty(businessE) && (
                  <div className="">
                    <div className="title">
                      商业生态
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <p className="hover-box" style={{ left: "0.56rem" }}>
                        此IP已有的不同商业衍生生态开发
                      </p>
                    </div>
                    <div className="chart">
                      <EchartRadar container="echart" data={businessE} />
                    </div>
                  </div>
                )}

                {!_isEmpty(priceTrend.series) && (
                  <div className="">
                    <div className="title">
                      价格趋势
                      <img src={icon_doubt} alt="" className="icon_detail" />
                      <p className="hover-box" style={{ left: "0.56rem" }}>
                        此IP近期在市场上公布的合作价格
                      </p>
                    </div>
                    <div className="chart-small">
                      <EchartLines container="echart" data={priceTrend} />
                    </div>
                  </div>
                )}
                {/*  {
                  !_isEmpty(potentialValue.series) &&
                  <div className="">
                    <div className="title">潜力值
                      <img src={icon_doubt} alt="" className="icon_detail"/>
                      <p className="hover-box" style={{ left: '0.4rem' }}>
                        此IP下一步的发展潜力预判，百分制表示
                      </p>
                    </div>
                    <div className="chart-small">
                      <EchartBar container="echart" data={potentialValue}/>
                    </div>
                  </div>
                }*/}
              </div>
              {/*推荐指数*/}
              <div className={tabTitle === 5 ? "m-life-cycle show" : "hide"}>
                <table className="table-bordered text-left ">
                  <thead>
                    <tr>
                      <th>IP名称</th>
                      <th>版权所属</th>
                      <th>
                        <div className="u-hover  wb">
                          口碑
                          <img src={icon_doubt} alt="" />
                          <p className="hover-box" style={{ left: "0.7rem" }}>
                            综合各个评分网站用户对于此IP的评价分数加权计算给出的综合评价
                          </p>
                        </div>
                      </th>
                      <th>
                        <div className="u-hover  wb">
                          新闻舆情
                          <img src={icon_doubt} alt="" />
                          <p className="hover-box" style={{ left: "0.85rem" }}>
                            此IP在新闻报道中的评价，用“正面、中性、负面”来区分，百分制表示
                          </p>
                        </div>
                      </th>
                      <th>
                        <div className="u-hover  wb">
                          推荐指数
                          <img src={icon_doubt} alt="" />
                          <p className="hover-box" style={{ left: "0.85rem" }}>
                            IPEC平台综合家需求和此IP本身的条件之后给出的推荐挑选指数，用星星颗数表示
                          </p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendData &&
                      recommendData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="td-info">
                                <img
                                  src={item.picUrl}
                                  alt=""
                                  className="ip-pic"
                                />
                                <div className="td-info-detail">
                                  <p>{item.ipName}</p>
                                </div>
                              </div>
                            </td>
                            <td>{item.owner ? item.owner : "--"}</td>
                            <td>{item.publicPraise || "--"}</td>
                            <td>
                              <div className="td-info-detail">
                                {item.positionNewsRatio && (
                                  <p>正面舆情_{item.positionNewsRatio}</p>
                                )}
                                {item.negativeNewsRatio && (
                                  <p>负面舆情_{item.negativeNewsRatio}</p>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                {[1, 2, 3, 4, 5].map((i, k) => {
                                  return (
                                    <span
                                      key={k}
                                      className={`${
                                        k + 1 < Number(item.recommendIndex) + 1
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      &#9733;
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            {isShow && (
              <Alert
                message={message}
                onClose={() => {
                  this.setState({ isShow: false });
                }}
                onSubmit={() => {}}
              />
            )}
          </div>
          {this.state.showToast && (
            <Toast
              onClose={() => {
                this.setState({ showToast: false });
              }}
              duration={2}
              message={this.state.toastMsg}
            />
          )}
          <ScrollTop />
        </div>
      );
    } else {
      return (
        <div>
          <DiamondsExample
            userGuid={userGuid}
            history={history}
            type={"filter"}
          />
          {this.state.showToast && (
            <Toast
              onClose={() => {
                this.setState({ showToast: false });
              }}
              duration={2}
              message={this.state.toastMsg}
            />
          )}
        </div>
      );
    }
  }
}
