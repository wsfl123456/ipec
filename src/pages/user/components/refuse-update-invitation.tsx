import * as React from 'react';
import "@assets/scss/refuse-update-invitation.scss";
import close from "assets/images/ic_close.svg";
import Alert from '@components/alert';
import { inject, observer } from 'mobx-react';
import Toast from '@components/toast';
import _isObject from 'lodash/isObject';

interface IModalProps extends IComponentProps {
  invitationGuid: string,
  onClose: Function;
}

interface IModalState {
  refuseReason: string,
  isShow: boolean,
  message: string,
  toastShow: boolean,
  toastMessage: string,
}

@inject('user')
@observer
export default class RefuseUpdateInvitation extends React.Component <IModalProps, IModalState> {
  constructor(props) {
    super(props);
    this.state = {
      refuseReason: "",
      isShow: false,
      message: '',
      toastMessage: '',
      toastShow: false,
    };
  }

  validateFun() {
    const { refuseReason } = this.state;
    if (!refuseReason) {
      this.setState({ isShow: true, message: '请输入拒绝原因' });
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { onClose, user } = this.props;
    const { isShow, message, refuseReason } = this.state;
    return (
      <div className='model-refuse'>
        <div className="refuse-content model-container">
          <div className="model-header">
            拒绝会面
            <img src={close} alt="" onClick={() => {
              onClose();
            }}/>
          </div>
          <div className="model-body">
            <div className="rc-group">
              <p>拒绝原因<i>*</i></p>
              <textarea className="rc-textarea" placeholder="请在此输入您想要对TA说的话（400字内）" maxLength={400}
                        onChange={async (e) => {
                          this.setState({
                            refuseReason: e.target.value,
                          });
                        }}/>
            </div>
          </div>
          <div className="model-footer">
            <input type="button" className="btn btn-submit" value="确认"
                   onClick={async () => {
                     let isValidate: any = this.validateFun();
                     if (isValidate) {
                       const { invitationGuid } = this.props;
                       const params = {
                         invitationGuid,
                         invitationRemarks: refuseReason,
                       };
                       const isSuccess: object = await user.inviterRefuse(params);
                       if (_isObject(isSuccess)) {
                         this.setState({
                           isShow: true,
                           message: isSuccess['message'],
                         });
                       } else {
                         this.setState({
                           toastShow: true,
                           toastMessage: "您拒绝了对方修改会面时间",
                         });
                         onClose();
                         setTimeout(() => {
                           user.invitationStatusChange({ currentPage: 1 });
                         }, 3000);
                       }
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
                             this.setState({ isShow: false });
                           }}
          />
        }
        {this.state.toastShow && <Toast
          onClose={() => {
            this.setState({ toastShow: false });
          }}
          duration={3}
          message={this.state.toastMessage}
        />}
      </div>
    );
  }

}
