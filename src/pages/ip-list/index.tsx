import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/ip_list.scss";
import { IpListItem, IpTypeList } from "@pages/ip-list/components";
import { toJS } from 'mobx';
import ScrollTop from "@components/scroll-top";
import { deletContact, sendUserBehavior } from "@utils/util";
import moment from "moment";
import { DatePicker } from 'antd';

const { MonthPicker } = DatePicker;
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const type_k_v = {
  "地区": "ipLocation",
  "类型": "ipTypeNumber",
  "性别": "ipSex",
  "状态": "ipStatus",
  "形式": "ipFormNumber",
};

const time_k_v = {

  "全部": () => {
    return {
      benginShowDate: '',
      endShowDate: '',
    };
  },
  "当年": () => {
    let now = moment();
    let format = "YYYY-MM-DD";
    return {
      benginShowDate: now.startOf("year").format(format),
      endShowDate: now.endOf("year").format(format),
    };
  },
  "当月": () => {
    let now = moment();
    let format = "YYYY-MM-DD";
    return {
      benginShowDate: now.startOf("month").format(format),
      endShowDate: now.endOf("month").format(format),
    };
  },
};

interface IListState {
  contastList: object;
  clear: boolean;
  all: Boolean;
  topTypeSuperiorNumber: boolean;
  allIpTypeSuperiorNumbers: any;
  beginDate: any;
  endDate: any;
  fullYearList: any;
  itemIpType: any;
}

@inject("ip_list")
@observer
export default class IpList extends React.Component<IProps, IListState> {

  constructor(props: any) {
    super(props);
    this.state = {
      clear: false,
      itemIpType: '',
      fullYearList: [], // 记录娱乐影音部分的日期年份
      topTypeSuperiorNumber: false,
      allIpTypeSuperiorNumbers: '',
      contastList: JSON.parse(localStorage.getItem('contastList')) === null ? [] : JSON.parse(localStorage.getItem('contastList')),
      beginDate: null,
      endDate: null,
      all: false,
    };
  }

  private timeCallback = async (o?: any) => {
    if (o) {
      const { date = "" } = o;
      const benginShowDate = moment(date).startOf("month").format("YYYY-MM-DD");
      await this.props.ip_list.changeStatus({ benginShowDate });
    }
  };

  private timeCallbackT = async (o?: any) => {
    if (o) {
      const { date = "" } = o;
      const endShowDate = moment(date).endOf("month").format("YYYY-MM-DD");
      await this.props.ip_list.changeStatus({ endShowDate });
    }
  };

