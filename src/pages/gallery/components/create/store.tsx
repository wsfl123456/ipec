import { action, observable } from "mobx";
import {
  getGalleryList,
  getAuthorize,
  listCountry,
  getCompanytype,
  getIpName,
  editGalleryDetail,
} from "@utils/api";

interface GalleryFile {}

class GalleryCreateStore {
  @observable userInfo: any;

  @observable galleryGuid: any = "";

  @observable fileFormatList = [
    "PSD",
    "AI",
    "ESP",
    "C4D",
    "SVG",
    "XD",
    "CDR",
    "Sketch",
    "Figma",
    "InDesign",
    "After Effects",
    "Axure",
    "Procreate",
  ];
  @observable fileFormatListStatus = new Array(13).fill(false);

  @observable resolvingPowerList = ["72dpi", "150dpi", "300dpi"];
  @observable resolvingPowerListStatus = new Array(3).fill(false);

  @observable colorFormatList = ["RGB", "CMYK"];
  @observable colorFormatListStatus = new Array(2).fill(false);

  @observable labelRadio = [];
  @observable labelRadioStatus = [];

  @observable durationList = ["3个月", "6个月", "12个月", "18个月", "24个月", "36个月"];

  @observable uploadPicList = [];

  @observable authorizeList = [];

  @observable countryList = [];
  @observable countryListStatus = [];

  @observable ipNameList = [];

  @observable originFile = {
    fileName: "", //文件名称
    fileSize: "", //文件大小
    fileUrl: "", //文件链接
    fileFormat: "", //文件格式
    imageHigh: "", //原图高度
    imageWide: "", //原图宽度
    resolvingPower: "", // 分辨率
    colorFormat: "", //色彩格式
    type: 2,
  };

  @observable galleryParams: any = {
    IpGallery: {
      ipid: "", //所属ip
      title: "", //图库名称
      label: "", //打标签
      galleryDesc: "", //图库简介
      authorizeRegion: "", //授权区域
      userGuid: "",
    },
    /* 存储头像和源文件 */
    IpGalleryFile: [],
    /* 授权类型 */
    IpGalleryPrice: [
      {
        authorizeTypeGuid: "", //授权品类id
        authorizeType: "", // 授权品类名称
        duration: "", //授权期限
        productionQuantityMin: "",
        productionQuantityMax: "",
        price: "", //授权费用
      },
    ],
  };

  @action refreshData = () => {
    this.galleryGuid = "";

    this.fileFormatList = [
      "PSD",
      "AI",
      "ESP",
      "C4D",
      "SVG",
      "XD",
      "CDR",
      "Sketch",
      "Figma",
      "InDesign",
      "After Effects",
      "Axure",
      "Procreate",
    ];
    this.fileFormatListStatus = new Array(13).fill(false);

    this.resolvingPowerList = ["72dpi", "150dpi", "300dpi"];
    this.resolvingPowerListStatus = new Array(3).fill(false);

    this.colorFormatList = ["RGB", "CMYK"];
    this.colorFormatListStatus = new Array(2).fill(false);

    this.labelRadio = [];
    this.labelRadioStatus = [];

    this.durationList = ["3个月", "6个月", "12个月", "18个月", "24个月", "36个月"];

    this.uploadPicList = [];

    this.authorizeList = [];

    this.countryList = [];
    this.countryListStatus = [];

    this.ipNameList = [];

    this.originFile = {
      fileName: "", //文件名称
      fileSize: "", //文件大小
      fileUrl: "", //文件链接
      fileFormat: "", //文件格式
      imageHigh: "", //原图高度
      imageWide: "", //原图宽度
      resolvingPower: "", // 分辨率
      colorFormat: "", //色彩格式
      type: 2,
    };

    this.galleryParams = {
      IpGallery: {
        ipid: "", //所属ip
        title: "", //图库名称
        label: "", //打标签
        galleryDesc: "", //图库简介
        authorizeRegion: "", //授权区域
        userGuid: "",
      },
      /* 存储头像和源文件 */
      IpGalleryFile: [],

      /* 授权类型 */
      IpGalleryPrice: [
        {
          authorizeTypeGuid: "", //授权品类id
          authorizeType: "", // 授权品类名称
          duration: "", //授权期限
          productionQuantityMin: "",
          productionQuantityMax: "",
          price: "", //授权费用
        },
      ],
    };
  };

