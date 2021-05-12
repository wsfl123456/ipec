import { action, observable } from "mobx";
import {
  buyerOrderList,
  uploadFile,
  submitDesign,
  buyerOrderDetail,
  cancelOrder,
  getCompanyType,
  getLogistics,
  downloadFile,
  getPayCode,
  eqGalleryPayStatus,
} from "@utils/api";
import { message } from "antd";
import _isEmpty from "lodash/isEmpty";

interface IListParamState {
  userGuid: string;
  payStatue: string | number;
  type: number;
  currentPage: number;
  pageSize: number;
}

class BuyerOrderStore {
  @observable imgShow: boolean = false;
  @observable cancelModal: boolean = false;
  @observable codeModal: boolean = false;
  @observable postAddressModal: boolean = false;
  @observable logisticsModal: boolean = false;
  @observable uploadPicList: any[] = []; // 样品物流凭证
  @observable logisticsNum: string = ""; // 物流单号
  @observable logisticsCompany: string = ""; // 物流公司

  @observable uploadModal: boolean = false;
  @observable uploadDesignList: any[] = []; // 上传设计图

  @observable orderList: any[] = []; // 订单列表
  @observable isLoading: boolean = true;
  @observable seeMore = false;
  @observable noMore = false;
  @observable orderSn: string = "";

  @observable detailList: any = {}; // 订单相亲
  @observable cancelReason = []; // 取消订单理由

  @observable bigImgList: any[] = [];

  @observable weChatPay = "";
  @observable alipay = "";
  @observable curOrder = {};

  @observable userGuid = ""

  @observable listParams: IListParamState = {
    userGuid: "",
    payStatue: "",
    type: 1,
    currentPage: 1,
    pageSize: 10,
  };

  @action clearPay = () => {
    this.weChatPay = "";
    this.alipay = "";
  };

  @action changecurOrder = (i) => {
    this.curOrder = i;
    console.log(i);
  };

  @action changeOrderGUid = (params) =>  {
    this.userGuid = params.userGuid
    this.orderSn = params.orderSn
  }

  // 订单详情
  @action
  async getOrderDetail(params) {
    const { errorCode, result }: any = await buyerOrderDetail(params);
    if (+errorCode === 200) {
      this.detailList = result.data;
      console.log("订单详情", result.data);
    }
  }

  // 大图弹窗是否显示
  // @action
  // changeImgShow(bole, arr ) {
  //   this.imgShow = bole;
  // };

  // 取消原因弹窗
  @action
  changeCancelModal(bole, orderSn) {
    this.cancelModal = bole;
    if (bole) {
      this.orderSn = orderSn;
    }
  }

  // 获取防伪码提示弹窗
  @action
  changeCodeModal(bole) {
    this.codeModal = bole;
  }

  // 查看样品邮寄地址弹窗-
  @action
  changePostAddressModal(bole) {
    this.postAddressModal = bole;
  }

  // 样品物流单号弹窗-
  @action
  changeLogisticsModal(bole, orderSn) {
    this.logisticsModal = bole;
    console.log(orderSn);
    if (bole) {
      this.orderSn = orderSn;
    }
  };

  // 上传产品设计图弹窗
  @action
  changeUploadModal(bole, orderSn?) {
    this.uploadModal = bole;
    if (bole) {
      this.orderSn = orderSn;
    }
  }

  // 取消订单理由
  @action
  async getCancelReason() {
    const { errorCode, result }: any = await getCompanyType({ type: 13 });
    if (+errorCode === 200) {
      this.cancelReason = result;
    }
  }

  // 取消订单
  @action
  async cancelOrderState(params) {
    params.payStatue = -1;
    const { errorCode, result }: any = await cancelOrder(params);
    if (+errorCode === 200) {
      message.success("成功取消订单");
      this.getOrderList()
      this.getOrderDetail({ userGuid: this.userGuid, orderSn: this.orderSn })
      return { statue: true };
    } else {
      message.error("取消订单失败，请联系客服");
      return { statue: true };
    }
  }

  // 上传设计搞图片
  // type: 1 设计稿，2 物流凭证

