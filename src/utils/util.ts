/**
 *  公共方法
 * @param params
 * @param ipTypeSuperiorNumber
 */
import { reqUserBehavior } from '@utils/api';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';

// 检查设备
export async function userAgent() {
  let sUserAgent = navigator.userAgent;
  let mobileAgents = ['Android', 'iPhone', 'Symbian', 'WindowsPhone', 'iPod', 'BlackBerry', 'Windows CE'];
  let goUrl = 0;
  for (let i = 0; i < mobileAgents.length; i++) {
    if (sUserAgent.indexOf(mobileAgents[i]) > -1) {
      goUrl = 1;
      return goUrl;
    }
  }
}

export async function setContact(params, ipTypeSuperiorNumber) {

  let storage = window.localStorage;
  let _contastList = JSON.parse(storage.getItem('contastList'));
  if (_contastList === null) {
    _contastList = [];
  }

  params && _contastList.push(params);
  // 写入c字段
  storage.setItem("contastList", JSON.stringify(_contastList));
  storage.setItem("ipTypeSuperiorNumber", JSON.stringify(ipTypeSuperiorNumber));
  return _contastList;
}

export async function getContact() {
  let storage = window.localStorage;
  let _contastList = JSON.parse(storage.getItem('contastList'));
  let _ipTypeSuperiorNumber = JSON.parse(storage.getItem('ipTypeSuperiorNumber'));
  if (_contastList === null) {
    _contastList = [];
  }
  let _params = {
    ipTypeSuperiorNumber: _ipTypeSuperiorNumber,
    ipids: '',
  };
  _contastList.forEach(element => {
    if (_params.ipids == '') {
      _params.ipids = element.ipids;
    } else {
      _params.ipids = _params.ipids + "," + element.ipids;
    }
  });
  return _params;
}

export async function deletContact(ipids) {
  const storage = window.localStorage;
  let _contastList = JSON.parse(storage.getItem('contastList'));
  let _params = [];
  _contastList.forEach(element => {
    if (element.ipids != ipids) {
      _params.push(element);
    }

  });
  storage.setItem("contastList", JSON.stringify(_params));
  if (_params.length === 0) {
    storage.setItem("ipTypeSuperiorNumber", JSON.stringify(null));
  }
  return _params;
}

export async function setTimeLoginSetion(user) {
  const date = new Date().getTime();
  let param = {
    user,
    time: date,
  };
  localStorage.setItem('user', JSON.stringify(param));
}

// 检查登陆过期状态
export async function isSignIn() {
  const nowDate = new Date().getTime();
  const wayTime = 1000 * 60 * 60 * 24 * 30; // 30days
  const storage = window.localStorage;
  let user = JSON.parse(storage.getItem('user'));
  if (user === null) {
    return { hasLogin: false };
  }
  if ((nowDate - user.time) > wayTime) {
    return { hasLogin: false };
  }
  return { hasLogin: true };
}

export async function _throttle(fun, interval) {
  let timeout, startTime: any = new Date();
  return () => {
    clearTimeout(timeout);
    let curTime: any = new Date();
    if (curTime - startTime <= interval) {
      timeout = setTimeout(() => {
        fun();
      }, curTime - startTime);
    } else {
      startTime = curTime;
    }
  };
}

/**
 * 判断是否有w,有的话去掉w,添加千位分割，最后拼接w
 */
export function thousandSeparator(param: string) {
  let number = param.indexOf("w");
  if (number > -1) {
    return Number(param.replace('w', '')).toLocaleString() + 'w';
  } else {
    return Number(param).toLocaleString();
  }
}

// 记录用户轨迹的方法:手工埋点
export async function sendUserBehavior(params) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const guid = !_isEmpty(userData) && userData.userGuid || '';
  let ipAddress = "",
    // let ipAddress = returnCitySN["cip"],
    operatingDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    operatingPlatform = navigator.platform,
    pageName = params.pageName,
    pageUrl = params.pageUrl,
    physicalAddress = "",
    remark = params.remark || "",
    platformType = 1,
    type = params.type,
    userGuid = guid;
  const { result, errorCode }: any = await reqUserBehavior({
    ipAddress,
    operatingDate,
    operatingPlatform,
    pageName,
    pageUrl,
    physicalAddress,
    remark,
    platformType,
    type,
    userGuid
  });
  if (errorCode === '200') {
    // console.log('手工埋点成功!');
  } else {
    // console.log('手工埋点失败!');
  }
}

const diyShow = {
  TypeNumberKV: [
    { id: '', name: '全部' },
    { id: 1, name: '卡通' },
    { id: 2, name: '文创艺术' },
    { id: 5, name: '电视剧' },
    { id: 6, name: '电影' },
    { id: 7, name: '影视娱乐' },
    { id: 8, name: '名人明星' },
    { id: 9, name: '动画' },
    { id: 10, name: '漫画' },
    { id: 334, name: '生活方式' },
    { id: 337, name: '非营利机构' },
    { id: 370, name: '网文图书' },
  ],
  detailNumberKV: {
    1: "卡通",
    2: "文创艺术",
    3: "图书",
    4: "网文",
    5: "电视剧",
    6: "电影",
    7: "综艺",
    8: "明星艺人",
    9: "动画",
    10: "漫画",
    334: "生活方式",
    335: "企业品牌",
    336: "体育运动",
    337: "非盈利机构",
    338: "网络游戏",
    370: "网文图书",
  },
  IndustryKV: [
    { id: '', name: '全部' },
    { id: 1, name: '行业案例' },
    { id: 5, name: '行业趋势' },
    { id: 2, name: '行业动态' },
    { id: 3, name: '人物专访' },
  ],
  forecastPurposeKV: [
    { id: '', name: '全部' },
    { id: 3, name: '旧品促销' },
    { id: 2, name: '新品上市' },
    { id: 1, name: '品牌上市' },
  ],
  rankingTab: [
    {
      class: 'dy',
      id: 1,
      tab: "抖音",
      title: "明星爱DOU榜是抖音推出的旨在反映抖音明星人气热度情况，展示在抖音内高人气的明星。榜单明星影响力值根据明星的总投稿量、播放量、互动量、贡献值等数据，通过多维度的算法计算而成。"
    },
    { class: 'hs', id: 2, tab: "火山", title: "火山排行榜是火山推出的旨在反映火山明星人气热度情况。" },
    {
      class: 'xhs',
      id: 3,
      tab: "小红书",
      title: "小红书明星榜是小红书推出的反映小红书明星热度情况，以人气值为准顺次展示， 榜单明星人气值根据明星近30日发布笔记的互动数、在小红书站内每日搜索次数， @明星的笔记产生互动数等多维度数据计算而成。"
    },
    { class: 'bz', id: 4, tab: "B站", title: "首次投稿时间在三个月内的UP主的投稿的排行，统计所有投稿的数据综合得分，每日更新一次。" },
    { class: 'ks', id: 6, tab: "快手", title: "快手排行榜是快手推出的旨在反映快手明星人气热度情况。" },
    { class: 'tbzb', id: 7, tab: "淘宝直播", title: "淘宝直播排行榜是淘宝直播推出的旨在反映淘宝直播明星人气热度情况。" },
    // { class: 'dzdp', id: 5, tab: "大众点评", title: "" },
    // { class: 'db', id: 8, tab: "豆瓣", title: "" },
  ]
};
export function bytesToSize(limit: number) {
  var size = "";
  if (limit < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  var sizestr = size + "";
  var len = sizestr.indexOf(".");
  var dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
export default diyShow;


