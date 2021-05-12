import * as React from "react";
import "@assets/scss/time_input.scss";
import DatePicker from "rc-calendar/lib/Picker";
import MonthCalendar from "rc-calendar/lib/MonthCalendar";
import "rc-calendar/assets/index.css";
import zhCN from "rc-calendar/lib/locale/zh_CN";
import enUS from "rc-calendar/lib/locale/en_US";
import _isFunc from "lodash/isFunction";

import moment from "moment";
import "moment/locale/zh-cn";
import "moment/locale/en-gb";

const format = "YYYY-MM";
const cn = location.search.indexOf("cn") !== -1;
const now = moment();
if (cn) {
  now.locale("zh-cn").utcOffset(8);
} else {
  now.locale("en-gb").utcOffset(0);
}

interface ITimeInputProps {
  callback: Function;
  callbackT: Function,
}

interface ITimeInputState {
  startTime: any;
}

function onStandaloneChange(value) {
  console.log("month-calendar change", (value && value.format(format)));
}

// function disabledDate(value) {
//   return value.year() > now.year() ||
//     value.year() === now.year() && value.month() > now.month();
// }

function onMonthCellContentRender(value) {
  return `${value.month() + 1}月`;
}

export default class TimeRange extends React.Component<ITimeInputProps, ITimeInputState> {

  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
    };
  }

  render() {
    const calendar = (<MonthCalendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      // disabledDate={disabledDate}
      onChange={onStandaloneChange}
      monthCellContentRender={onMonthCellContentRender}
    />);
    const { callback, callbackT } = this.props;
    return (
      <div className="time-input">
        <div className="time-list"> 
          <DatePicker
            onChange={value => {
              let date = !!value && value.format("YYYY-MM") || "";
              _isFunc(callback) && callback({ date });
            }}
            startTime={this.state.startTime}
            animmation="slide-up"
            calendar={calendar}
            className="calendar-element time-style">
            {
              ({ value }) => {
                return (<input
                  readOnly={true}
                  type="text" placeholder="请选择开始时间"
                  value={!!value && value.format("YYYY-MM") || ""}
                  className="calendar-element time-style"/>);

              }}
          </DatePicker>
          <div className="timeLine"/>
          <DatePicker
            onChange={value => {
              let date = !!value && value.format("YYYY-MM") || "";
              _isFunc(callbackT) && callbackT({ date });
            }}
            animmation="slide-up"
            calendar={calendar}
            className="calendar-element time-style">
            {
              ({ value }) => { 
                return (<input
                  readOnly={true}
                  type="text" placeholder="请选择结束时间"
                  value={!!value && value.format("YYYY-MM") || ""}
                  className="calendar-element time-style"/>);

              }}
          </DatePicker>
        </div>
      </div>
    );
  }
}
