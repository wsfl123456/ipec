export enum PayMethod {
  AliPay = 1,
  WeChatPay = 2,
  UnionPay = 3,
}

export enum CardType {
  Month = 1,
  HalfAYear = 2,
  Year = 3,
}

export enum MemberLevel {
  None = 0,
  Authorized = 1,
  Gold = 2,
  Diamond = 3,
  Custom = 4
}

export type Card = {
  actualAmount: number,
  discount: number,
  memberLevel: number,
  paymentAmount: number,
  remark: string,
  type: number,
};

export interface IVipStore {
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
