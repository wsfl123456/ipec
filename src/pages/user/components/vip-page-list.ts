import icon_attestation from "@assets/images/user/vip/attestation1.svg";
import icon_golden from "@assets/images/user/vip/golden_membership1.svg";
import icon_diamond from "@assets/images/user/vip/diamond_membership1.svg";
import icon_custom_service from "@assets/images/user/vip/custom-service.png";

import icon_sjzl from '@assets/images/user/vip/ic_sjzl.svg';
import icon_yxpf from '@assets/images/user/vip/ic_yxpf.svg';
import icon_bfqs from '@assets/images/user/vip/ic_bfqs.svg';
import icon_kbxx from '@assets/images/user/vip/ic_kbxx.svg';
import icon_hdzs from '@assets/images/user/vip/ic_hdzs.svg';
import icon_sszs from '@assets/images/user/vip/ic_search.svg';
import icon_media from '@assets/images/user/vip/ic_media.svg';
import icon_fsqs from '@assets/images/user/vip/ic_fsqs.svg';
import icon_wordcloud from '@assets/images/user/vip/ic_wordcloud.svg';
import icon_syjz from '@assets/images/user/vip/ic_value.svg';
import icon_arae from '@assets/images/user/vip/ic_area.svg';
import icon_vs from '@assets/images/user/vip/ic_vs.svg';
import icon_ptfb from '@assets/images/user/vip/ic_ptfb.svg';
import { MemberLevel } from "@pages/user/interfaces/i-vip";

import silver from '@assets/images/user/vip/silver.png';
import gold from '@assets/images/user/vip/gold.png';
import diamond from '@assets/images/user/vip/diamond.png';
import customize from '@assets/images/user/vip/customize.png';

const authenticationRules = [
  { img: icon_sjzl, title: '数据总览' },
  { img: icon_yxpf, title: '院线票房' },
  { img: icon_bfqs, title: '播放趋势' },
  { img: icon_ptfb, title: '平台发布' },
  { img: icon_kbxx, title: '口碑信息' },
  { img: icon_sszs, title: '搜索指数' },
  { img: icon_hdzs, title: '互动指数' },
  { img: icon_media, title: '媒体关注度' },
  { img: icon_fsqs, title: '粉丝趋势' },
];

const goldRules = [
  ...authenticationRules,
  { img: icon_fsqs, title: '受众画像' },
  { img: icon_arae, title: '地区分布' },
  { img: icon_syjz, title: '商业价值' },
  { img: icon_wordcloud, title: '关键词云' },
];

const diamondRules = [
  ...goldRules, { img: icon_vs, title: '同类IP对比' },
];

export const typeList = [
  {
    img: silver,
    title: '白银VIP会员',
    subtitle: '白银会员可免费查看海量IP',
    second_title: '基础数据',
    third_title_clazz: 'purple',
    third_title_color: '#8287A4',
    rules: authenticationRules,
    btn_title: {
      [MemberLevel.None]: '立即开通',
      [MemberLevel.Authorized]: '立即续费',
      [MemberLevel.Gold]: '立即开通',
      [MemberLevel.Diamond]: '立即开通',
    },
    member_level: MemberLevel.Authorized,
    userJurisdiction: ',1,'
  },
  {
    img: gold,
    title: '黄金VIP会员',
    subtitle: '黄金会员可免费查看海量IP',
    second_title: '基础数据/评估数据',
    third_title_clazz: 'gold',
    third_title_color: '#d79e6b',
    rules: goldRules,
    btn_title: {
      [MemberLevel.None]: '立即开通',
      [MemberLevel.Authorized]: '立即开通',
      [MemberLevel.Gold]: '立即续费',
      [MemberLevel.Diamond]: '立即开通',
    },
    member_level: MemberLevel.Gold,
    userJurisdiction: ',2,'
  },
  {
    img: diamond,
    title: '钻石VIP会员',
    subtitle: '钻石会员可免费查看海量IP',
    second_title: '基础数据/评估数据/IP对比',
    third_title_clazz: 'diamond',
    third_title_color: '#d09f10',
    rules: diamondRules,
    btn_title: {
      [MemberLevel.None]: '立即开通',
      [MemberLevel.Authorized]: '立即开通',
      [MemberLevel.Gold]: '立即开通',
      [MemberLevel.Diamond]: '立即续费'
    },
    member_level: MemberLevel.Diamond,
    userJurisdiction: ',3,'
  },
  {
    img: customize,
    title: '定制服务',
    subtitle: '评测数据',
    second_title: '定制化服务',
    third_title_clazz: 'normal',
    third_title_color: '#693FFE',
    btn_title: '联系客服',
    member_level: MemberLevel.Custom,
  },
];

export const modalTitle = {
  [MemberLevel.Gold]: '黄金VIP会员',
  [MemberLevel.Diamond]: '钻石VIP会员',
};

export const modalIcon = {
  [MemberLevel.Gold]: icon_golden,
  [MemberLevel.Diamond]: icon_diamond,
};
