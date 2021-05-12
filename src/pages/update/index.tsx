import * as React from "react";
import { inject, observer } from "mobx-react";
import { createRef } from "react";
import WangEditor from 'wangeditor';
import {message} from 'antd';
import { UpdateForm } from '@pages/update/components';

import "@assets/scss/update_new.scss";

@inject("login", 'nav_store', 'update_store')
@observer
export default class Update extends React.Component<IProps> {
  editorEle: any;

  constructor(props) {
    super(props);
    // 初始化 wang edit
    this.editorEle = createRef();
    this.state = {
      editor: null,
    };
  }

  async componentDidMount() {
    // 获取 IP所属国家地区List
    const { update_store, match, login }: any = this.props;
    await update_store.getCountryList();
    await update_store.getIpSublist();
    // 获取 授权品类
    await update_store.getAuthorize(1);
    await update_store.getAuthorize(2);
    await update_store.getAuthorize(3);
    // 获取 可授权区域
    await update_store.getAuthorizedLocationList();
    // 获取 在线播放平台
    await update_store.getListPlatform(1);
    // 获取 首播电视平台
    await update_store.getListPlatform(2);

    let { id, ipTypeNumber }: { [p: string]: string } = match.params;
    if (id) {
      document.title = "IP二厂-编辑IP";
      // 获取编辑页的基本信息
      await update_store.getIpEdit(login.userInfo.userGuid, id, ipTypeNumber);
    } else {
      document.title = "IP二厂-上传IP";
    }

    // 处理 ipTypeNumber
    !!ipTypeNumber && await update_store.setDefaultType(ipTypeNumber);

    // IP标签
    !!ipTypeNumber && await update_store.getIpTagList(ipTypeNumber);

    // 图文详情
    this.initEditor();
  }

  // 图文详情
  private initEditor() {
    const { update_store } = this.props;
    const ele = this.editorEle.current;
    const editor = new WangEditor(ele);
    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      // 'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
    editor.customConfig.uploadImgServer = `${$host}/ueditor/ueditorUpload`;
    editor.customConfig.uploadFileName = 'upfile';
    editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        const url = result.result.data;
        insertImg(url);
      }
    };
    editor.customConfig.customAlert = (info) => {
    message.warning(info)
    };
    editor.customConfig.zIndex = 2;
    editor.customConfig.onchange = html => {
      update_store.setDetail(html);
    };
    editor.create();
    // 初始化内容
    editor.txt.html(update_store.current.detail);
    update_store.setEditor(editor);
  }

  render() {
    const { match, update_store, nav_store } = this.props;
    const { id, ipTypeNumber }: any = match.params;
    return (
      <UpdateForm history={this.props.history} ipTypes={nav_store.ipTypes} className="update-new-body" ipId={id}
                  ipType={ipTypeNumber || 0}>
        {/* 图文详情 */}
        {
          <div
            className="rightIPDetails"
            style={{ display: !!update_store.current.ipTypeSuperiorNumber ? 'block' : 'none' }}>
            <div className="rightIPDetailsTitle">图文详情</div>
            <div className="rightIPDetailsText">注：图片尺寸最大不超过750px</div>
            <div ref={this.editorEle}/>
          </div>
        }
      </UpdateForm>
    );
  }
}
