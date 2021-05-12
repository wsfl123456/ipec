import * as React from "react";
import TimeInput from "@components/time_input";
import _isFunc from "lodash/isFunction";
import moment from 'moment';
import { inject } from 'mobx-react';
import { createRef } from 'react';
import { toJS, flow } from 'mobx';
import { upload, getAuthorize } from '@utils/api';
import E from "wangeditor";
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import ic_upload from "@assets/images/update/ic_upload.svg";
import shouqi from "@assets/images/update/shouqi.svg";
import xiala from "@assets/images/update/xiala.svg";
import { Select, DatePicker } from 'antd';
import _find from "lodash/find";
import { bool } from "prop-types";

const Option = Select.Option;
const children = [];

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

interface IAvatarProps extends IComponentProps {
  callback: Function;
}

interface IAvatarState {
  ipIsShow: number;
  isOn: boolean;
  isCaseOn: boolean;
  detail: string;
}

@inject('update')
export default class Avatar extends React.Component<IAvatarProps, IAvatarState> {
  editorEle: any;

  constructor(props) {
    super(props);
    this.editorEle = createRef();
    this.state = {
      ipIsShow: 1,
      isOn: false,
      isCaseOn: false,
      detail: "",
    };
  }

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  async componentDidMount() {
    this.initEditor();
    this.callback({ ipIsShow: this.state.ipIsShow });
    const { update, id } = this.props;
    const { updateList, } = update;
    const { detail } = this.state;
    if (id) {

    } else {
      await update.setStatus({  detail });
    }
  }

  componentWillUpdate(nextProps: Readonly<IAvatarProps>, nextState: Readonly<IAvatarState>, nextContext: any): void {


    //   const ele = this.editorEle.current;
    //   const editor = new E(ele);
    //   // 使用 onblur 函数监听内容的变化，并实时更新到 state 中
    //    editor.customConfig.onblur = html => {
    //     // html 即编辑器中的内容
    //     this.setState({
    //       detail: html
    //     });
    //     this.callback({ detail: html });
    //   };
  }
  componentDidUpdate(nextProps: Readonly<IAvatarProps>, nextState: Readonly<IAvatarState>, nextContext: any):void{
    let { pub,pub:{clear}} = this.props;
    if(clear){
      clear=false;
      this.props.setPub({ ...pub, clear})
      this.initEditor();
    }
  }
  private initEditor = () => {
    const { updateList } = this.props.update;
    const { setStatus } = updateList;
    const ele = this.editorEle.current;
    const editor = new E(ele);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 2;
    editor.customConfig.onblur = html => {
      // html 即编辑器中的内容
      this.setState({
        detail: html
      });
      console.log("init" + html, this.state.detail);
      this.callback({ detail: html });
    };
    editor.create();
    // 初始化内容
    // console.log(toJS(updateList));
    if (!_isEmpty(toJS(updateList))) {
      editor.txt.html(updateList.detail);
    }
  }

  render() {
    return (
      <div className="create-right-container flex-column">
        <div className="paddingB24 flex-column">
          <label>图文详情</label>
          <div ref={this.editorEle} />
        </div>
      </div>
    );
  }
}
