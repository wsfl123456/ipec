import * as React from 'react';
import _isEmpty from 'lodash/isEmpty';

export default {
  // 卡通动漫
  '1': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 文创艺术
  '2': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 图书
  '3': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 网文
  '4': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 电视剧
  '5': item => (
    <div>
      {item.countryNames && <div className="hover-type-name">所属国别：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">备案国别：{item.recordCountry}</div>}*/}
      {item.showDate && <div className="hover-type-name">首播时间：{item.showDate}</div>}
      {item.numberEpisodeTv && <div className="hover-type-name">集数：{item.numberEpisodeTv}</div>}
      {item.protagonistTv && <div className="hover-type-name">主演：{item.protagonistTv.replace(/,/g, "/")}</div>}
      {item.directorTv && <div className="hover-type-name">导演：{item.directorTv}</div>}
      {item.scriptwriterTv && <div className="hover-type-name">编剧：{item.scriptwriterTv}</div>}
      {!_isEmpty(item.companyGuidCpNamesTv) && item.companyGuidCpNamesTv.length !== 0 &&
      <div className="hover-type-name">出品公司：{(item.companyGuidCpNamesTv).join(',')}</div>}
      {/* <div className="hover-type-name">网络平台：
        {
          item.tvIpPlatformInfoGuidWlNames && item.tvIpPlatformInfoGuidWlNames.map((item, index) => {
            return (
              <span key={index}>{item}</span>
            );
          })
        }
      </div> */}
    </div>
  ),
  // 电影
  '6': item => {
    return (
      <div>
        {item.countryNames && <div className="hover-type-name">所属国别：{item.countryNames}</div>}
        {/*{item.recordCountry && <div className="hover-type-name">备案国别：{item.recordCountry}</div>}*/}
        {item.showDate && <div className="hover-type-name">上映时间：{item.showDate}</div>}
        {item.filmLength && <div className="hover-type-name">片长：{item.filmLength}</div>}
        {item.protagonistMovie && <div className="hover-type-name">主演：{item.protagonistMovie}</div>}
        {item.directorMovie && <div className="hover-type-name">导演：{item.directorMovie}</div>}
        {item.scriptwriterMovie &&
        <div className="hover-type-name">编剧：{item.scriptwriterMovie && item.scriptwriterMovie.replace(/,/g, "/")}</div>}
        {item.companyGuidCpNamesMovie && item.companyGuidCpNamesMovie.length !== 0 &&
        <div className="hover-type-name">出品公司：{(item.companyGuidCpNamesMovie).join(',')}</div>}
      </div>
    );
  },
  // 综艺
  '7': item => (
    <div>
      {
        item.countryNames && <div className="hover-type-name">所属国别：{item.countryNames}</div>
      }
      {/*{
        item.recordCountry && <div className="hover-type-name">备案国别：{item.recordCountry}</div>
      }*/}
      {
        item.showDate && <div className="hover-type-name">首播时间：{item.showDate}</div>
      }
      {
        item.periods && <div className="hover-type-name">期数：{item.periods}</div>
      }
      {
        item.compere && <div className="hover-type-name">主持人：{item.compere}</div>
      }
      {
        item.residentGuest && <div className="hover-type-name">主要嘉宾：{item.residentGuest}</div>
      }
      {
        item.directorVariety && <div className="hover-type-name">导演：{item.directorVariety}</div>
      }
      {
        item.productionManager && <div className="hover-type-name">制片人：{item.productionManager}</div>
      }
    </div>
  ),
  // 名人
  '8': item => (
    <div>
      {item.nationality && <div className="hover-type-name">国籍：{item.nationality}</div>}
      {item.profession && <div className="hover-type-name">职业：{item.profession}</div>}
      {item.brithDate && <div className="hover-type-name">出生日期：{item.brithDate}</div>}
      {item.brokerageFirm && <div className="hover-type-name">经纪公司：{item.brokerageFirm}</div>}
    </div>
  ),
  // 动画
  '9': item => (
    <div>
      {

        !_isEmpty(item.ipPlatformInfoGuidWlNames) &&
        <div className="hover-type-name">网络平台：
          { item.ipPlatformInfoGuidWlNames.map((item, index) => {
              return (
                <span key={index}>{item}</span>
              );
            })
          }
        </div>
      }
      {item.tvNumberEpisode && <div className="hover-type-name">集数：{item.tvNumberEpisode}</div>}
    </div>
  ),
  // 漫画
  '10': item => (
    <div>
      {item.ipComicStatusName && <div className="hover-type-name">状态：{item.ipComicStatusName}</div>}
    </div>
  ),
  // 生活方式
  '334': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 企业品牌
  '335': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 体育运动
  '336': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 非盈利机构
  '337': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 网络游戏
  '338': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
  // 网文图书
  '370': item => (
    <div>
      {item.ownerAvatar && <div className="hover-type-name">版权方：{item.ownerAvatar}</div>}
      {item.countryNames && <div className="hover-type-name">IP所属国：{item.countryNames}</div>}
      {/*{item.recordCountry && <div className="hover-type-name">IP备案国：{item.recordCountry}</div>}*/}
    </div>
  ),
};
