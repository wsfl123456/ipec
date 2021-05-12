import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/vip_card_buy.scss";
import { Form, Input, Cascader, Checkbox } from "antd";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Toast from "@components/toast";
import Add from "@assets/images/add.svg";
import VipCardBuyPay from "../pay/pay";
import _isEmpty from "lodash/isEmpty";
import Selected from "@assets/images/vip-card/selected.png";
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
      showModal: false,
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
      curPhone
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
                message:
                  "字段长度不能超过25",
              },
            ],
          })(<Input placeholder="请输入收货人姓名"/>)}
        </Form.Item>
        <Form.Item label="手机号码">
          {!!addressParams.addressGuid &&
          curPhone === addressParams.mobile
            ? getFieldDecorator("mobile", {
              initialValue: addressParams.mobile,

              rules: [
                {
                  required: true,
                  message: "请输入收货人手机号码",
                },
              ],
            })(<Input placeholder="请输入收货人手机号码"/>)
            : getFieldDecorator("mobile", {
              initialValue: addressParams.mobile,
              validateTrigger: 'onInput',
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
            })(<Input placeholder="请输入收货人手机号码"/>)}
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
                message:
                  "字段长度不能超过200",
              },
            ],
          })(
            <Input placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"/>
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
                pattern: '^[1-9]\\d{5}$',
                message: "请输入正确的邮编",
              },
            ],
          })(<Input placeholder="请输入邮编"/>)}
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

interface IVipCardBuyDetailState {
  showModal: boolean;
  showToast: boolean;
  toastMsg: string;
  isEditAddress: boolean;
}

