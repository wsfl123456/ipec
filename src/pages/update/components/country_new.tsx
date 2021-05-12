import { Checkbox, Input, message } from "antd";
import * as React from "react";
import _uniq from 'lodash/uniq';

// IP类型 IP所属国家地区 等 组件
export default ({
                  ipTypeSuperiorNumber,
                  updateStore,
                  customTag,
                  tagList,
                  countryTypes,
                  countryList
                }:
                  {
                    ipTypeSuperiorNumber: number,
                    updateStore: any,
                    customTag: string[],
                    tagList: any[],
                    countryTypes: string,
                    countryList: any[]
                  }) => {
  let str = [];

  return (
    <div>
      <div className="labelTitle">IP标签<span>*</span></div>
      <Input className="antdInput-w540" size="large" placeholder="请选择下方标签或输入新的标签,以逗号拼接" value={customTag.join(',')}
             onChange={(e) => {
               let value = e.target.value;
               updateStore.setIpTags(value.split(','));
             }}
             onBlur={(e) => {
               let value = e.target.value;
               const arr = value && value.split(/[, ，]/);
               if (new Set(arr).size !== arr.length) {
                 message.warning("IP标签中存在重复标签");
               }
             }}
      />
      <div className="labelBox">
        {(tagList || []).map((item, index: number) => {
          return (
            <span key={index}
                  onClick={() => {
                    updateStore.setIpTags(_uniq([...customTag,  item]));
                  }}>
                {item}
              </span>
          );
        })}
      </div>

      {
        ipTypeSuperiorNumber !== 8 &&
        <div>
          <div className="labelTitle">IP所属国家地区<span>*</span><span className="duanxuan">(可多选)</span></div>
          <Checkbox.Group
            className="rightIPKindsCheckboxGroup"
            value={countryTypes.split(',')}
            onChange={(e: string[]) => updateStore.setIpCountry(e.join(','))}>
            {
              (countryList || []).map((item, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    className="rightIPKindsCheckbox"
                    // value={item.resourceKey + '_' + item.resourceValue}
                    value={item.resourceKey}
                  >
                    {item.resourceValue}
                  </Checkbox>
                );
              })
            }
          </Checkbox.Group>
        </div>
      }
    </div>
  );
};
