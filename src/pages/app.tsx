import * as React from "react";
import { Provider } from "mobx-react";
import { HashRouter as Router, Route as R, Switch } from "react-router-dom";
import privateRoute from "@components/private_route";
import diamondsRoute from "@components/diamonds_route";
import forecastRoute from "@components/forecast_route";
import rankingRoute from "@components/ranking_route";
import publicRoute from '@components/public-route';
import Loading from '@pages/loading';
import ScrollRoute from '@components/scroll-route';

import Header from "@components/header";
import Footer from "@components/footer";

import {
  Home, IpList, About, Rights, Rule, User, Use, Detail,
  Login, Register, Authentication, UpdatePassword, Update,
  Download, IpResearch, IpSearch, IndustryDetail,
  Contrast, Ecosphere, HelpCenter, NoMatch, Source, AddCase, IpData,
  MessageCenter, AuthorizedExhibition, PersonalHomepage, PersonalHome, BusinessHomepage,
  IntentionExhibitor, Matchmaking,
  LoginOther, Explain, Load, IpNeeds, NeedsDetail,
  AddForecast, ForecastData, ForecastDetail, NewForecastDetail, FilterForecast,
  AddCalculate, Ranking, DoubleScreen, Introduce, DoubleEleven, VipCardBuy, VipCardBuyDetail, VipCardBuyOrder, Gallery, GalleryDetail, GalleryCreate,
  GalleryManage, GalleryOrder,
  Copyright, CopyrightDetail, BuyerOrderDetail,
} from "../routes";

import trackRoute from '@components/track_route';

const PrivateRoute = privateRoute(R);
const DiamondsRoute = diamondsRoute(R);
const ForecastRoute = forecastRoute(R);
const RankingRoute = rankingRoute(R);
const Route = trackRoute(R);
const PublicRoute = publicRoute(R);

import store from "@stores/index";

import "@assets/fonts/iconfont.css";
import "@assets/fonts2.0/iconfont.css";

