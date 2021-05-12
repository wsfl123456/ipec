import * as React from 'react';
import { inject, observer } from "mobx-react";
import "@assets/scss/my_schedule.scss";
import Add from '@assets/images/add.svg';
import download from '@assets/images/ip_detail/ic_download_pr.svg';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrid from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import '@assets/scss/fullcalendar.scss';
import AddSchedule from '@pages/user/components/add-schedule';
import { DatePicker, message, } from 'antd';
import Alert from '@components/alert';
import { getExportSchedule, } from '@utils/api';
import _isEqual from "lodash/isEqual";
import _isEmpty from "lodash/isEmpty";
import moment from 'moment';
import 'moment/locale/zh-cn';
import ic_user from "@assets/images/user.svg";
// import icon_load from "@assets/images/update/timg.gif";

moment.locale('zh-cn');

const dateTypeKV = {
  'timeGridMonth': 0,
  'timeGridWeek': 1,
  'timeGridDay': 2,
  'dayGridMonth': 0,
  'dayGridWeek': 1,
  'dayGridDay': 2,
};

interface IMyScheduleState {
  addIsShow: boolean,
  top?: number,
  left?: number,
  show?: string,
  current?: any,
  alertShow: Boolean,
  message: string,
  addTitle: boolean,
  timeType: number,
  chooseDate: any,
  oldCalendar?: any,
  isLoading?: boolean,
}

interface IMyScheduleProps extends IComponentProps {
  userGuid?: string
}

@inject('user', 'login')
@observer
export default class MySchedule extends React.Component <IMyScheduleProps, IMyScheduleState> {
  constructor(props) {
    super(props);
    this.state = {
      addIsShow: false,
      alertShow: false,
      message: "",
      addTitle: true,
      current: { id: -1 },
      timeType: 0,
      chooseDate: moment().format('YYYY-MM-DD'),
      oldCalendar: null,
    };
    this.calendarRef = React.createRef();

  }

  calendarRef = null;
  // 如果您想在切换到新视图的同时导航到新日期，则可以指定日期参数：
  changeDate = async (date: moment.MomentInput) => {
    const { user, login } = this.props;
    const { timeType: displayType } = this.state;
    if (!_isEmpty(date)) {
      const time = moment(date).format('YYYY-MM-DD');
      let calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(time);
      const userGuid = login.userInfo['userGuid'] || null;
      const params = {
        userGuid,
        displayType,
        chooseDate: time,
      };
      await user.scheduleEvents(params);
      this.setState({ chooseDate: time });
      // calendarApi.changeView('timeGridDay', time);
    } else {
      // console.log(date);
      // this.setState({
      //   chooseDate: moment("", 'YYYY-MM-DD'),
      // });
    }
  };

  handleDateClick = () => {
    this.setState({
      addIsShow: true,
      show: 'none',
      addTitle: true,
    });
    const params = {
      dateTitle: '',
      remarks: '',
      startEndTime: [],
      infoHours: '',
    };
    this.props.user.changeSchedule(params);
  };

