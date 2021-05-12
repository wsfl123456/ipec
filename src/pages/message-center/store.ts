import { action, observable } from 'mobx';
import { messageBox, messageReaded, privateLetter, privateLetterList, privateLetterReplyList } from '@utils/api';
import _isEmpty from 'lodash/isEmpty';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';

interface IMessageStatus {
  userGuid: string,
  isRead?: number | string,
  messageType?: number | string,
  currentPage: number,
  pageSize: number,
}

class MessageStore {

  @observable messageData: object[];
  @observable privateData: object[];
  @observable messageBox: object[];
  @observable replyList: object[];
  @observable messageParams: IMessageStatus = {
    userGuid: "",
    isRead: "",
    messageType: 1,
    currentPage: 1,
    pageSize: 20,
  };

  @observable isLoading: boolean = false;
  @observable seeMore: boolean = false;
  @observable noMore: boolean = false;

  @action
  async changeMessageParams(params: IMessageStatus) {
    this.messageParams = { ...this.messageParams, ...params, };
    await this.getMessages();
  }

  /**
   * 系统消息，关注消息
   */
  @action
  async getMessages() {
    const {
      userGuid,
      messageType,
      isRead,
      currentPage,
      pageSize,
    } = this.messageParams;
    const { errorCode, result: { data, totalCount, currentPage: current, totalPage }, errorMessage }: any = await privateLetter({
      userGuid,
      messageType,
      isRead,
      currentPage,
      pageSize,
    });
    this.isLoading = false;
    if (errorCode === '200') {
      if (!_isEmpty(data)) {
        current === 1 ? this.messageData = data : this.messageData = _uniqWith(this.messageData.concat(data), _isEqual);
        if (data.length < pageSize) {
          this.seeMore = false;
          this.noMore = true;
        } else {
          this.seeMore = true;
          this.noMore = false;
        }

      } else {
        if (currentPage === 1) {
          this.messageData = [];
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        this.seeMore = false;
        this.isLoading = false;
      }

    } else {
      return { message: errorMessage, show: true };
    }
  }

  /**
   * 消息盒
   * @param params
   */
  @action
  async getMessageBox(params) {
    const { errorCode, result: data }: any = await messageBox(params);
    if (errorCode === '200') {
      this.messageBox = data;
    }
  }

  /**
   * 设置消息已读
   * @param userGuid
   */
  @action
  async getMessageReaded(userGuid) {
    const { errorCode, result: { errorMsg }, errorMessage }: any = await messageReaded(userGuid);
    if (errorCode === '200') {
      return { message: errorMsg, show: false };
      // console.log(errorMsg);
    } else {
      return { message: errorMessage, show: true };
    }
  }

  /**
   * 私信列表
   */
  async getPrivateLetter(params) {
    const { errorCode, result: { data, totalCount, pageSize, currentPage: current, totalPage }, errorMessage }: any = await privateLetterList(params);
    if (errorCode === '200') {
      if (!_isEmpty(data)) {
        current === 1 ? this.privateData = data : this.privateData = _uniqWith(this.privateData.concat(data), _isEqual);
        if (data.length < pageSize) {
          this.seeMore = false;
          this.noMore = true;
        } else {
          this.seeMore = true;
          this.noMore = false;
        }

      } else {
        if (current === 1) {
          this.privateData = [];
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        this.seeMore = false;
        this.isLoading = false;
      }

    } else {
      return { message: errorMessage, show: true };
    }
  }

  /**
   *  点击查看私信记录
   */
  async getReplyList(params) {
    const { errorCode, result }: any = await privateLetterReplyList(params);
    if (errorCode === '200') {
      this.replyList = result.data;
    }
  }

}

export default new MessageStore();
