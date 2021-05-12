import * as React from 'react';
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import banner from '@assets/images/banner-ticket.jpg';
import Add from '@assets/images/add.svg';
import '@assets/scss/ticket.scss';
import { Checkbox, Row, Col, Input, Radio, Select } from "antd";
import Alert from "@components/alert";
import { addTicket } from '@utils/api';

const { Option } = Select;

interface IProps extends IComponentProps {
  userGuid?: string,
}

interface ITicketStatus {
  currentPage: number,
  pageSize: number,
  type: number,
  value: number,
  userGuid: any,
  brand: number,
  isShow: boolean,
  message: string,
  divArr: any,
  other: boolean, // 企业类别中其他
  otherInput: string, // 企业类别其他内容
  otherPro: boolean, // 业务/产品中其他
  otherProInput: string, // 业务/产品其他内容
  otherCheck: boolean; // 展会目的其他
  isAttendDockingMeeting: number,
  isAttendTrain: number,
  isHadCooperativeBrand: number,
  isHadIntentionBrand: number,
  recommendColleagues: number,
  targetCheckbox: any[],
  otherCheckVal: string,
  nextTicket: {
    enterpriseCategory: any,
    operatingBusiness: string,
    interestCategory: string,
    objective: string,
    isAttendDockingMeeting: string,
    isHadCooperativeBrand: string,
    isAttendTrain: string,
    isHadIntentionBrand: string,
    recommendColleagues: any,
  }
}