  async componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ isLoading: false });
    // }, 3000);
    await this.scheduleEventsFun();
  }

  /**
   * 日历列表
   */
  scheduleEventsFun = async () => {
    const { user, login } = this.props;
    const { timeType: displayType, chooseDate } = this.state;
    const userGuid = login.userInfo['userGuid'] || null;
    const params = {
      userGuid,
      displayType,
      chooseDate,
    };
    await user.scheduleEvents(params);
  };

  // 导出日程信息
  async getExportScheduleF() {
    const { timeType: displayType, chooseDate } = this.state;
    const { userGuid } = this.props.login.userInfo || null;
    const { errorCode, result, errorMessage }: any = await getExportSchedule(userGuid, displayType, chooseDate);
    if (errorCode === '200') {
      window.open(result, '_blank');
    } else {
      message.error(errorMessage);
    }
  }

  // shouldComponentUpdate(nextProps: Readonly<IMyScheduleProps>, nextState: Readonly<IMyScheduleState>, nextContext: any): boolean {
  //   // return nextProps !== this.props.user.scheduleData
  //   // return false;
  //   console.log(!_isEqual(this.props, nextProps), !_isEqual(this.state, nextState), !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState));
  //   return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  // }

  /**
   *    切换视图获取 chooseDate当前日期、 timeType展示类型（年、月、日）
   */
  changeView = async (view) => {
    if (!view) {
      return;
    }
    if (this.state.oldCalendar) {
      // console.log(
      //     'is equal',
      //     view.view.type,
      //     view.view.currentStart,
      //     _isEqual(this.state.oldCalendar.view.type, view.view.type),
      //     _isEqual(this.state.oldCalendar.view.currentStart, view.view.currentStart)
      // );
      if (_isEqual(this.state.oldCalendar.view.type, view.view.type) && _isEqual(this.state.oldCalendar.view.currentStart, view.view.currentStart)) {
        return;
      }
    }

    const { user, login } = this.props;
    const chooseDate = moment(view.view.currentStart).format('YYYY-MM-DD');
    const timeType = view.view.type;
    // console.log(dateTypeKV[timeType], timeType, this);
    const userGuid = login.userInfo['userGuid'] || null;
    const params = {
      userGuid,
      displayType: Number(dateTypeKV[timeType]),
      chooseDate,
    };
    await user.scheduleEvents(params);
    this.setState({
      oldCalendar: view,
      timeType: dateTypeKV[timeType],
      chooseDate
    });
  };

  render() {
    const loginUser = JSON.parse(localStorage.getItem('user'));
    const { addIsShow, current, alertShow, message, chooseDate } = this.state;
    const { user } = this.props;
    let { scheduleData }: { scheduleData: any | [] } = user;
    let date;
    if (!_isEmpty(chooseDate)) {
      date = chooseDate || null;
    } else if (chooseDate === null) {
      date = null;
    }
    return (
      <div className='my-schedule'>
        <div className='schedule-top'>
          <div className='top-title'>我的日程</div>
          <div className='add-schedule'
               onClick={() => {
                 this.setState({
                   addIsShow: true,
                   addTitle: true,
                 });
                 const params = {
                   dateTitle: '',
                   remarks: '',
                   startEndTime: [],
                   infoHours: '',
                 };
                 user.changeSchedule(params);
               }}>
            <img src={Add} alt=''/>添加日程
          </div>
          <div className='download-schedule' onClick={() => this.getExportScheduleF()}>
            <img src={download} alt=''/>下载日程
          </div>
        </div>
        <div className="schedule-change">
          <div className="select-date">
            <DatePicker placeholder="" onChange={this.changeDate} format="YYYY-MM-DD" allowClear={false}
                        value={moment(date, 'YYYY-MM-DD')}/>
          </div>
        </div>
        {addIsShow && <AddSchedule
          onClose={
            () => {
              this.setState({
                addIsShow: false
              });
            }}
          addTitle={this.state.addTitle}
          id={current.id || -1}
          scheduleEventsFun={async () => {
            await this.scheduleEventsFun();
          }}
          editEvent={async () => {
            let calendarApi = this.calendarRef.current.getApi();
            calendarApi.getEventById(current.id).remove({
              title: user.scheduleParams.dateTitle,
              start: user.scheduleParams.startEndTime[0],
              end: user.scheduleParams.startEndTime[1],
            });
            this.setState({
              addIsShow: false
            });

            // await this.scheduleEventsFun();
            // calendarApi.refetchEvents();
          }}
          onConfirm={async () => {
            // let calendarApi = this.calendarRef.current.getApi();
            // calendarApi.addEvent({
            //   title: user.scheduleParams.dateTitle,
            //   start: user.scheduleParams.startEndTime[0],
            //   end: user.scheduleParams.startEndTime[1],
            // });
            this.setState({
              addIsShow: false
            });
            // await this.scheduleEventsFun();
          }}/>}
        <div className="calendar-container">
          {/* {
            this.state.isLoading &&
            <div className="loading">sdf<img src={icon_load} alt=""/></div>
          }*/}
          <FullCalendar
            ref={this.calendarRef}
            defaultView="dayGridMonth"
            dateClick={this.handleDateClick}
            allDayDefault={false}
            firstDay={1}
            header={{
              left: '',
              center: 'prev,title,next',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            timeZone='local'
            locale='zh-cn'
            themeSystem='bootstrap'
            slotLabelFormat={[{
              hour: '2-digit',
              minute: '2-digit',
              omitZeroMinute: false,
              meridiem: false,
              hour12: false,
            }]}
            buttonText={{
              prev: '<',
              next: '>',
              month: '按月展示',
              week: '按周展示',
              day: '按天展示',
            }}
            buttonIcons={{
              prev: 'left-single-arrow',
              next: 'right-single-arrow',
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              omitZeroMinute: false,
              meridiem: false,
              hour12: false
            }}
            allDaySlot={false}
            plugins={[timeGrid, dayGridPlugin, interactionPlugin, bootstrapPlugin]}
            events={this.props.user.scheduleData}
            datesRender={(view: any) => {
              this.changeView(view);
            }}
            eventLimit={true}
            eventLimitClick="day"
            eventLimitText={(e) => {
              return '另外' + e + '个';
            }}
            slotDuration='00:30'
            eventMouseEnter={(arg) => {
              // scheduleData = toJS(scheduleData);
              const current = scheduleData.find(val => {
                return val.id === arg.event.id;
              });
              this.setState({
                current,
                left: arg.jsEvent.clientX + 10 || arg.jsEvent.pageX + 10,
                top: arg.jsEvent.clientY || arg.jsEvent.pageY,
                show: 'block',
              });
            }}
            eventMouseLeave={() => {
              // this.setState({
              //    show: 'none',
              //  });
            }}
          />
          <div onMouseLeave={() => this.setState({ show: 'none' })} className="hover-box"
               style={{ display: this.state.show, top: this.state.top + 'px', left: this.state.left + 'px' }}>
            {
              (current.type === 1 || current.type === null) &&
              <div className="detail-container">
                <div className="hover-top">
                  <img src={current.picUrl || ic_user} alt="" className="head-img"/>
                  <div>
                    <p className="head-title">{current.title}</p>
                    {loginUser.userAttribute === 1
                      ? <p>{current.post}{current.company}</p>
                      : <p>{current.post}{current.companyCategory}</p>
                    }
                  </div>
                </div>
                <div className="hover-bottom">
                  <p>会面时间：{current.start} - {current.end}</p>
                  <p>会面地址：{current.address}</p>
                  <p>会面原因：{current.reason}</p>
                </div>
              </div>
            }
            {
              current.type === 0 &&
              < div className="detail-container owner-add">
                <div className="owner-top">
                  <p className="owner-title">{current.title}</p>
                  <p>起止时间：{current.start} - {current.end}</p>
                  <p>事件描述：{current.reason}</p>
                </div>
                <div className="owner-bottom">
                  <button onClick={async () => {
                    this.setState({
                      addIsShow: true,
                      addTitle: false,
                    });
                    const params = {
                      dateTitle: current.title,
                      remarks: current.reason,
                      startEndTime: [current.start, current.end],
                      infoHours: current.infoHours
                    };
                    user.changeSchedule(params);
                  }}>编辑
                  </button>
                  <button onClick={() => {
                    this.setState({
                      alertShow: true,
                      message: '确定删除本次日程吗？'
                    });
                  }}
                  >删除
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
        {
          alertShow &&
          <Alert message={message}
                 onClose={() => {
                   this.setState({ alertShow: false });
                 }}
                 onSubmit={async () => {
                   await user.removeSchedule({ id: current.id });
                   let calendarApi = this.calendarRef.current.getApi();
                   calendarApi.getEventById(current.id).remove({
                     title: user.scheduleParams.dateTitle,
                     start: user.scheduleParams.startEndTime[0],
                     end: user.scheduleParams.startEndTime[1],
                   });
                 }}
          />
        }
      </div>
    );
  }
}
