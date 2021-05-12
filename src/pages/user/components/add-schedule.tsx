import * as React from 'react';
import "@assets/scss/my_schedule.scss";
import close from "assets/images/ic_close.svg";
import { DatePicker, Select, message } from 'antd';
import Alert from '@components/alert';
import _isEmpty from 'lodash/isEmpty';
import _isFun from 'lodash/isFunction';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import _isObject from 'lodash/isObject';

const { RangePicker } = DatePicker;
const { Option } = Select;
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Toast from '@components/toast';

const infoTime = {
  "10": "提前十分钟",
  "30": "提前半小时",
  "60": "提前一小时",
  "120": "提前两小时",
};

interface IMyScheduleState {
  dateTitle: string;
  remarks: string;
  startEndTime: Array<string>;
  infoHours: any;
  message: string;
  isShow: boolean;
  errorMessage?: string;
  errorShow?: boolean;
}

interface IMyScheduleProps extends IComponentProps {
  userGuid?: string;
  onConfirm?: Function;
  editEvent?: Function;
  onClose: Function;
  scheduleEventsFun: Function;
  id?: number;
}

@inject('user', 'login')
@observer
export default class AddSchedule extends React.Component <IMyScheduleProps, IMyScheduleState> {
  constructor(props) {
    super(props);
    this.state = {
      dateTitle: '',
      remarks: '',
      startEndTime: [],
      infoHours: '',
      message: '',
      isShow: false,
    };
  }

  validateFun() {
    const { user } = this.props;
    const { scheduleParams } = user;
    const { dateTitle, startEndTime } = scheduleParams;
    if (!dateTitle) {
      this.setState({ isShow: true, message: '请输入标题' });
      return false;
    } else if (_isEmpty(startEndTime)) {
      this.setState({ isShow: true, message: '请选择起止时间' });
      return false;
    } else {
      return true;
    }
  }

  /**
   * 日历列表
   */
  // async scheduleEventsFun() {
  //   const { user } = this.props;
  //   const userGuid = this.state.userData['userGuid'] || null;
  //   const params = {
  //     userGuid,
  //     displayType: 0,
  //     chooseDate: moment().format('YYYY-MM-DD'),
  //   };
  //   await user.scheduleEvents(params);
  // };

  /**
   * 添加日程
   */
  async submitSchedule() {
    const { userGuid } = this.props.login.userInfo;
    const { user, onConfirm, scheduleEventsFun } = this.props;
    let isValidate: any = this.validateFun();
    if (isValidate) {
      const params = {
        title: user.scheduleParams.dateTitle,
        matterExplain: user.scheduleParams.remarks,
        scheduleBeginTime: user.scheduleParams.startEndTime[0],
        scheduleEndTime: user.scheduleParams.startEndTime[1],
        reminderTime: user.scheduleParams.infoHours,
        userGuid,
      };
      const isSuccess: any = await user.addSchedules(params);
      const msg: string = isSuccess['message'];
      const errorMsg: string = isSuccess['errorMessage'];
      if (_isObject(isSuccess) && isSuccess['request']) {
        // this.setState({
        //   errorShow: isSuccess['request'],
        //   errorMessage: isSuccess['message']
        // });
        // if (isSuccess['close']) {
        //   setTimeout(() => {
        //     onConfirm();
        //   }, 3000);
        // }
        if (!isSuccess['close']) {
          onConfirm();
          message.error(msg);
        } else {
          onConfirm();
          message.success(msg);
          scheduleEventsFun();
        }
      } else {
        onConfirm();
        message.error(errorMsg);
      }
    }
  }

  //
  async editSchedule() {
    const { user, onConfirm, editEvent, scheduleEventsFun, login } = this.props;
    const { userGuid } = login.userInfo;

    let isValidate: any = this.validateFun();
    if (isValidate) {
      const params = {
        id: this.props.id,
        title: user.scheduleParams.dateTitle,
        matterExplain: user.scheduleParams.remarks,
        scheduleBeginTime: user.scheduleParams.startEndTime[0],
        scheduleEndTime: user.scheduleParams.startEndTime[1],
        reminderTime: user.scheduleParams.infoHours,
        userGuid,
      };
      const result: any = await user.editSchedule(params);
      const msg: string = result['message'];
      const errorMsg: string = result['errorMessage'];

      if (_isObject(result) && result['request']) {
        this.setState({
          errorShow: result['request'],
          errorMessage: result['message']
        });
        if (!result['close']) {
          onConfirm();
          message.error(msg);
        } else {
          onConfirm();
          message.success(msg);
          editEvent();
          scheduleEventsFun();
          // await this.scheduleEventsFun();
        }
        // if (result['close']) {
        //   setTimeout(() => {
        //     onConfirm();
        //     editEvent();
        //   }, 3000);
        // }
      } else {
        onConfirm();
        message.error(errorMsg);
      }

    }
  }

