import * as React from 'react';
import icon_detail from "@assets/images/ip_detail/how.png";
import icon_add from '@assets/images/add.svg';
import icon_red_close from '@assets/images/update/ic_red_close.png';
import _isEmpty from 'lodash/isEmpty';
import { Input, Select } from 'antd';

const { Option } = Select;
const platformList = [
  { typeId: 1, typeName: '微博' },
  { typeId: 2, typeName: '微信' },
  { typeId: 3, typeName: '抖音' },
  { typeId: 4, typeName: '火山' },
  { typeId: 5, typeName: '小红书' },
  { typeId: 6, typeName: 'B站' },
  { typeId: 7, typeName: '快手' },
  { typeId: 8, typeName: '微博' },
];
const platformObj = {
  1: '微博',
  2: '微信',
  3: '抖音',
  4: '火山',
  5: '小红书',
  6: 'B站',
  7: '快手',
  8: '微博',
};

export default ({
                  updateStore,
                  ipAccountInfoDTOList
                }:
                  {
                    updateStore: any
                    ipAccountInfoDTOList: any[]
                  }) => {
  let arr = [];
  JSON.stringify(ipAccountInfoDTOList) === '[]' ? arr = [{
    platformType: '',
    account: '',
    nickName: '',
    platformName: ''
  }] : arr = ipAccountInfoDTOList;
  return (
    <div className="rightSocialPlatform">
      <div className="labelTitle">
        添加IP的社交平台账号
        {/* <img className="img-mark" src={icon_detail} alt=""/>
        <span className="hover-box">
           含义：
        </span>*/}
        <div className="add-repeat" onClick={() => {
          let obj = { platformType: '', account: '', nickName: '', platformName: '' };
          updateStore.editPlatformGroups([...ipAccountInfoDTOList, obj]);
        }}>
          <img className="img-add" src={icon_add} alt=""/>继续添加
        </div>
      </div>
      {
        arr && arr.map((item, index) => {
          return (
            <div className="select-groups" key={index}>
              <Select className="antdInput-w240" placeholder="请选择平台号" size="large"
                      value={platformObj[item.platformType]}
                      onChange={e => {
                        // let list = ipAccountInfoDTOList;
                        let list = arr;
                        list[index]['platformType'] = e;
                        list[index].platformName = platformObj[`${e}`];
                        updateStore.editPlatformGroups(list);
                      }}
              >
                {
                  platformList && platformList.map((item, index) => {
                    return (
                      <Option label={item.typeName} value={item.typeId} key={index}> {item.typeName}</Option>
                    );
                  })
                }
              </Select>
              <span className="u-line"/>
              <Input className="antdInput-w240" size="large"
                     placeholder={platformObj[item.platformType] ? `请输入${platformObj[item.platformType]}昵称(必填)` : '请输入平台昵称'}
                     value={item.nickName}
                     onChange={(e) => {
                       // ipAccountInfoDTOList[index].nickName = e.target.value;
                       // updateStore.editPlatformGroups(ipAccountInfoDTOList);
                       arr[index].nickName = e.target.value;
                       updateStore.editPlatformGroups(arr);
                     }}/>
              <span className="u-line"/>
              <Input className="antdInput-w240" size="large"
                     placeholder={platformObj[item.platformType] ? `请输入${platformObj[item.platformType]}号（必填）` : '请输入平台账号'}
                     value={item.account}
                     onChange={(e) => {
                       // ipAccountInfoDTOList[index].account = e.target.value;
                       // updateStore.editPlatformGroups(ipAccountInfoDTOList);
                       arr[index].account = e.target.value;
                       updateStore.editPlatformGroups(arr);
                     }}
              />
              {index > 0 && <img className="u-close"
                                 onClick={() => {
                                   // ipAccountInfoDTOList.splice(index, 1);
                                   // updateStore.editPlatformGroups(ipAccountInfoDTOList);

                                   arr.splice(index, 1);
                                   updateStore.editPlatformGroups(arr);
                                 }}
                                 src={icon_red_close} alt=""/>}
            </div>
          );
        })
      }

    </div>
  );
}
