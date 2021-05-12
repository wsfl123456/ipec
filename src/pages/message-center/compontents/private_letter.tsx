import * as React from 'react';
import icon_return from 'assets/images/message-center/ic_return.svg';
import headImg from '@assets/images/user.svg';
import { inject, observer } from "mobx-react";
import { sendPrivateLetter } from '@utils/api'
import Alert from "@components/alert";

interface IPrivateProps extends IComponentProps {
  userGuid?: string,
  returnFun: Function;
}

interface IPriState {
  privateLetterGuid: any,
  receiverGuid: any,
  senderGuid: any,
  newContent: string,
  isShow: boolean,
  message: string,
}

@inject('message', 'login')
@observer
export default class PrivateLetter extends React.Component <IPrivateProps, IPriState> {
  constructor(props) {
    super(props);
    this.state = {
      newContent: '',
      privateLetterGuid: window.localStorage.getItem('privateLetterGuid'),
      senderGuid: window.localStorage.getItem('senderGuid'),
      receiverGuid: window.localStorage.getItem('receiverGuid'),
      isShow: false,
      message: ''
    }
  }

  async componentDidMount() {
    const { message, login } = this.props;
    const { privateLetterGuid } = this.state;
    const userGuid = login.userInfo.userGuid;
    const params = {
      userGuid,
      privateLetterGuid,
      currentPage: 1,
      pageSize: 20
    };
    await message.getReplyList(params);
    await this.scrollChat();
  }

  // 进入聊天框滚动条处于最底部[y轴滚动条到最下]
  async scrollChat() {
    let chatBox = document.getElementById("chat-box");
    if (chatBox) {
      // let offsetHeight = chatBox.offsetHeight; // 元素高度 -- div可视高度
      let clientHeight = chatBox.clientHeight; // 内部可视区高度
      let scrollHeight = chatBox.scrollHeight; // 内容的实际高度➕上下padding
      chatBox.scrollTop = scrollHeight - clientHeight;
    }
  }

  // 查看私信内容 -- 点击回复按钮
  async sendBtnLetter() {
    const {login} = this.props;
    const { privateLetterGuid } = this.state;
    const userGuid = login.userInfo.userGuid;
    const params = {
      newContent: this.state.newContent,
      receiverGuid: this.state.receiverGuid === userGuid ? this.state.senderGuid : this.state.receiverGuid,
      senderGuid: login.userInfo.userGuid, // 发送人的Guid一定是自己的Guid
    };
    if (!params.newContent) {
      this.setState({ isShow: true, message: '请输入私信内容' });
    } else {
      const { errorCode }: any = await sendPrivateLetter(params);
      this.setState({
        newContent: ''
      });
      if (errorCode === '200') {
        const { message } = this.props;
        const params = {
          userGuid: login.userInfo.userGuid,
          privateLetterGuid,
          currentPage: 1,
          pageSize: 20
        };
        await message.getReplyList(params);
      }
      await this.scrollChat();
    }
  }

  render() {
    const { returnFun, message } = this.props;
    const { replyList } = message;
    const userName = window.localStorage.getItem('userName');
    const showTime = new Date();
    const Y = showTime.getFullYear() + '-';
    const M = ((showTime.getMonth() + 1) < 10 ? '0' + (showTime.getMonth() + 1) : showTime.getMonth() + 1) + '-';
    const d = (showTime.getDate() < 10 ? '0' + showTime.getDate() : showTime.getDate());
    const todayTime = Y + M + d;

    return (
      <div className="private-content">
        <p className="p-title">
          <img src={icon_return} alt="" onClick={() => {
            returnFun();
          }}/>
          {userName}与你的私信</p>
        <div className='content-user' id='chat-box'>
          {
            replyList && replyList.map((item, index) => {
              return (
                <div className="p-main" key={index}>
                  {
                    item.isSelf === 0 &&
                    <div className="p-he">
                      <img src={item.picUrlSelf || headImg} className="head-img" alt=""/>
                      <p>{item.content}</p>
                      <span
                        className="p-date">{todayTime !== item.createDateStr.split(' ')[0] ? item.createDateStr : '今天' + ' ' + item.createDateStr.split(' ')[1]}</span>
                    </div>
                  }
                  {
                    item.isSelf === 1 &&
                    <div className="p-me">
                      <span
                        className="p-date">{todayTime !== item.createDateStr.split(' ')[0] ? item.createDateStr : '今天' + ' ' + item.createDateStr.split(' ')[1]}</span>
                      <p>{item.content}</p>
                      <img src={item.picUrlSelf || headImg} className="head-img" alt=""/>
                    </div>
                  }
                </div>
              )
            })
          }
        </div>

        <div className="p-operation">
          <div className="p-words">
            <img src={headImg} className="head-img" alt=""/>
            <textarea
              placeholder="请在此输入您想要对TA说的话（120字内）"
              maxLength={120}
              value={this.state.newContent}
              onChange={(e) => {
                const newContent = e.target.value;
                this.setState({
                  newContent
                });
              }}
          />
          </div>
          <button
            onClick={async () => {
              await this.sendBtnLetter();
            }}>回复
          </button>
        </div>
        {this.state.isShow && <Alert
          message={this.state.message}
          onClose={() => {
            this.setState({ isShow: false });
          }}
          onSubmit={() => {
          }}
        />
        }
      </div>
    )
      ;
  }
}
