import icon_silver from '@assets/images/user/vip/silver.png';
import icon_golden from '@assets/images/user/vip/gold.png';
import icon_diamond from '@assets/images/user/vip/diamond.png';

export enum PayMethod {
  AliPay = 1,
  WeChatPay = 2,
  UnionPay = 3,
}

export enum CardType {
  Year = 3,
}

export enum MemberLevel {
  None = 0,
  silver= 1,
  Gold = 2,
  Diamond = 3,
}

export const modalTitle = {
  [MemberLevel.silver]: '白银VIP会员年卡',
  [MemberLevel.Gold]: '黄金VIP会员年卡',
  [MemberLevel.Diamond]: '钻石VIP会员年卡',
};

export const modalIcon = {
  [MemberLevel.silver]: icon_silver,
  [MemberLevel.Gold]: icon_golden,
  [MemberLevel.Diamond]: icon_diamond,
};

export type Card = {
  actualAmount: number,
  discount: number,
  memberLevel: number,
  paymentAmount: number,
  remark: string,
  type: number,
};
export const couponTitle = {
  [MemberLevel.Diamond]: '16044.00元优惠券(钻石年卡可用)',
  [MemberLevel.Gold]: '2949.00元优惠券(黄金年卡可用)',
  [MemberLevel.silver]: '499.00元优惠券(白银年卡可用)',
};
export const couponNum = {
  [MemberLevel.Diamond]: '16044',
  [MemberLevel.Gold]: '2949',
  [MemberLevel.silver]: '499',
};

export interface IDoubleElevenStore {
  visible: boolean,
  memberLevel: MemberLevel,
  setVisible: (visible: boolean, memberLevel?: MemberLevel) => Promise<void>,
  cardType: CardType,
  setCardType: (
    type?: CardType,
    paymentAmount?: number,
    body?: string,
    return_url?: string,
    subject?: string,
    totalFee?: number,
  ) => Promise<void>,
  setClear: () => void,
  payMethod: PayMethod,
  isLoading: boolean,
  setPayMethod: (method: PayMethod) => void,
  agree: boolean,
  setAgree: () => void,
  cards: Card[],
  qrCode: any,
  showPrice: number,
  showMask: boolean,
  setMask: (mask?: boolean) => void,
  payStatus: () => Promise<void>,
  setLoading: (val: boolean) => void,
  agreementVisible: boolean,
  setAgreement: (visible: boolean) => void,
}
