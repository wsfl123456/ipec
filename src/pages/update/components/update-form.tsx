import * as React from 'react';
import ScrollTop from "@components/scroll-top";
import { Checkbox, message } from "antd";
import { inject, observer } from "mobx-react";
import { get, toJS } from "mobx";
import { Modal } from "antd";
import '@assets/scss/update-form.scss';
import {
  Amusement,
  Common,
  Copyright,
  Country,
  FrontCover,
  MD,
  Movies,
  People,
  Material,
  InvestmentMaterial,
  Case,
  SocialPlatform,
} from "@pages/update/components";
import _isEmpty from "lodash/isEmpty";

interface IUpdateForm extends IComponentProps {
  className: string,
  ipType: string,
  history: any,
}

interface IUpdateFormState {
  ruleModalShow: boolean,
  readAndAgree: boolean,
  showModal?: boolean,

  agencyAgreement: string,
  copyrightCertificate: string,
  ownership: string,
}

@inject('login', 'nav_store', 'update_store')
@observer
export default class UpdateForm extends React.Component<IUpdateForm, IUpdateFormState> {
  state = {
    ruleModalShow: false,
    readAndAgree: false,
    showModal: false,

    agencyAgreement: '',
    copyrightCertificate: '',
    ownership: '',
  };

  componentDidMount(): void {
    const { update_store } = this.props;
    const current = get(update_store, 'current');

    this.setState({
      agencyAgreement: current.agencyAgreement,
      copyrightCertificate: current.copyrightCertificate,
      ownership: current.ownership,
    });
  }