export default class App extends React.Component<IComponentProps> {
  public render() {
    return (
      <Router>
        <Provider {...store}>
          <ScrollRoute>
            <React.Suspense fallback={<Loading/>}>
              <PublicRoute component={(props) => <Header {...props}/>}/>

              <Switch>
                <Route path="/" exact component={(props: any) => <Home {...props}/>}/>
                <Route path="/index" exact component={(props: any) => <Home {...props}/>}/>
                <Route path="/ip-list" component={(props: any) => <IpList {...props}/>}/>
                <Route path="/about/:type?" component={(props: any) => <About {...props}/>}/>
                <Route path="/explain" component={(props: any) => <Explain {...props}/>}/>
                <Route path="/about/:type" component={(props: any) => <About {...props}/>}/>
                <Route path="/rights" component={(props: any) => <Rights {...props}/>}/>
                <Route path="/rule" component={(props: any) => <Rule {...props}/>}/>
                <Route path="/use" component={(props: any) => <Use {...props}/>}/>
                <Route path="/detail/:ipTypeNumber/:id" component={(props: any) => <Detail {...props}/>}/>
                <Route path="/login/:type?" component={(props: any) => <Login {...props}/>}/>
                <Route path="/login-other" component={(props: any) => <LoginOther {...props}/>}/>
                <Route path="/register" component={(props: any) => <Register {...props}/>}/>
                <PrivateRoute path="/user/:type" component={(props: any) => <User {...props}/>}/>
                <Route path="/helpCenter/:type" component={(props: any) => <HelpCenter {...props}/>}/>
                <Route path="/authentication" component={(props: any) => <Authentication {...props}/>}/>
                <Route path="/update-password" component={(props: any) => <UpdatePassword {...props}/>}/>
                <PrivateRoute
                  path="/update/:ipTypeNumber?/:id?/:iCheckStatus?"
                  component={(props: any) => <Update {...props}/>}
                />
                <PrivateRoute path="/download" component={(props: any) => <Download {...props}/>}/>
                <Route path="/ip-research" component={(props: any) => <IpResearch {...props}/>}/>
                <Route path="/ip-search/:key?" component={(props: any) => <IpSearch {...props}/>}/>
                <Route path="/industry-detail/:ipid" component={(props: any) => <IndustryDetail {...props}/>}/>
                <Route path="/contrast" component={(props: any) => <Contrast {...props}/>}/>
                <Route path="/source" component={(props: any) => <Source {...props}/>}/>
                <Route path="/ip-data" component={(props: any) => <IpData{...props}/>}/>
                <Route path="/ecosphere" component={(props: any) => <Ecosphere {...props}/>}/>
                <Route path="/add-case/:id?" component={(props: any) => <AddCase {...props}/>}/>
                <PrivateRoute path="/message-center" component={(props: any) => <MessageCenter {...props}/>}/>
                <Route path="/personal-homepage/:id" component={(props: any) => <PersonalHomepage {...props}/>}/>
                <Route path="/personal-home" component={(props: any) => <PersonalHome {...props}/>}/>
                <Route path="/business-homepage/:id?" component={(props: any) => <BusinessHomepage {...props}/>}/>
                <Route path="/intention-exhibitor" component={(props: any) => <IntentionExhibitor {...props}/>}/>
                <Route path="/matchmaking/:matchmaking?" component={(props: any) => <Matchmaking {...props}/>}/>
                <Route
                  path="/authorized-exhibition/:type?"
                  component={(props: any) => <AuthorizedExhibition {...props}/>}
                />
                <Route path="/ip-needs/:id?" component={(props: any) => <IpNeeds{...props}/>}/>
                <Route path="/needs-detail/:id" component={(props: any) => <NeedsDetail{...props}/>}/>
                <ForecastRoute path="/add-forecast/:id?" component={(props: any) => <AddForecast {...props}/>}/>
                <Route path="/filter-forecast/:guid?" component={(props: any) => <FilterForecast {...props}/>}/>
                <ForecastRoute path="/forecast-data" component={(props: any) => <ForecastData {...props}/>}/>
                <Route path="/forecast-detail/:ipids?"
                              component={(props: any) => <ForecastDetail {...props}/>}/>
                <Route path="/new-forecast-detail/:ipids?"
                               component={(props: any) => <NewForecastDetail {...props}/>}/>
                <DiamondsRoute path="/add-calculate/:id?" component={(props: any) => <AddCalculate {...props}/>}/>
                <RankingRoute path="/ranking" component={(props: any) => <Ranking{...props}/>}/>
                <Route path="/loading" component={(props: any) => <Load {...props}/>}/>
                /* 双屏互动页面 */
                <Route path="/double-screen" component={() => <DoubleScreen/>}/>
                <Route path="/introduce/:type?" component={(props: any) => <Introduce {...props}/>}/>

                <Route path="/vip-card-buy" component={(props: any) => <VipCardBuy {...props}/>}/>
                <Route path="/vip-card-buy-detail/:cardId?" component={(props: any) => <VipCardBuyDetail {...props}/>}/>
                <Route path="/vip-card-buy-order/:cardId?" component={(props: any) => <VipCardBuyOrder {...props}/>}/>

                <Route path="/gallery/index" component={(props: any) => <Gallery {...props}/>}/>
                <Route path="/gallery/detail/:identity?/:galleryGuid?" component={(props: any) => <GalleryDetail {...props}/>}/>
                <Route path="/gallery/create/:galleryGuid?" component={(props: any) => <GalleryCreate {...props}/>}/>
                <Route path="/gallery/manage" component={(props: any) => <GalleryManage {...props}/>}/>
                <Route path="/gallery/order/:galleryGuid?/:type?/:duration?/:numMin?/:numMax?/:price?" component={(props: any) => <GalleryOrder {...props}/>}/>
                <PrivateRoute path="/copyright" component={(props: any) => <Copyright {...props}/>}/>
                <PrivateRoute path="/copyright-detail/:orderSn?" component={(props: any) => <CopyrightDetail {...props}/>}/>

                <PrivateRoute path="/buyer-order-detail/:orderSn" component={(props: any) => <BuyerOrderDetail {...props}/>}/>
                {/*双十一优惠下架*/}
                {/*<Route  path="/double-eleven" component={(props: any) => <DoubleEleven {...props}/>}/>*/}
                /* 不准删 */
                <Route path='/404-page' component={() => <NoMatch/>}/>
                <Route component={() => <NoMatch/>}/>
                /* 不准删 */
              </Switch>
              <PublicRoute component={(props) => <Footer {...props}/>}/>
            </React.Suspense>

          </ScrollRoute>
        </Provider>
      </Router>
    );
  }
}
