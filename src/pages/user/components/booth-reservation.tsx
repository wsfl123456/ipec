import * as React from 'react';
import "@assets/scss/booth_reservation.scss";
import close from "assets/images/ic_close.svg";
import { Select } from 'antd';
import Alert from '@components/alert';
import { inject, observer } from 'mobx-react';

const { Option } = Select;
import 'moment/locale/zh-cn';
import Toast from '@components/toast';

interface IBoothReservationState {
  contactNumber: string;
  contacts: string;
  exhibitorIps: string;
  message: string;
  isShow: boolean;
  exhibitorArea: string;
  toastShow: boolean;
  toastMsg: string;
}

interface IBoothReservationProps extends IComponentProps {
  companyLogo: string
  companyName: string;
  exhibitionGuid: string,
  onClose: Function;
}

@inject('user')
@observer
export default class BoothReservation extends React.Component <IBoothReservationProps, IBoothReservationState> {
  constructor(props) {
    super(props);
    this.state = {
      contactNumber: '',
      contacts: '',
      exhibitorIps: '',
      message: '',
      isShow: false,
      exhibitorArea: '',
      toastShow: false,
      toastMsg: '',
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    // 参展面积
    await user.getCompanyType({ type: 8 });
  }

  validateFun() {
    const { contacts, contactNumber, exhibitorArea, exhibitorIps } = this.state;
    if (!contacts) {
      this.setState({ isShow: true, message: '请输入联系人姓名' });
      return false;
    }
    if (!contactNumber) {
      this.setState({ isShow: true, message: '请输入联系人电话' });
      return false;
    }
    if (!exhibitorIps) {
      this.setState({ isShow: true, message: '请输入参展品牌' });
      return false;
    }
    if (!exhibitorArea) {
      this.setState({ isShow: true, message: '请选择意向参展面积' });
      return false;
    }
    return true;
  }

  render() {
    const { userGuid } = JSON.parse(localStorage.getItem("user"));
    const { contacts, contactNumber, exhibitorArea, exhibitorIps, message, isShow, toastShow, toastMsg } = this.state;
    const { onClose, user, companyName, exhibitionGuid, companyLogo } = this.props;
    const { companyType } = user;
    return (
      <div className='model-reservation'>
        <div className="reservation-content model-container">
          <div className="model-header">
            预定展位
            <img src={close} alt="" onClick={() => {
              onClose();
            }}/>
          </div>
          <div className="model-body">
            <div className="rc-group">
              <input type="text" className="rc-input readonly" placeholder="请输入公司名" value={companyName} readOnly/>
            </div>
            <div className="rc-group">
              <p>联系人<i>*</i></p>
              <input type="text" className="rc-input" placeholder="请输入联系人姓名"
                     onChange={(e) => {
                       this.setState({ contacts: e.target.value });
                     }}/>
            </div>
            <div className="rc-group">
              <p>联系电话<i>*</i></p>
              <input type="text" className="rc-input" placeholder="请输入联系人电话"
                     onChange={(e) => {
                       this.setState({ contactNumber: e.target.value });
                     }}/>
            </div>
            <div className="rc-group">
              <p>参展品牌<i>*</i></p>
              <input type="text" className="rc-input" placeholder="请输入参展品牌"
                     onChange={(e) => {
                       this.setState({ exhibitorIps: e.target.value });
                     }}/>
            </div>
            <div className="rc-group">
              <p>意向参展面积(单位：sqm)<i>*</i></p>
              <Select style={{ width: 520 }}
                      onChange={(value: string) => {
                        this.setState({ exhibitorArea: value });
                      }}>
                {
                  [] && companyType.map((item) => {
                    return (
                      <Option value={item.resourceValue} key={item.resourceKey}>{item.resourceValue}</Option>
                    );
                  })
                }
              </Select>
            </div>
          </div>
          <div className="model-footer">
            <input type="button" className="btn btn-submit" value="确定"
                   onClick={async () => {
                     let isValidate: any = this.validateFun();
                     if (isValidate) {
                       const params = {
                         companyLogo,
                         companyName,
                         contactNumber,
                         contacts,
                         createUserGuid: userGuid,
                         exhibitionGuid,
                         exhibitorIps,
                         intentionalArea: exhibitorArea,
                       };
                       const data = await user.boothReservation(params);
                       onClose();
                       setInterval(() => {
                         this.setState({
                           toastMsg: data['message'],
                           toastShow: true,
                         });
                       }, 3000);
                       await user.getCompanyInfo(userGuid);
                     }
                   }}/>
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
          toastShow &&
          <Toast message={toastMsg} duration={3} onClose={() => this.setState({ toastShow: false })}/>
        }
      </div>
    );
  }
}
