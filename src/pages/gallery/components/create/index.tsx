import * as React from "react";
import { observer, inject } from "mobx-react";
import { Upload, message, Button, Input, Select, Icon, Checkbox } from "antd";
import "@assets/scss/gallery.scss";
import { Link } from "react-router-dom";
import Toast from "@components/toast";
import { savePic, uploadFile, saveGallery } from "@utils/api";
import FileType from "../../../../assets/images/gallery/file-type.png";
import Chat from "../../../../assets/images/gallery/chat.png";
import PicResolution from "../../../../assets/images/gallery/pic-resolution.png";
import PicSize from "../../../../assets/images/gallery/pic-size.png";
import PicType from "../../../../assets/images/gallery/pic-type.png";
import GalleryCreateProtocal from "@components/gallery-create-protocal";

const { Option } = Select;
const { TextArea } = Input;
const verifyToast = {
  ipid: "请填写图库所属IP",
  title: "请填写图库名称",
  // label: "请选择标签",
  galleryDesc: "请填写图库简介",
  fileName: "请上传图库源文件",
  // fileFormat: "请选择文件格式",
  // resolvingPower: "请选择分辨率",
  // colorFormat: "请色彩格式",
  // authorizeRegion: "请选择授权区域",
  IpGalleryPrice: "请填写完整的图库授权规格",
  hasAgreeXieyi: "请勾选同意版权方图库商业授权协议",
};

const fileUrlPre = "https://ipindex.oss-cn-hangzhou.aliyuncs.com/ip_file/";

