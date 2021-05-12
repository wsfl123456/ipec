import * as React from "react";
import { Input } from 'antd';
import "@assets/scss/dataAndTimePicker.scss";
import { invitePersonalTime, } from '@utils/api';

interface IDateAndTimePickerProps extends IComponentProps {
  selectMouthDay?: string,
  invitationDate?: string,
  invitationTime?: string,
  showMettingBox?: boolean,
  dateAndTimePickerData?: any,
  timeDataList?: any,
  justOneDay?: boolean,
  dateDateLiat?: any,
  selectMounth?: any,
  selectTime?: any,
  reservationTimeList?: any,
}

export default class DateAndTimePicker extends React.Component<IDateAndTimePickerProps> {
  state = {
    selectMouthDay: "", // 会面时间段的值 string类型 日期(invitationDate)+时间(invitationTime) 例如"2019-10-16 9:00-9:30"
    invitationDate: "", // 会面时间的日期
    invitationTime: "", // 会面时间的时间段
    showMettingBox: false, // 下方的选择时间显示与否
    dateAndTimePickerData: "",
    timeDataList: [
      { id: 0, value: "09:00-09:30" }, { id: 1, value: "09:30-10:00" }, { id: 2, value: "10:00-10:30" }, {
        id: 3,
        value: "10:30-11:00"
      },
      { id: 4, value: "11:00-11:30" }, { id: 5, value: "11:30-12:00" }, { id: 6, value: "12:00-12:30" }, {
        id: 7,
        value: "12:30-13:00"
      },
      { id: 8, value: "13:00-13:30" }, { id: 9, value: "13:30-14:00" }, { id: 10, value: "14:00-14:30" }, {
        id: 11,
        value: "14:30-15:00"
      },
      { id: 12, value: "15:00-15:30" }, { id: 13, value: "15:30-16:00" }, { id: 14, value: "16:00-16:30" }, {
        id: 15,
        value: "16:30-17:00"
      },
    ], // 右边时间选择的demo
    justOneDay: false, // 是否只有一天 如果是 则dateDateList数组的两项为当前的开始时间和结束时间
    dateDateList: [], // 左边日期的数组 例如 ["1564771348000", "1565000000000", "1565433752000"]
    selectMounth: "", // 选择的dateDateList的具体项 例如"1565433752000"
    selectTime: "", // 选择具体时间段
    reservationTimeList: [{ invitationDate: "", invitationTime: "" }], // 该负责人已被预约的时间段
  };

  async componentDidMount() {
    // 获取会面时间段的日期
    let beginDate = Date.parse(this.props.beginDate);
    let endDate = Date.parse(this.props.endDate);

    // beginDate = Date.parse('2019-08-28 16:00:00');
    // endDate = Date.parse('2019-10-28 16:00:00');
    let dateList = [];
    while (beginDate < endDate) {
      dateList.push(beginDate);
      beginDate = beginDate + 86400000;
    }
    // const datelistFirst  = dateList[0]
    const datelistLast = dateList[dateList.length - 1];

    if (dateList.length === 1) {
      this.setState({ justOneDay: true, dateDateList: [beginDate, endDate] });
    } else if (this.getFormatDate(datelistLast) === this.getFormatDate(endDate)) {
      dateList[dateList.length - 1] = endDate;
      this.setState({ dateDateList: dateList });
      this.setState({ selectMounth: dateList[0] });
    } else if (this.getFormatDate(datelistLast) !== this.getFormatDate(endDate)) {
      dateList.push(endDate);
      this.setState({ dateDateList: dateList });
      this.setState({ selectMounth: dateList[0] });
    }

    // 获取 展会被邀请人时间列表
    if (this.props.exhibitionGuid && this.props.meetPersonnel) {
      this.getInvitePersonneltime(this.props.exhibitionGuid, this.props.meetPersonnel);
    }

  }

  // all methods
  // 获取 展会被邀请人时间列表
  async getInvitePersonneltime(exhibitionGuid, meetPersonnel) {
    const result: any = await invitePersonalTime(exhibitionGuid, meetPersonnel);
    if (result.result) {
      this.setState({ reservationTimeList: result.result });
    }

  }

