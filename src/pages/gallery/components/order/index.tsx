import * as React from "react";
import { observer, inject } from "mobx-react";

import {
  Upload,
  message,
  Button,
  Input,
  InputNumber,
  Select,
  Icon,
  Checkbox,
  Cascader,
  Form,
} from "antd";
import "@assets/scss/gallery.scss";
import { Link } from "react-router-dom";
import {} from "@utils/api";
import { bytesToSize } from "@utils/util";
import Add from "@assets/images/add.svg";
import Toast from "@components/toast";
import GalleryPay from "./pay";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Selected from "@assets/images/vip-card/selected.png";
import ic_clear from "@assets/images/ic_clear.png";
import success_icon from "@assets/images/success-icon.png";

import Bianzu from "../../assets/images/gallery/bianzu.png";
import Xuantu from "../../assets/images/gallery/xuantu.png";
import Maitu from "../../assets/images/gallery/maitu.png";
import Download from "../../assets/images/gallery/download.png";
import Youji from "../../assets/images/gallery/youji.png";
import Liangchan from "../../assets/images/gallery/liangchan.png";
class OrderForm extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { errorCode, errorMessage } = await this.props.saveAddress();
        this.props.vm.setState({
          showToast: true,
          toastMsg: errorMessage,
        });
        if (+errorCode === 200) {
          this.handleReset();
          this.closeModal();
          this.props.getAddressList();
        }
      }
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  closeModal() {
    this.handleReset();
    this.props.vm.setState({
      showAddressModal: false,
    });
    this.props.changecurPhone();
    this.props.changeAddressParams({
      consignee: "",
      mobile: "",
      address: [],
      addressDetail: "",
      postcode: "",
      isDefault: false,
      addressGuid: "",
    });
  }

  render() {
    const {
      form,
      listDistrict,
      addressParams,
      changeAddressParams,
      curPhone,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="vertical">
        <Form.Item label="收货人">
          {getFieldDecorator("consignee", {
            initialValue: addressParams.consignee,
            rules: [
              {
                required: true,
                message: "请输入收货人姓名",
              },
              {
                max: 25,
                message: "字段长度不能超过25",
              },
            ],
          })(<Input placeholder="请输入收货人姓名" />)}
        </Form.Item>
        <Form.Item label="手机号码">
          {!!addressParams.addressGuid && curPhone === addressParams.mobile
            ? getFieldDecorator("mobile", {
                initialValue: addressParams.mobile,

                rules: [
                  {
                    required: true,
                    message: "请输入收货人手机号码",
                  },
                ],
              })(<Input placeholder="请输入收货人手机号码" />)
            : getFieldDecorator("mobile", {
                initialValue: addressParams.mobile,
                validateTrigger: "onInput",
                rules: [
                  {
                    required: true,
                    message: "请输入收货人手机号码",
                  },
                  {
                    pattern: "^((0\\d{2,3}-\\d{7,8})|(1[3-9]\\d{9}))$",
                    message: "请输入正确的手机号码",
                  },
                ],
              })(<Input placeholder="请输入收货人手机号码" />)}
        </Form.Item>
        <Form.Item label="所在地区">
          {getFieldDecorator("address", {
            initialValue: addressParams.address,

            rules: [
              {
                required: true,
                message: "请选择省/市/区/街道",
              },
            ],
          })(
            <Cascader
              options={listDistrict}
              placeholder="请选择省/市/区/街道"
            />
          )}
        </Form.Item>
        <Form.Item label="详细地址">
          {getFieldDecorator("addressDetail", {
            initialValue: addressParams.addressDetail,

            rules: [
              {
                required: true,
                message:
                  "请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息",
              },
              {
                max: 200,
                message: "字段长度不能超过200",
              },
            ],
          })(
            <Input placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息" />
          )}
        </Form.Item>
        <Form.Item label="邮政编码">
          {getFieldDecorator("postcode", {
            initialValue: addressParams.postcode,

            rules: [
              {
                required: true,
                message: "请输入邮编",
              },
              {
                pattern: "^[1-9]\\d{5}$",
                message: "请输入正确的邮编",
              },
            ],
          })(<Input placeholder="请输入邮编" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("isDefault", {
            initialValue: addressParams.isDefault,
          })(
            <Checkbox checked={addressParams.isDefault}>
              设置为默认地址
            </Checkbox>
          )}
        </Form.Item>
        <div className="bth-group">
          <div className="btn_primary_fl" onClick={this.handleSubmit}>
            提交
          </div>
          <div className="btn_default_fl" onClick={() => this.closeModal()}>
            取消
          </div>
        </div>
      </Form>
    );
  }
}

