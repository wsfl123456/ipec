/**
 *  添加编辑ip需求
 */
import * as React from "react";
import { inject, observer } from "mobx-react";
import "../../assets/scss/ip_needs.scss";
import { Input, Select, message } from "antd";
import { createRef } from "react";
import E from 'wangeditor';
import { toJS } from "mobx";
import Alert from "@components/alert";
import _isEmpty from "lodash/isEmpty";
import { savePic, UpdateNewCase } from "@utils/api";

const { Option } = Select;

interface IIpNeedsProps extends IComponentProps {
  userGuid?: string
}

interface IIpNeedsState {
  isShow: boolean;
  message: string;
  ipPicGuid?: string;
  currentPage?: number;
  pageSize?: number;
  disabled: boolean;
}

@inject('user', 'login', 'ip_need')
@observer
export default class Index extends React.Component <IIpNeedsProps, IIpNeedsState> {
  editorEle: any;

  constructor(props: any) {
    super(props);
    this.editorEle = createRef();
    this.state = {
      isShow: false,
      message: "",
      currentPage: 1,
      pageSize: 20,
      disabled: false,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- IP 需求";
    const { user, login, ip_need } = this.props;
    const { currentPage, pageSize } = this.state;
    const params = {
      currentPage,
      pageSize
    };
    await user.getMyCaseLabel(params);
    const { userGuid } = login.userInfo;
    const paramsDetail = {
      userGuid,
      portalPostGuid: this.props.location.pathname.split('/')[2],
    };
    if (paramsDetail.portalPostGuid) {
      await ip_need.getCaseDetail(paramsDetail);
      await this.recordValue();
    } else {
      this.resetCase();
    }
    this.initEditor();
  }

  componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IIpNeedsProps>, nextContext: any): void {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    // 配置服务端地址
    // editor.customConfig.uploadImgServer = '/ueditor/ueditorUpload'

    editor.customConfig.onblur = html => {
      this.props.ip_needs.setParams({ postContent: html });
    };
  }