  @action
  uploadDesign = (e, type) => {
    if (type === 1) {
      if (this.uploadDesignList.length > 4) {
        message.error("最多上传五张！");
        return false;
      }
    } else {
      if (this.uploadPicList.length > 4) {
        message.error("最多上传五张！");
        return false;
      }
    }

    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 20;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, type: 1, urlType: true };
      if (file.size > max_size) {
        message.error("图片过大,请重新上传！");
        return false;
      }
      const { errorCode, result }: any = await uploadFile(params);
      if (+errorCode === 200 && result.errorCode === 200) {
        const {
          data: fileName,
          mapDate: { picUrl: fileUrl },
        } = result;
        type === 1
          ? this.uploadDesignList.push(fileName)
          : this.uploadPicList.push(fileName);
      } else {
        message.error({
          title: result.errorMsg,
        });
      }
    };
  };

  // 提交设计稿待卖家监修
  @action
  async submitDesignList(orderSn) {
    if (this.uploadDesignList.length < 1) {
      message.warning("请至少先上传一张设计图");
      return false;
    }
    // 获取url去掉最后斜杠后面得字符串
    let arr = [];
    this.uploadDesignList.forEach((i) => {
      const index = i.lastIndexOf("/");
      arr.push(i.substring(index + 1, i.length));
    });
    const data = {
      fileUrl: arr.join(","),
      orderSn,
    };
    const { errorCode, result }: any = await submitDesign(data);
    if (+errorCode === 200) {
      message.success("提交成功");
      this.getOrderList()
      this.getOrderDetail({ userGuid: this.userGuid, orderSn: orderSn })
      return { status: true };
    }
  }

  // 填写样品物流单号待卖家监修
  @action
  async submitLogistics(orderSn) {
    if (!this.logisticsNum) {
      message.warning("请填写样品物流单号");
      return false;
    } else if (!this.logisticsCompany) {
      message.warning("请填写物流公司");
      return false;
    }
    // 获取url去掉最后斜杠后面得字符串
    let arr = [];
    this.uploadPicList.forEach((i) => {
      const index = i.lastIndexOf("/");
      arr.push(i.substring(index + 1, i.length));
    });
    const data = {
      samplePicUrl: arr.join(","),
      orderSn,
      waybill: this.logisticsNum,
      logisticsCompany: this.logisticsCompany,
    };
    const { errorCode, result }: any = await getLogistics(data);
    if (+errorCode === 200) {
      message.success("提交成功");
      this.getOrderList()
      this.getOrderDetail({ userGuid: this.userGuid, orderSn: this.orderSn })
      return { status: true };
    } else {
      message.success("提交样品物流单号失败，请联系客服");
      return { status: true };
    }
  }

  // 订单列表
  @action
  async changeListParams(params) {
    this.listParams = { ...this.listParams, ...params };
    await this.getOrderList();
  }

  @action
  async getOrderList() {
    const {
      userGuid,
      payStatue,
      type,
      currentPage,
      pageSize,
    } = this.listParams;
    this.isLoading = true;
    const { errorCode, result }: any = await buyerOrderList({
      userGuid,
      payStatue,
      type,
      currentPage,
      pageSize,
    });
    if (+errorCode === 200) {
      currentPage === 1
        ? (this.orderList = result.data)
        : (this.orderList = [...this.orderList, ...result.data]);
      this.isLoading = _isEmpty(result.data);
      if (!_isEmpty(this.orderList)) {
        this.seeMore = true;
        this.noMore = false;
        if (result.data.length < pageSize) {
          this.isLoading = false;
          this.seeMore = false;
          this.noMore = true;
        }
      } else {
        this.seeMore = false;
        this.noMore = false;
      }
      // this.orderList.push(result.data[0]);
    }
  }

  // 提醒卖家监修
  @action
  remindSellerRepair() {
    console.log("提醒");
    message.success("提醒发送成功");
  }

  //  提醒卖家审核
  @action
  remindSellerExamine() {
    message.success("提醒发送成功");
  }

  // 下载IP图库-已有url
  @action
  download = (url) => {
    const eleLink = document.createElement("a");
    eleLink.style.display = "none";
    eleLink.target = "_blank";
    eleLink.href = url;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };

  // 下载IP图库- 获取Url
  @action
  async downloadFun(params) {
    const { errorCode, result }: any = await downloadFile(params);
    if (+errorCode === 200) {
      console.log("文件路径", result);
      this.download(result && result.data);
      this.getOrderList()
    }
  }

  /**
   * 获取支付二维码
   */
  @action
  getPayCode = async (obj) => {
    const params = {
      ...obj,
    };
    const { result: data }: any = await getPayCode(params);
    if (obj.payMethod === 2) this.weChatPay = data.data;
    if (obj.payMethod === 7) this.alipay = data.data;
  };
  /**
   * 获取支付状态
   */
  @action
  getPayStatus = async (param) => {
    const params = {
      userGuid: param.userGuid,
      sn: this.detailList.orderSn,
    };
    const {
      result: { data, errorCode },
    }: any = await eqGalleryPayStatus(params);
    if (errorCode == 200) {
      message.success("支付成功");
      this.weChatPay = "";
      this.alipay = "";
      this.getOrderList()
      this.getOrderDetail({ userGuid: this.userGuid, orderSn: this.orderSn })
    }
    return { code: data.errorCode, errorMessage: data.errorMsg };
  };
}

export default new BuyerOrderStore();
