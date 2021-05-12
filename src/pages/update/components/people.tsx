import { DatePicker, Input, Radio, Select } from "antd";
import moment from "moment";
import * as React from "react";
import { IUpdateStore } from "@pages/update/interfaces/i-update-store";

const { Option } = Select;

export default ({
                  countryList,
                  updateStore,
                  nationality,
                  nationalityText,
                  birthDate,
                  brokerageFirms,
                  brokerageFirmsList,
                  profession,
                }:
                  {
                    countryList: any[],
                    updateStore: IUpdateStore,
                    nationality: string,
                    nationalityText: string,
                    birthDate: string,
                    brokerageFirms: string[],
                    brokerageFirmsList: any[],
                    profession: string,
                  }) => {
  return (
    <div>
      <div className="labelTitle">国籍<span>*</span></div>
      <Radio.Group
        className="rightIPKindsCheckboxGroup"
        onChange={(e) => updateStore.setNationality(e.target.value)}
        value={nationality}>
        {(countryList || []).map((item, index: number) => {
          return (
            <Radio key={index} value={item.resourceValue}>{item.resourceValue}</Radio>
          );
        })}
      </Radio.Group>
      {(nationality === "欧洲其他国家" || nationality === "其他") &&
      <Input
        className="antdInput-w540" size="large"
        placeholder="请输入具体国家名称"
        value={nationalityText}
        onChange={(e) => updateStore.setNationalityText(e.currentTarget.value)}/>
      }
      <div className="labelTitle">职业<span>*</span></div>
      <Input
        className="antdInput-w540" size="large" placeholder="请输入职业"
        value={profession}
        onChange={(e) => updateStore.setProfession(e.currentTarget.value)}/>
      <div className="labelTitle">出生日期</div>
      <DatePicker
        className="antdInput-w540 rightIPReleased" size="large" placeholder="请选择出生日期"
        value={birthDate ? moment(birthDate) : null}
        onChange={(_, dateString: string) => updateStore.setBirthDate(dateString)}/>
      <div className="labelTitle">经纪公司<span>*</span></div>
      <Select
        className="antdInput-w540"
        placeholder="请选择经纪公司" size="large"
        mode="tags"
        showSearch showArrow={false}
        notFoundContent={null}
        allowClear filterOption={false}
        onSearch={(e) => updateStore.searchCompany(e, 1, "brokerageFirmsList")}
        onChange={value => updateStore.setBrokerageFirms(value)}
        value={brokerageFirms}
      >
        {(brokerageFirmsList || []).map(item => {
          return (
            <Option key={item.companyGuid} value={item.companyName}>{item.companyName}</Option>
          );
        })}
      </Select>
    </div>
  );
}