  // 时间戳转换
  getFormatDate(timestamp) {
    let newDate = new Date(timestamp);
    Date.prototype['format'] = function(format) {
      let date = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S+': this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
        }
      }
      return format;
    };
    return newDate['format']('yyyy-MM-dd');
  }

  getFormatDate2(timestamp) {
    const newDate = new Date(timestamp);
    Date.prototype['format'] = function(format) {
      const date = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S+': this.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
        }
      }
      return format;
    };
    return newDate['format']('hh:mm');
  }

  // 选择会面时间段的日期
  changeMounth(item) {
    this.setState({ selectMounth: item });
    // 改变右边的时间选择

  }

  changeTime(value) {
    this.setState({ selectTime: value });
    this.setState({ showMettingBox: false });
    this.setState({ selectMouthDay: this.getFormatDate(this.state.selectMounth) + " " + value });
    // 把参数传给父组件
    this.props.getDateAndTimeData(this.getFormatDate(this.state.selectMounth), value);
  }

  render() {
    const { selectMouthDay, showMettingBox, dateDateList, selectMounth, timeDataList, reservationTimeList } = this.state;
    return (
      <div className="date-and-time-picker-body"
      >
        <Input type="text" size="large" placeholder="请选择会面时间段" value={selectMouthDay}
               onClick={(e) => {
                 e.nativeEvent.stopImmediatePropagation();
                 this.setState({ showMettingBox: !showMettingBox });
               }}
        />
        {showMettingBox &&
        <div className="meeting-box clearfix"
             onMouseOver={(e) => {

               e.stopPropagation();
               this.setState({ showMettingBox: true });
             }}>
          {/* 左边的日期 */}
          <div className="datePicker">
            {
              dateDateList.map((item, index) => {
                let check: string;
                if (selectMounth === '' && index === 0) {
                  check = 'active';
                  this.setState({
                    selectMounth: item,
                  });
                } else {
                  check = selectMounth === item ? 'active' : '';
                }

                return (
                  <div className={`month ${check} `} onClick={() => {
                    this.changeMounth(item);
                  }} key={item}>
                    {this.getFormatDate(item)}
                  </div>
                );
              })
            }
          </div>
          {/* 右边的时间段 */}
          <div className="timePicker">
            {
              timeDataList.map((item, index) => {
                let check = '';
                // 第一页 早于开始时间黑掉
                if (selectMounth === dateDateList[0]) {
                  const firstBegin = this.getFormatDate2(dateDateList[0]);
                  switch (true) {
                    case firstBegin > "09:00" && index === 0:
                      check = "disabled-active";
                      break;
                    case firstBegin > "09:30" && index === 1:
                      check = "disabled-active";
                      break;
                    case firstBegin > "10:00" && index === 2:
                      check = "disabled-active";
                      break;
                    case firstBegin > "10:30" && index === 3:
                      check = "disabled-active";
                      break;
                    case firstBegin > "11:00" && index === 4:
                      check = "disabled-active";
                      break;
                    case firstBegin > "11:30" && index === 5:
                      check = "disabled-active";
                      break;
                    case firstBegin > "12:00" && index === 6:
                      check = "disabled-active";
                      break;
                    case firstBegin > "12:30" && index === 7:
                      check = "disabled-active";
                      break;
                    case firstBegin > "13:00" && index === 8:
                      check = "disabled-active";
                      break;
                    case firstBegin > "13:30" && index === 9:
                      check = "disabled-active";
                      break;
                    case firstBegin > "14:00" && index === 10:
                      check = "disabled-active";
                      break;
                    case firstBegin > "14:30" && index === 11:
                      check = "disabled-active";
                      break;
                    case firstBegin > "15:00" && index === 12:
                      check = "disabled-active";
                      break;
                    case firstBegin > "15:30" && index === 13:
                      check = "disabled-active";
                      break;
                    case firstBegin > "16:00" && index === 14:
                      check = "disabled-active";
                      break;
                    case firstBegin > "16:30" && index === 15:
                      check = "disabled-active";
                      break;
                  }
                }
                // 最后一页 晚于结束时间黑掉
                if (selectMounth === dateDateList[dateDateList.length - 1]) {
                  const lastEnd = this.getFormatDate2(dateDateList[dateDateList.length - 1]);
                  switch (true) {
                    case lastEnd < "09:30" && index === 0:
                      check = "disabled-active";
                      break;
                    case lastEnd < "10:00" && index === 1:
                      check = "disabled-active";
                      break;
                    case lastEnd < "10:30" && index === 2:
                      check = "disabled-active";
                      break;
                    case lastEnd < "11:00" && index === 3:
                      check = "disabled-active";
                      break;
                    case lastEnd < "11:30" && index === 4:
                      check = "disabled-active";
                      break;
                    case lastEnd < "12:00" && index === 5:
                      check = "disabled-active";
                      break;
                    case lastEnd < "12:30" && index === 6:
                      check = "disabled-active";
                      break;
                    case lastEnd < "13:00" && index === 7:
                      check = "disabled-active";
                      break;
                    case lastEnd < "13:30" && index === 8:
                      check = "disabled-active";
                      break;
                    case lastEnd < "14:00" && index === 9:
                      check = "disabled-active";
                      break;
                    case lastEnd < "14:30" && index === 10:
                      check = "disabled-active";
                      break;
                    case lastEnd < "15:00" && index === 11:
                      check = "disabled-active";
                      break;
                    case lastEnd < "15:30" && index === 12:
                      check = "disabled-active";
                      break;
                    case lastEnd < "16:00" && index === 13:
                      check = "disabled-active";
                      break;
                    case lastEnd < "16:30" && index === 14:
                      check = "disabled-active";
                      break;
                    case lastEnd < "17:00" && index === 15:
                      check = "disabled-active";
                      break;
                  }
                }
                // 超过今天的日期黑掉
                const todayDay = this.getFormatDate(Math.round(Number(new Date())));
                if (todayDay > this.getFormatDate(selectMounth)) {
                  check = "disabled-active";
                } else if (todayDay === this.getFormatDate(selectMounth)) {
                  const todayTime = this.getFormatDate2(Math.round(Number(new Date())));
                  switch (true) {
                    case todayTime > "09:00" && index === 0:
                      check = "disabled-active";
                      break;
                    case todayTime > "09:30" && index === 1:
                      check = "disabled-active";
                      break;
                    case todayTime > "10:00" && index === 2:
                      check = "disabled-active";
                      break;
                    case todayTime > "10:30" && index === 3:
                      check = "disabled-active";
                      break;
                    case todayTime > "11:00" && index === 4:
                      check = "disabled-active";
                      break;
                    case todayTime > "11:30" && index === 5:
                      check = "disabled-active";
                      break;
                    case todayTime > "12:00" && index === 6:
                      check = "disabled-active";
                      break;
                    case todayTime > "12:30" && index === 7:
                      check = "disabled-active";
                      break;
                    case todayTime > "13:00" && index === 8:
                      check = "disabled-active";
                      break;
                    case todayTime > "13:30" && index === 9:
                      check = "disabled-active";
                      break;
                    case todayTime > "14:00" && index === 10:
                      check = "disabled-active";
                      break;
                    case todayTime > "14:30" && index === 11:
                      check = "disabled-active";
                      break;
                    case todayTime > "15:00" && index === 12:
                      check = "disabled-active";
                      break;
                    case todayTime > "15:30" && index === 13:
                      check = "disabled-active";
                      break;
                    case todayTime > "16:00" && index === 14:
                      check = "disabled-active";
                      break;
                    case todayTime > "16:30" && index === 15:
                      check = "disabled-active";
                      break;
                  }
                }
                // 属于该负责人已被预约的时间段的黑掉
                for (const i in reservationTimeList) {
                  if (reservationTimeList.hasOwnProperty(i)) {
                    if (reservationTimeList[i].invitationDate === this.getFormatDate(selectMounth) && reservationTimeList[i].invitationTime === item.value) {
                      check = "already";
                    }
                  }
                }

                // 已选中
                if (selectMouthDay.substring(0, 10) === this.getFormatDate(selectMounth) && selectMouthDay.substring(11) === item.value) {
                  check = "active";
                }

                return (
                  <div
                    className={`${check} `}
                    key={index}
                    onClick={() => {
                      if (check !== 'disabled-active') {
                        this.changeTime(item.value);
                      }
                    }}>
                    {check === "alreadyReserved" && <span>{item.value}<br/>已预约</span>}
                    {check === "disabled-active" && <span>{item.value}</span>}
                    {(check !== "already" && check !== "disabled-active") && <span>{item.value}</span>}
                  </div>
                );
              })
            }
          </div>
        </div>
        }
      </div>
    );
  }
}
