import { action, observable } from "mobx";
import { Card, CardType, IDoubleElevenStore, MemberLevel, PayMethod } from "@pages/double-eleven/components/vip";
import { generatePay, getLevelAmount, getScrollAmount, isPaySuccess } from "@utils/api";

class DoubleElevenStore implements IDoubleElevenStore {
  @observable visible = false;
  @observable memberLevel = MemberLevel.None;
  @observable cardType = CardType.Year;
  @observable payMethod: PayMethod = PayMethod.WeChatPay;
  @observable agree: boolean = true;
  @observable qrCode: any;
  @observable cards: Card[];
  @observable showPrice: number = 0;
  @observable showMask: boolean = false;
  @observable isLoading: boolean;

  @observable agreementVisible: boolean = false;

  @observable doubleNum: Array<string> = [];

  /**
   * 显示 Modal 视图, 关闭时可以不传会员等级参数
   * @param visible 显示布尔
   * @param memberLevel 会员等级
   */
  @action
  async setVisible(visible: boolean, memberLevel?: MemberLevel) {
    this.visible = visible;
    if (memberLevel) {
      this.memberLevel = memberLevel;
      await this.getMemberData();
      await this.setCardType(CardType.Year, 0);
    }
  }

  @action
  setLoading(val: boolean = false) {
    this.isLoading = val;
  }

  // 金额
  @action
  async getMemberData() {
    const { errorCode: code, result: data }: any = await getLevelAmount({ memberLevel: this.memberLevel });
    if (code === '200') {
      this.cards = data.map((v: Card) => ({
        actualAmount: v.actualAmount,
        discount: v.discount,
        memberLevel: v.memberLevel,
        paymentAmount: v.paymentAmount,
        remark: v.remark,
        type: v.type,
      }));
    }
  }

// 支付订单  二维码
  @action
  async setCardType(
    type?: CardType,
    paymentAmount?: number,
    body?: string,
    return_url?: string,
    subject?: string,
    totalFee?: number,
  ) {
    if (type) {
      this.cardType = type;
      this.showPrice = paymentAmount;
    }
    const { userGuid } = JSON.parse(localStorage.getItem('user'));
    const { errorCode, result }: any = await generatePay({
      // required
      userGuid,
      memberLevel: this.memberLevel,
      payMethod: this.payMethod,
      type: this.cardType,
      // optional
      body,
      return_url,
      subject,
      totalFee
    });
    if (errorCode === '200') {
      this.qrCode = 'data:image/png;base64,' + result;
      this.setLoading();
    } else {
      this.setLoading();
    }
  }

  @action
  setClear() {
    this.cardType = CardType.Year;
    this.payMethod = PayMethod.WeChatPay;
    this.visible = false;
  }

  @action
  setPayMethod(method: PayMethod) {
    this.payMethod = method;
  }

  @action
  setAgree() {
    this.agree = !this.agree;
  }

  @action
  setMask(mask?: boolean) {
    if (mask) {
      this.showMask = mask;
    } else {
      this.showMask = !this.showMask;
    }
  }

  // 支付状态
  @action
  async payStatus() {
    const { userGuid } = JSON.parse(localStorage.getItem('user'));
    const { errorCode, result }: any = await isPaySuccess({
      userGuid,
      memberLevel: this.memberLevel,
      payMethod: this.payMethod,
      type: this.cardType,
    });
    if (errorCode === '200' && result.data) {
      this.visible = false;
    }
  }

  /**
   * 支付协议弹出框
   */
  @action
  setAgreement(visible: boolean) {
    this.agreementVisible = visible;
  }

  // 获取双十一会员滚动数据
  @action
  async getScrollNum() {
    const { errorCode, result }: any = await getScrollAmount();
    if (errorCode === '200') {
      console.log(result);
      const num = (Array(4).join('0') + result).slice(-4);
      this.doubleNum = (num.toString()).split('');
    }
  }
}

export default new DoubleElevenStore();
