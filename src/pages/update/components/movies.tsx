import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import { DatePicker, Input, Radio, Select } from "antd";
import moment from "moment";
import * as React from "react";

const { Option } = Select;

// 影视娱乐-电影
export default (
  {
    updateStore,
    ipIsShow,
    showDate,
    filmLength,
    protagonist,
    companyCpsList,
    companyXfsList,
    companyCps,
    companyXfs,
    director,
    scriptwriter,
  }:
    {
      updateStore: IUpdateStore,
      scriptwriter: string,
      director: string,
      ipIsShow: number,
      showDate: string,
      filmLength: string,
      protagonist: string,
      companyCpsList: any[],
      companyXfsList: any[],
      companyCps: any[],
      companyXfs: any[],
    }) => {
  return (
    <div>
      <div className="labelTitle">是否上映</div>
      <Radio.Group
        className="rightIPKindsCheckboxGroup"
        onChange={(e) => updateStore.setIpIsShow(e.target.value)}
        value={ipIsShow}>
        <Radio value={2}>未上映</Radio>
        <Radio value={1}>已上映</Radio>
      </Radio.Group>
      <DatePicker
        className="antdInput-w540 rightIPReleased"
        size="large"
        placeholder="请选择上线时间"
        value={showDate ? moment(showDate) : null}
        onChange={(_, dateString: string) => updateStore.setShowDate(dateString)}/>
      <div className="labelTitle">片长</div>
      <Input
        className="antdInput-w540" size="large" placeholder="请填写片长时间" value={filmLength}
        onChange={(e) => updateStore.setFilmLength(e.currentTarget.value)}/>
      <div className="labelTitle">主演阵容</div>
      <Input
        className="antdInput-w540" size="large"
        placeholder="如果有多个, 名字之间用英文逗号隔开"
        value={protagonist}
        onChange={(e) => updateStore.setProtagonist(e.currentTarget.value)}/>

      <div className="labelTitle">导演</div>
      <Input className="antdInput-w540" size="large" placeholder="如果有多个, 名字之间用英文逗号隔开"
             value={director} onChange={(e) => updateStore.setDirector(e.currentTarget.value)}/>
      <div className="labelTitle">编剧</div>
      <Input
        className="antdInput-w540" size="large" placeholder="如果有多个, 名字之间用英文逗号隔开"
        value={scriptwriter} onChange={(e) => updateStore.setScriptWriter(e.currentTarget.value)}/>
      <div className="labelTitle">出品公司<span>*</span></div>
      <Select
        className="antdInput-w540" placeholder="请选择出品公司" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear filterOption={false}
        onSearch={(companyName) => updateStore.searchCompany(companyName, 1, 'companyCpsList')}
        onChange={async (value: any) => updateStore.setCompanyCps(value)}
        value={companyCps}
      >
        {(companyCpsList || []).map(item => {
          return (
            <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
          );
        })}
      </Select>
      <div className="labelTitle">宣发公司</div>
      <Select
        className="antdInput-w540" placeholder="请选择发行公司" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear={true} filterOption={false}
        onSearch={(companyName) => updateStore.searchCompany(companyName, 6, 'companyXfsList')}
        onChange={value => updateStore.setCompanyXfs(value)}
        value={companyXfs}
      >
        {(companyXfsList || []).map(item => {
          return (
            <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
          );
        })}
      </Select>
    </div>
  );
};