  @action
  changeUserInfo = (userInfo = {}) => {
    this.userInfo = userInfo;
  };

  @action changeGalleryParams = (prop, params) => {
    this.galleryParams[prop] = { ...this.galleryParams[prop], ...params };
    console.log(params);
  };

  @action changeGalleryPrice = (params, index) => {
    this.galleryParams.IpGalleryPrice[index] = {
      ...this.galleryParams.IpGalleryPrice[index],
      ...params,
    };
  };

  @action changeIpGalleryPriceList = (index?: any) => {
    if (index !== undefined) {
      this.galleryParams.IpGalleryPrice.splice(index, 1);
    } else {
      this.galleryParams.IpGalleryPrice.push({
        authorizeTypeGuid: null, //授权品类id
        authorizeType: "", // 授权品类名称
        duration: "", //授权期限
        price: "", //授权费用
      });
    }
  };

  @action addLabelRadio = (val) => {
    this.labelRadio = [...this.labelRadio, ...[{ resourceValue: val }]];
    this.labelRadioStatus = [...this.labelRadioStatus, ...[true]];
  };
  @action changeLabelRadioStatus = (k) => {
    this.labelRadioStatus.splice(k, 1, !this.labelRadioStatus[k]);
  };

  @action addfileFormatList = (val) => {
    this.fileFormatList = [...this.fileFormatList, ...[val]];
    this.fileFormatListStatus = [...this.fileFormatListStatus, ...[true]];
  };
  @action changefileFormatListStatus = (k) => {
    this.fileFormatListStatus.splice(k, 1, !this.fileFormatListStatus[k]);
  };
  @action addResolvingPowerList = (val) => {
    this.resolvingPowerList = [...this.resolvingPowerList, ...[val]];
    this.resolvingPowerListStatus = [
      ...this.resolvingPowerListStatus,
      ...[true],
    ];
  };
  @action changeresolvingPowerListStatus = (k) => {
    this.resolvingPowerListStatus.splice(
      k,
      1,
      !this.resolvingPowerListStatus[k]
    );
  };

  @action changecolorFormatListStatus = (k) => {
    this.colorFormatListStatus.splice(k, 1, !this.colorFormatListStatus[k]);
  };

  @action changecountryListStatus = (k) => {
    this.countryListStatus.splice(k, 1, !this.countryListStatus[k]);
  };

