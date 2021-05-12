import { Icon, Input } from "antd";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";

export default ({
                  updateStore,
                  rightIPImageShow,
                  prodect,
                }:
                  {
                    updateStore: IUpdateStore,
                    rightIPImageShow: boolean
                    prodect: any[],
                  }) => {
  return (
    <div className="rightIPImage">

      <div className="rightIPImageTop">
        <div className="leftTitle">IP素材图库</div>
        <div
          className="rightTitle"
          onClick={() => {
            updateStore.setRightIPImageShow(!rightIPImageShow);
          }}>
          {!!rightIPImageShow ? '收起' : '展开'}<Icon type={!!rightIPImageShow ? 'up' : 'down'}/>
        </div>
      </div>

      {!!rightIPImageShow &&
      <div className="rightIPImageBtm">
        <div className="notice">注：建议图片尺寸：230*180px</div>
        <div className="rightIPImageUploadBox">
          {
            prodect && prodect.map((item, idx: number) => {
              return (
                <div key={idx} className="rightIPImageUpload">
                  <div className="upload-box">
                    {!item.pic
                      ? <div className="upload-box-text">添加产品</div>
                      : <div
                        className="upload-box-text"
                        onClick={() => {
                          updateStore.unUploadImgProdect(idx);
                        }}>删除</div>
                    }

                    {!item.pic ? <Icon type="plus"/> : <Icon type="minus"/>}
                    {item.pic
                      ? <img src={item.pic} alt=''/>
                      : <input
                        type="file" onChange={(e) => updateStore.uploadImgProdect(e.target.files[0], idx)}
                        className="upload-box-file"/>
                    }
                  </div>
                  <Input
                    className="upload-Input" placeholder="输入产品描述最多12字" value={item.title}
                    onChange={(e) => updateStore.setProdectTitle(e.currentTarget.value, idx)}
                    maxLength={12}/>
                </div>
              );
            })
          }
        </div>
      </div>
      }
    </div>
  );
};