  render() {
    const { message, isShow, errorMessage, errorShow } = this.state;
    const { onClose, user } = this.props;
    const { scheduleParams } = user;
    return (
      <div className='model-schedule'>
        <div className="schedule-content model-container">
          <div className="model-header">
            {this.props.addTitle === true ? '添加日程' : '编辑日程'}
            <img src={close} alt="" onClick={() => {
              onClose();
            }}/>
          </div>
          <div className="model-body">
            <div className="rc-group">
              <p>标题<i>*</i></p>
              <input
                type="text" className="rc-input" placeholder="请输入标题"
                value={scheduleParams.dateTitle}
                onChange={async (e) => {
                  user.changeSchedule({ dateTitle: e.target.value });
                }}/>
            </div>
            <div className="rc-group">
              <p>事项说明</p>
              <textarea className="rc-textarea" placeholder="请在此输入该日程的内容（400字以内）" maxLength={400}
                        value={scheduleParams.remarks}
                        onChange={async (e) => {
                          await user.changeSchedule({ remarks: e.target.value });
                        }}/>
            </div>
            <div className="rc-group">
              <p>起止时间<i>*</i></p>
              {
                this.props.addTitle ?
                  <LocaleProvider locale={zh_CN}>
                    <RangePicker style={{ width: 520 }} getCalendarContainer={trigger => trigger.parentElement}
                                 showTime={{
                                   format: 'HH:mm',
                                   hideDisabledOptions: true,
                                 }}
                                 allowClear={false}
                                 renderExtraFooter={() => '半个小时为最小单位'}
                                 placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD HH:mm"
                                 onChange={async (dates, dateStrings) => {
                                   await user.changeSchedule({ startEndTime: dateStrings });
                                 }}/>
                  </LocaleProvider>
                  :
                  <LocaleProvider locale={zh_CN}>
                    <RangePicker getCalendarContainer={trigger => trigger.parentElement}
                                 style={{ width: 520 }}
                                 showTime={{
                                   format: 'HH:mm',
                                   hideDisabledOptions: true,
                                 }}
                                 defaultValue={[moment(scheduleParams.startEndTime[0], 'YYYY-MM-DD HH:mm'), moment(scheduleParams.startEndTime[1], 'YYYY-MM-DD HH:mm')]}
                                 allowClear={false}
                                 renderExtraFooter={() => '半个小时为最小单位'}
                                 placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD HH:mm"
                                 onChange={async (dates, dateStrings) => {
                                   await user.changeSchedule({ startEndTime: dateStrings });
                                 }}/>
                  </LocaleProvider>
              }

            </div>
            <div className="rc-group">
              <p>提醒时间</p>
              <Select style={{ width: 520 }} getPopupContainer={triggerNode => triggerNode.parentElement}
                      value={infoTime[scheduleParams.infoHours]}
                      onChange={async (value) => {
                        console.log(value);
                        await user.changeSchedule({ infoHours: value });
                      }}>
                <Option value="10">提前十分钟</Option>
                <Option value="30">提前半小时</Option>
                <Option value="60">提前一小时</Option>
                <Option value="120">提前两小时</Option>
              </Select>
            </div>
            <p className="rc-care">如设置了提醒时间，我们将已短信或邮件的形式提醒您该日程</p>
          </div>
          <div className="model-footer">
            {
              this.props.addTitle &&
              <input type="button" className="btn btn-submit" value="确定"
                     onClick={async () => {
                       // 提交日程
                       await this.submitSchedule();
                     }}/>
            }
            {
              !this.props.addTitle &&
              <input type="button" className="btn btn-submit" value="编辑"
                     onClick={async () => {
                       await this.editSchedule();

                     }}/>
            }
            <input type="button" className="btn btn-cancel" value="取消"
                   onClick={() => {
                     onClose();
                   }}/>
          </div>
        </div>
        {
          isShow && <Alert message={message}
                           onClose={() => {
                             this.setState({ isShow: false });
                           }}
                           onSubmit={() => {
                           }}
          />
        }
        {
          errorShow &&
          <Toast message={errorMessage} duration={5} onClose={() => {
            this.setState({ errorShow: false });
          }}/>
        }
      </div>
    );
  }
}
