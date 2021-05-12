import * as React from "react";
import { DatePicker, Radio, Select } from "antd";
import moment from "moment";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
const { Option } = Select;

export default ({
                  updateStore,
                  countryList,
                  owner,
                  rightIPCopyrightList,
                  rightIPCopyrightList2,
                  copyrightAgent,
                  recordCountry,
                  isTransferable,
                  grantedType,
                  grantedTypeList,
                  intentAuthorization,
                  intentAuthorizationList,
                  authorizedAllottedTime,
                  authorizedLocationList,
                  authorizedLocation,
                  authorizedType,
                  authorizedTypeList,
                }:
                  {
                    updateStore: IUpdateStore,
                    countryList: any[],
                    owner: string[],
                    rightIPCopyrightList: any[],
                    copyrightAgent: any[],
                    rightIPCopyrightList2: any[],
                    recordCountry: string,
                    isTransferable: number,
                    grantedType: any[],
                    grantedTypeList: any[],
                    intentAuthorization: any[],
                    intentAuthorizationList: any[],
                    authorizedAllottedTime: string,
                    authorizedLocationList: any[],
                    authorizedLocation: any[],
                    authorizedType: any[],
                    authorizedTypeList: any[],
                  }) => {
  return (
    <div className="rightIPCopyright">
      <div className="labelTitle">IP版权方<span>*</span></div>
      <Select
        className="antdInput-w540"
        placeholder="请填写企业全称" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear filterOption={false}
        onSearch={(e) => updateStore.searchCompany(e, 7, "rightIPCopyrightList")}
        onChange={value => updateStore.setOwner((value.length > 1 ? value.slice(1) : value))}
        value={owner}
      >
        {(rightIPCopyrightList || []).map(item => <Option key={item.companyGuid}
                                                          value={item.companyName}>{item.companyName}</Option>)}
      </Select>

      <div className="labelTitle">IP版权代理方</div>
      <Select
        className="antdInput-w540" placeholder="请填写企业全称" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear filterOption={false}
        onSearch={(e) => updateStore.searchCompany(e, 7, "rightIPCopyrightList2")}
        onChange={value => {
          if (value.length > 1) {
            updateStore.setCopyrightAgent(value.slice(1));
          } else {
            updateStore.setCopyrightAgent(value);
          }
        }}
        value={copyrightAgent}
      >
        {(rightIPCopyrightList2 || []).map(item => {
          return (
            <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
          );
        })}
      </Select>

      <div className="labelTitle">IP备案国家<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="请输入IP备案国家"
        allowClear filterOption={false} size="large"
        onChange={value => {
          if (value === undefined) {
            value = '';
          }
          updateStore.setRecordCountry(value);
        }}
        value={recordCountry}
      >
        {(countryList || []).map(item => {
          return (
            <Option key={item.resourceKey} value={item.resourceValue}>{item.resourceValue}</Option>
          );
        })}
      </Select>

      {/*<div className="labelTitle">是否可以直接签署授权协议<span>*</span></div>
      <Radio.Group
        className="isTransferableRadioGroup"
        value={isTransferable}
        onChange={(e) => updateStore.setIsTransferable(e.target.value)}>
        <Radio value={1}>是</Radio>
        <Radio value={0}>否</Radio>
      </Radio.Group>*/}

      <div className="labelTitle">可授权品类<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="选择可授权品类" size="large"
        mode="multiple" showSearch showArrow={false} notFoundContent={null}
        allowClear={true} filterOption={false}
        onChange={value => {
          if (value === undefined) {
            value = [];
          }
          updateStore.setAuthorizedType(value)
        }}
        value={authorizedType}
      >
        {(authorizedTypeList || []).map((item, index) => {
          return (
            <Option key={index} value={item.typeName}>{item.typeName}</Option>
          );
        })}
      </Select>

      <div className="labelTitle">已授权品类<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="选择已授权品类" size="large"
        mode="multiple" showSearch showArrow={false} notFoundContent={null}
        allowClear={true} filterOption={false}
        onChange={value => updateStore.setGrantedType(value)}
        value={grantedType}
      >
        {(grantedTypeList || []).map((item, index) => {
          return (
            <Option key={index} value={item.typeName}>{item.typeName}</Option>
          );
        })}
      </Select>

      <div className="labelTitle">意向授权品类<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="选择意向授权品类" size="large"
        mode="multiple" showSearch showArrow={false} notFoundContent={null}
        allowClear filterOption={false}
        onChange={value => updateStore.setIntentAuthorization(value)}
        value={intentAuthorization}
      >
        {(intentAuthorizationList || []).map((item, index) => {
          return (
            <Option key={index} value={item.typeName}>{item.typeName}</Option>
          );
        })}
      </Select>

      {/*TODO 新增加*/}
      <div className="labelTitle">是否可以转授权<span>*</span></div>
      <Radio.Group
        className="isTransferableRadioGroup"
        value={isTransferable}
        onChange={(e) => updateStore.setIsTransferable(e.target.value)}
      >
        <Radio value={1}>是</Radio>
        <Radio value={0}>否</Radio>
      </Radio.Group>

      <div className="labelTitle">可授权区域<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="填写可授权区域" size="large"
        mode="multiple" showSearch showArrow={false} notFoundContent={null}
        allowClear filterOption={false}
        onChange={v => updateStore.setAuthorizedLocation(v)}
        value={authorizedLocation}
      >
        {(authorizedLocationList || []).map((item, index) => {
          return (
            <Option key={index} value={item.resourceValue}>{item.resourceValue}</Option>
          );
        })}
      </Select>

      <div className="labelTitle">可授权期限<span>*</span></div>
      <DatePicker
        className="antdInput-w540"
        size="large"
        placeholder="选择可授权期限"
        value={!!authorizedAllottedTime ? moment(authorizedAllottedTime) : null}
        onChange={(_, dateString: string) => updateStore.setAuthorizedAllottedTime(dateString)}/>
    </div>
  );
}
