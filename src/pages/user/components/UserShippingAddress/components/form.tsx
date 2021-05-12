import * as React from "react";
import { observer } from "mobx-react";
import "@assets/scss/user_vip_card.scss";
import { Form, Input, Cascader, Checkbox } from "antd";
import Ic_clear from "@assets/images/vip-card/ic_clear.svg";

@observer
class AddressForm extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { errorCode, errorMessage } = await this.props.saveAddress();
        this.props.showToast(errorMessage);
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
    this.props.closeModal();
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

  async componentDidMount() {}

  render() {
    const {
      form,
      listDistrict,
      addressParams,
      curPhone,
      changeAddressParams,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="address-modal">
        <div className="area">
          <div className="title">
            <span>收货人信息</span>
            <img
              src={Ic_clear}
              onClick={() => {
                this.closeModal();
              }}
              alt=""
            />
          </div>
          <div className="content">
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
                    })(<Input placeholder="请输入收货人手机号码" />)
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
            </Form>
          </div>
          <div className="footer">
            <div
              className="btn_primary_fl"
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              提交
            </div>
            <div
              className="btn_default_fl"
              onClick={() => {
                this.closeModal();
              }}
            >
              取消
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedAddressForm = Form.create({
  name: "order-form",
  onFieldsChange(prop: any, changedFields: { value }) {
    prop.changeAddressParams({
      [Object.keys(changedFields)[0]]: Object.values(changedFields)[0].value,
    });
  },
})(AddressForm) as any;

export default WrappedAddressForm;
