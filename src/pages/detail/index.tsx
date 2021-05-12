import * as React from "react";
import "@assets/scss/detail.scss";
import { inject, observer } from "mobx-react";
import { IpArt } from "@pages/detail/components";
import UploadFileModel from '@components/upload_file_model';
import Model from '@components/model';
import ScrollTop from "@components/scroll-top";
import { deletContact, sendUserBehavior } from "@utils/util";

interface IDetailState {
  data: string[];
  show: boolean;
  contastList: object;
  uploadShow: Boolean;
  modelState: Boolean;
}

@inject("detail", 'update', 'login')
@observer
export default class Detail extends React.Component<IProps, IDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false,
      contastList: JSON.parse(localStorage.getItem('contastList')) === null ? [] : JSON.parse(localStorage.getItem('contastList')),
      uploadShow: false,
      modelState: false,
    };
  }

  async componentDidMount() {

    if (JSON.parse(localStorage.getItem('contastList')) === null) {
      localStorage.setItem("contastList", JSON.stringify([]));
    }
    document.title = "IP二厂-详情";
    const { detail, update, login } = this.props;
    this.setState({
      show: true
    });
    detail.changeUserInfo(login.userInfo)
    // 获取路由参数值this.props.match.params.参数名
    const { match: { params } } = this.props;
    let ipTypeNumber = Number(params['ipTypeNumber']);
    let ipid = Number(params['id']);
    let user = localStorage.getItem("user");
    await detail.getIpPeople({ ipTypeNumber, ipid });
    if (params.hasOwnProperty('id') && ipid > 0) {
      if (user !== null) {
        const { userGuid } = JSON.parse(user);
        const params = { userGuid, ipTypeSuperiorNumber: ipTypeNumber, ipid };
        let flag = await detail.ipDetail(params);
        flag === false ? this.props.history.push("/") : "";
      } else {
        const params = { ipTypeSuperiorNumber: ipTypeNumber, ipid };
        let flag = await detail.ipDetail(params);
        flag === false ? this.props.history.push("/") : "";
      }

      if (ipTypeNumber === 8) {
        const { starList: { ipName } } = detail;
        await detail.getProdctionData({ isUpcoming: 0, ipid, ipName, currentPage: 1, pageSize: 20 });
        await detail.getProdctionData({ isUpcoming: 1, ipid, ipName, currentPage: 1, pageSize: 20 });
      }
      await detail.getRelatedCase({ ipid, ipTypeSuperiorNumber: ipTypeNumber });
      await detail.ipArtLike({ ipTypeSuperiorNumber: ipTypeNumber, ipid });

      await sendUserBehavior({
        pageName: detail.ipDetailData.ipName,
        pageUrl: `/detail/${params['ipTypeNumber']}/${params['id']}`,
        type: 6,
        remark: params['id']
      });
    }

    /**
     * 下载资料
     */
    await update.getDownload({ ipid });
  }

  private callback = (params: boolean) => {
    this.setState({ uploadShow: params });
  };
  private callbackModel = (params: boolean) => {
    this.setState({ modelState: params });
  };
  private deletContast = (ipids) => {
    deletContact(ipids);
    this.setState({ contastList: JSON.parse(localStorage.getItem('contastList')) });
  };

  private callbackcontastList = (contastList) => {
    this.setState({ contastList });
  };

  render() {
    const { update, login } = this.props;
    const { businessList } = update;
    const { match: { params } } = this.props;
    const ipTypeNumber = parseInt(params['ipTypeNumber']);
    const id = params['id'];
    const { uploadShow, modelState, contastList } = this.state;
    const fileType = { type: 1, text: "上传商务合作资料", tip: "温馨提示：只支持PPT、PDF、Excel格式，单个文件大小在50M以内" };

    if (!login.userInfo) {
      localStorage.setItem("historyUrl", `detail/${ipTypeNumber}/${id}`);
    }
    return (
      <div>
        {
          modelState &&
          <Model data={businessList} title="下载资料" onClose={() => {
            this.setState({
              modelState: false
            });
          }}/>
        }
        <div className="detail-container flex-row">
          {
            <IpArt id={id} ipTypeNumber={ipTypeNumber}
                   contastList={contastList}
                   callbackcontastList={this.callbackcontastList}
                   history={this.props.history}
                   callbackParent={this.callback}
                   callback={this.callbackModel}/>

          }
        </div>
        {
          uploadShow &&
          <UploadFileModel
            setipMaterial={() => {
            }}
            callback={() => {
            }}
            fileType={fileType}
            ipid={id}
            onClose={() => {
              this.setState({
                uploadShow: false
              });
            }}/>
        }
        <ScrollTop contrast={true} data={this.state.contastList} deletContast={this.deletContast}
                   history={this.props.history}/>
      </div>
    );
  }
}
