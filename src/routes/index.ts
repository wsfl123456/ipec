import { lazy } from "react";

const Home = lazy(() => import("@pages/home"));
const Login = lazy(() => import("@pages/login"));
const LoginOther = lazy(() => import("@pages/login-other"));
const Register = lazy(() => import("@pages/register"));
const User = lazy(() => import("@pages/user/index"));
const About = lazy(() => import("@pages/about"));
const Rights = lazy(() => import("@pages/rights"));
const Rule = lazy(() => import("@pages/rule"));
const Use = lazy(() => import("@pages/use"));
const IpList = lazy(() => import("@pages/ip-list"));
const NoMatch = lazy(() => import("@pages/no-match"));
const Load = lazy(() => import("@pages/loading"));
const Detail = lazy(() => import("@pages/detail"));
const Authentication = lazy(() => import("@pages/authentication"));
const UpdatePassword = lazy(() => import("@pages/up-password"));
const IpResearch = lazy(() => import("@pages/ip-research"));
const Update = lazy(() => import("@pages/update"));
// const Update = lazy(() => import("@pages/update_new"));
const IpSearch = lazy(() => import("@pages/ip-search"));
const IndustryDetail = lazy(() => import("@pages/industry-detail"));
const Contrast = lazy(() => import("@pages/contrast"));
const Download = lazy(() => import("@pages/download"));
const Source = lazy(() => import("@pages/source"));
const Ecosphere = lazy(() => import("@pages/ecosphere"));
const HelpCenter = lazy(() => import("@pages/help-center"));
const AddCase = lazy(() => import("@pages/add-case"));
const MessageCenter = lazy(() => import("@pages/message-center"));
const AuthorizedExhibition = lazy(() => import("@pages/authorized-exhibition"));
const PersonalHomepage = lazy(() => import("@pages/personal-homepage"));
const PersonalHome = lazy(() => import("@pages/personal-home"));
const BusinessHomepage = lazy(() => import("@pages/business-homepage"));
const IntentionExhibitor = lazy(() => import("@pages/intention-exhibitor"));
const Explain = lazy(() => import("@pages/explain"));
const Matchmaking = lazy(() => import("@pages/matchmaking"));
const IpData = lazy(() => import("@pages/ip-data"));
const IpNeeds = lazy(() => import("@pages/ip-needs"));
const NeedsDetail = lazy(() => import("@pages/needs-detail"));
const AddForecast = lazy(() => import("@pages/add-forecast"));
const FilterForecast = lazy(() => import("@pages/filter-forecast"));
const ForecastData = lazy(() => import("@pages/forecast-data"));
const ForecastDetail = lazy(() => import("@pages/forecast-detail"));
const NewForecastDetail = lazy(() => import("@pages/new-forecast-detail"));

const AddCalculate = lazy(() => import("@pages/add-calculate"));
const Ranking = lazy(() => import("@pages/ranking"));

const DoubleScreen = lazy(() => import("@pages/double-screen"));
const Introduce = lazy(() => import("@pages/introduce"));
const DoubleEleven = lazy(() => import("@pages/double-eleven"));

const VipCardBuy = lazy(() => import("@pages/vip-card-buy"));
const VipCardBuyDetail = lazy(() => import("@pages/vip-card-buy/components/detail/detail"));
const VipCardBuyOrder = lazy(() => import("@pages/vip-card-buy/components/order/order"));

const Gallery = lazy(() => import("@pages/gallery"));
const GalleryDetail = lazy(() => import("@pages/gallery/components/detail/index"));
const GalleryCreate = lazy(() => import("@pages/gallery/components/create/index"));
const GalleryManage = lazy(() => import("@pages/gallery/components/manage/index"));
const GalleryOrder = lazy(() => import("@pages/gallery/components/order/index"));

// 版权中心
const Copyright = lazy(() => import("@pages/copyright-center/index"));
const CopyrightDetail = lazy(() => import("@pages/copyright-center/components/detail/index"));

// 买方订单详情
const BuyerOrderDetail = lazy(() => import("@pages/buyer-order-detail"));

export {
  Home,
  Login,
  LoginOther,
  Register,
  User,
  About,
  Rights,
  Rule,
  Use,
  IpList,
  NoMatch,
  Load,
  Detail,
  Authentication,
  UpdatePassword,
  IpResearch,
  Update,
  IpSearch,
  IndustryDetail,
  Contrast,
  Download,
  Source,
  IpData,
  Ecosphere,
  HelpCenter,
  AddCase,
  MessageCenter,
  AuthorizedExhibition,
  PersonalHomepage,
  PersonalHome,
  BusinessHomepage,
  IntentionExhibitor,
  Matchmaking,
  Explain,
  IpNeeds,
  NeedsDetail,
  AddForecast,
  ForecastDetail,
  NewForecastDetail,
  FilterForecast,
  ForecastData,
  AddCalculate,
  Ranking,
  DoubleScreen,
  Introduce,
  DoubleEleven,
  VipCardBuy,
  VipCardBuyDetail,
  VipCardBuyOrder,
  Gallery,
  GalleryDetail,
  GalleryCreate,
  GalleryManage,
  Copyright,
  CopyrightDetail,
  BuyerOrderDetail,
  GalleryOrder
};