  async _checkedType(item) {
    const { ip_list } = this.props;
    const { customStatus, selectedchild } = ip_list;
    const { nav_number } = selectedchild;
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        item[key] === customStatus[key] ? item[key] = null : '';
        if (key === 'ipTypeSuperiorNumbers' && item[key] === null) {
          item[key] = nav_number;
        }
      }
    }
    await ip_list.clearIpTypeListData();
    await ip_list.changeStatus(item);
  }

  filterParam = (el) => {
    if (this.state[el] === null) {
      return null;
    }
    return moment(this.state[el], 'YYYY-MM');
  };

  /**
   * 切换子类的方法
   *  sub sub {ipType: "治愈",ipTypeGuid: "6s4f4292-6a96-4264-aacf-6e5afe1a91b2",ipTypeNumber: 23}
   *  item {ipType: "类型",ipTypeGuid: "fd3f429c-7a96-42fd-aacf-2e5afe1a81be",ipTypeNumber: 21,sublist:object
   */
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

  /**
   *
   */
  async _selectSubType(sub, item) {
    const { ip_list } = this.props;
    let { selectSubList: { selectedObj, theAllId } } = ip_list;
    let params: {};
    if (typeof selectedObj[item.ipType] === "object") {
      let choose = !(selectedObj[item.ipType][sub.ipTypeNumber]);
      if (sub.ipType === "全部") {
        selectedObj = {
          ...selectedObj,
          [item.ipType]: { [sub.ipTypeNumber]: choose, }
        };
        theAllId = sub.ipTypeNumber;
      } else {
        selectedObj = {
          ...selectedObj,
          [item.ipType]: {
            ...selectedObj[item.ipType],
            [theAllId]: false,
            [sub.ipTypeNumber]: choose,
          },
        };
    console.log(selectedObj)

      }
      if (!!sub.ipTypeNumber) {
        if (choose) {
          let type = !!ip_list.customStatus.ipTypeNumber ?
            `${ip_list.customStatus.ipTypeNumber},${sub.ipTypeNumber}` :
            `,${sub.ipTypeNumber}`;
          // 选中全部的时候，清空数据
          if (sub.ipType === "全部") {
            params = { [type_k_v[item.ipType]]: '', currentPage: 1 };
          } else {
            params = { [type_k_v[item.ipType]]: type, currentPage: 1 };
          }
          // console.log(params);
        } else {
          let type = ip_list.customStatus.ipTypeNumber.replace(`,${sub.ipTypeNumber}`, "");
          params = { [type_k_v[item.ipType]]: type, currentPage: 1 };
          console.log(params);
        }
      } else {
        params = { [type_k_v[item.ipType]]: "", currentPage: 1 };
      }
    } else {
      if (item.ipType === "时间") {
        let current = time_k_v[sub.ipType]();
        params = { ...current, currentPage: 1 };
        if (sub.ipType === "全部" || sub.ipType === "当年" || sub.ipType === "当月") {
          await this.timeCallbackT();
          await this.timeCallback();
          this.setState({ clear: !this.state.clear });
        }
      } else {
        params = { [type_k_v[item.ipType]]: (!!sub.ipTypeNumber ? sub.ipTypeNumber : ""), currentPage: 1 };
      }
      selectedObj = {
        ...selectedObj, [item.ipType]: sub.ipTypeNumber
      };
    }
    await ip_list.setSelectSub({ selectedObj, theAllId });
    await ip_list.changeStatus(params);
  }

  async componentDidUpdate() {
    const { backRoute, isInRoute } = this.props.ip_list;
    if (backRoute && isInRoute) {
      window.location.reload();
    }
  }

  async componentDidMount() {
    let { fullYearList } = this.state;
    fullYearList.push(this.getFullYear('+1'));
    fullYearList.push(this.getFullYear(''));
    fullYearList.push(this.getFullYear('-1'));
    this.setState({
      fullYearList
    });
    if (JSON.parse(localStorage.getItem('contastList')) === null) {
      localStorage.setItem("contastList", JSON.stringify([]));
    }
    document.title = "IP二厂-IP列表";
    const { ip_list } = this.props;
    await ip_list.ipTypeList();
    await ip_list.ipList();
    await ip_list.getlistMainType();
  }

  getFullYear(str: string) {
    let date = new Date();
    return date.getFullYear() + Number(str);
  }

  private deletContast = (ipids) => {
    deletContact(ipids);
    this.setState({ contastList: JSON.parse(localStorage.getItem('contastList')) });
  };

  private callbackcontastList = (contastList) => {
    this.setState({ contastList });
  };