@inject("gallery_create_store", "login")
@observer
export default class GalleryCreate extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAddlabel: false,
      isAddFoormat: false,
      isAddPower: false,
      hasAgreeXieyi: false,
      showPicIndex: 0,
      messageToast: "",
      showToast: false,
      showProtocol: false,
    };
  }

  async componentDidMount() {
    const {
      gallery_create_store,
      login,
      location: { search },
      match: { params },
    } = this.props;
    const {
      getAuthorizeList,
      getCountryList,
      getLabelRadio,
      getIpName,
      galleryDetail,
      refreshData,
    } = gallery_create_store;
    // 很无奈，每次都要刷新数据
    refreshData();

    await Promise.all([
      (async () => {
        await getLabelRadio();
      })(),
    ]);
    await Promise.all([
      (async () => {
        /* 编辑时先获取详情 */
        if (unescape(params["galleryGuid"])) {
          await galleryDetail(unescape(params["galleryGuid"]));
          this.setState({
            showPicIndex: 1,
          });
        }
      })(),
      (async () => {
        await gallery_create_store.changeUserInfo(login.userInfo);
      })(),
      (async () => {
        await getAuthorizeList();
      })(),
      (async () => {
        await getCountryList();
      })(),
      (async () => {
        await getIpName();
      })(),
    ]);
  }

  closeProtocol() {
    this.setState({ showProtocol: false });
  }

  /* 上传图片 */
  uploadImg = async (e, showPicIndex) => {
    const { gallery_create_store } = this.props;
    const { uploadPicList } = gallery_create_store;

    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 10;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, type: 1, urlType: false };
      if (file.size > max_size) {
        this.setState({ message: "图片过大,请重新上传！", show: true });
        return;
      } else {
        const result = await uploadFile(params);
        if (
          result["errorCode"] === "200" &&
          result["result"].errorCode === 200
        ) {
          const { data: fileUrl } = result["result"];
          if (!!showPicIndex) {
            gallery_create_store.editUploadPicList(
              { fileUrl, type: 1 },
              showPicIndex
            );
          } else {
            gallery_create_store.addUploadPicList({ fileUrl, type: 1 });
            this.setState({
              showPicIndex: uploadPicList.length,
            });
          }
        } else {
          this.setState({
            messageToast: result["result"].errorMsg,
            showToast: true,
          });
        }
      }
    };
  };
  /* 上传文件 */
  uploadFile = async (e, isEdit) => {
    const { gallery_create_store } = this.props;
    const { uploadPicList } = gallery_create_store;

    let file = e.target.files[0];
    const max_size = 1024 * 1024 * 2;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      let formData = new FormData();
      formData.append("file", file);
      const params = { file: formData, type: 2, urlType: false };
      if (file.size > max_size) {
        this.setState({ message: "文件过大,请重新上传！", show: true });
        return;
      } else {
        const result = await uploadFile(params);
        if (
          result["errorCode"] === "200" &&
          result["result"].errorCode === 200
        ) {
          const {
            data: fileUrl,
            mapDate: { fileName, fileSize },
          } = result["result"];
          gallery_create_store.changeOriginFile(
            { fileUrl, fileName, fileSize: String(fileSize) },
            isEdit
          );
        } else {
          this.setState({
            messageToast: result["result"].errorMsg,
            showToast: true,
          });
        }
      }
    };
  };

  /* 勾选协议 */
  agreeXieYi(checked) {
    this.setState({
      hasAgreeXieyi: checked,
    });
  }
  /* 检验表单 */
  verifyForm = () => {
    const {
      gallery_create_store: {
        galleryParams: { IpGallery, IpGalleryPrice },
        originFile,
        fileFormatListStatus,
        resolvingPowerListStatus,
        colorFormatListStatus,
        labelRadioStatus,
        countryListStatus,
      },
    } = this.props;
    const { hasAgreeXieyi } = this.state;

    for (const prop in IpGallery) {
      if (!IpGallery[prop] && IpGallery[prop] !== 0 && prop in verifyToast) {
        this.setState({
          messageToast: verifyToast[prop],
          showToast: true,
        });
        return;
      }
    }
    for (const prop in originFile) {
      if (!originFile[prop] && originFile[prop] !== 0 && prop in verifyToast) {
        this.setState({
          messageToast: verifyToast[prop],
          showToast: true,
        });
        return;
      }
    }
    for (const i of IpGalleryPrice) {
      for (const prop in i) {
        if (i.hasOwnProperty(prop) && !i[prop]) {
          this.setState({
            messageToast: verifyToast.IpGalleryPrice,
            showToast: true,
          });
          return;
        }
      }
    }
    if (!labelRadioStatus.some((e) => e)) {
      this.setState({
        messageToast: "请选择标签",
        showToast: true,
      });
      return;
    }
    if (!fileFormatListStatus.some((e) => e)) {
      this.setState({
        messageToast: "请选择文件格式",
        showToast: true,
      });
      return;
    }
    if (!resolvingPowerListStatus.some((e) => e)) {
      this.setState({
        messageToast: "请选择分辨率",
        showToast: true,
      });
      return;
    }
    if (!colorFormatListStatus.some((e) => e)) {
      this.setState({
        messageToast: "请色彩格式",
        showToast: true,
      });
      return;
    }
    if (!countryListStatus.some((e) => e)) {
      this.setState({
        messageToast: "请选择授权区域",
        showToast: true,
      });
      return;
    }
    if (!hasAgreeXieyi) {
      this.setState({
        messageToast: verifyToast.hasAgreeXieyi,
        showToast: true,
      });
      return;
    }

    this.saveGallery();
  };
  saveGallery = async () => {
    const {
      gallery_create_store: {
        galleryParams: { IpGallery, IpGalleryPrice },
        uploadPicList,
        originFile,
        labelRadio,
        labelRadioStatus,
        fileFormatList,
        fileFormatListStatus,
        resolvingPowerList,
        resolvingPowerListStatus,
        colorFormatList,
        colorFormatListStatus,
        countryList,
        countryListStatus,
        galleryGuid,
      },
      login,
    } = this.props;
    IpGalleryPrice.forEach((e) => {
      e.duration = e.duration.replace("个月", "");
    });
    const params = {
      ...IpGallery,
    };

    /* format label */
    const labelArr = [];
    labelRadioStatus.map((i, k) => {
      if (i) {
        labelArr.push(labelRadio[k].resourceValue);
      }
    });
    params.label = labelArr.join("、");
    /* format 格式 */
    const formatArr = [];
    fileFormatListStatus.map((i, k) => {
      if (i) {
        formatArr.push(fileFormatList[k]);
      }
    });
    originFile.fileFormat = formatArr.join("、");
    /* format 分辨率 */
    const resolvingArr = [];
    resolvingPowerListStatus.map((i, k) => {
      if (i) {
        resolvingArr.push(resolvingPowerList[k]);
      }
    });
    originFile.resolvingPower = resolvingArr.join("、");
    /* format 色彩 */
    const colorArr = [];
    colorFormatListStatus.map((i, k) => {
      if (i) {
        colorArr.push(colorFormatList[k]);
      }
    });
    originFile.colorFormat = colorArr.join("、");
    /* format 地区 */
    const countryArr = [];
    countryListStatus.map((i, k) => {
      if (i) {
        countryArr.push(countryList[k].resourceValue);
      }
    });

    params.authorizeRegion = countryArr.join("、");

    params.ipGalleryFileVOs = [].concat(uploadPicList);
    params.ipGalleryFileVO = Object.assign(originFile);
    params.ipGalleryPriceVOs = [...IpGalleryPrice];
    params.userGuid = login.userInfo.userGuid;
    params.picUrl = uploadPicList[0].fileUrl;

    const {
      result: { errorCode, errorMsg },
    }: any = await saveGallery({ ...params, ...{ galleryGuid } });
    this.setState({
      messageToast: errorMsg,
      showToast: true,
    });
    if (+errorCode === 200) {
      this.props.history.push(`/gallery/manage`);
    }
  };
  render() {
    const {
      gallery_create_store,
      location: { search },
    } = this.props;
    const {
      galleryParams,
      changeGalleryParams,
      labelRadio,
      labelRadioStatus,
      changeLabelRadioStatus,
      addLabelRadio,
      uploadPicList,
      originFile,
      fileFormatList,
      addfileFormatList,
      fileFormatListStatus,
      changeOriginFile,
      changefileFormatListStatus,
      resolvingPowerList,
      resolvingPowerListStatus,
      addResolvingPowerList,
      changeresolvingPowerListStatus,
      colorFormatList,
      colorFormatListStatus,
      changecolorFormatListStatus,
      durationList,
      changeIpGalleryPriceList,
      authorizeList,
      changeGalleryPrice,
      countryList,
      countryListStatus,
      changecountryListStatus,
      ipNameList,
    } = gallery_create_store;

    const { isAddlabel, isAddFoormat, isAddPower, showPicIndex } = this.state;

    return (
      <div className="gallery gallery-create">
        <div className="area">
          <div className="operate">
            <div className="left">
              <div className="upload">
                {showPicIndex === 0 && (
                  <div className="upload-pic">
                    <span>上传图库预览图</span>
                  </div>
                )}
                {showPicIndex !== 0 && (
                  <div className="replace-pic">
                    <img
                      src={
                        uploadPicList[showPicIndex - 1].fileUrl.indexOf(
                          "ipindex.oss-cn-hangzhou"
                        ) !== -1
                          ? uploadPicList[showPicIndex - 1].fileUrl
                          : fileUrlPre + uploadPicList[showPicIndex - 1].fileUrl
                      }
                      alt=""
                    />
                    <p>替换图库预览图</p>
                  </div>
                )}

                <input
                  type="file"
                  className="btn_file"
                  name="image_file"
                  accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                  onChange={async (e) => {
                    await this.uploadImg(e, showPicIndex);
                  }}
                />
              </div>
              <div className="list">
                {uploadPicList &&
                  uploadPicList.map((i: any, k) => (
                    <img
                      onMouseOverCapture={() => {
                        this.setState({ showPicIndex: k + 1 });
                      }}
                      key={k}
                      src={
                        i.fileUrl.indexOf("ipindex.oss-cn-hangzhou") !== -1
                          ? i.fileUrl
                          : fileUrlPre + i.fileUrl
                      }
                    />
                  ))}
                {!!uploadPicList.length && uploadPicList.length < 5 && (
                  <div>
                    <Icon type="plus" />
                    <input
                      type="file"
                      name="image_file"
                      accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                      onChange={async (e) => {
                        await this.uploadImg(e, 0);
                      }}
                    />
                  </div>
                )}
              </div>
              <p>
                <p>预览图仅支持源文件导出的jpg/png图</p>
                {uploadPicList && !uploadPicList.length && (
                  <div>最多可上传5张</div>
                )}
                {uploadPicList && !!uploadPicList.length && (
                  <div>
                    已上传{uploadPicList.length}，还可上传
                    <span style={{ color: "#6236FF" }}>
                      {5 - uploadPicList.length}张
                    </span>
                  </div>
                )}
              </p>
            </div>
            <div className="right">
              <div className="form">
                <div className="item">
                  <div className="label">
                    <div>
                      选择图库所属IP<span style={{ color: "#E02020" }}>*</span>
                      <span className="warn">
                        （注：如无可选的IP，请先上传图库所属的版权IP后再上传图库，立即
                        <Link to="/update">
                          <span className="link">上传IP</span>
                        </Link>
                        )
                      </span>
                    </div>
                  </div>
                  <Select
                    value={galleryParams.IpGallery.ipid}
                    onChange={(e: any) => {
                      changeGalleryParams("IpGallery", {
                        ipid: e,
                      });
                    }}
                  >
                    {ipNameList &&
                      ipNameList.map((ip, ipK) => (
                        <Option key={ipK} value={ip.ipid}>
                          {ip.ip_name}
                        </Option>
                      ))}
                  </Select>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      图库名称<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <Input
                    value={galleryParams.IpGallery.title}
                    onChange={(e: any) => {
                      changeGalleryParams("IpGallery", {
                        title: e.target.value,
                      });
                    }}
                  ></Input>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      打标签<span style={{ color: "#E02020" }}>*</span>
                      <span className="warn">
                        （注：打标签是图库快速被找到、购买的关键)
                      </span>
                    </div>
                  </div>
                  <div className="radio-group">
                    {labelRadio &&
                      labelRadio.map((i, k) => (
                        <div
                          key={k}
                          onClick={() => {
                            changeLabelRadioStatus(k);
                          }}
                          className={labelRadioStatus[k] ? "radio--active" : ""}
                        >
                          {i.resourceValue}
                        </div>
                      ))}
                    {isAddlabel && (
                      <input
                        autoFocus
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            addLabelRadio(e.target.value);
                            changeGalleryParams("IpGallery", {
                              label: e.target.value,
                            });
                          }
                          this.setState({ isAddlabel: false });
                        }}
                        style={{ outline: "none" }}
                        type="text"
                      />
                    )}
                    <div
                      className="add"
                      onClick={() => {
                        this.setState({ isAddlabel: true });
                      }}
                    >
                      +&nbsp;添加
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      IP图库简介<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <TextArea
                    value={galleryParams.IpGallery.galleryDesc}
                    onChange={(e: any) => {
                      changeGalleryParams("IpGallery", {
                        galleryDesc: e.target.value,
                      });
                    }}
                    autoSize={{ minRows: 4 }}
                  ></TextArea>
                </div>
              </div>

              <div className="form">
                <div className="item">
                  <div className="label">
                    <div>
                      上传图库源文件<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  {!originFile ||
                    (!originFile.fileName && (
                      <div className="upload-file">
                        <div>
                          <div className="gallery-btn gallery-btn--primary">
                            上传图库源文件
                          </div>
                          <input
                            type="file"
                            name="image_file"
                            onChange={async (e) => {
                              await this.uploadFile(e, false);
                            }}
                          />
                        </div>

                        <p>
                          支持PSD、SVG、AI、XD、C4D、CDR、SKETCH、EPS、AEP、TIF、MAX、AE、JPG、PNG、ZIP...等格式，
                          体积在2G以下
                        </p>
                      </div>
                    ))}
                  {originFile && originFile.fileName && (
                    <div className="upload-file-success">
                      <div className="left">
                        <img src={FileType} alt="" />
                        <div>
                          <p>{originFile.fileName}</p>
                          <p>文件大小：{originFile.fileSize}</p>
                        </div>
                      </div>
                      <div className="right">
                        <div>
                          <Icon type="check" />
                          上传成功
                        </div>
                        <div className="upload-file">
                          <div>
                            <div className="gallery-btn gallery-btn--primary">
                              替换源文件
                            </div>
                            <input
                              type="file"
                              name="image_file"
                              onChange={async (e) => {
                                await this.uploadFile(e, true);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="item">
                  <div className="label" style={{ marginBottom: 0 }}>
                    <div>
                      文件格式<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <div className="radio-group">
                    {fileFormatList &&
                      fileFormatList.map((i, k) => (
                        <div
                          key={k}
                          onClick={() => {
                            changefileFormatListStatus(k);
                          }}
                          className={
                            fileFormatListStatus[k] ? "radio--active" : ""
                          }
                        >
                          {i}
                        </div>
                      ))}
                    {isAddFoormat && (
                      <input
                        autoFocus
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            addfileFormatList(e.target.value);
                            changeOriginFile(
                              { fileFormat: e.target.value },
                              false
                            );
                          }
                          this.setState({ isAddFoormat: false });
                        }}
                        style={{ outline: "none" }}
                        type="text"
                      />
                    )}
                    <div
                      className="add"
                      onClick={() => {
                        this.setState({ isAddFoormat: true });
                      }}
                    >
                      +&nbsp;添加
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      源文件尺寸<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <div className="addon-after">
                    <Input
                      value={originFile.imageWide}
                      onChange={(e) => {
                        changeOriginFile({ imageWide: e.target.value }, false);
                      }}
                      addonAfter="px"
                      placeholder="宽"
                    ></Input>
                    <span className="split"></span>
                    <Input
                      value={originFile.imageHigh}
                      onChange={(e) => {
                        changeOriginFile({ imageHigh: e.target.value }, false);
                      }}
                      addonAfter="px"
                      placeholder="高"
                    ></Input>
                  </div>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      分辨率<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <div className="radio-group">
                    {resolvingPowerList &&
                      resolvingPowerList.map((i, k) => (
                        <div
                          key={k}
                          onClick={() => {
                            changeresolvingPowerListStatus(k);
                          }}
                          className={
                            resolvingPowerListStatus[k] ? "radio--active" : ""
                          }
                        >
                          {i}
                        </div>
                      ))}
                    {isAddPower && (
                      <input
                        autoFocus
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            addResolvingPowerList(e.target.value);
                            changeOriginFile(
                              { resolvingPower: e.target.value },
                              false
                            );
                          }
                          this.setState({ isAddPower: false });
                        }}
                        style={{ outline: "none" }}
                        type="text"
                      />
                    )}
                    <div
                      className="add"
                      onClick={() => {
                        this.setState({ isAddPower: true });
                      }}
                    >
                      +&nbsp;添加
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="label">
                    <div>
                      色彩格式<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <div className="radio-group">
                    {colorFormatList &&
                      colorFormatList.map((i, k) => (
                        <div
                          key={k}
                          onClick={() => {
                            changecolorFormatListStatus(k);
                          }}
                          className={
                            colorFormatListStatus[k] ? "radio--active" : ""
                          }
                        >
                          {i}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="form">
                <div className="item">
                  <div className="label">
                    <div>
                      图库授权规格<span style={{ color: "#E02020" }}>*</span>
                    </div>
                    <div
                      className="add-type"
                      onClick={() => {
                        changeIpGalleryPriceList();
                      }}
                    >
                      <Icon type="plus-circle" theme="filled" />
                      <span>添加图库授权规格</span>
                    </div>
                  </div>
                  {galleryParams.IpGalleryPrice.map((i, k) => (
                    <div key={k} className="warrant-type">
                      <div>
                        <div>
                          <div>
                            <div className="label">
                              授权品类
                              <span style={{ color: "#E02020" }}>*</span>
                            </div>
                            <div className="double-input">
                              <Select
                                value={
                                  galleryParams.IpGalleryPrice[k]
                                    .authorizeTypeGuid
                                }
                                onChange={(e) => {
                                  changeGalleryPrice(
                                    { authorizeTypeGuid: e },
                                    k
                                  );
                                }}
                                placeholder="请选择授权品类"
                              >
                                {authorizeList &&
                                  authorizeList.map((price, priceK) => (
                                    <Option
                                      key={priceK}
                                      value={String(price.typeGuid)}
                                    >
                                      {price.typeName}
                                    </Option>
                                  ))}
                              </Select>
                              <Input
                                value={
                                  galleryParams.IpGalleryPrice[k].authorizeType
                                }
                                onChange={(e) => {
                                  changeGalleryPrice(
                                    { authorizeType: e.target.value },
                                    k
                                  );
                                }}
                                placeholder="请填写具体授权商品类型"
                              ></Input>
                            </div>
                          </div>
                          <div>
                            <div className="label">
                              授权期限（含清货期）
                              <span style={{ color: "#E02020" }}>*</span>
                            </div>
                            <Select
                              value={galleryParams.IpGalleryPrice[k].duration}
                              onChange={(e) => {
                                changeGalleryPrice({ duration: e }, k);
                              }}
                              placeholder="请选择授权期限"
                            >
                              {durationList &&
                                durationList.map((duration, durationK) => (
                                  <Option key={durationK} value={duration}>
                                    {duration}
                                  </Option>
                                ))}
                            </Select>
                          </div>
                        </div>
                        <div>
                          <div>
                            <div className="label">
                              限定授权商品生产数量区间
                              <span style={{ color: "#E02020" }}>*</span>
                            </div>
                            <div className="Quantity">
                              <Input
                                value={
                                  galleryParams.IpGalleryPrice[k]
                                    .productionQuantityMin
                                }
                                onChange={(e) => {
                                  changeGalleryPrice(
                                    { productionQuantityMin: e.target.value },
                                    k
                                  );
                                }}
                                placeholder="请填写生产数量最小值"
                              ></Input>
                              <span></span>
                              <Input
                                value={
                                  galleryParams.IpGalleryPrice[k]
                                    .productionQuantityMax
                                }
                                onChange={(e) => {
                                  changeGalleryPrice(
                                    { productionQuantityMax: e.target.value },
                                    k
                                  );
                                }}
                                placeholder="请填写生产数量最大值"
                              ></Input>
                            </div>
                          </div>
                          <div>
                            <div className="label">
                              授权费用
                              <span style={{ color: "#E02020" }}>*</span>
                            </div>
                            <Input
                              value={galleryParams.IpGalleryPrice[k].price}
                              onChange={(e) => {
                                changeGalleryPrice(
                                  { price: e.target.value },
                                  k
                                );
                              }}
                              placeholder="请填写授权费用"
                            ></Input>
                          </div>
                        </div>
                      </div>
                      {galleryParams.IpGalleryPrice.length > 1 && (
                        <Icon
                          onClick={() => {
                            changeIpGalleryPriceList(k);
                          }}
                          type="close-circle"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="item">
                  <div className="label" style={{ marginBottom: 0 }}>
                    <div>
                      可授权地区<span style={{ color: "#E02020" }}>*</span>
                    </div>
                  </div>
                  <div className="radio-group">
                    {countryList &&
                      countryList.map((i, k) => (
                        <div
                          key={k}
                          onClick={() => {
                            changecountryListStatus(k);
                          }}
                          className={
                            countryListStatus[k] ? "radio--active" : ""
                          }
                        >
                          {i.resourceValue}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="xieyi">
                  <Checkbox
                    onChange={(e) => {
                      this.agreeXieYi(e.target.checked);
                    }}
                  >
                    我已阅读并同意
                   
                  </Checkbox>
                  <span
                      onClick={() => {
                        this.setState({ showProtocol: true });
                      }}
                      style={{ color: "#4185F3", cursor: "pointer" }}
                    >
                      《版权方图库商业授权协议》
                    </span>
                    ，并为本单位所上传IP图库信息和数据的合法性、真实性负责。
                  <p>
                    为了确保您签订的授权协议具有法律效应，请您仔细阅读至协议最后一张，并勾选同意协议
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-btn-group">
            <div
              className="gallery-btn gallery-btn--primary"
              onClick={this.verifyForm}
            >
              提交审核
            </div>
            {/* <div className="gallery-btn gallery-btn--default">重置</div> */}
          </div>
        </div>
        {this.state.showToast && (
          <Toast
            onClose={() => {
              this.setState({ showToast: false });
            }}
            duration={2}
            message={this.state.messageToast}
          />
        )}
        {this.state.showProtocol && (
          <GalleryCreateProtocal
            closeProtocol={() => {
              this.closeProtocol();
            }}
          ></GalleryCreateProtocal>
        )}
      </div>
    );
  }
}
