import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import { Input, Radio } from "antd";
import * as React from "react";

const { TextArea } = Input;

export default (
  {
    updateStore,
    ipTypes,
    selectedType,
    id,
    ipName, ipTypeSuperiorNumber,
    ipDesc
  }: {
    updateStore: IUpdateStore
    ipTypes: any[],
    selectedType: any,
    id: string,
    ipName: string, ipTypeSuperiorNumber: number,
    ipDesc: string,
  }) => {
  return (
    <div className="rightIPName">
      <div className="labelTitle">IP名称<span>*</span></div>
      <Input className="antdInput-w540" size="large" placeholder="填写IP公认的名称" value={ipName || ''}
             onChange={(e) => updateStore.setIpName(e.target.value)}/>
      <div className="labelTitle">IP分类<span>*</span></div>

      <Radio.Group
        className="IPListRadioGroup"
        onChange={async (e) => updateStore.setIpType(e.target.value)}
        value={selectedType} disabled={!!id}>
        {(ipTypes || []).map((item, index: number) => {
          return (
            <Radio
              className="IPListRadio"
              key={index}
              value={index}
            >
              {item.typeName}
            </Radio>
          );
        })}
      </Radio.Group>

      {/* IP分类的子列表 */}
      {((ipTypes[selectedType] || {}).childTypeList || []).length > 0 &&
      <Radio.Group
        className="IpListChildRadioGroup" value={ipTypeSuperiorNumber}
        onChange={ async (e) => {
          updateStore.setSecondType(e.target.value);
          // await updateStore.getIpTagList(e.target.value);
        }}
        disabled={!!id}
      >
        {
          ((ipTypes[selectedType] || {}).childTypeList || []).map((item, index: number) =>
            (<Radio className="IPListChildRadio" key={index} value={item.ipTypeNumber}>{item.ipType}</Radio>)
          )
        }
      </Radio.Group>
      }
      <div className="labelTitle">IP简介</div>
      <TextArea
        placeholder="请在此处填写IP简介" autosize={{ minRows: 6 }} value={ipDesc}
        onChange={(e) => updateStore.changeIpDesc(e.target.value)}
      />
    </div>
  );
};
