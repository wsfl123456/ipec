import home from "@pages/home/store";
import login from "@pages/login/store";
import ip_list from "@pages/ip-list/store";
import user from "@pages/user/store";
import contract from "@pages/contrast/store";
import register from "@pages/register/store";
import authentication from "@pages/authentication/store";
import authorize from "@pages/authorized-exhibition/store";
import upPassword from "@pages/up-password/store";
import update from "@pages/update/store";
import industry from "@pages/ip-research/store";
import nav_store from "@components/nav-store";
import detail from "@pages/detail/store";
import ipSearch from "@pages/ip-search/store";
import industry_detail from "@pages/industry-detail/store";
import message from "@pages/message-center/store";
import business from '@pages/business-homepage/store';
import personal_home from '@pages/personal-homepage/store';
import vip from '@pages/user/components/vip-store';
import calculate_list from '@pages/user/components/calculate-store';
import calculate_result from '@pages/user/components/calculate-result-store';

import update_store from '@pages/update/update-store';
import ip_need from '@pages/ip-needs/store';
import need_detail from '@pages/needs-detail/store';
import ecosphere from '@pages/ecosphere/store';
import add_forecast from '@pages/add-forecast/store';
import filter_forecast from '@pages/filter-forecast/store';
import forecast_list from '@pages/forecast-data/store';
import forecast_detail from '@pages/forecast-detail/store';
import new_forecast_detail from '@pages/new-forecast-detail/store';
import add_calculate from '@pages/add-calculate/store';
import ranking from '@pages/ranking/store';
import double_eleven from '@pages/double-eleven/store';

import vip_card_buy from '@pages/vip-card-buy/store';
import vip_card_buy_detail from '@pages/vip-card-buy/components/detail/store';
import vip_card_buy_order from '@pages/vip-card-buy/components/order/store';
import user_vip_card from '@pages/user/components/UserVipCard/store';
import user_order from '@pages/user/components/UserOrder/store';
import user_shipping_address from '@pages/user/components/UserShippingAddress/store';

import user_information from '@pages/user/components/user-information/store';

/* 图库商城 */
import gallery_store from '@pages/gallery/store';
import gallery_detail_store from '@pages/gallery/components/detail/store';
import gallery_create_store from '@pages/gallery/components/create/store';
import gallery_manage_store from '@pages/gallery/components/manage/store';
import gallery_order_store from '@pages/gallery/components/order/store';
// 版权中心-卖家
import copyrightCenter from '@pages/copyright-center/store';
// 个人中心-买家
import buyerOrder from '@pages/user/components/buyer-order/store';
import orderDetailStore from "@pages/copyright-center/components/detail/store"

export default {
  // pages store
  home,
  login,
  register,
  authentication,
  authorize,
  ip_list,
  user,
  industry,
  update,
  update_store,
  upPassword,
  detail,
  ipSearch,
  industry_detail,

  // user children components
  vip,
  forecast_list,
  calculate_list,
  calculate_result,

  // components store
  nav_store,
  contract,
  message,
  business,
  personal_home,
  ip_need,
  need_detail,
  ecosphere,

  // forecast Data
  add_forecast,
  filter_forecast,
  forecast_detail,
  new_forecast_detail,
  add_calculate,

  ranking,

  // 双十一
  double_eleven,

  vip_card_buy,
  vip_card_buy_detail,
  vip_card_buy_order,
  user_vip_card,
  user_order,
  user_shipping_address,

  user_information,

  gallery_store,
  gallery_detail_store,
  gallery_create_store,
  gallery_manage_store,
  gallery_order_store,
  copyrightCenter,
  buyerOrder,
  orderDetailStore
};
