import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/user_vip_card.scss";
import Toast from "@components/toast";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";
import Reminder from "@assets/images/vip-card/reminder.png";
import WrappedAddressForm from "./components/form";

interface IState {
  showEdit: boolean;
  showDel: boolean;
  showToast: boolean;
  toastMsg: string;
}
@inject("user_shipping_address", "login")
@observer
export default class UserShippingAddress extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showEdit: false,
      showDel: false,
      showToast: false,
      toastMsg: "",
    };
  }

  showDel(i) {
    const { user_shipping_address } = this.props;
    const { changeCurAddress } = user_shipping_address;
    changeCurAddress(i);
    this.setState({
      showDel: true,
    });
  }

  closeDel() {
    const { user_shipping_address } = this.props;
    const { changeCurAddress } = user_shipping_address;
    changeCurAddress({});
    this.setState({ showDel: false });
  }

  async delAddress() {
    const { user_shipping_address } = this.props;
    const { setRemoveAddress, getAddressList } = user_shipping_address;
    const { code, errorMsg } = await setRemoveAddress();
    if (+code === 200) {
      getAddressList();
      this.closeDel();
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    } else {
      this.setState({
        showToast: true,
        toastMsg: errorMsg,
      });
    }
  }

  createAddress() {
    const { user_shipping_address } = this.props;
    const { addressList } = user_shipping_address;
    if (!!addressList && addressList.length < 5) this.setState({showEdit: true});
    else this.setState({showToast: true, toastMsg: '最多可创建5个收货地址'});
  }

  showEdit(i) {
    const { user_shipping_address } = this.props;
    const { changeAddressParams } = user_shipping_address;
    changeAddressParams({
      consignee: i.consignee,
      mobile: i.mobile,
      address: i.address.split(","),
      addressDetail: i.addressDetail,
      postcode: i.postcode,
      isDefault: i.isDefault === 1 ? true : false,
      addressGuid: i.addressGuid,
    }, true);
    this.setState({ showEdit: true });
  }

  closeEditModal() {
    const { user_shipping_address } = this.props;
    const { changecurPhone } = user_shipping_address;
    this.setState({ showEdit: false });
    changecurPhone()
  }

  showToast(msg) {
    this.setState({ showToast: true, toastMsg: msg });
  }

  async setDefault(i) {
    const { user_shipping_address } = this.props;
    const {
      changeAddressParams,
      saveAddress,
      getAddressList,
    } = user_shipping_address;
    changeAddressParams({
      consignee: i.consignee,
      mobile: i.mobile,
      address: i.address.split(","),
      addressDetail: i.addressDetail,
      postcode: i.postcode,
      isDefault: true,
      addressGuid: i.addressGuid,
    });
    const { errorCode } = await saveAddress();
    changeAddressParams({
      consignee: "",
      mobile: "",
      address: [],
      addressDetail: "",
      postcode: "",
      isDefault: false,
      addressGuid: "",
    });
    if (+errorCode === 200) {
      getAddressList();
    }
  }

  async componentDidMount() {
    const { user_shipping_address, login } = this.props;
    const { getAddressList, getListDistrict } = user_shipping_address;
    user_shipping_address.changeUserInfo(login.userInfo)
    getAddressList();
    getListDistrict();
  }

  render() {
    const { user_shipping_address } = this.props;
    const {
      addressList,
      listDistrict,
      addressParams,
      saveAddress,
      changeAddressParams,
      getAddressList,
      curPhone
    } = user_shipping_address;
    return (
      <div className="vip-card user-shipping-address">
        <div className="title">收货地址</div>
        <div className="add-address">
          <div
            className="btn_primary_fl"
            onClick={() => {
              this.createAddress();
            }}
          >
            新增收货地址
          </div>
          <div className="num">
            您已创建了<span>{!!addressList ? addressList.length : 0}</span>
            个收货地址，最多可创建
            <span>5</span>个
          </div>
        </div>
        <div className="list">
          {!!addressList &&
            !!addressList.length &&
            addressList.map((i, k) => (
              <div className="item" key={k}>
                <div className="left">
                  <div className="name">
                    <span className="consignee">{i.consignee}</span>
                    {+i.isDefault === 1 && (
                      <span className="default">默认地址</span>
                    )}
                  </div>
                  <div>
                    <span className="label">联系方式：</span>
                    <span className="val">{i.mobile}</span>
                  </div>
                  <div>
                    <span className="label">所在地区：</span>
                    <span className="val">{i.address}</span>
                  </div>
                  <div>
                    <span className="label">详细地址：</span>
                    <span className="val">{i.addressDetail}</span>
                  </div>
                  <div>
                    <span className="label">邮政编码：</span>
                    <span className="val">{i.postcode}</span>
                  </div>
                </div>
                <div className="right">
                  {+i.isDefault !== 1 && (
                    <span
                      onClick={() => {
                        this.setDefault(i);
                      }}
                    >
                      设为默认地址
                    </span>
                  )}
                  <span
                    onClick={() => {
                      this.showEdit(i);
                    }}
                  >
                    修改
                  </span>
                  <span
                    onClick={() => {
                      this.showDel(i);
                    }}
                  >
                    删除
                  </span>
                </div>
              </div>
            ))}
        </div>
        {this.state.showDel && (
          <div className="showDel">
            <div className="area">
              <div className="clear">
                <img
                  src={Ic_clear}
                  onClick={() => {
                    this.closeDel();
                  }}
                  alt=""
                />
              </div>
              <div className="content">
                <img src={Reminder} alt="" />
                <div className="msg">确认要删除该条收货地址么？</div>
                <div className="tip">
                  删除后该收货地址信息将从收货地址栏中移除
                </div>
              </div>
              <div className="btn-group">
                <div
                  className="btn_primary_fl"
                  onClick={() => {
                    this.delAddress();
                  }}
                >
                  确认
                </div>
                <div
                  className="btn_default_fl"
                  onClick={() => {
                    this.closeDel();
                  }}
                >
                  取消
                </div>
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
        {this.state.showEdit && (
          <WrappedAddressForm
            listDistrict={listDistrict}
            addressParams={addressParams}
            saveAddress={saveAddress}
            getAddressList={getAddressList}
            curPhone={curPhone}
            changeAddressParams={changeAddressParams}
            showToast={(msg) => {
              this.showToast(msg);
            }}
            closeModal={() => {
              this.closeEditModal();
            }}
          ></WrappedAddressForm>
        )}
      </div>
    );
  }
}