@inject('authorize')
@inject('user')
@observer
export default class Ticket extends React.Component<IProps, ITicketStatus> {
  constructor(props: any) {
    super(props);
    this.state = {
      userGuid: JSON.parse(localStorage.getItem("user")),
      type: 1,
      value: 1,
      currentPage: 1,
      pageSize: 12,
      isShow: false,
      message: '',
      brand: 1,
      other: false,
      otherPro: false,
      otherCheck: false,
      otherInput: '',
      otherProInput: '',
      isAttendDockingMeeting: 1,
      isAttendTrain: 1,
      isHadCooperativeBrand: 1,
      isHadIntentionBrand: 1,
      recommendColleagues: 2,
      divArr: [],
      targetCheckbox: [],
      otherCheckVal: '',
      nextTicket: {
        enterpriseCategory: '', // [],
        operatingBusiness: '',
        interestCategory: '',
        objective: '',
        isAttendDockingMeeting: '',
        isHadCooperativeBrand: '',
        isAttendTrain: '',
        isHadIntentionBrand: '',
        recommendColleagues: [],
      }
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- 预订门票";
    const { authorize } = this.props;
    await authorize.getCompanyType();
    await authorize.getProductType();
    await authorize.getGoalType();
    await authorize.getListMainType();
    await authorize.getProvince();
    await authorize.getCountry();
  }

  /**
   *  门票按钮点击下一步
   */
  async nextParams() {
    const { nextTicket, targetCheckbox, otherCheckVal } = this.state;
    const exhibitionGuidNext = this.props.user.personInfo.exhibitionGuid;
    let obj = {
      name: '',
      appellation: '',
      mobile: '',
      email: '',
      country: '',
      province: '',
      address: '',
    };
    // let option = { province: '' };
    const r = this.state.nextTicket;
    Object.assign(obj, r.recommendColleagues);
    const objIdx = targetCheckbox.indexOf('otherCheck');
    targetCheckbox[objIdx] = otherCheckVal ? otherCheckVal : targetCheckbox[objIdx];
    const objective = targetCheckbox.join(',');
    const params = {
      createUserGuid: this.state.userGuid.userGuid,
      enterpriseCategory: nextTicket.enterpriseCategory,
      exhibitionGuid: exhibitionGuidNext,
      operatingBusiness: nextTicket.operatingBusiness,
      interestCategory: nextTicket.interestCategory,
      // objective: nextTicket.objective,
      objective,
      isAttendDockingMeeting: this.state.isAttendDockingMeeting === 1 ? nextTicket.isAttendDockingMeeting : '',
      isAttendTrain: this.state.isAttendTrain === 1 ? nextTicket.isAttendTrain : '',
      isHadCooperativeBrand: this.state.isHadCooperativeBrand === 1 ? nextTicket.isHadCooperativeBrand : '',
      isHadIntentionBrand: this.state.isHadIntentionBrand === 1 ? nextTicket.isHadIntentionBrand : '',
      recommendColleagues: this.state.recommendColleagues === 1 ? nextTicket.recommendColleagues : [],
    };
    // console.log(params);
    if (!params.enterpriseCategory) {
      this.setState({ isShow: true, message: '请选择企业类别' });
    } else if (!params.operatingBusiness) {
      this.setState({ isShow: true, message: '请选择经营的业务/产品' });
    } else if (!params.interestCategory) {
      this.setState({ isShow: true, message: '请选择感兴趣的授权合作品类' });
    } else if (!params.objective) {
      this.setState({ isShow: true, message: '请选择参观参会的目的' });
    } else if (this.state.isAttendDockingMeeting === 1 && !params.isAttendDockingMeeting) {
      this.setState({ isShow: true, message: '请输入参加授权匹配对接会原因' });
    } else if (this.state.isAttendTrain === 1 && !params.isAttendTrain) {
      this.setState({ isShow: true, message: '请输入参加授权行业培训原因' });
    } else if (this.state.isHadCooperativeBrand === 1 && !params.isHadCooperativeBrand) {
      this.setState({ isShow: true, message: '请输入已经合作的品牌形象名称' });
    } else if (this.state.isHadIntentionBrand === 1 && !params.isHadIntentionBrand) {
      this.setState({ isShow: true, message: '请输入有意向合作的品牌形象名称' });
    } else if (this.state.recommendColleagues === 1 && params.recommendColleagues.length === 0) {
      this.setState({ isShow: true, message: '请点击下方推荐用户参展,并完善推荐用户信息' });
    } else if (this.state.recommendColleagues === 1 && params.recommendColleagues.length !== 0) {

      for (let i in params.recommendColleagues) {
        if (params.recommendColleagues.hasOwnProperty(i)) {
          if (!params.recommendColleagues[i].name) {
            this.setState({ isShow: true, message: '请填写姓名' });
            return;
          } else if (!params.recommendColleagues[i].appellation) {
            this.setState({ isShow: true, message: '请选择性别' });
            return;
          } else if (!params.recommendColleagues[i].mobile) {
            this.setState({ isShow: true, message: '请输入手机号' });
            return;
          } else if (!params.recommendColleagues[i].email) {
            this.setState({ isShow: true, message: '请输入电子邮箱' });
            return;
          } else if (!params.recommendColleagues[i].country || !params.recommendColleagues[i].province || !params.recommendColleagues[i].address) {
            this.setState({ isShow: true, message: '请填写地址' });
            return;
          }
        }
      }
      let { errorCode, result }: any = await addTicket(params);
      if (errorCode === "200") {
        this.setState({ isShow: true, message: '提交成功' });
        localStorage.setItem('sn', result.data);
      }
    } else {
      let { errorCode, result }: any = await addTicket(params);
      if (errorCode === "200") {
        this.setState({ isShow: true, message: '提交成功' });
        localStorage.setItem('sn', result.data);
      }
    }
  }

  // 点击推荐新同事
  async addForm() {
    const { divArr, nextTicket } = this.state;
    divArr.push(1);
    let nextTicketNew = nextTicket;
    nextTicketNew.recommendColleagues.push(
      {
        name: '', appellation: '', mobile: '', email: '', country: '', province: '', address: '',
      }
    );
    this.setState({
      divArr,
      nextTicket: nextTicketNew
    });
    // console.log(arr, divArr);
  }

  render() {
    const { authorize } = this.props;
    const { isShow, message, divArr, other, otherPro, otherCheck } = this.state;
    const { companyType, productType, interestDataList, goalType, provinceInfo, countryInfo } = authorize;
    return (
      <div className='ticket-box'>
        <div className='tic-content'>
          <div className='img-top'>
            <img src={banner} alt=''/>
          </div>
          <div className='form-table'>
            <p className='title'>观众参展意向调查
              <span className='word'>(带<span className='star'>*</span>的为必填)</span>
            </p>
            <div className='change'>
              <label className='input-label'>1.企业类别<span className='case-hot'>*</span>（单选）</label>
              <div className='group'>
                <Radio.Group
                  className='check-box'
                  onChange={async (e) => {
                    const { nextTicket } = this.state;
                    const { value } = e.target;
                    nextTicket.enterpriseCategory = value;
                    this.setState({ nextTicket, other: (value === 'other') });
                  }}
                >
                  {
                    toJS(companyType) && toJS(companyType).map((item, index) => {
                      return (
                        <Row key={index} className='check-row'>
                          <Col>
                            <Radio value={item.resourceValue} className='check-txt'>
                              {item.resourceValue}
                            </Radio>
                          </Col>
                        </Row>
                      );
                    })
                  }
                  <Radio
                    value={'other'}
                  >其他</Radio>
                  {
                    other ?
                      <Input
                        type='text'
                        maxLength={120}
                        placeholder='请输入其他企业类别，限120字'
                        className='lab-input'
                        style={{ width: '11rem', marginTop: '0.1rem', height: '0.46rem' }}
                        onChange={async (ee) => {
                          const otherInput = ee.target.value;
                          const { nextTicket } = this.state;
                          nextTicket.enterpriseCategory = ee.target.value;
                          this.setState({
                            otherInput,
                            nextTicket
                          });
                        }}
                      />
                      : ''
                  }
                </Radio.Group>
              </div>
            </div>
            <div className='change'>
              <label className='input-label'>2.您所经营的业务/产品<span className='case-hot'>*</span>（单选）</label>
              <div className='group'>
                <Radio.Group
                  className='check-box'
                  onChange={async (e) => {
                    const { nextTicket } = this.state;
                    const { value } = e.target;
                    nextTicket.operatingBusiness = value;
                    this.setState({
                      nextTicket,
                      otherPro: (value === 'otherPro')
                    });
                  }}
                >
                  {
                    toJS(productType) && toJS(productType).map((item, index) => {
                      return (
                        <Radio value={item.resourceValue} className='check-row' key={index}>
                          {item.resourceValue}
                        </Radio>
                      );
                    })
                  }
                  <Radio value='otherPro'>其他</Radio>
                  {
                    otherPro ?
                      <Input
                        type='text'
                        maxLength={120}
                        placeholder='请输入您所经营的其他业务/产品，限120字'
                        className='lab-input'
                        style={{ width: '11rem', marginTop: '0.1rem', height: '0.46rem' }}
                        onChange={async (ee) => {
                          const otherProInput = ee.target.value;
                          const { nextTicket } = this.state;
                          nextTicket.operatingBusiness = ee.target.value;
                          this.setState({
                            otherProInput,
                            nextTicket
                          });
                        }}
                      />
                      : ''
                  }
                </Radio.Group>
              </div>
            </div>
            <div className='change'>
              <label className='input-label'>3.感兴趣的授权合作品类<span className='case-hot'>*</span>（可多选）</label>
              <div className='group'>
                <Checkbox.Group
                  onChange={(e) => {
                    const { nextTicket } = this.state;
                    nextTicket.interestCategory = e.join(',');
                    this.setState({ nextTicket });
                  }}
                  className='check-box'
                >
                  {
                    toJS(interestDataList || []).map((item, index) => {
                      return (
                        <Row key={index} className='check-row'>
                          <Col>
                            <Checkbox value={item.typeName} className='check-txt'>
                              {item.typeName}
                            </Checkbox>
                          </Col>
                        </Row>
                      );
                    })
                  }
                </Checkbox.Group>
              </div>
            </div>
            <div className='change'>
              <label className='input-label'>4.参观展会的目的<span className='case-hot'>*</span>（可多选）</label>
              <div className='group'>
                <Checkbox.Group
                  className='check-box'
                  onChange={async (e) => {
                    this.setState({ targetCheckbox: e });
                  }}
                >
                  {
                    toJS(goalType) && toJS(goalType).map((item, index) => {
                      return (
                        <Row key={index} className='check-row'>
                          <Col>
                            <Checkbox value={item.resourceValue} className='check-txt'>
                              {item.resourceValue}
                            </Checkbox>
                          </Col>
                        </Row>
                      );
                    })
                  }
                  <Checkbox
                    value='otherCheck'
                    onChange={async (e) => {
                      this.setState({ otherCheck: e.target.checked });
                    }}
                  >其他</Checkbox>
                  {
                    otherCheck ?
                      <Input
                        type='text'
                        maxLength={120}
                        className='lab-input'
                        placeholder='请输入您所经营的其他业务/产品，限120字'
                        style={{ width: '11rem', marginTop: '0.1rem', height: '0.46rem' }}
                        onChange={async (e) => {
                          const otherCheckVal = e.target.value;
                          // const { nextTicket } = this.state;
                          // let arr = nextTicket.objective.split(',');
                          // const idx = arr.indexOf('otherCheck');
                          // arr[idx] = e.target.value;
                          // nextTicket.objective = arr.join(',');
                          this.setState({
                            otherCheckVal
                          });
                        }}
                      />
                      : ''
                  }
                </Checkbox.Group>
              </div>
            </div>
            <div className='change'>
              <label className='input-label'>5.您是否意向参加授权匹配对接会？<span className='case-hot'>*</span></label>
              <Radio.Group
                value={this.state.isAttendDockingMeeting}
                onChange={(e) => {
                  const isAttendDockingMeeting = e.target.value;
                  this.setState({ isAttendDockingMeeting });
                }}
              >
                <Radio value={1} style={{ width: '2.3rem' }}>是</Radio>
                <Radio value={2}>否</Radio>
                {
                  this.state.isAttendDockingMeeting === 1 ?
                    <div className='input-radio'>
                      <Input
                        type='text'
                        className='lab-input'
                        maxLength={120}
                        placeholder='请输入参加授权匹配对接会原因，限120字'
                        onChange={async (e) => {
                          const { nextTicket } = this.state;
                          nextTicket.isAttendDockingMeeting = e.target.value;
                          this.setState({ nextTicket });
                        }}
                      />
                    </div>
                    : ''
                }
              </Radio.Group>
            </div>
            <div className='change'>
              <label className='input-label'>6.您是否意向参加授权行业培训？<span className='case-hot'>*</span></label>
              <Radio.Group
                value={this.state.isAttendTrain}
                onChange={(e) => {
                  const isAttendTrain = e.target.value;
                  this.setState({ isAttendTrain });
                }}
              >
                <Radio value={1} style={{ width: '2.3rem' }}>是</Radio>
                <Radio value={2}>否</Radio>
                {
                  this.state.isAttendTrain === 1 ?
                    <div className='input-radio'>
                      <Input
                        type='text'
                        maxLength={120}
                        className='lab-input'
                        placeholder='请输入参加授权行业培训原因，限120字'
                        onChange={async (e) => {
                          const { nextTicket } = this.state;
                          nextTicket.isAttendTrain = e.target.value;
                          this.setState({ nextTicket });
                        }}
                      />
                    </div>
                    : ''
                }
              </Radio.Group>
            </div>
            <div className='change'>
              <label className='input-label'>7.您是否有已经合作的授权品牌形象？<span className='case-hot'>*</span></label>
              <Radio.Group
                value={this.state.isHadCooperativeBrand}
                onChange={(e) => {
                  const isHadCooperativeBrand = e.target.value;
                  this.setState({ isHadCooperativeBrand });
                }}
              >
                <Radio value={1} style={{ width: '2.3rem' }}>是</Radio>
                <Radio value={2}>否</Radio>
                {
                  this.state.isHadCooperativeBrand === 1 ?
                    <div className='input-radio'>
                      <Input
                        type='text'
                        maxLength={120}
                        className='lab-input'
                        placeholder='请输入已经合作的品牌形象名称；如有多个请以；号隔开，限120字'
                        onChange={async (e) => {
                          const { nextTicket } = this.state;
                          nextTicket.isHadCooperativeBrand = e.currentTarget.value;
                          this.setState({ nextTicket });
                        }}
                      />
                    </div>
                    : ''
                }
              </Radio.Group>
            </div>
            <div className='change'>
              <label className='input-label'>8.您是否已经有意向合作的授权品牌形象？<span className='case-hot'>*</span></label>
              <Radio.Group
                value={this.state.isHadIntentionBrand}
                onChange={(e) => {
                  const isHadIntentionBrand = e.target.value;
                  this.setState({ isHadIntentionBrand });
                }}
              >
                <Radio value={1} style={{ width: '2.3rem' }}>是</Radio>
                <Radio value={2}>否</Radio>
                {
                  this.state.isHadIntentionBrand === 1 ?
                    <div className='input-radio'>
                      <Input
                        type='text'
                        maxLength={120}
                        className='lab-input'
                        placeholder='请输入有意向合作的品牌形象名称；如有多个请以；号隔开，限120字'
                        onChange={async (e) => {
                          const { nextTicket } = this.state;
                          nextTicket.isHadIntentionBrand = e.currentTarget.value;
                          this.setState({ nextTicket });
                        }}
                      />
                    </div> : ''
                }
              </Radio.Group>
            </div>
            <div className='change'>
              <label className='input-label'>9.您是否要推荐同事参加此次授权展？<span className='case-hot'>*</span></label>
              <Radio.Group
                value={this.state.recommendColleagues}
                onChange={(e) => {
                  const recommendColleagues = e.target.value;
                  this.setState({ recommendColleagues });
                }}
              >
                <Radio value={1} style={{ width: '2.3rem' }}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </div>
            {
              this.state.recommendColleagues === 1 ?
                divArr && divArr.map((item, index) => {
                  return (
                    <div className='add-newForm' key={index}>
                      <div className='change'>
                        <label className='table-label'>姓名<span className='case-hot'>*</span></label>
                        <div>
                          <Input
                            className='table-form'
                            placeholder='请输入TA的姓名'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].name = e.target.value;
                              this.setState({ nextTicket });
                            }}
                          />
                          <Select
                            placeholder='请选择性别'
                            style={{ width: '2.88rem' }}
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].appellation = e;
                              this.setState({ nextTicket });
                            }}
                          >
                            <Option value={'先生'}>先生</Option>
                            <Option value={'女士'}>女士</Option>
                          </Select>
                        </div>
                      </div>
                      <div className='change'>
                        <label className='table-label'>手机号码<span className='case-hot'>*</span></label>
                        <div>
                          <Input
                            type='number'
                            className='table-form'
                            style={{ width: '7.12rem' }}
                            placeholder='请输入TA的手机号码'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].mobile = e.target.value;
                              this.setState({ nextTicket });
                            }}
                          />
                        </div>
                      </div>
                      <div className='change'>
                        <label className='table-label'>电子邮箱<span className='case-hot'>*</span></label>
                        <div>
                          <Input
                            className='table-form'
                            style={{ width: '7.12rem' }}
                            placeholder='请输入TA的电子邮箱'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].email = e.target.value;
                              this.setState({ nextTicket });
                            }}
                          />
                        </div>
                      </div>
                      <div className='change'>
                        <label className='table-label'>联系地址<span className='case-hot'>*</span></label>
                        <div>
                          <Select
                            style={{ width: '1.53rem', marginRight: '0.2rem' }}
                            placeholder='请选国别'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].country = e;
                              this.setState({ nextTicket });
                            }}
                          >
                            {
                              countryInfo && countryInfo.map((item, index) => {
                                return (
                                  <Option value={item.districtName} key={index}>
                                    {item.districtName}
                                  </Option>
                                );
                              })
                            }
                          </Select>
                          <Select
                            style={{ width: '1.53rem', marginRight: '0.2rem' }}
                            placeholder='请选省份'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].province = e;
                              this.setState({ nextTicket });
                            }}
                          >
                            {provinceInfo && provinceInfo.map((item, index) => {
                              return (
                                <Option value={item.fullName} key={index}>
                                  {item.fullName}
                                </Option>
                              );
                            })
                            }
                          </Select>
                          <Input
                            className='table-form'
                            style={{ width: '3.65rem' }}
                            placeholder='填写具体地址'
                            onChange={async (e) => {
                              const { nextTicket } = this.state;
                              nextTicket.recommendColleagues[index].address = e.target.value;
                              this.setState({ nextTicket });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
                : ''
            }
            {
              this.state.recommendColleagues === 1 ?
                <div className='add'>
                  <img src={Add} alt=''/>
                  <p className='more-people'
                     onClick={async () => {
                       await this.addForm();
                     }}
                  >推荐更多同事参展</p>
                </div>
                : ''
            }
            <div className='btn'>
              <button
                className='btn-submit'
                onClick={async () => {
                  await this.nextParams();
                }}>下一步
              </button>
            </div>
          </div>
        </div>
        {
          isShow && <Alert
            message={message}
            onClose={() => {
              this.setState({ isShow: false });
            }}
            onSubmit={() => {
              if (message === '提交成功') {
                this.props.history.push('/authorized-exhibition/confirm');
              }
            }}
          />
        }
      </div>
    );
  }
}
