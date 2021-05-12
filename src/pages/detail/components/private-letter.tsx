/**
 * blance.xue
 * 私信
 */
import * as React from 'react';
import close from "assets/images/ic_close.svg";
import '@assets/scss/private_letter.scss';
import Alert from '@components/alert';
import { sendPrivateLetter } from '@utils/api';

interface IPrivateLetterProp {
  onClose: Function;
  data: any;
}

interface IPrivateLetterState {
  messageContent: string,
  messageType: number,
  receiveName: string,
  show: boolean,
  message: string,
}

export default class PrivateLetter extends React.Component<IPrivateLetterProp, IPrivateLetterState> {
  constructor(props) {
    super(props);
    this.state = {
      messageContent: '',
      messageType: 1,
      receiveName: '',
      show: false,
      message: '',
    };
  }

  componentDidMount(): void {
    const { data: { companyDetailVO: { companyName } } } = this.props;
    this.setState({
      receiveName: companyName,
    });
  }

  async sendPrivateLetter() {
    let { messageContent, messageType, show, message } = this.state;
    const { data: { companyDetailVO: { companyName, userGuid: companyGuid }, userGuid } } = this.props;
    if (!companyGuid) {
      this.setState({ show: true, message: '接受消息用户不能为空' });
      return false;
    }
    if (!messageContent) {
      this.setState({ show: true, message: '请输入您想要对TA说的话' });
      return false;
    }

    const data = {
      newContent: messageContent,
      receiverGuid: companyGuid,
      senderGuid: userGuid
    };
    const { errorCode, result }: any = await sendPrivateLetter(data);
    if (errorCode === '200' && result) {
      this.props.onClose();
    } else {
      this.setState({
        show: true,
        message: result
      });
    }
  }

  render() {
    const { onClose, data: { companyDetailVO: { companyName } } } = this.props;
    return (
      <div className="model">
        <div className="content">
          <div className="title">
            私信TA
            <img src={close} onClick={async () => {
              onClose();
            }} alt=""/>
          </div>
          <div className="center">
            <div className="form-group   flex-column">
              <input
                type="text"
                className="form-control read-only"
                value={companyName}
                readOnly
              />
            </div>
            <div className="form-group   flex-column">
              <textarea placeholder="请在此输入您想要对TA说的话（800字内）" onChange={e => {
                const value = e.target.value.replace(/ /g, '');
                if (value.length > 400) {
                  this.setState({
                    show: true,
                    message: '原因不能超出400字'
                  });
                  return;
                }
                this.setState({
                  messageContent: value
                });
              }} cols={30} rows={10}/>
            </div>
          </div>
          <div className="footer">
            <button onClick={async () => {
              await this.sendPrivateLetter();
            }}>确认
            </button>
            <button className="resolve" onClick={() => {
              onClose();
            }}>取消
            </button>
          </div>
        </div>
        {
          this.state.show &&
          <Alert message={this.state.message}
                 onClose={() => {
                   this.setState({
                     show: false,
                   });
                 }}
                 onSubmit={() => {
                 }}
          />
        }
      </div>
    );
  }

}
