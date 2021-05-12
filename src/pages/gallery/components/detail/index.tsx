import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/gallery.scss";
import { Link } from "react-router-dom";
import { userPrejudgment } from "@utils/api";
import Toast from "@components/toast";
import FileType from "../../../../assets/images/gallery/file-type.png";
import { bytesToSize } from "@utils/util";
import ic_clear from "@assets/images/ic_clear.png";
import error_icon from "@assets/images/error-icon.png";
import Enterprise from "../../../../assets/images/gallery/enterprise.png";
import Chat from "../../../../assets/images/gallery/chat.png";
import PicResolution from "../../../../assets/images/gallery/pic-resolution.png";
import PicSize from "../../../../assets/images/gallery/pic-size.png";
import PicType from "../../../../assets/images/gallery/pic-type.png";
import moment from "moment";

const fileInfoList = [
  {
    label: "尺寸/分辨率",
    icon: PicResolution,
    value: "resolvingPower",
  },
  {
    label: "图库文件格式",
    icon: PicType,
    value: "fileFormat",
  },
  {
    label: "图库文件大小",
    icon: PicSize,
    value: "fileSize",
  },
];
const introList = [
  {
    label: "图库所属IP：",
    value: "ipName",
  },
  {
    label: "图库标签：",
    value: "label",
  },
  {
    label: "图库介绍：",
    value: "galleryDesc",
  },
];
@inject("gallery_detail_store", "login")
@observer
export default class GalleryIndex extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showPicIndex: 0,
      messageToast: "",
      userAttribute: "",
      companyRealStatus: "",
      showModal: false,
      identity: null, // 1 => 卖家，2 => 买家
    };
  }

  async componentDidMount() {
    const {
      gallery_detail_store,
      login,
      location: { search },
      match: { params },
    } = this.props;
    this.setState({
      identity: +unescape(params["identity"]),
    });
    // 很无奈，每次都要刷新数据
    gallery_detail_store.refreshData();
    gallery_detail_store.changeUserInfo(login.userInfo);
    gallery_detail_store.changegalleryGuid(unescape(params["galleryGuid"]));
    gallery_detail_store.getGalleryDetail();
    gallery_detail_store.galleryDetailFilter();
    const {
      result: {
        data: { userAttribute, companyRealStatus },
      },
    }: any = await userPrejudgment(login.userInfo.userGuid);
    this.setState({
      userAttribute,
      companyRealStatus,
    });
  }

  verifyForm = () => {
    const {
      gallery_detail_store,
      location: { search },
    } = this.props;
    const {
      showPicIndex,
      userAttribute,
      companyRealStatus,
      showModal,
    } = this.state;
    const {
      galleryDetail,
      galleryFilter,
      galleryFilterParams,
      galleryGuid,
      changegalleryFilterParams,
    } = gallery_detail_store;
    if (userAttribute !== 2 || companyRealStatus !== 1) {
      this.setState({
        showModal: true,
      });
      return;
    }
    if (!galleryFilterParams.authorizeType) {
      this.setState({
        messageToast: "请选择授权品类",
      });
      return;
    }
    if (!galleryFilterParams.duration) {
      this.setState({
        messageToast: "请选择授权期限",
      });
      return;
    }
    if (!galleryFilterParams.productionQuantityMin) {
      this.setState({
        messageToast: "请选择生产数量",
      });
      return;
    }
    this.setState({
      messageToast: "",
    });
    this.props.history.push(`/gallery/order/${galleryGuid}/${galleryFilterParams.authorizeType}/${galleryFilterParams.duration}/${galleryFilterParams.productionQuantityMin}/${galleryFilterParams.productionQuantityMax}/${galleryFilter.prices}`);
  };

  render() {
    const {
      gallery_detail_store,
      location: { search },
    } = this.props;
    const { showPicIndex, messageToast, showModal, identity } = this.state;
    const {
      galleryDetail,
      galleryFilter,
      galleryFilterParams,
      changegalleryFilterParams,
    } = gallery_detail_store;

    return (
      <div className="gallery gallery-detail">
        <div className="area">
          {+identity === 1 && galleryDetail.auditStatus === 3 && (
            <div className="audit-reason">
              <p>未通过理由：</p>
              <p>{galleryDetail.auditReason}</p>
            </div>
          )}
          <div className="info">
            <div className="left">
              {galleryDetail.ipGalleryFileVOs &&
                galleryDetail.ipGalleryFileVOs.length && (
                  <div>
                    <img
                      src={galleryDetail.ipGalleryFileVOs[showPicIndex].fileUrl}
                      alt=""
                    />
                    <div>
                      {galleryDetail.ipGalleryFileVOs
                        .slice(0, 5).filter(e => e.type === 1)
                        .map((i, k) => (
                          <img
                            onMouseOverCapture={() => {
                              this.setState({ showPicIndex: k });
                            }}
                            key={k}
                            src={i.fileUrl}
                          />
                        ))}
                    </div>
                  </div>
                )}
            </div>
            <div className="right">
              <div className="name">
                {galleryDetail.title}
                {+identity === 2 && (
                  <div>
                    <img src={Enterprise} alt="" />
                    <span>版权已认证</span>
                  </div>
                )}
              </div>
              <div className="company">
                <div>
                  <img src={galleryDetail.companyLogo} alt="" />
                  <div>
                    <p>{galleryDetail.companyName}</p>
                    <p>
                      {moment(new Date(galleryDetail.auditDate)).format(
                        "YYYY-MM-DD"
                      )}
                      发布
                    </p>
                  </div>
                </div>
                <div>
                  {/* <img src={Chat} alt="" /> */}
                  {/* <span>私信TA</span> */}
                </div>
              </div>
              {+identity === 2 && (
                <div className="declare">
                  <span>版权申明：</span>
                  本图库由版权公司/版权人持有，用户购买后只能在授权期限内使用，禁止转授权行为，版权公司保有侵权追责权。
                </div>
              )}
              {+identity === 1 && (
                <div className="file-info">
                  <img src={FileType} alt="" />
                  <div>
                    <span>
                      {!!galleryDetail.ipGalleryFileVO &&
                        galleryDetail.ipGalleryFileVO.fileName}
                    </span>
                    <span>
                      (
                      {!!galleryDetail.ipGalleryFileVO &&
                        bytesToSize(+galleryDetail.ipGalleryFileVO.fileSize)}
                      )
                    </span>
                  </div>
                </div>
              )}

              {galleryDetail.ipGalleryFileVO && (
                <React.Fragment>
                  <div className="file">
                    {fileInfoList.map((i, k) => (
                      <div key={k}>
                        <div className="label">{i.label}</div>
                        <div className="value">
                          <img src={i.icon} alt="" />
                          {i.value === "fileSize" && (
                            <span>
                              {bytesToSize(
                                galleryDetail.ipGalleryFileVO[i.value]
                              )}
                            </span>
                          )}
                          {i.value !== "fileSize" && (
                            <span>
                              {galleryDetail.ipGalleryFileVO[i.value]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}

              <div className="warrant">
                <div className="warrant-item">
                  <div>授权区域：</div>
                  <div>
                    <span>{galleryDetail.authorizeRegion}</span>
                  </div>
                </div>
                <div className="warrant-item">
                  <div>授权品类：</div>
                  <div>
                    {galleryFilter.authorizeTypeList.map((i, k) => (
                      <React.Fragment key={k}>
                        {galleryFilterParams.authorizeType === i.value && (
                          <span
                            onClick={() => {
                              if (i.choose) {
                                changegalleryFilterParams(
                                  "authorizeType",
                                  i.value
                                );
                              }
                            }}
                            className={
                              i.choose
                                ? "radio radio--active"
                                : "radio radio--disable"
                            }
                            key={k}
                          >
                            {i.value}
                          </span>
                        )}
                        {galleryFilterParams.authorizeType !== i.value && (
                          <span
                            onClick={() => {
                              if (i.choose) {
                                changegalleryFilterParams(
                                  "authorizeType",
                                  i.value
                                );
                              }
                            }}
                            className={
                              i.choose ? "radio" : "radio radio--disable"
                            }
                            key={k}
                          >
                            {i.value}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="warrant-item">
                  <div>授权期限：</div>
                  <div>
                    {galleryFilter.durationList.map((i, k) => (
                      <React.Fragment key={k}>
                        {galleryFilterParams.duration === i.value && (
                          <span
                            onClick={() => {
                              if (i.choose) {
                                changegalleryFilterParams("duration", i.value);
                              }
                            }}
                            className={
                              i.choose
                                ? "radio radio--active"
                                : "radio radio--disable"
                            }
                            key={k}
                          >
                            {`${i.value}个月`}
                          </span>
                        )}
                        {galleryFilterParams.duration !== i.value && (
                          <span
                            onClick={() => {
                              if (i.choose) {
                                changegalleryFilterParams("duration", i.value);
                              }
                            }}
                            className={
                              i.choose ? "radio" : "radio radio--disable"
                            }
                            key={k}
                          >
                            {`${i.value}个月`}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="warrant-item">
                  <div>生产数量：</div>
                  <div>
                    {galleryFilter.productionQuantityList.map((i, k) => (
                      <React.Fragment key={k}>
                        {galleryFilterParams.productionQuantityMin ===
                          i.value.split("-")[0] &&
                          galleryFilterParams.productionQuantityMax ===
                            i.value.split("-")[1] && (
                            <span
                              onClick={() => {
                                if (i.choose) {
                                  changegalleryFilterParams(
                                    "productionQuantity",
                                    i.value
                                  );
                                }
                              }}
                              className={
                                i.choose
                                  ? "radio radio--active"
                                  : "radio radio--disable"
                              }
                              key={k}
                            >
                              {`${i.value}`}
                            </span>
                          )}
                        {!(
                          galleryFilterParams.productionQuantityMin ===
                            i.value.split("-")[0] &&
                          galleryFilterParams.productionQuantityMax ===
                            i.value.split("-")[1]
                        ) && (
                          <span
                            onClick={() => {
                              if (i.choose) {
                                changegalleryFilterParams(
                                  "productionQuantity",
                                  i.value
                                );
                              }
                            }}
                            className={
                              i.choose ? "radio" : "radio radio--disable"
                            }
                            key={k}
                          >
                            {`${i.value}`}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="warrant-item aglin-center">
                  <div>授权金额：</div>
                  <div>
                    <span className="money">{galleryFilter.prices}</span>
                  </div>
                </div>
              </div>
              {messageToast && <div className="error-tips">{messageToast}</div>}
              <div
                className="gallery-btn gallery-btn--primary"
                onClick={() => {
                  this.verifyForm();
                }}
              >
                立即购买
              </div>
            </div>
          </div>
          {+identity === 2 && (
            <div className="intro">
              <div className="title">图库详情</div>
              {introList.map((i, k) => (
                <div className="item" key={k}>
                  <div>{i.label}</div>
                  {i.value === "ipName" && (
                    <div>
                      <Link
                        to={`/detail/${galleryDetail.ipTypeNumber}/${galleryDetail.ipid}`}
                      >
                        {galleryDetail[i.value]}
                      </Link>
                    </div>
                  )}
                  {i.value !== "ipName" && <div>{galleryDetail[i.value]}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        {showModal && (
          <div className="tips-modal">
            <div className="area">
              <img
                className="clear"
                src={ic_clear}
                onClick={() => {
                  this.setState({ showModal: false });
                }}
                alt=""
              />
              <div className="head">
                <img src={error_icon} alt="" />
                <p className="title">温馨提示</p>
              </div>
              <div className="body-error">
                <p style={{textAlign: "center"}}>很抱歉，您还未进行企业资质认证</p>
                <p style={{textAlign: "center"}}>图库授权交易只针对已认证的企业，是否立即进行企业认证？</p>
              </div>
              <div className="foot">
                <div>
                  <Link to="/user/2">前往认证</Link>
                </div>
                <div
                  onClick={() => {
                    this.setState({ showModal: false });
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