  /**
   * 图文详情
   */
  private initEditor() {
    const { ip_need } = this.props;
    const ele = this.editorEle.current;
    const editor = new E(ele);
    // editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 2;
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
    editor.customConfig.uploadImgServer = `${$host}/ueditor/ueditorUpload`;
    editor.customConfig.uploadFileName = 'upfile';
    editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        const url = result.result.data;
        insertImg(url);
      }
    };
    editor.customConfig.customAlert = (info) => {
      message.warning(info)
    };
    editor.customConfig.onchange = html => {
      ip_need.setParams({ postContent: html });
    };

    editor.create();
    // 初始化内容
    const { needsDetail } = this.props.ip_need;
    if (!_isEmpty(toJS(needsDetail))) {
      editor.txt.html(needsDetail.postContent);
    }
  }

  /**
   *  重置按钮清空文本编辑器内容
   */
  editorClear() {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 2;
    editor.customConfig.onchange = html => {
      this.props.ip_need.setParams({ postContent: html });
    };
    editor.create();
    editor.txt.clear();
  }

  /**
   * 上传案例封面图
   * @param e
   * @param field
   */
  async uploadImg(e, field) {
    const { ip_need } = this.props;
    let file = e.target.files[0];
    let fileMaxSize = 1024 * 5120;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    if (file.size < fileMaxSize) {
      reader.onload = async (e) => {
        // 动态设置setState 的值
        const data = {};
        data[field] = e.target.result;
        this.setState(data);
        let formData = new FormData();
        formData.append("file", file);
        const params = { file: formData, picType: 2 };
        const { errorCode, result = {} }: any = await savePic(params);
        if (errorCode === '200' && result.errorCode === 200) {
          ip_need.setParams({ ipPicGuid: result.data });
        }
      };
    } else {
      message.warning('图片过大请重新上传');
    }
  };

  /**
   * 添加新案例
   */
  async submitBtn() {
    const { login, ip_need } = this.props;
    const { needsDetail } = ip_need;
    const { userGuid } = login.userInfo;
    const params: any = {
      userGuid,
      ipPicGuid: needsDetail.ipPicGuid,
      postTitle: needsDetail.postTitle,
      postType: 4,
      portalCategoryGuid: needsDetail.portalCategoryGuid,
      ipName: needsDetail.ipName,
      postContent: needsDetail.postContent,
    };
    if (!params.postTitle) {
      this.setState({ isShow: true, message: '请输入需求名称' });
      return false;
    } else if (!params.portalCategoryGuid) {
      this.setState({ isShow: true, message: '请选择行业分类' });
      return false;
    } else if (!params.ipPicGuid) {
      this.setState({ isShow: true, message: '请上传封面图' });
      return false;
    } else {
      const isSuccess = await ip_need.submitIpNeed(params);
      this.setState({
        isShow: true,
        message: '提交成功',
        disabled: true,
      });
      await this.resetCase();
      setTimeout(() => {
        history.go(-1);
      }, 1000);
      return true;
    }
  }

  /**
   * 修改发布的发布 需求
   */
  async UpdateBtn() {
    const { ip_need, login } = this.props;
    const { needsDetail, needsData } = ip_need;
    const { userGuid } = login.userInfo;
    const params: any = {
      userGuid,
      ipPicGuid: needsDetail.ipPicGuid,
      postTitle: needsDetail.postTitle,
      postType: needsDetail.postType,
      portalCategoryGuid: needsDetail.portalCategoryGuid,
      ipName: needsDetail.ipName,
      postContent: needsDetail.postContent,
      portalPostGuid: needsData.portalPostGuid,
    };
    console.log("IP需求" + params);
    if (!params.postTitle) {
      this.setState({ isShow: true, message: '请输入需求名称' });
      return false;
    }
    if (!params.portalCategoryGuid) {
      this.setState({ isShow: true, message: '请选择行业分类' });
      return false;
    }
    if (!params.ipPicGuid) {
      this.setState({ isShow: true, message: '请上传封面图' });
      return false;
    }
    const isSuccess = await UpdateNewCase(params);
    this.setState({
      isShow: true,
      message: '修改成功',
      disabled: true,
    });
    setTimeout(() => {
      history.go(-1);
    }, 1500);
  }

  /**
   * 重置发布的案例内容
   */
  resetCase() {
    let addCase = {
      postTitle: '',
      portalCategoryGuid: '',
      ipName: '',
      ipPicGuid: '',
      picUrl: '',
      postContent: '',
    };
    this.setState({
      ipPicGuid: '',
    });
    this.props.ip_need.setParams(addCase);
    this.editorClear();
  }

  /**
   * 编辑回显案例详情
   */
  async recordValue() {
    const { ip_need } = this.props;
    const { needsData } = ip_need;
    const record = toJS(needsData);
    const params: any = {
      postTitle: record.postTitle,
      postType: record.postType,
      portalCategoryGuid: record.portalCategoryGuid + '',
      ipName: record.ipName,
      postContent: record.postContent,
      picUrl: record.picUrl,
      ipPicGuid: record.ipPicGuid,
    };
    ip_need.setParams(params);
  }

  render() {
    const { isShow, message, ipPicGuid, disabled } = this.state;
    const { user, ip_need, match } = this.props;
    let { myCaseLabel, relationIp } = user;
    const { needsDetail } = ip_need;
    const { params } = match;

    return (
      <div className='add-needs'>
        <div className="container-needs justify-content-between">
          <div className='add-needs-left'>
            <div className='add-left-img'>
              {
                (ipPicGuid || (needsDetail && needsDetail.ipPicGuid)) ?
                  <div className='add-needs-img'>
                    <input type="file" accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                           onChange={async (e) => {
                             await this.uploadImg(e, 'ipPicGuid');
                           }}/>
                    <img className="head-img" src={ipPicGuid || needsDetail.picUrl} alt=""/>
                  </div>
                  :
                  <div className='add-needs-img'>
                    <input type="file" accept="image/gif,image/jpg,image/jpeg,image/svg,image/png" alt=""
                           onChange={async (e) => {
                             await this.uploadImg(e, 'ipPicGuid');
                           }}
                    />
                    <img src="" alt=""/>
                    <span className='add-img'>上传封面图</span>
                    <p className="important">(必传)</p>
                  </div>
              }
            </div>
            <div className='needs-notes'>
              <span>
                建议宽*高尺寸：320*240px
              </span>
            </div>
          </div>
          <div className='add-needs-right'>
            <div className='add-needs-right-top'>
              <div className='add-content'>
                <label className='input-label'>需求名称<span className='needs-hot'>*</span></label>
                {
                  <Input
                    type='text'
                    className='form-control'
                    placeholder='填写IP需求的名称'
                    value={needsDetail && needsDetail.postTitle}
                    onChange={(e) => {
                      ip_need.setParams({ postTitle: e.currentTarget.value });
                    }}
                  />
                }
              </div>

              <div className='needs-content'>
                <label className='input-label'>行业分类 <span className="needs-hot">*</span></label>
                <Select
                  className='form-control'
                  placeholder='选择行业分类'
                  value={needsDetail && needsDetail.portalCategoryGuid}
                  onChange={(portalCategoryGuid: string) => {
                    ip_need.setParams({ portalCategoryGuid });
                  }}
                >
                  {
                    myCaseLabel && myCaseLabel.map((item, index) => {
                      return (
                        <Option key={index} value={item.portalCategoryGuid}>
                          {item.portalCategoryName}
                        </Option>
                      );
                    })
                  }
                </Select>

              </div>

              <div className='needs-content'>
                <label className='input-label'>关联IP</label>
                {
                  <div className='needs-ip'>
                    <Select
                      showSearch
                      notFoundContent={null}
                      allowClear={true}
                      className='form-control'
                      placeholder='选择案例所关联的IP'
                      value={needsDetail && needsDetail.ipName}
                      onChange={(ipName: string) => {
                        ip_need.setParams({ ipName });
                        if (ipName === "") {
                          user.relationIp = null;
                        }
                      }}
                      onSearch={async (ipName) => {
                        if (ipName === '') {
                          this.props.user.relationIp = null;
                        } else {
                          const { pageSize, currentPage } = this.state;
                          const params = {
                            ipName,
                            currentPage,
                            pageSize
                          };
                          await user.getRelationIP(params);
                        }
                      }}
                    >
                      {
                        relationIp && relationIp.map((item, index) => {
                          return (
                            <Option value={item.ipName} key={index}>
                              {item.ipName}
                            </Option>
                          );
                        })
                      }
                    </Select>
                    {
                      toJS(relationIp) && toJS(relationIp).length === 0 ? <div className='waring'>此IP不存在 请先上传</div> : ''
                    }
                  </div>
                }
              </div>
            </div>
            <div className='add-needs-right-detail'>
              <div className='needs-content'>
                <label className='input-label'>图文详情</label>
                <div ref={this.editorEle}/>
              </div>
            </div>
            <div className='needs-btn'>
              <button
                className='btn-submit'
                disabled={disabled}
                onClick={async () => {
                  !params.id ? await this.submitBtn() : await this.UpdateBtn();
                }}
              >提交审核
              </button>
              <button className='btn-reset'
                      onClick={async () => {
                        await this.resetCase();
                      }}
              >重置
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
            }}
          />
        }
      </div>
    );
  }
}