  render() {
    const { className, ipId, ipTypes, login, update_store } = this.props;
    const { userGuid } = login.userInfo;
    const current = get(update_store, 'current');
    const ipTypeSuperiorNumber = Number(get(current, 'ipTypeSuperiorNumber'));
    // console.log(this.state.agencyAgreement);
    // let { id }: any = this.props.match.params || { id: '' };
    let investmentList = toJS(get(current, 'investmentList'));

    let prodect = toJS(get(current, 'prodect'));
    let cooperationCase = toJS(get(current, 'cooperationCase'));
    // if (_isEmpty(prodect)) {
    //   // current.prodect = Array(4).fill({ pic: '', title: '' });
    // }
    // if (_isEmpty(cooperationCase)) {
    //   // current.cooperationCase = Array(4).fill({ pic: '', title: '' });
    // }
    let ipAccountInfoDTOList = toJS(get(current, 'ipAccountInfoDTOList'));
    // console.log(prodect);
    return (
      <div className={className}>
        <div className="update_new-container">

          {/*??????????????????*/}
          <Modal
            visible={this.state.showModal}
            onOk={() => {
              this.setState({ showModal: false });
              this.props.history.push('/user/1');
            }}
            onCancel={() => {
              this.setState({ showModal: false });
            }}
            okText={"??????"} cancelText={"??????"}
          >
            <p>
              ?????????????????????????????????????????????IP???
            </p>
          </Modal>

          {/* ??????????????????IP */}
          <FrontCover ipLeftPic={get(current, 'ipLeftPic')} updateStore={update_store}/>
          {/* ???????????????????????? */}
          <div className="update_newRight">
            {/* IP?????? IP?????? IP?????? */}
            {!!current && <Common
              updateStore={update_store}
              ipName={get(current, 'ipName')}
              ipTypes={ipTypes}
              ipDesc={get(current, 'ipDesc')}
              id={ipId && ipId}
              selectedType={get(update_store, 'selectedType')}
              ipTypeSuperiorNumber={Number(current.ipTypeSuperiorNumber)}
            />}

            {!!ipTypeSuperiorNumber &&
            <div className="rightIPKinds">
              {/* IP?????? IP?????????????????? ??? ?????? */}
              <Country
                ipTypeSuperiorNumber={ipTypeSuperiorNumber}
                customTag={toJS(current.customTag)}
                updateStore={update_store}
                tagList={get(update_store, 'tagList')}
                countryTypes={toJS(current.countryTypes)}
                countryList={get(update_store, 'countryList')}
              />

              {
                (ipTypeSuperiorNumber === 5 || ipTypeSuperiorNumber === 7) &&
                <Amusement
                  ipTypeSuperiorNumber={ipTypeSuperiorNumber}
                  updateStore={update_store}
                  ipIsShow={get(current, 'ipIsShow')}
                  companyCpsList={get(update_store, 'companyCpsList')}
                  companyFxsList={get(update_store, 'companyFxsList')}
                  companyCps={get(current, 'companyCps')}
                  companyXfs={get(current, 'companyXfs')}
                  ipPlatformInfoWlsList={get(update_store, 'ipPlatformInfoWlsList')}
                  ipPlatformInfoWls={get(current, 'ipPlatformInfoWls')}
                  ipPlatformInfoDssList={get(update_store, 'ipPlatformInfoDssList')}
                  ipPlatformInfoDss={get(current, 'ipPlatformInfoDss')}
                  director={get(current, 'director')}
                  filmLength={get(current, 'filmLength')}
                  numberEpisode={get(current, 'numberEpisode')}
                  protagonist={get(current, 'protagonist')}
                  scriptwriter={get(current, 'scriptwriter')}
                  showDate={get(current, 'showDate')}
                />
              }

              {/* ?????? */}
              {
                ipTypeSuperiorNumber === 6 &&
                <Movies
                  updateStore={update_store}
                  ipIsShow={get(current, 'ipIsShow')}
                  companyCpsList={get(update_store, 'companyCpsList')}
                  companyXfsList={get(update_store, 'companyXfsList')}
                  companyCps={get(current, 'companyCps')}
                  companyXfs={get(current, 'companyXfs')}
                  director={get(current, 'director')}
                  filmLength={get(current, 'filmLength')}
                  protagonist={get(current, 'protagonist')}
                  scriptwriter={get(current, 'scriptwriter')}
                  showDate={get(current, 'showDate')}
                />
              }

              {/* ?????? */}
              {
                ipTypeSuperiorNumber === 8 &&
                <People
                  nationality={get(current, 'nationality')}
                  nationalityText={get(current, 'nationalityText')}
                  profession={get(current, 'profession')}
                  brokerageFirmsList={get(update_store, 'brokerageFirmsList')}
                  brokerageFirms={get(current, 'brokerageFirms')}
                  updateStore={update_store}
                  countryList={get(update_store, 'countryList')}
                  birthDate={get(current, 'birthDate')}
                />
              }

            </div>
            }

            {/* IP????????? -- ????????????????????? */}
            {
              !!ipTypeSuperiorNumber &&
              <Copyright
                owner={get(current, 'owner')}
                copyrightAgent={get(current, 'copyrightAgent')}
                recordCountry={get(current, 'recordCountry')}
                rightIPCopyrightList={get(current, 'rightIPCopyrightList')}
                rightIPCopyrightList2={get(current, 'rightIPCopyrightList2')}
                isTransferable={get(current, 'isTransferable')}
                updateStore={update_store}
                grantedType={get(current, 'grantedType')}
                grantedTypeList={get(update_store, 'grantedTypeList')}
                authorizedTypeList={get(update_store, 'authorizedTypeList')}
                authorizedType={get(current, 'authorizedType')}
                authorizedLocationList={get(update_store, 'authorizedLocationList')}
                intentAuthorizationList={get(update_store, 'intentAuthorizationList')}
                intentAuthorization={get(current, 'intentAuthorization')}
                authorizedLocation={get(current, 'authorizedLocation')}
                authorizedAllottedTime={get(current, 'authorizedAllottedTime')}
                countryList={get(update_store, 'countryList')}/>
            }

            {/*IP?????????????????????*/}
            {
              !!ipTypeSuperiorNumber &&
              <SocialPlatform
                updateStore={update_store}
                ipAccountInfoDTOList={ipAccountInfoDTOList}
              />
            }

            {/* IP???????????? */}
            {
              !!ipTypeSuperiorNumber &&
              <Material
                updateStore={update_store}
                rightIPImageShow={get(update_store, 'rightIPImageShow')}
                prodect={prodect}
              />
            }

            {/* ?????????/???????????? */}
            {
              !!ipTypeSuperiorNumber &&
              <Case
                updateStore={update_store}
                cooperationCase={cooperationCase}
                rightIPCaseShow={update_store.rightIPCaseShow}/>
            }

            {this.props.children}

            {/* ???????????? */}
            {!!ipTypeSuperiorNumber &&
            <InvestmentMaterial
              updateStore={update_store}
              ipId={ipId}
              investmentList={toJS(get(current, 'investmentList'))}
              userGuid={userGuid}
              type={1}
            />
            }

            {/* ????????????*/}
            {
              !!ipTypeSuperiorNumber && ipTypeSuperiorNumber !== 8 &&
              <div className="rightIPUpload flex-column">
                <p className="rules_Tip">
                  ?????????????????????????????????????????????.zip??????????????????????????????10M?????????
                </p>
                <div className="rules_pull">
                  <div className="clearfix">
                    <div className="ruleText">???????????????????????????????????????????????????</div>
                    <div className="file btn btn-primary limit-custom-btn">????????????
                      <input
                        type="file"
                        accept=".zip"
                        className="pointer"
                        onChange={async (e) => {
                          if (!(update_store.current.agencyAgreement)) {
                            await update_store.uploadInvestment(e.target.files[0], userGuid, ipId, 2);
                          }
                        }}/>
                    </div>
                  </div>
                  {/*??????*/}
                  {
                    update_store.current.agencyAgreement &&
                    <div>
                      <span className="word-ellipsis">{update_store.current.agencyAgreementName}</span>
                      <a onClick={() => window.open(update_store.current.agencyAgreement)} className="download">??????</a>
                      <a className="download"
                         onClick={() => {
                           update_store.current.agencyAgreement = "";
                           update_store.current.agencyAgreementName = "";
                           update_store.current.agencyAgreementGuid = "";
                           update_store.agencyAgreementName = "";
                         }}>??????</a>
                    </div>
                  }
                  {/*??????*/}
                  <p>{update_store.agencyAgreementName}</p>
                </div>
                <div className="rules_pull">
                  <div className="clearfix">
                    <div className="ruleText">??????????????????????????????????????????????????????????????????</div>

                    <div className="file btn btn-primary limit-custom-btn">????????????
                      <input
                        type="file"
                        accept=".zip"
                        className="pointer"
                        onChange={async (e) => {
                          if (!(update_store.current.copyrightCertificate)) {
                            await update_store.uploadInvestment(e.target.files[0], userGuid, ipId, 3);
                          }
                        }}/>
                    </div>
                  </div>
                  {
                    update_store.current.copyrightCertificate &&
                    <div>
                      <span className="word-ellipsis">{update_store.current.copyrightCertificateName}</span>
                      <a onClick={() => window.open(update_store.current.copyrightCertificate)}
                         className="download">??????</a>
                      <a className="download" onClick={() => {
                        // update_store.setCurrent({ "copyrightCertificate": "", "copyrightCertificateName": "" });
                        update_store.current.copyrightCertificate = "";
                        update_store.current.copyrightCertificateName = "";
                        update_store.current.copyrightCertificateGuid = "";
                        update_store.copyrightCertificateName = "";
                      }}>??????</a>
                    </div>
                  }
                  {
                    // update_store.current.copyrightCertificateName !== update_store.copyrightCertificateName &&
                    <p>{update_store.copyrightCertificateName}</p>
                  }
                </div>
                <div className="rules_pull">
                  <div className="clearfix">
                    <div className="ruleText">????????????IP????????????????????????</div>

                    <div className="file btn btn-primary limit-custom-btn">????????????
                      <input
                        type="file"
                        accept=".zip"
                        className="pointer"
                        onChange={async (e) => {
                          if (!(update_store.current.ownership)) {
                            await update_store.uploadInvestment(e.target.files[0], userGuid, ipId, 4);
                          }
                        }}/>
                    </div>
                  </div>
                  {
                    update_store.current.ownership &&
                    <div>
                      <span className="word-ellipsis">{update_store.current.ownershipName}</span>
                      <a onClick={() => window.open(update_store.current.ownership)}
                         className="download"
                      >??????</a>
                      <a className="download"
                         onClick={() => {
                           update_store.current.ownership = "";
                           update_store.current.ownershipName = "";
                           update_store.current.ownershipGuid = "";
                           update_store.ownershipName = "";
                         }}
                      >??????</a>
                    </div>
                  }
                  {
                    // update_store.current.ownershipName !== update_store.ownershipName &&
                    <p>{update_store.ownershipName}</p>
                  }
                </div>
              </div>
            }
            {
              !!ipTypeSuperiorNumber && ipTypeSuperiorNumber === 8 &&
              <div className="rightIPUpload flex-column">
                <p className="rules_Tip">
                  ???????????????????????????????????????.zip??????????????????????????????10M?????????
                </p>
                <div className="rules_pull">
                  <div className="clearfix">
                    <div className="ruleText">???????????????????????????????????????????????????</div>

                    <div className="file btn btn-primary limit-custom-btn">????????????
                      <input
                        type="file"
                        accept=".zip"
                        className="pointer"
                        onChange={async (e) => {
                          if (!update_store.current.ownershipName) {
                            await update_store.uploadInvestment(e.target.files[0], userGuid, ipId, 5);
                          }
                        }}/>
                    </div>
                  </div>
                  {
                    update_store.current.ownership &&
                    <div>
                      <span className="word-ellipsis">{update_store.current.ownershipName}</span>
                      <a onClick={() => window.open(update_store.current.ownership)} className="download"
                         download="">??????</a>
                      <a className="download" onClick={() => {
                        update_store.current.ownership = "";
                        update_store.current.ownershipName = "";
                        update_store.current.ownershipGuid = "";
                        update_store.ownershipName = "";
                      }}>??????</a>
                    </div>

                  }
                  {
                    // update_store.current.ownershipName !== update_store.ownershipName &&
                    <p>{update_store.ownershipName}</p>
                  }
                </div>
              </div>
            }

            {/* ??????????????? */}
            {!!ipTypeSuperiorNumber &&
            <div className="rightIPReadAndAgree">
              <Checkbox
                className="rightIPReadAndAgreeCheckbox"
                checked={update_store.readAndAgree}
                onChange={(e) => update_store.setReadAndAgree(e.target.checked)}>
                ?????????????????????
                <span className="span" onClick={() => {
                  this.setState({ ruleModalShow: true });
                }}>???IP??????????????????????????????????????????????????????</span>
                ???????????????????????????IP????????????????????????????????????????????????
              </Checkbox>
            </div>
            }

            {/* ??????Btn */}
            <div className="rightIPTwoBtn">
              {ipId
                ? <div className="submitBtn" onClick={async () => {
                  const { data }: any = await update_store.beforeEditIp(ipId, userGuid);
                  if (data) {
                    message.success("????????????!");
                    setTimeout(() => this.props.history.push('/user/1'), 2000);
                    update_store.agencyAgreementName = '';
                    update_store.copyrightCertificateName = '';
                    update_store.ownershipName = '';
                  } else if (typeof data === 'object') {
                    data.hasOwnProperty('errorMsg') && message.error(data.errorMsg);
                  } else if (data === '') {
                    this.setState({
                      showModal: true
                    });
                  }
                }}>??????</div>
                : <div>
                  <div className="submitBtn" onClick={async () => {
                    const { status, data } = await update_store.beforeCreateIp(userGuid);
                    if (status) {
                      message.success(data.errorMsg);
                      setTimeout(() => this.props.history.push('/user/1'), 2000);
                      update_store.agencyAgreementName = '';
                      update_store.copyrightCertificateName = '';
                      update_store.ownershipName = '';
                    } else {
                      data && message.error(data.errorMsg);
                    }
                  }}>????????????
                  </div>
                  <div className="cancelBtn" onClick={() => update_store.reset()}>??????</div>
                </div>
              }
            </div>
          </div>
        </div>
        <ScrollTop/>
        <MD
          showModal={this.state.ruleModalShow}
          onOk={() => this.setState({ ruleModalShow: false })}
          onCancel={() => this.setState({ ruleModalShow: false })}
        />
      </div>
    );
  }
}
