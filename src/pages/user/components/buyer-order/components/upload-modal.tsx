/**
 * 上传样品设计图
 */
import * as React from 'react';
import 'assets/scss/copyright-modal.scss';
import ic_clear from '@assets/images/ic_clear.png';
import { inject, observer } from "mobx-react";

interface IUploadProps extends IComponentProps {
  orderSn?: string;
}

@inject('buyerOrder')
@observer
export default class UploadModal extends React.Component<IUploadProps, any> {
  render() {
    const { buyerOrder, orderSn } = this.props;
    const { uploadDesignList } = buyerOrder;
    return (
      <div className={`copyright-modal  ${buyerOrder.uploadModal ? "show" : "hide"}`}>

        <div className="upload-content">
          <div className="modal-header">
            <p>上传设计图</p>
            <img src={ic_clear} alt="" className="modal-close"
                 onClick={() => {
                   buyerOrder.changeUploadModal(false);
                 }}/>
          </div>

          <div className="modal-body body-border-top">
            <p><span className="red">注：</span>请上传产品的三视图（主视图、俯视图、左视图），以便产品设计图能更好的通过监修</p>
            <div className="upload-click-drag">
              <input type="file" onChange={e => buyerOrder.uploadDesign(e, 1)}/>
              <button>上传图片</button>
              <p>点击素材图到这里上传</p>
              <span>支持png、jpg、jpeg…等格式， 体积在20M以下</span>
              <span>已上传{uploadDesignList.length}张，还可上传 <i className="purple">{5 - uploadDesignList.length}张</i></span>
            </div>
            <div className="upload-img">
              {
                uploadDesignList && uploadDesignList.map((item, idx) => {
                  return <img src={item} key={idx} alt=""/>;
                })
              }
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-button button-active"
                    onClick={async () => {
                      const data: any = await buyerOrder.submitDesignList(orderSn);
                      if (data.status) {
                        buyerOrder.changeUploadModal(false);
                      }
                    }}
            >提交监修
            </button>
            <button className="modal-button button-active"
                    onClick={() => {
                      buyerOrder.changeUploadModal(false);
                    }}
            >取消
            </button>
          </div>

        </div>

      </div>
    );
  }
}
