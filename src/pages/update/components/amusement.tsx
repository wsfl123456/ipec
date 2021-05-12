import { IUpdateStore } from "@pages/update/interfaces/i-update-store";
import { DatePicker, Input, Radio, Select } from "antd";
import moment from "moment";
import * as React from "react";

const { Option } = Select;

// 影视娱乐-电视剧 影视娱乐-综艺
export default ({
                  ipTypeSuperiorNumber,
                  updateStore,
                  ipIsShow,
                  showDate,
                  filmLength,
                  protagonist,
                  numberEpisode,
                  companyCpsList,
                  companyFxsList,
                  companyCps,
                  companyXfs,
                  ipPlatformInfoWls,
                  ipPlatformInfoWlsList,
                  ipPlatformInfoDss,
                  ipPlatformInfoDssList,
                  director,
                  scriptwriter,
                }:
                  {
                    ipTypeSuperiorNumber,
                    updateStore: IUpdateStore,
                    scriptwriter: string,
                    director: string,
                    ipIsShow: number,
                    showDate: string,
                    numberEpisode: string,
                    filmLength: string,
                    protagonist: string,
                    companyCpsList: any[],
                    companyFxsList: any[],
                    companyCps: any[],
                    companyXfs?: any[],
                    ipPlatformInfoWls: any[],
                    ipPlatformInfoWlsList: any[],
                    ipPlatformInfoDss: any[],
                    ipPlatformInfoDssList: any[],
                  }) => {
  console.log(ipPlatformInfoWls);
  console.log(ipPlatformInfoWlsList);
  console.log(ipTypeSuperiorNumber);
  return (
    <div>
      <div className="labelTitle">是否首播上线</div>
      <Radio.Group
        className="rightIPKindsCheckboxGroup"
        onChange={(e) => updateStore.setIpIsShow(e.target.value)}
        value={ipIsShow}
      >
        <Radio value={2}>未上线</Radio>
        <Radio value={1}>已上线</Radio>
      </Radio.Group>
      <DatePicker
        className="antdInput-w540 rightIPReleased" size="large" placeholder="请选择上线时间"
        value={showDate ? moment(showDate) : null}
        onChange={(_, dateStr: string) => updateStore.setShowDate(dateStr)}/>
      <div className="labelTitle">集数</div>
      <Input
        className="antdInput-w250" size="large" placeholder="请填写集数" value={numberEpisode}
        onChange={(e) => updateStore.setNumberEpisode(e.currentTarget.value)}/>
      <div className="div-w40">&</div>
      <Input
        className="antdInput-w250" size="large" placeholder="请填写每集片长" value={filmLength}
        onChange={(e) => updateStore.setFilmLength(e.currentTarget.value)}
      />
      <div className="labelTitle">主演阵容</div>
      <Input
        className="antdInput-w540" size="large"
        placeholder="如果有多个, 名字之间用英文逗号隔开"
        value={protagonist}
        onChange={(e) => updateStore.setProtagonist(e.currentTarget.value)}/>
      <div className="labelTitle">导演</div>
      <Input
        className="antdInput-w540" size="large" placeholder="如果有多个, 名字之间用英文逗号隔开"
        value={director}
        onChange={(e) => updateStore.setDirector(e.currentTarget.value)}/>
      <div className="labelTitle">编剧</div>
      <Input className="antdInput-w540" size="large" placeholder="如果有多个, 名字之间用英文逗号隔开"
             value={scriptwriter} onChange={(e) => updateStore.setScriptWriter(e.currentTarget.value)}/>
      <div className="labelTitle">出品公司<span>*</span></div>

      <Select
        className="antdInput-w540" placeholder="请选择出品公司" size="large"
        mode="tags"
        showArrow={false}
        showSearch
        notFoundContent={null}
        allowClear
        filterOption={false}
        onSearch={(companyName) => updateStore.searchCompany(companyName, 1, 'companyCpsList')}
        value={companyCps}
        onChange={(v: string[]) => updateStore.setCompanyCps(v)}
      >
        {(companyCpsList || []).map(item => {
          return (
            <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
          );
        })}
      </Select>
      {
        ipTypeSuperiorNumber === 5 &&
        <div className="labelTitle">发行公司</div>
      }
      {
        ipTypeSuperiorNumber === 5 &&
        <Select
          className="antdInput-w540" placeholder="请选择发行公司" size="large"
          mode="tags" showSearch showArrow={false} notFoundContent={null}
          allowClear={true} filterOption={false}
          onSearch={(companyName) => updateStore.searchCompany(companyName, 2, 'companyFxsList')}
          value={companyXfs}
          onChange={v => updateStore.setCompanyXfs(v)}
        >
          {(companyFxsList || []).map(item => {
            return (
              <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
            );
          })}
        </Select>
      }
      <div className="labelTitle">在线播放平台</div>
      <Select
        className="antdInput-w540" placeholder="请选择在线播放平台" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear={true} filterOption={true}
        onChange={v => updateStore.setIpPlatformInfoWls(v)}
        value={ipPlatformInfoWls}
      >
        {(ipPlatformInfoWlsList || []).map(item => {
          return (
            <Option key={item.id} value={item.ipPlatformFullName}>{item.ipPlatformFullName}</Option>
          );
        })}
      </Select>
      <div className="labelTitle">首播电视平台</div>
      <Select
        className="antdInput-w540" placeholder="请选择首播电视平台" size="large"
        mode="tags" showSearch showArrow={false} notFoundContent={null}
        allowClear={true} filterOption={true}
        onChange={value => updateStore.setIpPlatformInfoDss(value)}
        value={ipPlatformInfoDss}
      >
        {(ipPlatformInfoDssList || []).map((item) => {
          return (
            <Option key={item.id} value={item.ipPlatformFullName}>{item.ipPlatformFullName}</Option>
          );
        })}
      </Select>
    </div>
  );
};