  @action addUploadPicList = (file) => {
    this.uploadPicList.push(file);
    console.log(this.uploadPicList);
  };
  @action editUploadPicList = (file, index) => {
    this.uploadPicList.splice(index - 1, 1, file);
    console.log(index);
  };
  @action changeOriginFile = (file, isEdit) => {
    if (isEdit) {
      this.originFile = file;
    } else {
      this.originFile = { ...this.originFile, ...file };
    }
    console.log(this.originFile);
  };
  /**
   * 授权品类
   */
  @action
  getAuthorizeList = async () => {
    const { result }: any = await getAuthorize(4);
    this.authorizeList = result;
  };
  /**
   * 授权区域
   */
  @action
  getCountryList = async () => {
    const { result }: any = await listCountry();
    this.countryList = result;
    this.countryListStatus = new Array(result.length).fill(false);
  };
  /**
   * 标签
   */
  @action
  getLabelRadio = async () => {
    const { result }: any = await getCompanytype(14);
    this.labelRadio = result;
    this.labelRadioStatus = new Array(result.length).fill(false);
    // this.galleryList = data;
  };
  /**
   * 所属ip
   */
  @action
  getIpName = async () => {
    const { result }: any = await getIpName({
      userGuid: this.userInfo.userGuid,
    });
    this.ipNameList = result.data;
  };
  /**
   * 图库详情
   */
  @action
  galleryDetail = async (galleryGuid) => {
    const {
      result: { data, errorCode },
    }: any = await editGalleryDetail({ galleryGuid });

    data.ipGalleryFileVOs &&
      data.ipGalleryFileVOs.map((e) => {
        this.addUploadPicList(e);
      });

    this.galleryParams.IpGallery = {
      ipid: data.ipid, //所属ip
      title: data.title, //图库名称
      galleryDesc: data.galleryDesc, //图库简介
      userGuid: data.userGuid,
    };
    this.originFile.imageWide = data.ipGalleryFileVO.imageWide;
    this.originFile.imageHigh = data.ipGalleryFileVO.imageHigh;
    this.originFile.fileName = data.ipGalleryFileVO.fileName;
    this.originFile.fileSize = data.ipGalleryFileVO.fileSize;
    this.originFile.fileUrl = data.ipGalleryFileVO.fileUrl;

    /*  format 标签 */
    const labelRadioCopy = Object.assign(this.labelRadio);
    data.label.split("、").map((e) => {
      if (!labelRadioCopy.some((i) => i.resourceValue === e)) {
        this.labelRadio.push({ resourceValue: e });
      }
    });
    this.labelRadio.map((e, k) => {
      data.label.split("、").map((i) => {
        if (e.resourceValue === i) {
          this.changeLabelRadioStatus(k);
        }
      });
    });

    /*  format 文件格式 */
    const fileFormatListCopy = Object.assign(this.fileFormatList);
    data.ipGalleryFileVO.fileFormat.split("、").map((e) => {
      if (!fileFormatListCopy.some((i) => i === e)) {
        this.fileFormatList.push(e);
      }
    });
    this.fileFormatList.map((e, k) => {
      data.ipGalleryFileVO.fileFormat.split("、").map((i) => {
        if (e === i) {
          console.log(i);
          this.changefileFormatListStatus(k);
        }
      });
    });

    /*  format 分辨率 */
    const resolvingPowerListCopy = Object.assign(this.resolvingPowerList);
    data.ipGalleryFileVO.resolvingPower.split("、").map((e) => {
      if (!resolvingPowerListCopy.some((i) => i === e)) {
        this.resolvingPowerList.push(e);
      }
    });
    this.resolvingPowerList.map((e, k) => {
      data.ipGalleryFileVO.resolvingPower.split("、").map((i) => {
        if (e === i) {
          console.log(i);
          this.changeresolvingPowerListStatus(k);
        }
      });
    });
    /*  format 分辨率 */
    const colorFormatListCopy = Object.assign(this.colorFormatList);
    data.ipGalleryFileVO.colorFormat.split("、").map((e) => {
      if (!colorFormatListCopy.some((i) => i === e)) {
        this.colorFormatList.push(e);
      }
    });
    this.colorFormatList.map((e, k) => {
      data.ipGalleryFileVO.colorFormat.split("、").map((i) => {
        if (e === i) {
          console.log(i);
          this.changecolorFormatListStatus(k);
        }
      });
    });
    /*  授权规格 */
    const countryListCopy = Object.assign(this.countryList);
    data.authorizeRegion.split("、").map((e) => {
      if (!countryListCopy.some((i) => i.resourceValue === e)) {
        this.countryList.push({ resourceValue: e });
      }
    });
    this.countryList.map((e, k) => {
      data.authorizeRegion.split("、").map((i) => {
        if (e.resourceValue === i) {
          console.log(i);
          this.changecountryListStatus(k);
        }
      });
    });

    this.galleryParams.IpGalleryPrice = data.ipGalleryPriceVOs.map((e) => ({
      authorizeTypeGuid: e.authorizeTypeGuid, //授权品类id
      authorizeType: e.authorizeType, // 授权品类名称
      duration: e.duration, //授权期限
      productionQuantityMin: e.productionQuantityMin,
      productionQuantityMax: e.productionQuantityMax,
      price: e.price, //授权费用
    }));
    this.galleryParams.IpGalleryPrice.map((e) => {
      e.duration = `${e.duration}个月`;
    });

    this.galleryGuid = data.galleryGuid;
  };
}

export default new GalleryCreateStore();
