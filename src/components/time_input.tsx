import * as React from "react";
import "@assets/scss/time_input.scss";
import calendar_icon from "@assets/images/calendar.svg";
import DatePicker from "rc-calendar/lib/Picker";
import Calendar from "rc-calendar";
import "rc-calendar/assets/index.css";
import zh_CN from "rc-calendar/lib/locale/zh_CN";
import _isFunc from "lodash/isFunction";

interface ITimeInputProps extends IComponentProps {
  placeholder?: string;
  margin_left?: number;
  show_triangle?: boolean;
  callback: Function;
  defaultValue?: any
}

interface ITimeInputState {
  triangle_color: string;
}

export default class TimeInput extends React.Component<ITimeInputProps, ITimeInputState> {

  constructor(props: any) {
    super(props);
    this.state = { triangle_color: "#ced4da", };
  }

  render() {
    const calendar = (<Calendar
      locale={zh_CN}
      style={{ zIndex: 21 }}
      showDateInput={false}
    />);
    const { placeholder, margin_left = 0, show_triangle = true, callback } = this.props;
    const { triangle_color } = this.state;
    return (
      <div className="time-input">
        {/*{show_triangle &&*/}
        {/*<div className="invert-triangle main-triangle"*/}
        {/*style={{ marginLeft: margin_left + "rem", borderBottomColor: triangle_color, }}/>}*/}
        {/*{show_triangle &&*/}
        {/*<div className="invert-triangle bg-triangle" style={{ marginLeft: margin_left + "rem" }}/>}*/}

        <div className="time-list">
          <DatePicker
            onChange={value => {
              let date = !!value && value.format("YYYY-MM-DD") || "";
              _isFunc(callback) && callback({ date });
            }}
            animmation="slide-up"
            calendar={calendar}
            className="calendar-element">
            {
              ({ value }) => {
                return (<input
                  readOnly={true}
                  onBlur={() => this.setState({ triangle_color: "#ced4da" })}
                  onFocus={() => this.setState({ triangle_color: "#9013fe" })}
                  type="text" placeholder={placeholder || "请选择日期"}
                  value={!!value && value.format("YYYY-MM-DD") || this.props.defaultValue || "" }
                  className="form-control calendar-element"
                // defaultValue={this.props.defaultValue}
              />)
                ;
              }}
          </DatePicker>
          <img className="calendar-icon" src={calendar_icon} alt=""/>
        </div>
      </div>
    );
  }
}