const WrappedOrderForm = Form.create({
  name: "order-form",
  onFieldsChange(prop: any, changedFields: { value }) {
    prop.changeAddressParams({
      [Object.keys(changedFields)[0]]: Object.values(changedFields)[0].value,
    });
  },
})(OrderForm) as any;

@inject("gallery_order_store", "login")
@observer
export default class GalleryIndex extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      galleryInfo: {
        authorizeType: "",
        duration: "",
        productionQuantityMin: "",
        productionQuantityMax: "",
        price: "",
      },
      showAddressModal: false,
      showPayModal: true,
      isEditAddress: false,
      showToast: false,
      toastMsg: "",
      securityPrice: 0.01,
      paySuccess: false,
      downloadUrl: ""
    };
  }

  async componentDidMount() {
    const {
      gallery_order_store,
      login,
      location: { search },
      match: { params },
    } = this.props;
    const {
      changeUserInfo,
      changegalleryGuid,
      getGalleryDetail,
      getAddressList,
      getListDistrict,
      refreshData,
    } = gallery_order_store;
    /* 每次进入页面刷新数据 。。。。。 */
    refreshData();

    this.setState({
      galleryInfo: {
        authorizeType: unescape(params["type"]),
        duration: unescape(params["duration"]),
        productionQuantityMin: unescape(params["numMin"]),
        productionQuantityMax: unescape(params["numMax"]),
        price: unescape(params["price"]),
      },
    });
    changeUserInfo(login.userInfo);
    changegalleryGuid(unescape(params["galleryGuid"]));
    getGalleryDetail();
    getAddressList();
    getListDistrict();
  }

  createAddress() {
    const { gallery_order_store } = this.props;
    const { addressList } = gallery_order_store;
    if (!!addressList && addressList.length < 5) {
      this.visibleModal(true, false);
    } else {
      this.setState({ showToast: true, toastMsg: "最多可创建5个收货地址" });
    }
  }

  editModal(i) {
    const { gallery_order_store } = this.props;
    const { changeAddressParams } = gallery_order_store;
    changeAddressParams(
      {
        consignee: i.consignee,
        mobile: i.mobile,
        address: i.address.split(","),
        addressDetail: i.addressDetail,
        postcode: i.postcode,
        isDefault: i.isDefault === 1 ? true : false,
        addressGuid: i.addressGuid,
      },
      true
    );
    this.visibleModal(true, true);
  }

  visibleModal(bol, isEdit) {
    const { gallery_order_store } = this.props;
    const { changeAddressParams, changecurPhone } = gallery_order_store;
    if (!bol) {
      changeAddressParams({
        consignee: "",
        mobile: "",
        address: [],
        addressDetail: "",
        postcode: "",
        isDefault: false,
        addressGuid: "",
      });
      changecurPhone();
    }
    this.setState({ showAddressModal: bol, isEditAddress: !!isEdit });
  }

  verifyOrrder = async () => {
    const { gallery_order_store } = this.props;
    const {
      orderParams,
      galleryGuid,
      userInfo,
      newOrder,
      getPayCode,
    } = gallery_order_store;
    const { securityPrice, galleryInfo } = this.state;
    if (!orderParams.productionQuantity) {
      this.setState({
        showToast: true,
        toastMsg: "请输入具体生产数量",
      });
      return;
    }
    if (!orderParams.addressGuid) {
      this.setState({
        showToast: true,
        toastMsg: "请选择收货地址",
      });
      return;
    }
    const ipGalleryPriceVO = {
      ...galleryInfo,
    };
    const params = {
      ipGalleryPriceVO,
      price: galleryInfo.price,
      securityCodePrice:
        (+orderParams.productionQuantity * securityPrice * 100) / 100 +
        Number(galleryInfo.price),
      ...orderParams,
      galleryGuid,
      userGuid: userInfo.userGuid,
    };
    const { errorCode, data, errorMsg } = await newOrder(params);
    if (+errorCode === 200) {
      getPayCode({
        sn: data.orderSn,
        payMethod: 2,
      });
      getPayCode({
        sn: data.orderSn,
        payMethod: 7,
      });
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  };

  changepaySuccess = (bol) => {
    this.setState({
      paySuccess: bol,
    });
  };

  async downloadGallery() {
    const {
      gallery_order_store,
      location: { search },
    } = this.props;
    const { downloadGallery } = gallery_order_store;
    const { data, errorCode, errorMsg } = await downloadGallery();
    if (+errorCode === 200) {
      this.setState({
        paySuccess: false,
        downloadUrl: data
      });
      // const ele = document.createElement("a");
      const $a = document.getElementById("gallery-download")
      $a.click()
      // ele.setAttribute("href", data); //设置下载文件的url地址
      // ele.click();

    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  }

  render() {
    const {
      gallery_order_store,
      location: { search },
    } = this.props;
    const {
      galleryDetail,
      addressList,
      changeOrderParams,
      listDistrict,
      addressParams,
      saveAddress,
      updateAddress,
      changecurPhone,
      curPhone,
      getAddressList,
      changeAddressParams,
      orderParams: { addressGuid, productionQuantity, securityCodePrice },
      orderParams,
      weChatPay,
      alipay,
      getPayStatus,
      changePayCode,
      downloadGallery,
    } = gallery_order_store;
    const {
      galleryInfo: {
        authorizeType,
        duration,
        productionQuantityMin,
        productionQuantityMax,
        price,
      },
      galleryInfo,
      securityPrice,
      showPayModal,
      paySuccess,
      downloadUrl
    } = this.state;
    return (
      <div className="gallery gallery-order">
        <a id="gallery-download" href={downloadUrl} download style={{display:"none"}}></a>
        <div className="area">
          <div className="gallery-order__card">
            <p>填写并核对订单信息</p>
            <div>
              <div className="card-title">确认图库授权订单</div>
              <table>
                <thead>
                  <tr>
                    <th>图库商品</th>
                    <th>授权品类</th>
                    <th>授权期限</th>
                    <th>授权生产数量 </th>
                    <th>授权金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>
                        <img src={galleryDetail.picUrl} alt="" />
                        <div>
                          <p>{galleryDetail.title}</p>
                          <p>
                            尺寸、分辨率：
                            {!!galleryDetail.ipGalleryFileVO &&
                              galleryDetail.ipGalleryFileVO.resolvingPower}
                          </p>

                          <p>
                            文件大小：
                            {!!galleryDetail.ipGalleryFileVO &&
                              bytesToSize(
                                +galleryDetail.ipGalleryFileVO.fileSize
                              )}
                          </p>
                          <p>
                            文件格式：
                            {!!galleryDetail.ipGalleryFileVO &&
                              galleryDetail.ipGalleryFileVO.fileFormat}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{authorizeType}</td>
                    <td>{duration}个月</td>
                    <td>{`${productionQuantityMin}-${productionQuantityMax}`}</td>
                    <td className="price">¥ {price}</td>
                  </tr>
                </tbody>
              </table>
              <div className="warning">
                <Icon type="warning" theme="filled" />
                商品防伪码根据商品的具体属性和生产数量在下单时从平台统一采购，以确保版权方和生产方实现产品全生命周期的追溯管理，每个环节有据可查有责可追。
              </div>
              <div className="security-code">
                <div>
                  <div className="card-title">
                    具体生产数量<span style={{ color: "#E02020" }}>*</span>
                  </div>
                  <InputNumber
                    value={productionQuantity}
                    onChange={(e: any) => {
                      changeOrderParams({ productionQuantity: e });
                    }}
                  ></InputNumber>
                </div>
                <div>
                  <Icon type="close" />
                </div>
                <div>
                  <div className="card-title">防伪码价格（元/个）</div>
                  <InputNumber value={securityPrice} disabled></InputNumber>
                </div>
                <div>
                  <span>=</span>
                </div>
                <div className="security-price">
                  <div className="card-title ">防伪码总价格（元）</div>
                  <InputNumber
                    value={(+productionQuantity * securityPrice * 100) / 100}
                    disabled
                  ></InputNumber>
                </div>
              </div>
              <div className="sure-order">
                <div className="sure-order-label">
                  <div className="order-title">
                    <div>
                      选择收货地址<span style={{ color: "#E02020" }}>*</span>
                    </div>
                    {!!addressList && !!addressList.length && (
                      <div>
                        请选择收货地址，便于我们给您邮寄发票和防伪码；您已创建了
                        <span>{addressList.length}</span>
                        个收货地址，最多可创建<span>5</span>个
                      </div>
                    )}
                  </div>
                  {!!addressList && !!addressList.length && (
                    <div
                      className="add-second"
                      onClick={() => this.createAddress()}
                    >
                      <img src={Add} alt="" />
                      <span>新增收货地址</span>
                    </div>
                  )}
                </div>
                {!!addressList && !addressList.length && (
                  <div className="add-new">
                    <div
                      className="gallery-btn gallery-btn--primary"
                      onClick={() => {
                        this.createAddress();
                      }}
                    >
                      新增收货地址
                    </div>
                    <div>
                      请选择收货地址，便于我们给您邮寄发票和防伪码；您已创建了
                      <span>{addressList.length}</span>
                      个收货地址，最多可创建<span>5</span>个
                    </div>
                  </div>
                )}
                {!!addressList && !!addressList.length && (
                  <div className="list">
                    {addressList.map((i, k) => (
                      <div
                        className={`item ${
                          i.addressGuid === addressGuid && "item--selected"
                        }`}
                        key={k}
                        onClick={() => {
                          changeOrderParams({ addressGuid: i.addressGuid });
                        }}
                      >
                        <div>
                          <span className="name">{i.consignee}</span>
                          {i.isDefault === 1 && (
                            <span className="default">默认地址</span>
                          )}
                          {i.addressGuid === addressGuid && (
                            <span
                              className="edit"
                              onClick={() => this.editModal(i)}
                            >
                              修改
                            </span>
                          )}
                        </div>
                        <div className="bom">
                          <span className="address-detail">
                            {i.addressDetail}
                          </span>
                          <span className="mobile">{i.mobile}</span>
                        </div>
                        {i.addressGuid === addressGuid && (
                          <img src={Selected} alt="" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="method">
                <div className="card-title">配送方式</div>
                <p>
                  <span>普通配送</span>
                  <span>快递</span>
                  <span>免邮费</span>
                </p>
              </div>
            </div>

            <div className="price-sure">
              <p className="price">
                IP图库授权金额：<span>¥ {price}</span>
              </p>
              <p className="price">
                防伪码金额：
                <span>
                  ¥ {(+productionQuantity * securityPrice * 100) / 100}
                </span>
              </p>
              <p className="price">
                应付总金额金额：
                <span className="red">
                  ¥{" "}
                  {(+productionQuantity * securityPrice * 100) / 100 +
                    Number(price)}
                </span>
              </p>
              <p>
                发票和防伪码寄送至：
                <span className="strong">
                  {addressList.find((i) => i.addressGuid == addressGuid) &&
                    addressList.find((i) => i.addressGuid == addressGuid)
                      .addressDetail}
                </span>
              </p>
              <p>
                收货人：
                <span className="strong">
                  {addressList.find((i) => i.addressGuid == addressGuid) &&
                    addressList.find((i) => i.addressGuid == addressGuid)
                      .consignee}
                </span>
                <span className="strong">
                  {addressList.find((i) => i.addressGuid == addressGuid) &&
                    addressList.find((i) => i.addressGuid == addressGuid)
                      .mobile}
                </span>
              </p>
            </div>
            <div className="gallery-btn-group">
              <div
                className="gallery-btn gallery-btn--primary"
                onClick={() => {
                  this.verifyOrrder();
                }}
              >
                提交订单
              </div>
            </div>
          </div>
        </div>
        {this.state.showAddressModal && (
          <div className="gallery-address-modal">
            <div className="area">
              <div className="title">
                <span>
                  {this.state.isEditAddress ? "修改" : "新增"}收货人信息
                </span>
                <img
                  src={Ic_clear}
                  onClick={() => this.visibleModal(false, false)}
                  alt=""
                />
              </div>
              <div className="form">
                <WrappedOrderForm
                  listDistrict={listDistrict}
                  addressParams={addressParams}
                  saveAddress={saveAddress}
                  updateAddress={updateAddress}
                  isEditAddress={this.state.isEditAddress}
                  changecurPhone={changecurPhone}
                  curPhone={curPhone}
                  vm={this}
                  getAddressList={getAddressList}
                  changeAddressParams={changeAddressParams}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.toastMsg}
          />
        )}
        {alipay && weChatPay && (
          <GalleryPay
            galleryInfo={galleryInfo}
            galleryDetail={galleryDetail}
            orderParams={orderParams}
            getPayStatus={getPayStatus}
            alipay={alipay}
            weChatPay={weChatPay}
            closeModal={changePayCode}
            downloadGallery={downloadGallery}
            changepaySuccess={this.changepaySuccess}
          />
        )}
        {paySuccess && (
          <div className="tips-modal">
            <div className="area">
              <img
                className="clear"
                src={ic_clear}
                onClick={() => {
                  this.setState({ paySuccess: false });
                }}
                alt=""
              />
              <div className="head">
                <img src={success_icon} alt="" />
                <p
                  style={{
                    fontSize: "18px",
                    fontFamily: "PingFangSC-Medium, PingFang SC",
                    fontWeight: 500,
                    color: "#343A40",
                    lineHeight: "25px",
                  }}
                >
                  支付成功
                </p>
              </div>
              <div className="body-error">
                <p style={{ textAlign: "center" }}>
                  恭喜您已成功购买{galleryDetail.title}
                  {galleryInfo.authorizeType}
                  {galleryInfo.duration}个月授权资格
                </p>
                <p style={{ textAlign: "center" }}>
                  您可以去订单列表页下载高清图库素材源文件，设计相关产品图啦
                </p>
              </div>
              <div className="foot">
                <div
                  onClick={() => {
                    this.downloadGallery();
                  }}
                >
                  立即下载
                </div>
                <div
                  onClick={() => {
                    this.setState({ paySuccess: false });
                  }}
                >
                  取消
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
