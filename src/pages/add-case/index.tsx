import * as React from "react";
import { inject, observer } from "mobx-react";
import "@assets/scss/add_case.scss";
import { Input, Select, message } from "antd";
import { createRef } from "react";
import E from 'wangeditor';
import { toJS } from "mobx";
import { addNewCase, savePic, UpdateNewCase } from "@utils/api";
import Alert from "@components/alert";
import _isEmpty from "lodash/isEmpty";
import _isArray from "lodash/isArray";

const { Option } = Select;

interface IProps extends IComponentProps {
  userGuid?: string
}

interface IAddCase {
  currentPage: number;
  pageSize: number;
  message: string;
  alertMessage: string;
  isShow: boolean;
  ipPicGuid?: string;
}

@inject('user', 'update', 'login')
@observer
export default class AddCase extends React.Component <IProps, IAddCase> {
  editorEle: any;

  constructor(props: any) {
    super(props);
    this.editorEle = createRef();
    this.state = {
      currentPage: 1,
      pageSize: 10,
      message: '',
      alertMessage: '',
      isShow: false,
    };
  }

  async componentDidMount() {
    document.title = "IP二厂- 案例";
    const { user, login } = this.props;
    const { currentPage, pageSize } = this.state;
    const params = {
      currentPage,
      pageSize
    };
    await user.getMyCaseLabel(params);
    const { userGuid } = login.userInfo;
    const paramsCode = {
      userGuid,
      portalPostGuid: this.props.location.pathname.split('/')[2],
    };
    if (paramsCode.portalPostGuid) {
      await user.getCaseDetail(paramsCode);
      await this.recordValue();
    } else {
      await this.resetCase();
    }
    this.initEditor();
  }

  componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IAddCase>, nextContext: any): void {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    // 配置服务端地址
    // editor.customConfig.uploadImgServer = '/ueditor/ueditorUpload'
    editor.customConfig.onblur = html => {
      this.props.user.changeDetail({ postContent: html });
    };
  }

  /**
   * 图文详情
   */
  private initEditor() {
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
      this.props.user.changeDetail({ postContent: html });
    };

    editor.create();
    // 初始化内容
    const { caseDetail } = this.props.user;
    if (!_isEmpty(toJS(caseDetail))) {
      editor.txt.html(caseDetail.postContent);
    }
  }

  /**
   *  重置按钮清空文本编辑器内容
   */
  async editorClear() {
    const ele = this.editorEle.current;
    const editor = new E(ele);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 2;
    editor.customConfig.onchange = html => {
      this.props.user.changeDetail({ postContent: html });
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
    const { user } = this.props;
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
          user.changeDetail({ ipPicGuid: result.data });
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
    const { login, user } = this.props;
    const { userGuid } = login.userInfo;
    const { caseDetail } = user;
    console.log(caseDetail.brandName);
    const params = {
      userGuid,
      postTitle: caseDetail.postTitle,
      labels: caseDetail.labels,
      postType: caseDetail.postType,
      portalCategoryGuid: caseDetail.portalCategoryGuid + '',
      ipName: caseDetail.ipName,
      brandName: caseDetail.brandName && (caseDetail.brandName).join(','),
      postSource: caseDetail.postSource,
      postKeywords: caseDetail.postKeywords,
      ipPicGuid: caseDetail.ipPicGuid,
      postExcerpt: caseDetail.postExcerpt,
      postContent: caseDetail.postContent,
    };
    // console.log(params);

    if (!params.postTitle) {
      this.setState({ isShow: true, message: '请输入案例标题' });
      return false;
    } else if (!params.postType) {
      this.setState({ isShow: true, message: '请选择案例的所属分类' });
      return false;
    } else {
      const isSuccess = await addNewCase(params);
      this.setState({ isShow: true, message: '提交成功' });
      setTimeout(() => {
        history.go(-1);
      }, 1000);
      // console.log(isSuccess);
      return true;
    }
  }

  /**
   * 修改发布的案例
   */
  async UpdateBtn() {
    const { user, login } = this.props;
    const { caseDetail } = user;
    const params = {
      userGuid: login.userInfo.userGuid,
      postTitle: caseDetail.postTitle,
      labels: caseDetail.labels,
      postType: caseDetail.postType,
      portalCategoryGuid: caseDetail.portalCategoryGuid + '',
      portalPostGuid: caseDetail.portalPostGuid + '',
      ipName: caseDetail.ipName,
      brandName: _isArray(caseDetail.brandName) ? caseDetail.brandName.join(',') : caseDetail.brandName,
      postSource: caseDetail.postSource,
      postKeywords: caseDetail.postKeywords,
      postContent: caseDetail.postContent,
      picUrl: caseDetail.picUrl,
      ipPicGuid: caseDetail.ipPicGuid,
      postExcerpt: caseDetail.postExcerpt,
    };

    // console.log("编辑：" + JSON.stringify(params));
    if (!params.postTitle) {
      this.setState({ isShow: true, message: '请输入案例标题' });
      return;
    }
    if (!params.postType) {
      this.setState({ isShow: true, message: '请选择案例的所属分类' });
      return;
    }
    const isSuccess = await UpdateNewCase(params);
    this.setState({ isShow: true, message: '修改成功' });
    setTimeout(() => {
      history.go(-1);
    }, 1000);
    console.log(isSuccess);
  }

  /**
   * 重置发布的案例内容
   */
  async resetCase() {
    let addCase = {
      postTitle: '',
      labels: '',
      postType: undefined,
      portalCategoryGuid: '',
      ipName: '',
      brandName: '',
      postSource: '',
      postKeywords: '',
      ipPicGuid: '',
      postExcerpt: '',
      postContent: '',
    };
    console.log(addCase);
    this.props.user.changeDetail(addCase);
    await this.editorClear();
  }

  /**
   * 编辑回显案例详情
   */
  async recordValue() {
    const { user } = this.props;
    // const { addCase } = this.state;
    const { caseDetail: record } = user;
    const params = {
      postTitle: record.postTitle,
      postType: record.postType,
      labels: record.labels, // 案例标签
      portalCategoryGuid: record.portalCategoryGuid + '',
      ipName: record.ipName,
      brandName: record.brandName,
      postSource: record.postSource,
      postKeywords: record.postKeywords,
      postExcerpt: record.postExcerpt,
      postContent: record.postContent,
      picUrl: record.picUrl,
    };

    console.log(params);
    // user.changeDetail(params);
  }

  render() {
    const { isShow, message, ipPicGuid } = this.state;
    const { user, match } = this.props;
    let { myCaseLabel, relationIp, relationBrand, caseDetail } = user;
    caseDetail = toJS(caseDetail);
    const { params } = match;

    return (
      <div className='add-case'>
        <div className="container-case justify-content-between">
          <div className='add-case-left'>
            <div className='add-left-img'>
              {
                (ipPicGuid || (caseDetail && caseDetail.ipPicGuid)) ?
                  < div className='add-case-img'>
                    <input
                      type="file" accept="image/gif,image/jpg,image/jpeg,image/svg,image/png"
                      onChange={async (e) => {
                        await this.uploadImg(e, 'ipPicGuid');
                      }}/>
                    <img className="head-img" src={ipPicGuid || caseDetail.picUrl} alt=""/>
                  </div>
                  :
                  <div className='add-case-img'>
                    <input type="file" accept="image/gif,image/jpg,image/jpeg,image/svg,image/png" alt=""
                           onChange={async (e) => {
                             await this.uploadImg(e, 'ipPicGuid');
                           }}
                    />
                    <span className='add-img'>上传案例封面图</span>
                  </div>
              }
            </div>
            <div className='case-notes'>
              <span>
                建议宽*高尺寸：320*240px
              </span>
            </div>
          </div>
          <div className='add-case-right'>
            <div className='add-case-right-top'>
              <div className='add-content'>
                <label className='input-label'>案例标题<span className='case-hot'>*</span></label>
                {
                  <Input
                    type='text'
                    className='form-control'
                    placeholder='填写案例的标题'
                    value={caseDetail && caseDetail.postTitle}
                    onChange={(e) => {
                      user.changeDetail({ postTitle: e.currentTarget.value });
                    }}
                  />
                }
              </div>
              <div className='case-content'>
                <label className='input-label'>案例分类<span className='case-hot'>*</span></label>
                {
                  !params.id &&
                  <Select
                    className='form-control'
                    placeholder='选择案例的所属分类'
                    onChange={(postType: number) => {
                      user.changeDetail({ postType });
                    }}
                  >
                    <Option value={1}>行业案例</Option>
                    <Option value={5}>行业趋势</Option>
                    <Option value={2}>行业动态</Option>
                    <Option value={3}>人物专访</Option>
                  </Select>
                }
                {
                  !_isEmpty(caseDetail) && caseDetail.postType && params.id &&
                  <Select
                    className='form-control'
                    placeholder='选择案例的所属分类'
                    value={caseDetail && caseDetail.postType}
                    disabled={true}
                  >
                    <Option value={1}>行业案例</Option>
                    <Option value={5}>行业趋势</Option>
                    <Option value={2}>行业动态</Option>
                    <Option value={3}>人物专访</Option>
                  </Select>
                }

              </div>
              <div className='case-content'>
                <label className='input-label'>行业分类</label>
                <Select
                  className='form-control'
                  placeholder='选择行业分类'
                  value={caseDetail && caseDetail.portalCategoryGuid}
                  onChange={(portalCategoryGuid: string) => {
                    user.changeDetail({ portalCategoryGuid });
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
              <div className='case-content'>
                <label className='input-label'>案例标签</label>
                <Input
                  type='text'
                  className='form-control-text'
                  placeholder='填写案例的标签'
                  value={caseDetail && caseDetail.labels}
                  onChange={async (e) => {
                    user.changeDetail({ labels: e.currentTarget.value });
                  }}
                />
                {/* <Select
                        showSearch
                        className='form-control'
                        placeholder='选择案例所属标签'
                        value={addCase && addCase.portalCategoryGuid}
                        onChange={async (portalCategoryGuid: string) => {
                          const { addCase } = this.state;
                          addCase.portalCategoryGuid = portalCategoryGuid;
                          this.setState({ addCase });
                        }}
                      >
                        {
                          myCaseLabel && myCaseLabel.map((item, index) => {
                            return (
                              <Option value={item.portalCategoryGuid} key={index}>
                                {item.portalCategoryName}
                              </Option>
                            )
                          })
                        }
                      </Select>*/}
              </div>
              <div className='case-content'>
                <label className='input-label'>关联IP</label>
                {
                  <div className='case-ip'>
                    <Select
                      showSearch
                      showArrow={false}
                      notFoundContent={null}
                      allowClear={true}
                      className='form-control'
                      placeholder='选择案例所关联的IP'
                      value={caseDetail && caseDetail.ipName}
                      onChange={async (ipName: string) => {
                        user.changeDetail({ ipName });
                        if (ipName === "") {
                          this.props.user.relationIp = null;
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
              <div className='case-content'>
                <label className='input-label'>关联品牌</label>
                {
                  <div className='case-ip'>
                    {
                      <Select
                        showSearch
                        mode="tags"
                        showArrow={false}
                        notFoundContent={null}
                        allowClear={true}
                        className='form-control'
                        placeholder='选择案例所关联的品牌'
                        value={caseDetail && caseDetail.brandName}
                        onChange={async (brandName: string) => {
                          user.changeDetail({ brandName });
                          if (brandName === undefined || brandName === '') {
                            this.props.user.relationBrand = null;
                          }
                        }}
                        onSearch={async (brandName: string) => {
                          if (brandName === '' || brandName === undefined) {
                            this.props.user.relationBrand = null;
                          } else {
                            const { pageSize, currentPage } = this.state;
                            const params = {
                              brandName,
                              currentPage,
                              pageSize
                            };
                            await user.getRelationBrand(params);
                          }
                        }}
                        onSelect={(value) => {
                          if (value) {
                            this.props.user.relationBrand = null;
                          }
                        }}
                      >
                        {
                          relationBrand && relationBrand.map((item, index) => {
                            return (
                              <Option key={index} value={item.brandName}>
                                {item.brandName}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    }
                  </div>
                }
              </div>
              <div className='case-content'>
                <label className='input-label'>关键词</label>
                {
                  <Input type='text'
                         style={{ width: 790 }}
                         className='form-control-text'
                         placeholder='选输入该案例的关键词，如有多个，以英文，分割'
                         value={caseDetail && caseDetail.postKeywords}
                         onChange={async (e) => {
                           user.changeDetail({ postKeywords: e.currentTarget.value });
                         }}
                  />
                }
              </div>
              <div className='case-content'>
                <label className='input-label'>摘要</label>
                <Input type='text'
                       style={{ width: 790 }}
                       className='form-control-text'
                       placeholder='请选择该案例摘要'
                       value={caseDetail && caseDetail.postExcerpt}
                       onChange={(e) => {
                         user.changeDetail({ postExcerpt: e.currentTarget.value });
                       }}
                />
              </div>
              <div className='case-content'>
                <label className='input-label'>来源</label>
                <Input type='text'
                       style={{ width: 790 }}
                       className='form-control-text'
                       placeholder='转载文章，请输入文章来源，如有多个，请以英文,号分割'
                       value={caseDetail && caseDetail.postSource}
                       onChange={(e) => {
                         user.changeDetail({ postSource: e.currentTarget.value });
                       }}
                />
              </div>
            </div>
            <div className='add-case-right-detail'>
              <div className='case-content'>
                <label className='input-label'>图文详情</label>
                <div ref={this.editorEle}/>
              </div>
            </div>
            <div className='case-btn'>
              <button
                className='btn-submit'
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
