import * as React from "react";
import { observer, inject } from "mobx-react";
import { Upload, message, Button, Input, Select, Icon, Checkbox } from "antd";
import "@assets/scss/gallery.scss";
import { Link } from "react-router-dom";
import {} from "@utils/api";
import Toast from "@components/toast";
import { bytesToSize } from "@utils/util";
import Enterprise from "../../../../assets/images/gallery/enterprise.png";
import Chat from "../../../../assets/images/gallery/chat.png";
import PicResolution from "../../../../assets/images/gallery/pic-resolution.png";
import PicSize from "../../../../assets/images/gallery/pic-size.png";
import PicType from "../../../../assets/images/gallery/pic-type.png";
import Aside from "@pages/copyright-center/components/aside";
import moment from "moment";
import NoResult from "../../../../assets/images/gallery/no-result.jpg";
const filterAudit = (auditStatus, status) => {
  switch (+auditStatus) {
    case 0:
      return "待审核";
    case 2:
      return "审核不通过";
    case 1:
      break;
    default:
      return;
  }
  switch (+status) {
    case 1:
      return "审核通过\n";
    case 2:
      return "审核通过\n(已下架)";
    default:
      return;
  }
};
@inject("gallery_manage_store", "login")
@observer
export default class GalleryManage extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: "",
    };
  }

  async componentDidMount() {
    const {
      gallery_manage_store,
      login,
      location: { search },
    } = this.props;
    gallery_manage_store.changeUserInfo(login.userInfo);
    gallery_manage_store.getMyGallery();
  }

  offonShelt = async (galleryGuids, type) => {
    const { gallery_manage_store } = this.props;
    const { offonShelt, getMyGallery } = gallery_manage_store;
    const { errorCode, errorMsg } = await offonShelt(galleryGuids, type);
    this.setState({
      showToast: true,
      toastMsg: errorMsg,
    });
    if (errorCode === 200) {
      getMyGallery();
    }
  };

  delGallery = async (galleryGuids) => {
    const { gallery_manage_store } = this.props;
    const { delGallery, getMyGallery } = gallery_manage_store;
    const { errorCode, errorMsg } = await delGallery(galleryGuids);
    this.setState({
      showToast: true,
      toastMsg: errorMsg,
    });
    if (errorCode === 200) {
      getMyGallery();
    }
  };

  render() {
    const {
      gallery_manage_store,
      location: { search },
    } = this.props;
    const {
      auditStatusList,
      myGallery,
      getMyGallery,
      auditStatus,
      changeauditStatus,
    } = gallery_manage_store;
    return (
      <div style={{ backgroundColor: "#f5f5f5", padding: "24px 0" }}>
        <div style={{ width: "11.4rem", margin: "0 auto" }}>
          <Aside path="/gallery/manage" />

          <div className="gallery gallery-manage">
            <div className="head">
              <p>图库列表</p>
              <Link to={`/gallery/create`}>
                <div className="gallery-btn gallery-btn--primary">
                  <Icon type="plus-circle" theme="filled" />
                  新增图库
                </div>
              </Link>
            </div>
            <div className="filter">
              <div className="lf">
                <div>筛选：</div>
                {auditStatusList.map((i, k) => (
                  <span
                    className={i.id === auditStatus ? "cur-status" : ""}
                    key={k}
                    onClick={() => {
                      changeauditStatus(i.id);
                      getMyGallery();
                    }}
                  >
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="list">
              {!!Object.keys(myGallery).length &&
                Object.keys(myGallery).map((i, k) => (
                  <div key={k}>
                    <div className="ip-name">{i}</div>
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>IP图库名称</th>
                          <th>状态</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myGallery[i].map((item, itemK) => (
                          <tr className="body-tr" key={itemK}>
                            <div>
                              <td>
                                <div className="info">
                                  <img src={item.picUrl.split(",")[0]} alt="" />
                                  <div>
                                    <p>{item.title}</p>
                                    <div>
                                      <span>
                                        大小：{bytesToSize(+item.fileSize)}
                                      </span>
                                      <span>
                                        上传时间：{" "}
                                        {moment(
                                          new Date(item.auditDate)
                                        ).format("YYYY-MM-DD")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="status">
                                {filterAudit(item.auditStatus, item.status)}
                                {item.auditStatus === 1 &&
                                  item.status === 1 && (
                                    <span style={{ color: "#E02020" }}>
                                      已授权
                                    </span>
                                  )}
                              </td>
                              <td className="operation">
                                {/* <Link to={`/gallery/detail/1/${item.galleryGuid}`}>
                            <span>详情</span>
                          </Link> */}
                                {item.auditStatus !== 0 && item.status !== 1 && (
                                  <Link
                                    to={`/gallery/create/${item.galleryGuid}`}
                                  >
                                    <span>编辑</span>
                                  </Link>
                                )}
                                {item.auditStatus === 1 && item.status === 2 && (
                                  <span
                                    onClick={async () => {
                                      this.offonShelt(item.galleryGuid, 1);
                                    }}
                                  >
                                    上架
                                  </span>
                                )}
                                {item.auditStatus === 1 && item.status === 1 && (
                                  <span
                                    onClick={() => {
                                      this.offonShelt(item.galleryGuid, 2);
                                    }}
                                  >
                                    下架
                                  </span>
                                )}
                                {item.auditStatus !== 0 && item.status !== 1 && (
                                  <span
                                    onClick={() => {
                                      this.delGallery(item.galleryGuid);
                                    }}
                                  >
                                    删除
                                  </span>
                                )}
                                {/* <span>复制链接</span> */}
                              </td>
                            </div>
                            {item.auditStatus === 2 && (
                              <p className="audit-reason">
                                <p>未通过的理由：</p>
                                <p>{item.auditReason}</p>
                              </p>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              {!Object.keys(myGallery).length && (
                <div className="no-result">
                  <img src={NoResult} alt="" />
                  <span>
                    您还未上传版权IP图库，
                    <Link to="/gallery/create">上传图库</Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
