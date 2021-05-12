import * as React from 'react';
import { useState } from "react";
import { Input } from 'antd';
import moment from 'moment';

import "@assets/scss/dataAndTimePicker.scss";

interface IDateTimePicker {
  begin: string,
  end: string,
  dateTime: Function,
  reservation?: { invitationDate: string, invitationTime: string }[]
}

function leftDate(begin: string, end: string): moment.Moment[] {
  return Array(moment(end).diff(moment(begin), 'day') + 1)
    .fill('')
    .map((_, i: number) => moment(begin).add(i, 'd'));
}

export default ({
                  begin,
                  end,
                  reservation,
                  ...props
                }: IDateTimePicker) => {
  const rightTimeList: any[] = [
    { id: 0, time_str: "09:00-09:30" }, { id: 1, time_str: "09:30-10:00" },
    { id: 2, time_str: "10:00-10:30" }, { id: 3, time_str: "10:30-11:00" },
    { id: 4, time_str: "11:00-11:30" }, { id: 5, time_str: "11:30-12:00" },
    { id: 6, time_str: "12:00-12:30" }, { id: 7, time_str: "12:30-13:00" },
    { id: 8, time_str: "13:00-13:30" }, { id: 9, time_str: "13:30-14:00" },
    { id: 10, time_str: "14:00-14:30" }, { id: 11, time_str: "14:30-15:00" },
    { id: 12, time_str: "15:00-15:30" }, { id: 13, time_str: "15:30-16:00" },
    { id: 14, time_str: "16:00-16:30" }, { id: 15, time_str: "16:30-17:00" },
  ];

  const leftDateList = leftDate(begin, end);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(leftDateList[0]);
  const [selectedTime, setSelectedTime] = useState<string>();

  return (
    <div className='date-and-time-picker-body'>
      <Input
        type="text"
        size="large"
        placeholder="请选择会面时间段"
        value={selectedTime}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setShow(!show);
        }}
      />
      {
        show &&
        <div
          className="meeting-box clearfix"
          onMouseLeave={(e) => {
            e.stopPropagation();
            setShow(!show);
          }}
        >
          {/* 左边的日期 */}
          <div className="datePicker">
            {
              leftDateList.map((item, index) => {
                let check = selectedMonth.isSame(item) ? 'active' : '';
                return (
                  <div
                    key={index}
                    className={`month ${check}`}
                    onClick={() => {
                      if (!selectedMonth.isSame(item)) {
                        setSelectedMonth(item);
                        setSelected('');
                      }
                    }}
                  >
                    {item.format('YYYY-MM-DD')}
                  </div>
                );
              })
            }
          </div>
          {/* 右边的时间段 */}
          <div className="timePicker">
            {
              rightTimeList.map((item, index) => {
                const hms = item.time_str.split('-')[0];
                const ymd = selectedMonth.format('YYYY-MM-DD');
                const tmp: string = `${ymd} ${hms}`;
                const current = moment(tmp);
                let check: string = current.isBefore(moment()) ? 'disabled-active' : '';

                const endTime = moment(end);

                if (current.isBefore(selectedMonth)) {
                  check = 'disabled-active';
                }

                if (endTime.format('YYYY-MM-DD') === ymd) {
                  check = current.isAfter(endTime) ? 'disabled-active' : check;
                }
                if (selected === item.time_str) check = 'active';
                if (reservation && reservation
                  .findIndex(o =>
                    (o.invitationDate === ymd && o.invitationTime === item.time_str)) > -1) {
                  check = 'already';
                }
                return (
                  <div
                    className={check}
                    key={index}
                    onClick={() => {
                      if (check !== 'disabled-active' && check !== 'already') {
                        props.dateTime(ymd, item.time_str);
                        setSelected(item.time_str);
                        setSelectedTime(tmp);
                        setShow(false);
                      }
                    }}
                  >
                    {check === "already" && <span>{item.time_str}<br/>已预约</span>}
                    {check === "disabled-active" && <span>{item.time_str}</span>}
                    {(check !== "already" && check !== "disabled-active") && <span>{item.time_str}</span>}
                  </div>
                );
              })
            }
          </div>
        </div>
      }

    </div>
  );
};