@inject("vip_card_buy_order", "login")
@observer
export default class VipCardBuyOrder extends React.Component<IProps,
  IVipCardBuyDetailState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      showToast: false,
      toastMsg: "",
      isEditAddress: false,
    };
  }

  async componentDidMount() {
    const {
      vip_card_buy_order,
      login,
      match: { params },
    } = this.props;
    vip_card_buy_order.changeUserInfo(login.userInfo);
    vip_card_buy_order.getListDistrict();
    vip_card_buy_order.getAddressList();
    vip_card_buy_order.ConfirmOrder(unescape(params["cardId"]));
  }

  editModal(i) {
    this.props.vip_card_buy_order.changeAddressParams({
      consignee: i.consignee,
      mobile: i.mobile,
      address: i.address.split(","),
      addressDetail: i.addressDetail,
      postcode: i.postcode,
      isDefault: i.isDefault === 1 ? true : false,
      addressGuid: i.addressGuid,
    }, true);
    this.visibleModal(true, true);
  }

  createAddress() {
    const { vip_card_buy_order } = this.props;
    const { addressList } = vip_card_buy_order;
    if (!!addressList && addressList.length < 5) {
      this.visibleModal(true, false);
    } else {
      this.setState({ showToast: true, toastMsg: "最多可创建5个收货地址" });
    }
  }

  visibleModal(bol, isEdit) {
    const { vip_card_buy_order } = this.props;
    const { changecurPhone } = vip_card_buy_order;
    if (!bol) {
      this.props.vip_card_buy_order.changeAddressParams({
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
    this.setState({
      showModal: bol,
      isEditAddress: !!isEdit,
    });
  }

  changeOrderParams(selectedId) {
    const { vip_card_buy_order } = this.props;
    vip_card_buy_order.changeOrderParams({ selectedId });
  }

  async submitOrder() {
    const {
      vip_card_buy_order,
      match: { params },
    } = this.props;
    const { addressList } = vip_card_buy_order;
    if (_isEmpty(addressList)) {
      this.setState({
        showToast: true,
        toastMsg: '请先设置收货地址',
      });
      return false;
    }
    const { createOrder, getPayCode, setOrderCode } = vip_card_buy_order;
    const cardId = unescape(params["cardId"]);
    const { errorCode, errorMessage, data } = await createOrder({
      cardGuid: cardId,
      isNeedPhysicalCard: 1,
    });
    setOrderCode({ orderCode: data.data });

    if (+errorCode === 200) {
      getPayCode({
        sn: data.data,
        payMethod: 2,
      });
      getPayCode({
        sn: data.data,
        payMethod: 7,
      });
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMessage,
      });
    }
  }

  render() {
    const { vip_card_buy_order } = this.props;
    const {
      addressList,
      listDistrict,
      addressParams,
      saveAddress,
      updateAddress,
      orderParams,
      confirmOrderInfo,
      commodityDetail,
      weChatPay,
      alipay,
      orderCode,
      changecurPhone,
      curPhone
    } = vip_card_buy_order;
    return (
      <div className="vip-card vip-card-buy-order">
        <div className="order">
          <div className="top">
            <div className="title">填写并核对订单信息</div>
            <div className="sure-order">
              <div className="header">
                <div className="title">选择收货地址</div>
                {!!addressList && !!addressList.length && (
                  <div
                    className="add-second"
                    onClick={() => this.createAddress()}
                  >
                    <img src={Add} alt=""/>
                    <span>新增收货地址</span>
                  </div>
                )}
              </div>
              {!!addressList && !addressList.length && (
                <div className="add-new">
                  <div
                    className="btn_primary_fl"
                    onClick={() => {
                      this.createAddress();
                    }}
                  >
                    新增收货地址
                  </div>
                  <div>
                    您已创建了<span>{addressList.length}</span>
                    个收货地址，最多可创建<span>5</span>个
                  </div>
                </div>
              )}
              {!!addressList && !!addressList.length && (
                <div className="list">
                  {addressList.map((i, k) => (
                    <div
                      className={`item ${
                        i.addressGuid === orderParams.selectedId &&
                        "item--selected"
                      }`}
                      key={k}
                      onClick={() => {
                        this.changeOrderParams(i.addressGuid);
                      }}
                    >
                      <div>
                        <span className="name">{i.consignee}</span>
                        {i.isDefault === 1 && (
                          <span className="default">默认地址</span>
                        )}
                        {i.addressGuid === orderParams.selectedId && (
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
                      {i.addressGuid === orderParams.selectedId && (
                        <img src={Selected} alt=""/>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="tables">
                <div className="title">确认订单信息</div>
                <table>
                  <thead>
                  <tr>
                    {!!confirmOrderInfo &&
                    !!confirmOrderInfo.length &&
                    confirmOrderInfo.map((i, k) => (
                      <th key={k}>{i.title}</th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    {!!confirmOrderInfo &&
                    !!confirmOrderInfo.length &&
                    confirmOrderInfo.map((i, k) => {
                      switch (i.title) {
                        case "商品名称":
                          return (
                            <td key={k}>
                              <img src={i.img} alt=""/>
                              {i.val}
                            </td>
                          );
                          break;
                        case "优惠方式":
                          return (
                            <td key={k}>
                              <span>{i.val}</span>
                              <br/>
                              <span className="discount">{i.discount}</span>
                            </td>
                          );
                          break;
                        case "小计":
                          return (
                            <td key={k}>
                              <span className="xiaoji">{i.val}</span>
                            </td>
                          );
                          break;
                        default:
                          return <td key={k}>{i.val}</td>;
                          break;
                      }
                    })}
                  </tr>
                  </tbody>
                </table>
              </div>
              <div className="delivery">
                <div className="title">配送方式</div>
                <div className="content">
                  <span>普通配送</span>
                  <span>快递</span>
                  <span>免邮费</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mid">
            <div className="money">
              <span>应付总金额：</span>
              <span className="money">¥{commodityDetail.paymentAmount}</span>
            </div>
            <div className="address">
              <span>寄送至：</span>
              <span>
                {!!addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ) &&
                addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ).addressDetail}
              </span>
            </div>
            <div className="name">
              <span>收货人：</span>
              <span>
                {!!addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ) &&
                addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ).consignee}
              </span>
              <span>
                {!!addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ) &&
                addressList.find(
                  (i) => i.addressGuid === orderParams.selectedId
                ).mobile}
              </span>
            </div>
          </div>
          <div className="bottom">
            <div
              className="btn_primary_fl"
              onClick={() => {
                this.submitOrder();
              }}
            >
              提交订单
            </div>
          </div>
        </div>
        {this.state.showModal && (
          <div className="vip-card-buy-order-modal">
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
                  getAddressList={vip_card_buy_order.getAddressList}
                  changeAddressParams={vip_card_buy_order.changeAddressParams}
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
        {!!weChatPay && !!alipay && (
          <VipCardBuyPay
            weChatPay={weChatPay}
            alipay={alipay}
            closeModal={vip_card_buy_order.changePayCode}
            getPayStatus={vip_card_buy_order.getPayStatus}
            commodityDetail={commodityDetail}
            history={this.props.history}
            vm={this}
          />
        )}
      </div>
    );
  }
}
