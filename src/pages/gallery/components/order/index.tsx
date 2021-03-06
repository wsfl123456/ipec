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
        <Form.Item label="?????????">
          {getFieldDecorator("consignee", {
            initialValue: addressParams.consignee,
            rules: [
              {
                required: true,
                message: "????????????????????????",
              },
              {
                max: 25,
                message: "????????????????????????25",
              },
            ],
          })(<Input placeholder="????????????????????????" />)}
        </Form.Item>
        <Form.Item label="????????????">
          {!!addressParams.addressGuid && curPhone === addressParams.mobile
            ? getFieldDecorator("mobile", {
                initialValue: addressParams.mobile,

                rules: [
                  {
                    required: true,
                    message: "??????????????????????????????",
                  },
                ],
              })(<Input placeholder="??????????????????????????????" />)
            : getFieldDecorator("mobile", {
                initialValue: addressParams.mobile,
                validateTrigger: "onInput",
                rules: [
                  {
                    required: true,
                    message: "??????????????????????????????",
                  },
                  {
                    pattern: "^((0\\d{2,3}-\\d{7,8})|(1[3-9]\\d{9}))$",
                    message: "??????????????????????????????",
                  },
                ],
              })(<Input placeholder="??????????????????????????????" />)}
        </Form.Item>
        <Form.Item label="????????????">
          {getFieldDecorator("address", {
            initialValue: addressParams.address,

            rules: [
              {
                required: true,
                message: "????????????/???/???/??????",
              },
            ],
          })(
            <Cascader
              options={listDistrict}
              placeholder="????????????/???/???/??????"
            />
          )}
        </Form.Item>
        <Form.Item label="????????????">
          {getFieldDecorator("addressDetail", {
            initialValue: addressParams.addressDetail,

            rules: [
              {
                required: true,
                message:
                  "??????????????????????????????????????????????????????????????????????????????????????????",
              },
              {
                max: 200,
                message: "????????????????????????200",
              },
            ],
          })(
            <Input placeholder="??????????????????????????????????????????????????????????????????????????????????????????" />
          )}
        </Form.Item>
        <Form.Item label="????????????">
          {getFieldDecorator("postcode", {
            initialValue: addressParams.postcode,

            rules: [
              {
                required: true,
                message: "???????????????",
              },
              {
                pattern: "^[1-9]\\d{5}$",
                message: "????????????????????????",
              },
            ],
          })(<Input placeholder="???????????????" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("isDefault", {
            initialValue: addressParams.isDefault,
          })(
            <Checkbox checked={addressParams.isDefault}>
              ?????????????????????
            </Checkbox>
          )}
        </Form.Item>
        <div className="bth-group">
          <div className="btn_primary_fl" onClick={this.handleSubmit}>
            ??????
          </div>
          <div className="btn_default_fl" onClick={() => this.closeModal()}>
            ??????
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
    /* ?????????????????????????????? ??????????????? */
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
      this.setState({ showToast: true, toastMsg: "???????????????5???????????????" });
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
        toastMsg: "???????????????????????????",
      });
      return;
    }
    if (!orderParams.addressGuid) {
      this.setState({
        showToast: true,
        toastMsg: "?????????????????????",
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
      // ele.setAttribute("href", data); //?????????????????????url??????
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
            <p>???????????????????????????</p>
            <div>
              <div className="card-title">????????????????????????</div>
              <table>
                <thead>
                  <tr>
                    <th>????????????</th>
                    <th>????????????</th>
                    <th>????????????</th>
                    <th>?????????????????? </th>
                    <th>????????????</th>
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
                            ?????????????????????
                            {!!galleryDetail.ipGalleryFileVO &&
                              galleryDetail.ipGalleryFileVO.resolvingPower}
                          </p>

                          <p>
                            ???????????????
                            {!!galleryDetail.ipGalleryFileVO &&
                              bytesToSize(
                                +galleryDetail.ipGalleryFileVO.fileSize
                              )}
                          </p>
                          <p>
                            ???????????????
                            {!!galleryDetail.ipGalleryFileVO &&
                              galleryDetail.ipGalleryFileVO.fileFormat}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{authorizeType}</td>
                    <td>{duration}??????</td>
                    <td>{`${productionQuantityMin}-${productionQuantityMax}`}</td>
                    <td className="price">?? {price}</td>
                  </tr>
                </tbody>
              </table>
              <div className="warning">
                <Icon type="warning" theme="filled" />
                ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
              </div>
              <div className="security-code">
                <div>
                  <div className="card-title">
                    ??????????????????<span style={{ color: "#E02020" }}>*</span>
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
                  <div className="card-title">?????????????????????/??????</div>
                  <InputNumber value={securityPrice} disabled></InputNumber>
                </div>
                <div>
                  <span>=</span>
                </div>
                <div className="security-price">
                  <div className="card-title ">???????????????????????????</div>
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
                      ??????????????????<span style={{ color: "#E02020" }}>*</span>
                    </div>
                    {!!addressList && !!addressList.length && (
                      <div>
                        ????????????????????????????????????????????????????????????????????????????????????
                        <span>{addressList.length}</span>
                        ?????????????????????????????????<span>5</span>???
                      </div>
                    )}
                  </div>
                  {!!addressList && !!addressList.length && (
                    <div
                      className="add-second"
                      onClick={() => this.createAddress()}
                    >
                      <img src={Add} alt="" />
                      <span>??????????????????</span>
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
                      ??????????????????
                    </div>
                    <div>
                      ????????????????????????????????????????????????????????????????????????????????????
                      <span>{addressList.length}</span>
                      ?????????????????????????????????<span>5</span>???
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
                            <span className="default">????????????</span>
                          )}
                          {i.addressGuid === addressGuid && (
                            <span
                              className="edit"
                              onClick={() => this.editModal(i)}
                            >
                              ??????
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
                <div className="card-title">????????????</div>
                <p>
                  <span>????????????</span>
                  <span>??????</span>
                  <span>?????????</span>
                </p>
              </div>
            </div>

            <div className="price-sure">
              <p className="price">
                IP?????????????????????<span>?? {price}</span>
              </p>
              <p className="price">
                ??????????????????
                <span>
                  ?? {(+productionQuantity * securityPrice * 100) / 100}
                </span>
              </p>
              <p className="price">
                ????????????????????????
                <span className="red">
                  ??{" "}
                  {(+productionQuantity * securityPrice * 100) / 100 +
                    Number(price)}
                </span>
              </p>
              <p>
                ??????????????????????????????
                <span className="strong">
                  {addressList.find((i) => i.addressGuid == addressGuid) &&
                    addressList.find((i) => i.addressGuid == addressGuid)
                      .addressDetail}
                </span>
              </p>
              <p>
                ????????????
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
                ????????????
              </div>
            </div>
          </div>
        </div>
        {this.state.showAddressModal && (
          <div className="gallery-address-modal">
            <div className="area">
              <div className="title">
                <span>
                  {this.state.isEditAddress ? "??????" : "??????"}???????????????
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
                  ????????????
                </p>
              </div>
              <div className="body-error">
                <p style={{ textAlign: "center" }}>
                  ????????????????????????{galleryDetail.title}
                  {galleryInfo.authorizeType}
                  {galleryInfo.duration}??????????????????
                </p>
                <p style={{ textAlign: "center" }}>
                  ???????????????????????????????????????????????????????????????????????????????????????
                </p>
              </div>
              <div className="foot">
                <div
                  onClick={() => {
                    this.downloadGallery();
                  }}
                >
                  ????????????
                </div>
                <div
                  onClick={() => {
                    this.setState({ paySuccess: false });
                  }}
                >
                  ??????
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
