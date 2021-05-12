import * as React from "react";
import { observer, inject } from "mobx-react";
import "@assets/scss/gallery.scss";
import { Link } from "react-router-dom";
import {} from "@utils/api";
import Bianzu from "../../assets/images/gallery/bianzu.png";
import Xuantu from "../../assets/images/gallery/xuantu.png";
import Maitu from "../../assets/images/gallery/maitu.png";
import Download from "../../assets/images/gallery/download.png";
import Upload from "../../assets/images/gallery/upload.png";
import Youji from "../../assets/images/gallery/youji.png";
import Liangchan from "../../assets/images/gallery/liangchan.png";
import NoResult from "../../assets/images/gallery/no-result.jpg";

/* 授权流程 */
const processList = [
  {
    img: Xuantu,
    name: "线上选图",
    tips: "图库商城选择意向合作的IP图库",
  },
  {
    img: Maitu,
    name: "一键下单",
    tips: "选择授权信息，线上购买获得授权资格",
  },
  {
    img: Download,
    name: "下载源文件",
    tips: "下载图库高清图库源文件设计产品图",
  },
  {
    img: Upload,
    name: "上传产品设计图",
    tips: "上传产品图给IP图库版权方监修",
  },
  {
    img: Youji,
    name: "邮寄样品",
    tips: "邮寄样品并上传物流单号给版权方进行监修",
  },
  {
    img: Liangchan,
    name: "获取防伪码量产",
    tips: "获取防伪码进行批量生产和投放",
  },
];

/* tabs */
const tabsList = [
  {
    label: "热门图库",
    id: 1,
  },
  {
    label: "最新上架",
    id: 2,
  },
];
@inject("gallery_store", "login")
@observer
export default class GalleryIndex extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      type: 1,
      authorizeTypeGuids: "",
      authorizeRegion: "",
      label: "",
    };
  }

  async componentDidMount() {
    const {
      gallery_store,
      login,
      location: { search },
    } = this.props;
    gallery_store.changeUserInfo(login.userInfo);
    gallery_store.GalleryList(this.state);
    gallery_store.getAuthorizeList(this.state);
    gallery_store.getCountryList(this.state);
    gallery_store.getLabelRadio(this.state);
  }

  render() {
    const {
      gallery_store,
      location: { search },
    } = this.props;
    const {
      galleryList,
      authorizeList,
      countryList,
      labelRadioList,
      GalleryList,
    } = gallery_store;
    const { type, authorizeTypeGuids, authorizeRegion, label } = this.state;
    return (
      <div className="gallery gallery-index">
        <div className="banner"></div>
        {/* 流程 */}
        <div className="process">
          <div>
            <img src={Bianzu} alt="" />
            图库线上授权流程
          </div>
          <div>
            {processList.map((e, k) => (
              <div className="process__item" key={k}>
                <div className="pic">
                  <img src={e.img} alt="" />
                </div>
                <div className="name">{e.name}</div>
                <div className="tips">{e.tips}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 内容 */}
        <div className="content">
          <div className="tabs">
            {tabsList.map((e, k) => (
              <div
                onClick={() => {
                  this.setState({ type: e.id });
                  setTimeout(() => {
                    GalleryList(this.state);
                  });
                }}
                className={e.id === type ? "tab--active" : ""}
                key={k}
              >
                <span>{e.label}</span>
              </div>
            ))}
          </div>
          <div className="filter">
            <div>
              <div>
                <div className="label">授权品类：</div>
                <div className="name">
                  {!!authorizeList &&
                    authorizeList.map((i, k) => (
                      <p
                        onClick={() => {
                          this.setState({ authorizeTypeGuids: i.typeGuid });
                          setTimeout(() => {
                            GalleryList(this.state);
                          });
                        }}
                        className={`link ${
                          i.typeGuid === authorizeTypeGuids ? "link--active" : ""
                        }`}
                        key={k}
                      >
                        {i.typeName}
                      </p>
                    ))}
                </div>
              </div>
              <div>
                <div className="label">授权区域：</div>
                <div className="name">
                  {!!countryList &&
                    countryList.map((i, k) => (
                      <p
                        onClick={() => {
                          this.setState({ authorizeRegion: i.id });
                          setTimeout(() => {
                            GalleryList(this.state);
                          });
                        }}
                        className={`link ${
                          i.id === authorizeRegion ? "link--active" : ""
                        }`}
                        key={k}
                      >
                        {i.resourceValue}
                      </p>
                    ))}
                </div>
              </div>
              <div>
                <div className="label">标&nbsp;&nbsp;&nbsp;&nbsp;签：</div>
                <div className="name">
                  {!!labelRadioList &&
                    labelRadioList.map((i, k) => (
                      <p
                        onClick={() => {
                          this.setState({ label: i.id });
                          setTimeout(() => {
                            GalleryList(this.state);
                          });
                        }}
                        className={`link ${
                          i.id === label ? "link--active" : ""
                        }`}
                        key={k}
                      >
                        {i.resourceValue}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="list">
            <div>
              {!!galleryList &&
                !!galleryList.length &&
                galleryList.map((e, k) => (
                  <div key={k}>
                    <Link to={`/gallery/detail/2/${e.galleryGuid}`}>
                      <div className="pic">
                        <div className="bg-1"></div>
                        <div className="bg-2"></div>
                        <img src={e.picUrl} alt="" />
                      </div>
                      <p>{e.title}</p>
                    </Link>
                  </div>
                ))}
                {
                  (!galleryList || !galleryList.length) && 
                  <div className="no-result">
                    <img src={NoResult} alt=""/>
                    没有检索到您要的图库，请更换筛选条件～
                  </div>
                }
            </div>
            {/* <p className="load-more">
              <span className="link">下拉查看更多</span>
            </p> */}
          </div>
        </div>
      </div>
    );
  }
}