// 埋点函数
  async getUserBehavior(pageName, pageUrl, type, remark) {
    const params = {
      pageName,
      pageUrl,
      type,
      remark
    };
    await sendUserBehavior(params);
  }

  render() {
    const { ip_list } = this.props;
    let { customStatus, head_list, head_list_top, selectedchild, listCountry, ipItemList, ipTypeListData, page: { totalCount }, isInRoute } = ip_list;
    const { subTypeList } = head_list;
    const { subTypeList_top, typeSecond_top } = head_list_top;
    const { selected } = customStatus;
    const { nav, country, case_, slectTime } = selectedchild;
    const subType_top = subTypeList_top && subTypeList_top[selected];
    const subType_child = subTypeList && subTypeList[nav];
    return (
      <div className="ip-list-container flex-column">
        <div className="select-bar-area flex-row align-items-center justify-content-start">
          <div className="select-bar">
            <div className="select-bar-head flex-row">
              {typeSecond_top && typeSecond_top.map((item, index) => {
                return (
                  <span
                    key={item.ipTypeNumber + index}
                    className={selected === `${item.ipType}` ? "span-active" : ""}
                    onClick={async () => {
                      if (!isInRoute) await ip_list.setInRout();
                      // 每次点击大类的时候都要清空现有加载数据
                      await ip_list.clearIpTypeListData();
                      await ip_list.setselected({ nav: '', case_: '', country: '', });
                      await ip_list.setSelectSub({
                        selectedObj: {
                          "地区": "", "类型": {}, "时间": "",
                          "状态": "", "形式": "", "性别": "",
                        }, theAllId: "",
                      });
                      // 判断当前大类下边多少子类 如果只有一个子类，不显示类别，
                      let _ipTypeSuperiorNumbers = '',
                        _ipType = '';
                      subTypeList_top && subTypeList_top[item.ipType] && subTypeList_top[item.ipType].map((item: any, index) => {
                        _ipTypeSuperiorNumbers += `${item.ipTypeNumber},`; // ?
                        index <= 0 ? _ipType = item.ipType : _ipType = '';
                      });
                      if (subTypeList_top[item.ipType] === null) {
                        this.setState({
                          topTypeSuperiorNumber: true
                        });
                      } else {
                        this.setState({
                          topTypeSuperiorNumber: false
                        });
                      }
                      // 重置loading
                      await ip_list.setselected({ nav: _ipType, show: _ipType, nav_number: _ipTypeSuperiorNumbers });
                      // 设置ipTypeSuperiorNumbers 用于记录类别切换到全部时 所需要到ipTypeSuperiorNumbers
                      this.setState({
                        allIpTypeSuperiorNumbers: _ipTypeSuperiorNumbers,
                      });
                      // 记录当前筛选后的信息
                      await ip_list.changeStatus(
                        {
                          selected: item.ipType,
                          ipTypeSuperiorNumbers: _ipTypeSuperiorNumbers,
                          ipTypeNumber: "",
                          ipFormNumber: "", benginShowDate: "", endShowDate: "",
                          ipStatus: "", ipSex: "", countryType: "",
                          ipIsAuthenticated: null,
                          currentPage: 1,
                          pageSize: 24,
                        });
                      await this.getUserBehavior(item.ipType, '/ip-list', 4, '');
                    }}>
                    {item.ipType}</span>);
              })}
            </div>
            {
              !!selected && (
                <div className="select-bar-operation">
                  <div className="operation-type flex-fill">
                    <div className="classify-type-item">状态:</div>
                    <div className="sub-type-item flex-row flex-wrap align-items-center">
                      <span className={case_ === '' ? "ip-category-item span-selected" : "ip-category-item"}
                            onClick={async () => {
                              if (case_ === '') return;
                              await ip_list.setselected({ case_: '', show: ip_list.getSubType(subTypeList_top) });
                              await this._checkedType({ ipIsAuthenticated: null });
                            }}>全部</span>
                      <span className={case_ === 3 ? "ip-category-item span-selected" : "ip-category-item "}
                            onClick={async () => {
                              if (case_ === 3) return;
                              await ip_list.setselected({ case_: 3, show: ip_list.getSubType(subTypeList_top) });
                              await this._checkedType({ ipIsAuthenticated: 3 });
                            }}>已认证</span>
                      <span className={case_ === 1 ? "ip-category-item span-selected" : "ip-category-item "}
                            onClick={async () => {
                              if (case_ === 1) return;
                              await ip_list.setselected({ case_: 1, show: ip_list.getSubType(subTypeList_top) });
                              await this._checkedType({ ipIsAuthenticated: 1 });
                            }}>未认证</span>
                    </div>
                  </div>
                  <div className="operation-type flex-fill">
                    <span>{selectedchild.show}</span>
                    {subType_top && selectedchild.show && <div className="classify-type-item">类别:</div>}
                    {selectedchild.show && <div className="sub-type-item flex-row flex-wrap align-items-center">
                      {/* 全部按钮 */}
                      <span className={selectedchild.nav === '' ? "ip-category-item span-selected" : "ip-category-item"}
                            onClick={async () => {
                              if (selectedchild.nav === '') {
                                return;
                              }
                              await ip_list.clearIpTypeListData();
                              await ip_list.setselected({ nav: '', show: '', });
                              await this._checkedType({
                                ipTypeSuperiorNumbers: this.state.allIpTypeSuperiorNumbers,
                                ipTypeNumber: '',
                                ipFormNumber: '',
                                benginShowDate: '',
                                endShowDate: '',
                                ipStatus: '',
                              });
                            }}>全部</span>
                      {/* 其余按钮 */}
                      {!!subType_top && subType_top.map((item: any, index) => {
                        let active = item.ipType === selectedchild.nav ? "span-selected" : "";
                        return (
                          <span
                            key={item.ipTypeGuid + index}
                            className={`ip-category-item  ${active}`}
                            onClick={async () => {
                              if (item.ipType === selectedchild.nav) {
                                return;
                              }
                              await ip_list.clearIpTypeListData();
                              await ip_list.setselected({ nav: item.ipType, show: '', nav_number: '' , form: '' });
                              ip_list.selectSubList.selectedObj['类型'] = {};
                              ip_list.selectSubList.selectedObj['形式'] = '';
                              await this._checkedType({
                                ipTypeSuperiorNumbers: `${item.ipTypeNumber},`,
                                ipFormNumber: '',
                                ipTypeNumber: '',
                                benginShowDate: '',
                                endShowDate: '',
                                ipStatus: '',
                              });
                            }}>
                            {item.ipType}
                              </span>
                        );
                      })
                      }
                    </div>
                    }

                  </div>
                  {
                    !!selectedchild.nav && (
                      <div>
                        {!!subType_child && subType_child.map((item: any, index) => {
                          const { sublist, ipTypeGuid }: { sublist: any[], ipTypeGuid: string } = item;
                          return (
                            <div key={ipTypeGuid + index} className="operation-type flex-fill">
                              {/* 选择类别后 该子类下边的性别 类型等 */}
                              <div className="classify-type-item">{item.ipType}:</div>
                              <div className="sub-type-item flex-row flex-wrap align-items-center">
                                {!!sublist && sublist.map((sub) => {
                                  const tmp = ip_list.selectSubList.selectedObj[item.ipType];
                                  let _tmp = Object.keys(tmp);
                                  let active: string;
                                  if (typeof tmp === "number" && !!tmp) {
                                    active = tmp === sub.ipTypeNumber ? "span-selected" : "";
                                  } else if (sub.ipType === "全部" && (_tmp.length === 0 || this.isAllFalse(tmp))) {
                                    active = "span-selected";
                                  } else {
                                    active = tmp[sub.ipTypeNumber] ? "span-selected" : "";
                                  }
                                  // console.log(tmp, _tmp);
                                  return (
                                    <span
                                      key={sub.ipTypeGuid}
                                      className={`ip-category-item ${active} `}
                                      onClick={async () => {
                                        if (active && item.ipType !== '类型') return;
                                        await ip_list.setloadingType(true);
                                        await ip_list.clearIpTypeListData();
                                        await this._selectSubType(sub, item);
                                      }
                                      }>
                                      {sub.ipType}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                        }
                      </div>
                    )
                  }
                  <div className="operation-type flex-fill">
                    {listCountry && listCountry.lenght !== 0 && <div className="classify-type-item">国别:</div>}
                    <div className="sub-type-item flex-row flex-wrap align-items-center">
                        <span className={country === '' ? "ip-category-item span-selected" : "ip-category-item"}
                              onClick={async () => {
                                if (country === '') return;
                                await ip_list.setselected({ country: '', show: ip_list.selectedchild.show });
                                await this._checkedType({ countryType: '' });
                              }}>全部</span>
                      {!!listCountry && listCountry.map((item: any, index) => {
                        let active = country === item.resourceValue ? "span-selected" : "";
                        return (
                          <span
                            key={item.createUserGuid + index}
                            className={`ip-category-item ${active} `}
                            onClick={async () => {
                              if (active) return;
                              await ip_list.setselected({
                                country: item.resourceValue,
                                show: ip_list.selectedchild.show
                              });
                              await this._checkedType({ countryType: '' + item.resourceKey });
                            }}>
                            {item.resourceValue}
                          </span>
                        );
                      })
                      }
                    </div>
                  </div>
                  {
                    selected && selected === '影视娱乐' && <div className="operation-type flex-fill">
                      <div className="classify-type-item">时间:</div>
                      <div className="sub-type-item flex-row flex-wrap align-items-center">
                        <span className={slectTime === 'all' ? "ip-category-item span-selected" : "ip-category-item "}
                              onClick={
                                async () => {
                                  if (slectTime === 'all') return;
                                  this.setState({
                                    endDate: null,
                                    beginDate: null,
                                  });
                                  await ip_list.setselected({ slectTime: 'all', show: ip_list.selectedchild.show });
                                  await this._checkedType({ benginShowDate: '', endShowDate: '' });
                                }
                              }>全部 </span>
                        {this.state.fullYearList.map(element => {
                          return (
                            <span key={element}
                                  className={slectTime === element ? "ip-category-item span-selected" : "ip-category-item "}
                                  onClick={
                                    async () => {
                                      if (slectTime === element) return;
                                      this.setState({
                                        endDate: null,
                                        beginDate: null,
                                      });
                                      await ip_list.setselected({
                                        slectTime: element,
                                        show: ip_list.selectedchild.show
                                      });
                                      await this._checkedType({
                                        benginShowDate: element + '-01-01',
                                        endShowDate: element + '-12-31'
                                      });
                                    }
                                  }>
                              {element}</span>
                          );
                        })}
                        {/* 开始结束的时间 */}
                        <div className="time-picker-area">
                          <MonthPicker locale={locale} size="default"
                                       onChange={async value => {
                                         let date = !!value && value.format("YYYY-MM") || null;
                                         this.setState({
                                           beginDate: date
                                         });
                                         if (this.state.endDate === null) {
                                           await this._checkedType({ endShowDate: '' });
                                         }

                                         await ip_list.setselected({
                                           slectTime: date,
                                           show: ip_list.selectedchild.show
                                         });
                                         await this._checkedType({ benginShowDate: date });
                                       }}
                                       value={this.filterParam('beginDate')}
                          />
                          <div className="timeLine"/>
                          <MonthPicker locale={locale} size="default"
                                       onChange={async value => {
                                         if (this.state.beginDate === null) {
                                           await this._checkedType({ benginShowDate: '' });
                                         }
                                         let date = !!value && value.format("YYYY-MM") || null;
                                         await ip_list.setselected({
                                           slectTime: date,
                                           show: ip_list.selectedchild.show
                                         });
                                         await this._checkedType({ endShowDate: date });
                                         this.setState({
                                           endDate: date
                                         });
                                       }}
                                       value={this.filterParam('endDate')}
                          />
                        </div>

                      </div>
                    </div>
                  }

                </div>
              )
            }
          </div>
        </div>
        < div className="ip-content-list">
          {
            selected === "" && ipItemList && ipItemList.map((item: any) => {
              let arr = toJS(item.sublist);
              return arr.length > 0 &&
                <IpListItem key={item.ipType} data={item} ip_list={ip_list} selected={selected}/>;
            })
          }
          {
            // (selected !== "" && Number(totalCount) > 0) && (
            (selected !== "") && (
              <div className="operation-group flex-row" id="operation-group">
                <IpTypeList data={ipTypeListData}
                            contastList={this.state.contastList}
                            callbackcontastList={this.callbackcontastList}
                            totalCount={totalCount} ip_list={ip_list}
                            topTypeSuperiorNumber={this.state.topTypeSuperiorNumber} pageSize={24}
                            history={this.props.history}/>
              </div>
            )
          }
        </div>
        <ScrollTop contrast={true} data={this.state.contastList} deletContast={this.deletContast}
                   history={this.props.history}/>
      </div>
    );
  }
}
