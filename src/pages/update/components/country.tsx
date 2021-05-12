import { Checkbox } from "antd";
import * as React from "react";

// IP类型 IP所属国家地区 等 组件
export default ({
                  ipTypeSuperiorNumber,
                  updateStore,
                  ipTypeNumber,
                  childList,
                  countryTypes,
                  countryList
                }:
                  {
                    ipTypeSuperiorNumber: number,
                    updateStore: any,
                    ipTypeNumber: string,
                    countryTypes: string,
                    childList: any[],
                    countryList: any[]
                  }) => {
  return (
    <div>
      <div className="labelTitle">IP类型<span>*</span></div>
      <Checkbox.Group
        className="rightIPKindsCheckboxGroup"
        value={ ipTypeNumber.split(',')}
        onChange={(v: string[]) => updateStore.setIpTypeNumber(v.join(','))}>
        {(childList || [])
          .filter(v => v.ipType !== '全部')
          .map((item, index: number) => {
            return (
              <Checkbox
                key={index}
                className="rightIPKindsCheckbox"
                value={item.ipTypeNumber + ''}
              >
                {item.ipType}
              </Checkbox>
            );
          })}
      </Checkbox.Group>

      {
        ipTypeSuperiorNumber !== 8 &&
        <div>
          <div className="labelTitle">IP所属国家地区<span>*</span><span className="duanxuan">(可多选)</span></div>
          <Checkbox.Group
            className="rightIPKindsCheckboxGroup"
            value={ countryTypes.split(',')}
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
