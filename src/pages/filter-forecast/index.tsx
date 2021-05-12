/**
 * IP筛选器数据- 筛选条件页面
 * author:Blance.xue
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import { Prompt } from "react-router";
import "@assets/scss/filter_forecast.scss";
import { Input, Select, message, DatePicker, Checkbox, Radio } from "antd";
import { toJS } from "mobx";
import Alert from "@components/alert";
import ForecastAlert from "@components/forecast_alert";
import _isEmpty from "lodash/isEmpty";
import default_img from "@assets/images/default/ic_default_shu.png";
import ic_warning from "@assets/images/user/ic_prompt.svg";
import ic_record from "@assets/images/forecast/ic_record.svg";
import history_data from "@assets/images/forecast/history_data.jpg";
import ic_load from "@assets/images/update/timg.gif";
import NoResult from "@components/no_result";
import ScrollTop from "@components/scroll-top";
import { sendUserBehavior } from "@utils/util";
import DiamondsExample from "@components/diamonds-example";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Reminder from "@assets/images/vip-card/reminder.png";
const { Option } = Select;

let isSave = false;

interface IFilterForecaseState {
  message: string;
  isShow: boolean;
  alertMessage: string;
  checkedList: Array<string>;
  disabled: boolean;
  modalVisible: boolean;
  location: any;
  isSave: boolean;
  showDeduction: boolean;
}

@inject("login", "filter_forecast", "forecast_detail")
@observer
export default class FilterForecast extends React.Component<
  IProps,
  IFilterForecaseState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: "",
      isShow: false,
      alertMessage: "",
      checkedList: [],
      disabled: false,
      modalVisible: false,
      location: null,
      isSave: false,
      showDeduction: false,
    };

    // this.props.filter_forecast.changeParams({
    //   clientDemandGuid: this.props.match.params['guid'],
    //   ipTypeSuperiorNumber: '1,9,10',
    // });
  }

  async componentDidMount() {
    document.title = "IP二厂- 分析数据筛选条件";
    const { login } = this.props;
    const { userGuid } = login.userInfo || { userGuid: "" };
    // if (!userGuid) {
    //   return false;
    // }
    // const contrastArr = [',3,', ',4,'];
    // const visibleContrastArr = !_isEmpty(login.userInfo) && contrastArr.some((e: string) => login.userInfo.userJurisdiction.indexOf(e) !== (-1));
    // if (!visibleContrastArr) {
    //   return false;
    // }
    const {
      filter_forecast,
      match: { params },
    } = this.props;
    filter_forecast.changeUserInfo(login.userInfo)

    await filter_forecast.getMainType();
    await filter_forecast.getIpType();

    await filter_forecast.changeParams({
      clientDemandGuid: params["guid"],
      ipTypeSuperiorNumber: "1,9,10",
    });

    addEventListener("scroll", this.scrollLoading);
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollLoading);
    isSave = false;
  }

  _throttle(fun, interval) {
    let timeout,
      startTime: any = new Date();
    return () => {
      clearTimeout(timeout);
      let curTime: any = new Date();
      if (curTime - startTime <= interval) {
        timeout = setTimeout(() => {
          fun();
        }, curTime - startTime);
      } else {
        startTime = curTime;
      }
    };
  }

  scrollLoading = () => {
    const { filter_forecast } = this.props;
    const {
      filterListParam: { currentPage },
      isLoading,
      seeMore,
    } = filter_forecast;
    let yScroll: number;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
      yScroll = document.documentElement.scrollTop;
    } else if (document.body) {
      yScroll = document.body.scrollTop;
    }
    if (
      yScroll + document.body.clientHeight >= document.body.scrollHeight &&
      !isLoading &&
      seeMore
    ) {
      filter_forecast.isLoading = true;
      this._throttle(
        filter_forecast.changeParams({ currentPage: currentPage + 1 }),
        3000
      );
    }
  };

  // 类型选中状态
  isAllFalse(arr) {
    arr = toJS(arr);
    let result = true;
    for (let val in arr) {
      if (arr.hasOwnProperty(val)) {
        if (arr[val]) result = false;
      }
    }
    return result;
  }

  showModalSave = (location) => {
    this.setState({ modalVisible: true, location });
  };
  cancel = () => {
    this.setState({ modalVisible: false, location: "" });
  };

  closeModalSave = () => {
    const { location } = this.state;
    const { history } = this.props;
    isSave = true;
    history.push({ pathname: `${location.pathname}` });
    this.setState({ modalVisible: false });
  };
  handlePrompt = (location) => {
    if (
      location.pathname.indexOf("forecast-data") !== -1 ||
      location.pathname.indexOf("forecast-detail") !== -1
    ) {
      return true;
    } else {
      if (!isSave) {
        this.showModalSave(location);
        return false;
      }
      return true;
    }
  };
  handleSave = () => {
    const { location } = this.state;
    const { history } = this.props;
    isSave = true;
    history.push(`/add-forecast`);
    this.setState({ modalVisible: false });
  };

  sureDeduction() {
    const { filter_forecast } = this.props;
    let { ipidArr } = filter_forecast;
    let ipids = escape(ipidArr.join(","));
    // 埋点
    sendUserBehavior({
      pageName: filter_forecast.selected,
      pageUrl: `/forecast-detail/${ipids}`,
      type: 10,
      remark: ipidArr.join(","),
    });

    filter_forecast.selected = "卡通动漫";
    filter_forecast.clearIpData();
    filter_forecast.selectedChild = {
      nav: "",
      nav_number: "",
    };
    this.props.history.push(`/new-forecast-detail/${ipids}`);
  }

  render() {
    const { filter_forecast, forecast_detail, login } = this.props;
    const {
      head_list_top,
      selected,
      filterData,
      isLoading,
      seeMore,
      noMore,
      filterListParam: { sex },
      secondType,
      selectedChild,
      hotWords,
    } = filter_forecast;
    const { typeSecond_top, subTypeList_top } = head_list_top;
    const { isShow, message } = this.state;
    // 一级类型下若有二级类型：类别展示
    const secondType_much = subTypeList_top && subTypeList_top[selected];
    // 类别
    let categoryList = [];
    // console.log(selected, toJS(secondType), secondType[selected]);
    // 类型
    if (selectedChild.nav) {
      secondType &&
        secondType.forEach((item) => {
          if (item.ipType === selectedChild.nav) {
            return (categoryList = item.sublist[0].sublist);
          }
        });
    }
    let _tmp: Array<string>;
    let { ipidArr } = filter_forecast;

    const { modalVisible, location } = this.state;
    const { userGuid } = login.userInfo || { userGuid: "" };

    const contrastArr = [",3,", ",4,"];
    const visibleContrastArr =
      !_isEmpty(login.userInfo) &&
      contrastArr.some(
        (e: string) => login.userInfo.userJurisdiction.indexOf(e) !== -1
      );
    // if (visibleContrastArr) {
    return (
      <div className="main-container">
        {/* <Prompt message={this.handlePrompt} />
        {modalVisible && (
          <ForecastAlert
            message="是否保留筛选记录？"
            onClose={this.closeModalSave}
            onSubmit={this.handleSave}
            onCancel={this.cancel}
          />
        )} */}

        <div className="filter-forecast">
          <div className="select-bar-area flex-row align-items-center justify-content-start">
            <div className="select-bar">
              {/* 十大类型*/}
              <div className="select-bar-head flex-row">
                {typeSecond_top &&
                  typeSecond_top.map((item, index) => {
                    return (
                      <span
                        key={item.ipTypeNumber + index}
                        className={
                          selected === `${item.ipType}` ? "span-active" : ""
                        }
                        onClick={async () => {
                          // if (selected === item.ipType) return;
                          filter_forecast.selected = item.ipType; // 选中类型
                          filter_forecast.clearIpData();
                          ipidArr = [];

                          _tmp = [];
                          let ipTypeSuperiorNumber,
                            nav,
                            arr = [],
                            navArr = [];
                          ([] && subTypeList_top[item.ipType]).map(
                            (item, index) => {
                              arr.push(item.ipTypeNumber);
                              index <= 0 ? (nav = item.ipType) : (nav = "");
                            }
                          );
                          ipTypeSuperiorNumber =
                            arr.length > 1 ? arr.join(",") : arr[0]; // 二级类型id
                          // nav = navArr.length > 1 ? navArr.join(',') : ''; // 二级类型名
                          filter_forecast.changeSelectedChild({
                            nav,
                            nav_number: ipTypeSuperiorNumber,
                          });
                          filter_forecast.selectedAll = ipTypeSuperiorNumber;
                          // console.log("IP类别:", ipTypeSuperiorNumber);
                          localStorage.setItem(
                            "ipTypeNumber",
                            ipTypeSuperiorNumber
                          );
                          await filter_forecast.changeParams({
                            ipTypeSuperiorNumber,
                            currentPage: 1,
                            ageMax: "",
                            ageMin: "",
                            fansMax: "",
                            fansMin: "",
                            fansSuffix: "",
                            labels: "",
                            profession: "",
                            sex: "",
                          });
                        }}
                      >
                        {item.ipType}
                      </span>
                    );
                  })}
              </div>
              {/*具体筛选条件*/}

              {
                <div className="m-filters">
                  {/* 一级类型下若有二级类型：类别展示*/}
                  {secondType_much && secondType_much.length > 1 && (
                    <div className="sex  ">
                      <span className="name">类</span>
                      <i>别:</i>
                      <span
                        className={
                          selectedChild.nav === "" ? "span-active" : ""
                        }
                        onClick={async () => {
                          if (selectedChild.nav === "") return;
                          filter_forecast.clearIpTypeData();
                          _tmp = [];

                          filter_forecast.changeSelectedChild({
                            nav: "",
                            // nav_number: `${selectedChild.nav_number}`
                            nav_number: filter_forecast.selectedAll,
                          });

                          filter_forecast.clearHotKeywords();
                          await filter_forecast.changeParams({
                            // ipTypeSuperiorNumber: `${selectedChild.nav_number}`,
                            ipTypeSuperiorNumber: filter_forecast.selectedAll,
                            profession: "",
                            currentPage: 1,
                          });
                        }}
                      >
                        全部
                      </span>
                      {secondType_much &&
                        secondType_much.map((item, index) => {
                          let active =
                            item.ipType === selectedChild.nav
                              ? "span-active"
                              : "";
                          return (
                            <span
                              key={index}
                              className={`${active}`}
                              onClick={async () => {
                                if (active) return;
                                filter_forecast.clearIpTypeData();

                                filter_forecast.changeSelectedChild({
                                  nav: item.ipType,
                                  nav_number: item.ipTypeNumber,
                                });

                                filter_forecast.clearHotKeywords();

                                await filter_forecast.changeParams({
                                  ipTypeSuperiorNumber: item.ipTypeNumber,
                                  currentPage: 1,
                                });
                              }}
                            >
                              {item.ipType}
                            </span>
                          );
                        })}
                    </div>
                  )}

                  {selected === "名人明星" && (
                    <div className="sex">
                      <span className="name">性</span>
                      <i>别:</i>
                      <span
                        className={sex === "" ? "span-active" : ""}
                        onClick={async () => {
                          if (sex === "") return;
                          filter_forecast.clearIpTypeData();
                          await filter_forecast.changeParams({
                            sex: "",
                            currentPage: 1,
                          });
                        }}
                      >
                        不限
                      </span>
                      <span
                        className={sex === "240" ? "span-active" : ""}
                        onClick={async () => {
                          if (sex === "240") return;
                          filter_forecast.clearIpTypeData();
                          await filter_forecast.changeParams({
                            sex: "240",
                            currentPage: 1,
                          });
                        }}
                      >
                        男
                      </span>
                      <span
                        className={sex === "241" ? "span-active" : ""}
                        onClick={async () => {
                          if (sex === "241") return;
                          filter_forecast.clearIpTypeData();
                          await filter_forecast.changeParams({
                            sex: "241",
                            currentPage: 1,
                          });
                        }}
                      >
                        女
                      </span>
                      <span
                        className={sex === "242" ? "span-active" : ""}
                        onClick={async () => {
                          if (sex === "242") return;
                          filter_forecast.clearIpTypeData();
                          await filter_forecast.changeParams({
                            sex: "242",
                            currentPage: 1,
                          });
                        }}
                      >
                        组合
                      </span>
                    </div>
                  )}
                  {selectedChild.nav && (
                    <div className="job justify-content-start">
                      <div className="left">
                        <span className="name">类</span>
                        <i>型:</i>
                      </div>
                      <div className="right">
                        <span
                          className={`${
                            _isEmpty(filter_forecast.selectedTypes)
                              ? "span-active"
                              : ""
                          }`}
                          onClick={async () => {
                            if (_isEmpty(filter_forecast.selectedTypes)) return;
                            filter_forecast.clearIpTypeData();
                            await filter_forecast.changeParams({
                              profession: "",
                              currentPage: 1,
                            });
                          }}
                        >
                          全部
                        </span>
                        {categoryList &&
                          categoryList.map((item, k) => {
                            let active: string, type, choose;
                            const tmp = filter_forecast.selectedTypes;
                            _tmp = Object.keys(tmp);
                            choose = !filter_forecast.selectedTypes[
                              item.ipType
                            ];
                            active = tmp[item.ipType] ? "span-active" : "";

                            return (
                              <span
                                key={k}
                                className={`${active} `}
                                onClick={async () => {
                                  filter_forecast.filterData = [];

                                  filter_forecast.selectedTypes = {
                                    ...filter_forecast.selectedTypes,
                                    // [item.ipType]: true, // 不可取消
                                    [item.ipType]: choose,
                                  };

                                  if (choose) {
                                    type = !!filter_forecast.filterListParam
                                      .profession
                                      ? `${filter_forecast.filterListParam.profession},${item.ipType}`
                                      : `,${item.ipType}`;
                                  } else {
                                    type = filter_forecast.filterListParam.profession.replace(
                                      `${item.ipType}`,
                                      ""
                                    );

                                    if (type === "") {
                                      filter_forecast.selectedTypes = {};
                                    }
                                  }
                                  // console.log(toJS(filter_forecast.selectedTypes));

                                  // TODO 以下代码不可删除
                                  // _tmp = Object.keys(filter_forecast.selectedTypes);
                                  // let profession = (_tmp.join(',')).replace(/^,+/, "").replace(/,+$/, "");

                                  await filter_forecast.changeParams({
                                    profession: type
                                      .replace(/^,+/, "")
                                      .replace(/,+$/, ""),
                                    currentPage: 1,
                                  });
                                }}
                              >
                                {item.ipType}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {selected === "名人明星" && (
                    <div className="age">
                      <span className="name">年</span>
                      <i>龄:</i>
                      <div className="min">
                        <input
                          type="text"
                          placeholder="最小年龄"
                          onBlur={(e) => {
                            filter_forecast.changeParams({
                              ageMin: e.target.value,
                              currentPage: 1,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              filter_forecast.changeParams({
                                ageMin: e.currentTarget.value,
                                currentPage: 1,
                              });
                            }
                          }}
                        />
                      </div>
                      <span className="line"> - </span>
                      <div className="max">
                        <input
                          type="text"
                          placeholder="最大年龄"
                          onBlur={(e) => {
                            filter_forecast.changeParams({
                              ageMax: e.target.value,
                              currentPage: 1,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              filter_forecast.changeParams({
                                ageMax: e.currentTarget.value,
                                currentPage: 1,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {typeSecond_top &&
                    typeSecond_top.map((item, index) => {
                      if (filter_forecast.selected === item.ipType) {
                        return (
                          <div className="blog" key={index}>
                            <span className="name">微博粉丝量:</span>
                            <div className="min">
                              <input
                                type="text"
                                placeholder="最少粉丝量"
                                onBlur={(e) => {
                                  filter_forecast.changeParams({
                                    fansMin: e.target.value,
                                    currentPage: 1,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    filter_forecast.changeParams({
                                      fansMin: e.currentTarget.value,
                                      currentPage: 1,
                                    });
                                  }
                                }}
                              />
                            </div>
                            <span className="line">-</span>
                            <div className="max">
                              <input
                                type="text"
                                placeholder="最大粉丝量"
                                onBlur={(e) => {
                                  filter_forecast.changeParams({
                                    fansMax: e.target.value,
                                    currentPage: 1,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    filter_forecast.changeParams({
                                      fansMax: e.currentTarget.value,
                                      currentPage: 1,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}

                  {typeSecond_top &&
                    typeSecond_top.map((item, index) => {
                      if (filter_forecast.selected === item.ipType) {
                        return (
                          <div className="ip-name" key={index}>
                            <span className="name">IP名</span>
                            <i>称:</i>
                            <input
                              type="text"
                              placeholder="请输入IP名称"
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  filter_forecast.changeParams({
                                    ipName: e.currentTarget.value,
                                    currentPage: 1,
                                  });
                                }
                              }}
                              onBlur={(e) => {
                                filter_forecast.changeParams({
                                  ipName: e.currentTarget.value,
                                  currentPage: 1,
                                });
                              }}
                            />
                          </div>
                        );
                      }
                    })}
                  {typeSecond_top &&
                    typeSecond_top.map((item, index) => {
                      if (filter_forecast.selected === item.ipType) {
                        return (
                          <div className="keywords" key={index}>
                            <span className="name">特征关键词:</span>
                            <input
                              type="text"
                              placeholder="请输入特征关键词，如有多个，请以；分割"
                              onKeyDown={(e) => {
                                if (_isEmpty(e.currentTarget.value)) {
                                  filter_forecast.changeParams({ labels: "" });
                                } else {
                                  let labels =
                                    filter_forecast.filterListParam.labels;
                                  let keyWords = filter_forecast.labels;
                                  // console.log(labels, keyWords);
                                  if (e.keyCode === 13) {
                                    filter_forecast.changeParams({
                                      labels:
                                        e.currentTarget.value.replace(
                                          /；/,
                                          ","
                                        ) +
                                        "," +
                                        labels,
                                    });
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                if (_isEmpty(e.currentTarget.value)) {
                                  filter_forecast.changeParams({ labels: "" });
                                } else {
                                  let labels =
                                    filter_forecast.filterListParam.labels;
                                  filter_forecast.changeParams({
                                    labels:
                                      e.currentTarget.value.replace(/；/, ",") +
                                      "," +
                                      labels,
                                  });
                                }
                              }}
                            />
                          </div>
                        );
                      }
                    })}

                  {/*  热门关键词*/}
                  {!_isEmpty(hotWords) && (
                    <div className="hot-words justify-content-start">
                      <div className="left">
                        <span className="name">热门关键词：</span>
                      </div>
                      <div className="right">
                        {hotWords &&
                          hotWords.map((item, k) => {
                            let active: string, choose, labels;
                            const tmp = filter_forecast.selectedKeyWords;
                            choose = !filter_forecast.selectedKeyWords[item];
                            active = tmp[item] ? "span-active" : "";
                            return (
                              <span
                                key={k}
                                className={`${active} `}
                                onClick={async () => {
                                  filter_forecast.filterData = [];
                                  filter_forecast.changeHotKeywords({
                                    [item]: choose,
                                  });

                                  const tmp = filter_forecast.selectedKeyWords;
                                  _tmp = Object.keys(tmp);
                                  labels = _tmp
                                    .join(",")
                                    .replace(/^,+/, "")
                                    .replace(/,+$/, "");
                                  if (choose) {
                                    labels = !!filter_forecast.filterListParam
                                      .labels
                                      ? `${filter_forecast.filterListParam.labels},${item}`
                                      : `,${item}`;
                                  } else {
                                    labels = filter_forecast.filterListParam.labels.replace(
                                      `,${item}`,
                                      ""
                                    );

                                    filter_forecast.changeHotKeywords({
                                      labels,
                                    });
                                    // console.log(labels);
                                  }

                                  await filter_forecast.changeParams({
                                    labels,
                                    currentPage: 1,
                                  });
                                }}
                              >
                                {item}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {/*  热门关键词*/}
                </div>
              }
            </div>
          </div>

          <div className="g-ip-content">
            {!_isEmpty(filterData) && (
              <div className="m-top justify-content-between align-items-start text-center">
                <p className="align-items-center">
                  <img src={ic_warning} alt="" />
                  根据项目设置的受众群体、微博粉丝量及特征关键词，用户可至多选择十五个IP，查看分析数据结果
                </p>
                <div>
                  <div
                    className="u-btn"
                    onClick={async () => {
                      if (ipidArr.length === 0) {
                        this.setState({
                          isShow: true,
                          message: "请先选择您要查看的IP",
                        });
                      } else if (ipidArr.length < 2) {
                        this.setState({
                          isShow: true,
                          message: "至少选择两个ip数据",
                        });
                      } else {
                        let ipids = escape(ipidArr.join(","));
                        const {
                          data,
                        } = await filter_forecast.getIsDeduction({
                          type: 4,
                          ipids
                        });
                        switch (data) {
                          case 0:
                          case 1:
                            this.sureDeduction();
                            break;
                          case 2:
                            this.setState({showDeduction: true});
                            break;
                          default:
                          break;
                        }
                      }
                    }}
                  >
                    <img src={ic_record} alt="" />
                    查看分析数据
                  </div>
                  <div
                    className="u-btn"
                    onClick={() => this.props.history.push("/forecast-data")}
                  >
                    <img src={history_data} alt="" />
                    历史筛选数据
                  </div>
                </div>
              </div>
            )}
            <div className="m-content flex-row flex-wrap align-items-center">
              {filterData &&
                filterData.map((i) => {
                  return (
                    <div className="ip" key={i.ipid}>
                      <div
                        className={`img ${
                          filter_forecast.ipidsObj[i.ipName] ? "checked" : ""
                        }`}
                      >
                        <img
                          src={i.picUrl || default_img}
                          alt=""
                          onClick={() => {
                            window.open(
                              `#/detail/${i.ipTypeSuperiorNumber}/${i.ipid}`
                            );
                          }}
                        />
                        <div
                          className={` ip-bottom justify-content-between align-items-center `}
                        >
                          <label
                            htmlFor={i.ipid}
                            className="name word-ellipsis"
                          >
                            {i.ipName}
                          </label>
                          <input
                            type="checkbox"
                            value={i.ipName}
                            id={i.ipid}
                            onChange={(e) => {
                              const idx = ipidArr.indexOf(i.ipid + "");
                              if (ipidArr.length < 15) {
                                if (idx > -1) {
                                  filter_forecast.setIpArr(
                                    ipidArr.filter((v) => v !== i.ipid + "")
                                  );
                                  e.currentTarget.checked = false;
                                } else {
                                  filter_forecast.setIpArr(
                                    ipidArr.concat([i.ipid + ""])
                                  );
                                  e.currentTarget.checked = true;
                                }
                              } else {
                                filter_forecast.setIpArr(
                                  ipidArr.filter((v) => v !== i.ipid + "")
                                );
                                e.currentTarget.checked = false;

                                // 超过15条的ip
                                if (idx === -1) {
                                  this.setState({
                                    disabled: true,
                                    isShow: true,
                                    message: "最多一次可查看15个IP的数据趋势",
                                  });
                                }
                              }
                              filter_forecast.ipidsObj = {
                                ...filter_forecast.ipidsObj,
                                [i.ipName]: e.currentTarget.checked,
                              };
                              forecast_detail.setIpids(ipidArr.join(","));
                            }}
                          />
                        </div>
                      </div>
                      <div className="name word-ellipsis" title={i.ipName}>
                        {i.ipName}
                      </div>
                    </div>
                  );
                })}
              {seeMore && !isLoading && !noMore && (
                <div className="loading-more">下拉查看更多</div>
              )}
              {noMore && !isLoading && (
                <p className="is-no-result">
                  <span>没有更多内容</span>
                </p>
              )}
              {isLoading && (
                <div className="loading-more">
                  <img src={ic_load} alt="" />
                </div>
              )}
              {_isEmpty(filterData) && !isLoading && <NoResult />}
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
          {this.state.showDeduction && (
            <div className="show-deduction">
              <div className="area">
                <div className="clear">
                  <img
                    src={Ic_clear}
                    onClick={() => {
                      this.setState({ showDeduction: false });
                      localStorage.removeItem("curIndex");
                    }}
                    alt=""
                  />
                </div>
                <div className="content">
                  <img src={Reminder} alt="" />
                  <div className="msg">扣费提醒</div>
                  <div className="tip">
                    该数据属于会员权限数据，本次查看将从您的vip储值卡中扣除300元
                    是否继续查看？
                  </div>
                </div>
                <div className="btn-group">
                  <div
                    className="btn_default_fl"
                    onClick={() => {
                      this.setState({ showDeduction: false });
                      localStorage.removeItem("curIndex");
                    }}
                  >
                    取消
                  </div>
                  <div
                    className="btn_primary_fl"
                    onClick={() => {
                      this.sureDeduction();
                    }}
                  >
                    确认查看
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <ScrollTop />
      </div>
    );
  }
  // else {
  //   return (
  //     <div>
  //       <DiamondsExample userGuid={userGuid} history={history} type={'filter'}/>
  //     </div>
  //   );
  // }

  // }
}
