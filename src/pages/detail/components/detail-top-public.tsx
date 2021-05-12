import * as React from 'react';
import _isEmpty from 'lodash/isEmpty';

export default {
  // ip 形象
  '1': item => {
    return (
      <div className="basic-msg">
        {
          !!item.countryNames &&
          <div className="base-line flex-row">
            <span>所属国别:&nbsp;</span>
            <span>{item.countryNames}</span>
          </div>
        }
        {/*{
          !!item.recordCountry &&
          <div className="base-line flex-row">
            <span>备 案 国:&nbsp;</span>
            <span>{item.recordCountry}</span>
          </div>
        }*/}
        {
          !!item.owner &&
          <div className="base-line flex-row">
            <span>版 权 方:&nbsp;</span>
            <span>{item.owner}</span>
          </div>
        }
        {
          !!item.copyrightAgent &&
          <div className="base-line flex-row">
            <span>版权代理方:&nbsp;</span>
            <span>{item.copyrightAgent}</span>
          </div>
        }
       {/* {
          !!item.isTransferable &&
          <div className="base-line flex-row">
            <span>可否转授权:&nbsp;</span>
            <span>{item.isTransferable === 1 ? "是" : "否"}</span>
          </div>
        }
        {
          !!item.authorizedLocation &&
          <div className="base-line flex-row">
            <span>可授权区域:&nbsp;</span>
            <span>{item.authorizedLocation}</span>
          </div>
        }
        {
          !!item.authorizedAllottedTimeStr &&
          <div className="base-line flex-row">
            <span>可授权期限:&nbsp;</span>
            <span>{item.authorizedAllottedTimeStr}</span>
          </div>
        }*/}
      </div>
    );
  },

  // 文创艺术
  '2': item => {
    return (
      <div className="basic-msg">
        {
          !!item.countryNames &&
          <div className="base-line flex-row">
            <span>所属国别:&nbsp;</span>
            <span>{item.countryNames}</span>
          </div>
        }
       {/* {
          !!item.recordCountry &&
          <div className="base-line flex-row">
            <span>备 案 国:&nbsp;</span>
            <span>{item.recordCountry}</span>
          </div>
        }*/}
        {
          !!item.owner &&
          <div className="base-line flex-row">
            <span>版 权 方:&nbsp;</span>
            <span>{item.owner}</span>
          </div>
        }
        {
          !!item.copyrightAgent &&
          <div className="base-line flex-row">
            <span>版权代理方:&nbsp;</span>
            <span>{item.copyrightAgent}</span>
          </div>
        }
        {/*{
          !!item.isTransferable &&
          <div className="base-line flex-row">
            <span>可否转授权:&nbsp;</span>
            <span>{item.isTransferable === 1 ? "是" : "否"}</span>
          </div>
        }
        {
          !!item.authorizedLocation &&
          <div className="base-line flex-row">
            <span>可授权区域:&nbsp;</span>
            <span>{item.authorizedLocation}</span>
          </div>
        }
        {
          !!item.authorizedAllottedTimeStr &&
          <div className="base-line flex-row">
            <span>可授权期限:&nbsp;</span>
            <span>{item.authorizedAllottedTimeStr}</span>
          </div>
        }*/}
      </div>
    );
  },
  // 图书
  '3': item => (
    <div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
     {/* {
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
      {/*{
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 网文
  '4': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
      {/*{
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 生活方式
  '334': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
     {/* {
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
    {/*  {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 企业品牌
  '335': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
      {/*{
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 体育运动
  '336': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
      {/*{
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 非盈利机构
  '337': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
     {/* {
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 网络游戏
  '338': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
    {/*  {
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 网文图书
  '370': item => (<div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
      {/*{
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 电视剧
  '5': item => (
    <div className="basic-msg">
      {
        !!item.countryNames && <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
     {/* {
        !!item.recordCountry && <div className="base-line flex-row">
          <span>备案国别:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.showDate && <div className="base-line flex-row">
          <span>首播时间:&nbsp;</span>
          <span>{item.showDate}</span>
        </div>
      }
      {
        !!item.filmLength &&
        <div className="base-line flex-row">
          <span>集  数:&nbsp;</span>
          <span>{item.filmLength}</span>
        </div>
      }
      {
        !!item.protagonist &&
        <div className="base-line flex-row">
          <span>主  演:&nbsp;</span>
          <span>{item.protagonist}</span>
        </div>
      }
      {
        !!item.director &&
        <div className="base-line flex-row">
          <span>导  演:&nbsp;</span>
          <span>{item.director}</span>
        </div>
      }
      {
        !!item.scriptwriter &&
        <div className="base-line flex-row">
          <span>编  剧:&nbsp;</span>
          <span>{item.scriptwriter}</span>
        </div>
      }
      {
        !!item.companyGuidCpNames &&
        <div className="base-line  special-base-line" style={{}}>
          <span> 出品公司:&nbsp;</span>
          <span>
          {item.companyGuidCpNames.join(',')}
            </span>
        </div>
      }

      {/*<div className="base-line flex-row">*/}
      {/*<span>发行公司:&nbsp;</span>*/}
      {/*<span></span>*/}
      {/*</div>*/}

      {/*<div className="base-line flex-row">*/}
      {/*<span>在线播放平台:&nbsp;</span>*/}
      {/*<span>就萨克洛夫的骄傲</span>*/}
      {/*</div>*/}
      {/*<div className="base-line flex-row">*/}
      {/*<span>首播电视平台:&nbsp;</span>*/}
      {/*<span></span>*/}
      {/*</div>*/}

      {/*{
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !_isEmpty(item.authorizedTypeNames) &&
        <div className="base-line flex-row">
          <span>可授权品类:&nbsp;</span>
          <span>{item.authorizedTypeNames.join(',')}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
  // 电影
  '6': item => {
    return (
      <div className="basic-msg">
        {
          !!item.countryNames &&
          <div className="base-line flex-row">
            <span>所属国别:&nbsp;</span>
            <span>{item.countryNames}</span>
          </div>
        }
       {/* {!!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备案国别:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
        }*/}
        {
          !!item.showDate &&
          <div className="base-line flex-row">
            <span>上映时间:&nbsp;</span>
            <span>{item.showDate}</span>
          </div>
        }
        {!!item.filmLength &&
        <div className="base-line flex-row">
          <span>片    长:&nbsp;</span>
          <span>{item.filmLength}</span>
        </div>
        }
        {
          !!item.protagonist &&
          <div className="base-line flex-row">
            <span>主    演:&nbsp;</span>
            <span>{item.protagonist}</span>
          </div>
        }
        {
          !!item.director &&
          <div className="base-line flex-row">
            <span>导    演:&nbsp;</span>
            <span>{item.director}</span>
          </div>
        }
        {!!item.scriptwriter &&
        <div className="base-line flex-row">
          <span>编    剧:&nbsp;</span>
          <span>{item.scriptwriter}</span>
        </div>
        }
        {
          !_isEmpty(item.companyGuidCpNames) &&
          <div className="base-line flex-row">
            <span>出品公司:&nbsp;</span>
            <span>{item.companyGuidCpNames.join(',')}</span>
          </div>
        }
      </div>
    );
  },
  // 综艺
  '7': item => (
    <div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row"><span>所属国别:&nbsp;</span><span>{item.countryNames}</span></div>
      }
     {/* {
        !!item.recordCountry &&
        <div className="base-line flex-row"><span>备案国别:&nbsp;</span><span>{item.recordCountry}</span></div>
      }*/}
      {
        !!item.showDate &&
        <div className="base-line flex-row"><span>首播时间:&nbsp;</span><span>{item.showDate}</span></div>
      }
      {
        !!item.periods &&
        <div className="base-line flex-row"><span>期&nbsp;&nbsp;&nbsp;&nbsp;数:&nbsp;</span><span>{item.periods}</span>
        </div>
      }
      {
        !!item.compere &&
        <div className="base-line flex-row"><span>主  持  人:&nbsp;</span><span>{item.compere}</span></div>
      }
      {
        !!item.residentGuest &&
        <div className="base-line flex-row"><span>主要嘉宾:&nbsp;</span><span>{item.residentGuest}</span></div>
      }
      {
        !!item.director &&
        <div className="base-line flex-row"><span>导    演:&nbsp;</span><span>{item.director}</span></div>
      }
      {
        !!item.productionManager &&
        <div className="base-line flex-row"><span>制片  人:&nbsp;</span><span>{item.productionManager}</span></div>
      }
    </div>
  ),
  // 名人
  '8': item => (
    <div className="basic-msg">
      {
        !!item.nationality &&
        <div className="base-line flex-row">
          <span>国籍:&nbsp;</span>
          <span>{item.nationality}</span>
        </div>
      }
      {
        !!item.profession &&
        <div className="base-line flex-row">
          <span>职业:&nbsp;</span>
          <span>{item.profession}</span>
        </div>
      }
      {!!item.brithDate &&
      <div className="base-line flex-row">
        <span>出生日期:&nbsp;</span>
        <span>{item.brithDate}</span>
      </div>
      }
      {!!item.brokerageFirmList &&
      <div className="base-line flex-row">
        <span>经纪公司:&nbsp;</span>
        {
          item.brokerageFirmList.map((item, index) => {
            return <span key={index}>{item.companyName}</span>;
          })
        }
        {/*<span>{item.brokerageFirmGuid}</span>*/}
      </div>
      }
    </div>
  ),
  // 动画
  '9': item => (
    <div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
      {/*{
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
     {/* {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>),
  // 漫画
  '10': item => (
    <div className="basic-msg">
      {
        !!item.countryNames &&
        <div className="base-line flex-row">
          <span>所属国别:&nbsp;</span>
          <span>{item.countryNames}</span>
        </div>
      }
     {/* {
        !!item.recordCountry &&
        <div className="base-line flex-row">
          <span>备 案 国:&nbsp;</span>
          <span>{item.recordCountry}</span>
        </div>
      }*/}
      {
        !!item.owner &&
        <div className="base-line flex-row">
          <span>版 权 方:&nbsp;</span>
          <span>{item.owner}</span>
        </div>
      }
      {
        !!item.copyrightAgent &&
        <div className="base-line flex-row">
          <span>版权代理方:&nbsp;</span>
          <span>{item.copyrightAgent}</span>
        </div>
      }
{/*      {
        !!item.isTransferable &&
        <div className="base-line flex-row">
          <span>可否转授权:&nbsp;</span>
          <span>{item.isTransferable === 1 ? "是" : "否"}</span>
        </div>
      }
      {
        !!item.authorizedLocation &&
        <div className="base-line flex-row">
          <span>可授权区域:&nbsp;</span>
          <span>{item.authorizedLocation}</span>
        </div>
      }
      {
        !!item.authorizedAllottedTimeStr &&
        <div className="base-line flex-row">
          <span>可授权期限:&nbsp;</span>
          <span>{item.authorizedAllottedTimeStr}</span>
        </div>
      }*/}
    </div>
  ),
};
