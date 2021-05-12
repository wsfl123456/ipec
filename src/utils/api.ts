/**
 * 会员行为轨迹
 * @param ipAddress (string, optional): IP地址 ,
 * @param operatingDate (Timestamp, optional): 操作时间 ,
 * @param operatingPlatform (string, optional): 操作平台：Windows、MAC、Android、IOS ,
 * @param pageName (string, optional): 页面名称 ,
 * @param pageUrl (string, optional): 页面连接 ,
 * @param physicalAddress (string, optional): 操作平台物理IP地址 ,
 * @param platformType (integer, optional): 平台类型：1IP二厂、2IP365X、3小程序 ,
 * @param type (integer, optional): 类型：1banner、2IP、3会员、4案例、5IP筛选器 ,
 * @param userGuid (string, optional): 会员G录
 */
export function reqUserBehavior({
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
                                }
                                  :
                                  {
                                    ipAddress?: string,
                                    operatingDate?: any,
                                    operatingPlatform?: string,
                                    pageName: string,
                                    pageUrl: string,
                                    physicalAddress?: string,
                                    remark?: string,
                                    platformType: number,
                                    type: number,
                                    userGuid?: string,
                                  }
) {
  return $ajax.post("/frontend-behavior-trajectory/save-behavior-trajectory", {
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
}

/**
 * 登录
 * @param userLogin 用户名
 * @param userPass 密码
 * @param userType (integer, optional): 类型:1个人、2企业
 */
export function reqLogin(
  { userLogin, userPass, companyName, userAttribute }: { userLogin: string, userPass: string, companyName?: string, userAttribute: string }
) {
  return $ajax.post("/frontend-user/frontend-login", {
    userLogin,
    userPass,
    userAttribute,
    companyName,
  });
}
/**
 * 登录 - new
 * @param userLogin 用户名
 * @param userPass 密码
 * @param userType (integer, optional): 类型:1个人、2企业
 */
export function reqNewLogin(
  { userLogin, userPass, code, userAttribute }: { userLogin: string, userPass: string, code?: string, userAttribute: string }
) {
  return $ajax.post("/frontend-user/frontend-user-login", {
    userLogin,
    userPass,
    code,
  });
}

// export function reqLogin(params) {
//   return $ajax.get("/frontend-user/frontend-login", params);
// }
/**
 * 注册
 * @param userLogin 登陆名
 * @param userPass  登陆密码
 * @param code 验证码
 * @param companyName
 * @param userAttribute
 * @param type
 */
export function onRegister(
  { userLogin, userPass, code, companyName, userAttribute, type }: { userLogin: string, userPass: string, code: string, companyName: string, userAttribute: string, type: string }
) {
  return $ajax.post("/frontend-user/frontend-register", {
    userLogin,
    userPass,
    code,
    companyName,
    userAttribute,
    type,
  });
}
/**
 * 注册 - new
 * @param userLogin 登陆名
 * @param userPass  登陆密码
 * @param code 验证码
 * @param companyName
 * @param userAttribute
 * @param type
 */
export function onNewRegister(
  { userLogin, userPass, code, companyName, userAttribute, type }: { userLogin: string, userPass: string, code: string, companyName: string, userAttribute: string, type: string }
) {
  return $ajax.post("/frontend-user/frontend-user-registered", {
    userLogin,
    userPass,
    code,
    companyName,
    userAttribute,
    type,
  });
}

/**
 * 获取验证码
 * @param userLogin 登陆名
 * @param receiverType  1手机 2邮箱
 * @param sendType    1注册 2修改密码 3实名认证 4修改绑定 5第三方登陆发送验证码
 */
export function onCodeReg(
  { userLogin, receiverType, sendType }: { userLogin: string, receiverType: Number, sendType: Number }
) {
  return $ajax.post("/frontend-user/send-verification-code", {
    userLogin,
    receiverType,
    sendType
  });
}

/**
 * 第三方登陆接口
 */
export function reqLoginThree(params) {
  let url = `/frontend-user/login-thirdparty?userLogin=${params.userLogin}&code=${params.code}`;
  return $ajax.post(url, params);
}

/**
 * 修改密码
 * @param userGuid 登陆识别码
 * @param oldUserPass 老密码
 * @param userPass    新密码
 */
export function resetPassword(
  { oldUserPass, userGuid, userPass }: { oldUserPass: string, userGuid: string, userPass: string }
) {
  return $ajax.post("/frontend-user/update-password", {
    oldUserPass,
    userGuid,
    userPass
  });
}

/**
 * @param code  验证码
 * @param email   邮箱号码
 * @param mobile  手机号码
 * @param receiverType 1手机 2邮箱
 * @param userGuid  用户凭证
 */
export function editUserInformation(
  { code, email, mobile, receiverType, userGuid }:
    { code: string, email: string, mobile: string, receiverType: number, userGuid: string }
) {
  return $ajax.post("/frontend-user/updata-binding", {
    code,
    email,
    mobile,
    receiverType,
    userGuid,
  });
}

/**
 * 忘记密码提交
 * @param userLogin 登陆名
 * @param code  验证码
 * @param userPass  登陆密码
 */
export function onForgetPassWord(
  { userLogin, code, userPass }: { userLogin: string, code: string, userPass: string }
) {
  return $ajax.post("/frontend-user/forget-password", {
    code,
    userLogin,
    userPass
  });
}

/**
 * 忘记密码申请下一步
 * @param userLogin 登陆名
 * @param code  验证码
 */
export function onForgetPassWordNext(
  { userLogin, code }: { userLogin: string, code: string }
) {
  return $ajax.post("/frontend-user/forget-password-validate", {
    code,
    userLogin,
  });
}

/*
* 请求导航栏
* */
export function reqNavList(params) {
  return $ajax.get("/frontend-index/nav-list", {
    params
  });
}

/**
 * 公示IP接口
 */
export function ipPublic(param) {
  let url = `/frontend-index/list-publicity-ip?currentPage=${param.currentPage}&pageSize=${param.pageSize}`;
  return $ajax.get(url, param);
}

/**
 * 请求 ip 类型列表
 */
export function reqIpTypeList() {
  return $ajax.get("/frontend-ip-library/type-list");
}

export function listMainType() {
  return $ajax.get("/frontend-common/list-main-type");
}

/**
 * 请求 国别信息
 */
export function listCountry() {
  return $ajax.get("/frontend-common/list-country");
}

/**
 * 请求 ip 列表
 */
export function reqIpList() {
  return $ajax.get("/frontend-ip-library/list");
}

/**
 * 请求 ip 选中类型 子分类列表
 */
export function reqIpTypeListTab({
                                   ipTypeSuperiorNumbers,
                                   ipLocation = "", ipTypeNumber = "",
                                   ipFormNumber = "", benginShowDate = "", endShowDate = "",
                                   ipStatus = "", ipSex = "", countryType = "", ipIsAuthenticated,
                                   currentPage, pageSize
                                 }: IStatus) {
  return $ajax.get("/frontend-ip-library/query-list", {
    params: {
      ipTypeSuperiorNumbers,
      ipLocation,
      ipTypeNumber,
      ipFormNumber,
      benginShowDate,
      endShowDate,
      ipStatus,
      countryType,
      ipIsAuthenticated,
      ipSex,
      currentPage,
      pageSize
    }
  });
}

/**
 * 请求 IP 搜索页面
 */
export function reqIpSearch(keyword: string, currentPage: number, pageSize: number, userGuid: string, type: undefined) {
  return $ajax.get("/frontend-index/search", {
    params: {
      keyword,
      currentPage,

      pageSize,
      userGuid,
      type,
    }
  });
}

/**
 * 请求主页大轮播图
 */
export function reqBannerList(params) {
  return $ajax.get("/frontend-index/banner-list", {
    params
  });
}

/**
 * 请求主页模块
 */
export function reqModuleList(params) {
  return $ajax.get("/frontend-index/module-list-new", { params });
}

/**
 * 获取添加 ip 的国家地区和 ip 类型
 */
export function reqCreateCategory() {
  return $ajax.get("");
}

export function reqEditData(id: string) {
  return $ajax.get("", {
    data: { id }
  });
}

/**
 * 获取授权品类接口
 * typeCategory 类型类别:1可授权品类、2已授权品类、3意向授权品类
 */

export function getAuthorize(typeCategory: Number) {
  return $ajax.get(`/frontend-common/list-authorize-type`, {
    params: {
      typeCategory
    }
  });

}

/**
 * 添加ip
 */
export function createIp(type: string, params: object) {
  let url = `/frontend-user-publish/save-ip`;
  return $ajax.post(url, params);
}

export function reqCreateIp(params: object) {
  return $ajax.post('/frontend-user-publish/save-ip', params);
}

export function reqEditIp(params: object) {
  return $ajax.post('/frontend-user-publish/edit-ip', params);
}

/**
 * 编辑ip
 */
export function EditIp(type: string, params: object) {
  let url = `/frontend-user-publish/edit-ip`;
  return $ajax.post(url, params);
}

export function EditIpCheckStatus(type: string, params: object) {
  let url = `/frontend-user-publish/${type}/edit`;
  return $ajax.post(url, params);
}

/**
 * 上传商务资料 IP 编辑
 * file userGuid ipid
 */
export function uploadBusinessData(params) {
  let url = `/frontend-user-publish/upload-material?userGuid=${params.userGuid}&ipid=${params.ipid}&type=${params.type}`;
  return $ajax.post(url, params.file);

}

/**
 * 上传商务资料 IP 新增
 * 1商务资料、2代理协议、3国家版权登记证或境外版权证明文件、4证明IP所有权的相关文件、5经纪合同
 * file userGuid ipid
 */
export function uploadUploadFile(params) {
  let url = `/frontendFileUpload/upload-file?userGuid=${params.userGuid}&type=${params.type}`;
  return $ajax.post(url, params.file);
}

export function getArtDetail(type, params) {
  return $ajax.get(`/frontend-ip-detail/${type}`, {
    params
  });

}

/**
 *  文创详情页面
 */
// export function getArtDetail(
//   { userGuid, ipid }: { userGuid: string, ipid: number }
// ) {
//   return $ajax.get("/frontend-ip-detail/get-cultural", {
//     params: {
//       userGuid, // 登陆要传的参数
//       ipid,
//     }
//   });
//
// }

/**
 * 文创艺术详情页-微博趋势、媒体指数、热度指数接口
 */

export function getArtEchart(
  { dayNumber, ipid, typeId }: { dayNumber: number, ipid: number, typeId: number }
) {
  return $ajax.get('/frontend-ip-detail/get-cultural-dataacquire', {
    params: {
      dayNumber,
      ipid,
      typeId
    }
  });
}

/**
 * 文创猜你喜欢
 */

export function getArtLike(
  { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: string, ipid: string }
) {
  return $ajax.get('/frontend-ip-detail-common/get-love', {
    params: {
      ipTypeSuperiorNumber,
      ipid
    }
  });
}

/**
 * 相关介绍- 影人相关播放量
 * @param ipTypeSuperiorNumber
 * @param ipid
 */
export function getIpPeople(
  { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: string, ipid: number }
) {
  return $ajax.get('frontend-ip-detail-common/get-ip-people', {
    params: {
      ipTypeSuperiorNumber,
      ipid
    }
  });
}

/**
 * GET 下载资料列表GET
 */
export function getDownload(ipid: number) {
  return $ajax.get('/frontend-ip-detail-common/get-material', {
    params: {
      ipid,
    }
  });
}

/**
 *  名人详情页面
 */
export function getStarDetail(
  { userGuid, ipid }: { userGuid: string, ipid: number }
) {
  return $ajax.get("/frontend-ip-detail/get-people", {
    params: {
      userGuid, // 登陆要传的参数
      ipid,
    }
  });
}

/**
 *  名人详情-数据总览-数据平台
 */
export function getDataPlatform(params) {
  return $ajax.get("/frontend-ip-detail-common/get-ip-data-platform", { params });
}

/**
 *  名人详情-数据总览-数据平台-数据
 */
export function getPlatformData(params) {
  return $ajax.get("/frontend-ip-detail-common/get-platform-info", { params });
}

/**
 *  名人详情-粉丝趋势|获赞趋势（新增加平台数据）
 */
export function reqStarFans(params) {
  return $ajax.get("/frontend-ip-detail-common/get-platform-data-acquire", { params });
}

/**
 *  名人详情-粉丝趋势|获赞趋势（新增加平台数据）
 */
export function reqStarFansNew(params) {
  return $ajax.get("/frontend-ip-detail-auth/get-platform-data-acquire", { params });
}

/**
 *  名人详情-展现（新增加平台数据）
 */
export function reqStarRecentWorks(params) {
  return $ajax.get("/frontend-ip-detail-common/get-platform-works-acquire", { params });
}

/**
 *  名人详情-近期作品展现（新增加平台数据）
 */
export function reqStarRecentWorksNew(params) {
  return $ajax.get("/frontend-ip-detail-auth/get-platform-works-acquire", { params });
}

/**
 * GET /frontend-ip-detail-common/get-relevant-portalpost详情页-查询相关案例
 */
export function getPortalpost(
  { ipid, ipTypeSuperiorNumber }: { ipid: number, ipTypeSuperiorNumber: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-relevant-portalpost", {
    params: {
      ipid,
      ipTypeSuperiorNumber
    }
  });
}

/**
 * GET /frontend-portal-post/portalPost-detail 行业案例详情接口
 */
export function getPortalPostDetail(
  { portalPostGuid, userGuid }: { portalPostGuid: string, userGuid?: string }
) {
  return $ajax.get("/frontend-portal-post/portalPost-detail", {
    params: {
      portalPostGuid,
      userGuid,
    }
  });
}

/**
 * POST frontend-portal-post/portalPost-give-like" 行业案例详情接口
 * isLike 1表示点赞 0表示取消点赞
 * portalPostGuid url参数
 */
export function setPortalPostLike(params) {
  const url = `/frontend-portal-post/portalPost-give-like?portalPostGuid=${params.portalPostGuid}&userGuid=${params.userGuid}`;
  return $ajax.post(url, params);
}

/**
 * GET 详情页-关键词云
 */
export function getWordCloub(
  { userGuid, ipid, wordType }: { userGuid: string, ipid: number, wordType: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-word-cloud", {
    params: {
      userGuid,
      ipid,
      wordType
    }
  });
}

/**
 * GET 详情页-关键词云
 */
export function getWordCloubNew(
  { userGuid, ipid, wordType, consumptionToken }: { userGuid: string, ipid: number, wordType: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-word-cloud", {
    params: {
      userGuid,
      ipid,
      wordType,
      consumptionToken
    }
  });
}

/**
 * GET 详情页-关键词云
 */
export function getWordCloubNewFilter(
  { userGuid, ipid, ipids, wordType, consumptionToken }: { userGuid: string, ipid: number, ipids: any, wordType: number, consumptionToken: string }
) {
  return $ajax.get("/fontend-forecast-data-auth/get-word-cloud", {
    params: {
      userGuid,
      ipid,
      ipids,
      wordType,
      consumptionToken
    }
  });
}

/**
 * GET 详情页-代表作
 */
export function getProduction(
  { isUpcoming, ipid, ipName, currentPage, pageSize }: { isUpcoming: number, ipid: number, ipName: string, currentPage?: number, pageSize?: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-ip-production", {
    params: {
      isUpcoming,
      ipid,
      ipName,
      currentPage,
      pageSize,
    }
  });
}

/**
 * GET 详情页-数据总览
 */
export function getTotalData(
  { ipTypeSuperiorNumber, ipid }: { ipTypeSuperiorNumber: number, ipid: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-data-screening", {
    params: {
      ipTypeSuperiorNumber,
      ipid,
    }
  });
}

/**
 * GET 详情页-数据总览
 */
export function getTotalDataNew(
  { ipTypeSuperiorNumber, ipid, consumptionToken, userGuid }: { ipTypeSuperiorNumber: number, ipid: number, consumptionToken: string, userGuid: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-data-screening", {
    params: {
      ipTypeSuperiorNumber,
      ipid,
      consumptionToken,
      userGuid
    }
  });
}

/**
 * 详情页-基础数据-搜索基础数据，互动基础数据，媒体关注基础数据，粉丝趋势;
 */
export function getEchartsData(
  { userGuid, dayNumber, ipid, typeId }: { userGuid?: string, dayNumber: number, ipid: number, typeId: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-data-acquire", {
    params: {
      userGuid,
      dayNumber,
      ipid,
      typeId,
    }
  });
}

/**
 * 详情页-基础数据-搜索基础数据，互动基础数据，媒体关注基础数据，粉丝趋势;
 */
export function getEchartsDataNew(
  { userGuid, dayNumber, ipid, typeId, consumptionToken }: { userGuid?: string, dayNumber: number, ipid: number, typeId: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-data-acquire", {
    params: {
      userGuid,
      dayNumber,
      ipid,
      typeId,
      consumptionToken
    }
  });
}

/**
 * 详情页-基础信息-电影-院线票房趋势;
 */
export function getBoxOfficeDataNew(
  { dayNumber, ipid, consumptionToken, userGuid }: { dayNumber: number, ipid: number, consumptionToken: string, userGuid: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-box-office", {
    params: {
      dayNumber,
      ipid,
      consumptionToken,
      userGuid
    }
  });
}

/**
 * 对比数据-电影-院线票房趋势;
 */
export function getContrastBoxOfficeNew(
  { userGuid, dayNumber, typeId, ipids, consumptionToken }: { userGuid: string, dayNumber: number, typeId: number, ipids: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-datacomparison-auth/list-film-trends", {
    params: {
      userGuid,
      dayNumber,
      typeId,
      ipids,
      consumptionToken
    }
  });
}

/**
 * 详情页- 基础信息-电视剧/综艺播放趋势、电影在线平台趋势
 * @param type
 * @param dayNumber
 * @param ipid
 */
export function getBroadcastTrend(
  { type, dayNumber, ipid }: { type: number, dayNumber: number, ipid: number }
) {
  return $ajax.get('/frontend-ip-detail-common/get-play-trends', {
    params: {
      type,
      dayNumber,
      ipid,
    }
  });
}

/**
 * 详情页- 基础信息-电视剧/综艺播放趋势、电影在线平台趋势
 * @param type
 * @param dayNumber
 * @param ipid
 * @param consumptionToken
 * @param userGuid
 */
export function getBroadcastTrendNew(
  { type, dayNumber, ipid, consumptionToken, userGuid }: { type: number, dayNumber: number, ipid: number, consumptionToken: string, userGuid: string }
) {
  return $ajax.get('/frontend-ip-detail-auth/get-play-trends', {
    params: {
      type,
      dayNumber,
      ipid,
      consumptionToken,
      userGuid
    }
  });
}

/**
 * 详情页-基础信息-口碑信息
 * @param ipid
 */
export function getPublicPraise(
  { ipid }: { ipid: number }
) {
  return $ajax.get('/frontend-ip-detail-common/get-public-praise', {
    params: {
      ipid
    }
  });
}

/**
 * 详情页-基础信息-口碑信息
 * @param ipid
 * * @param consumptionToken
 * @param userGuid
 */
export function getPublicPraiseNew(
  { ipid, consumptionToken, userGuid }: { ipid: number, consumptionToken: string, userGuid: string }
) {
  return $ajax.get('/frontend-ip-detail-auth/get-public-praise', {
    params: {
      ipid,
      consumptionToken,
      userGuid
    }
  });
}

/**
 * 详情页-基础信息-播放平台分布
 * @param ipid
 */
export function getBroadcastPlaform({ ipid }: { ipid: number }) {
  return $ajax.get('/frontend-ip-detail-common/get-playback-platform', {
    params: {
      ipid
    }
  });
}

/**
 * 详情页-基础信息-播放平台分布
 * @param ipid
 * @param consumptionToken
 * @param userGuid
 */
export function getBroadcastPlaformNew({ ipid, consumptionToken, userGuid }: { ipid: number, userGuid: string, consumptionToken: string }) {
  return $ajax.get('/frontend-ip-detail-auth/get-playback-platform', {
    params: {
      ipid,
      consumptionToken,
      userGuid
    }
  });
}

/**
 * 详情页-新闻舆情 默认4个(相关动态 默认3个)
 */
export function getNewsData(
  { ipid, typeId = 7, currentPage = 1, pageSize }: { ipid: number, typeId: number, currentPage?: number, pageSize?: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-acquire-page", {
    params: {
      ipid,
      typeId,
      currentPage,
      pageSize,
    }
  });
}

/**
 *  详情页评估数据- 电视剧预测评分/电影预测票房；
 */
export function getTVAndMovie(params) {
  return $ajax.get("/frontend-ip-detail-common/get-prediction-results", { params });
}

/**
 *  详情页评估数据- 电视剧预测评分/电影预测票房；
 */
export function getTVAndMovieNew(params) {
  return $ajax.get("/frontend-ip-detail-auth/get-prediction-results", { params });
}

/**
 * 详情页评估数据- 地区分布（3 省份 ，4 区域）；
 */
export function getFansArea(
  { userGuid, ipid, typeId }: { userGuid: string, ipid: number, typeId: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-acquire", {
    params: {
      userGuid,
      ipid,
      typeId,
    }
  });
}

/**
 * 详情页评估数据- 地区分布（3 省份 ，4 区域）；
 */
export function getFansAreaNew(
  { userGuid, ipid, typeId, consumptionToken }: { userGuid: string, ipid: number, typeId: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-acquire", {
    params: {
      userGuid,
      ipid,
      typeId,
      consumptionToken
    }
  });
}

/**
 * - 地区分布（3 省份 ，4 区域）；
 */
export function getFansAreaNewFilter(
  { userGuid, ipid, ipids, typeId, consumptionToken }: { userGuid: string, ipid: number, typeId: number, ipids: any, consumptionToken: string }
) {
  return $ajax.get("/fontend-forecast-data-auth/get-acquire", {
    params: {
      userGuid,
      ipid,
      ipids,
      typeId,
      consumptionToken
    }
  });
}

/**
 * 对比数据- 地区分布（3 省份 ，4 区域）；
 */
export function getAreaData(
  { userGuid, ipids, typeId }: { userGuid: string, ipids: string, typeId: number }
) {
  return $ajax.get("/frontend-datacomparison/list-regional-distribution", {
    params: {
      userGuid,
      ipids,
      typeId,
    }
  });
}

/**
 * 对比数据- 地区分布（3 省份 ，4 区域）；
 */
export function getAreaDataNew(
  { userGuid, ipids, typeId, consumptionToken }: { userGuid: string, ipids: string, typeId: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-datacomparison-auth/list-regional-distribution", {
    params: {
      userGuid,
      ipids,
      typeId,
      consumptionToken
    }
  });
}

/**
 * 详情页评估数据-受众画像（1 年龄,2 性别）
 * @param userGuid
 * @param ipid
 * @param typeId
 */
export function getAgeSexArea(
  { userGuid, ipid, typeId }: { userGuid: string, ipid: number, typeId: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-assess-acquire", {
    params: {
      userGuid,
      ipid,
      typeId,
    }
  });
}

/**
 * 基础数据平台列表
 * @params.moduleNumber  模块编号
 * 1在线平台趋势 2衍生品销售数据 3社交平台数据总览 4粉丝趋势
 * 5社交平台近期作品数据 6搜索基础数据 7媒体关注基础数据
 */
export function ReqBasicPlatformList(
  { userGuid, consumptionToken, ipid, moduleNumber }: { userGuid: string, consumptionToken: string, ipid: number, moduleNumber: number }
) {
  return $ajax.get('/frontend-ip-detail-auth/get_platforms_list', {
    params: {
      userGuid,
      consumptionToken,
      ipid,
      moduleNumber,
    }
  });
}

/**
 * 基础数据平台数据
 * @params.moduleNumber
 *  1在线平台趋势 2衍生品销售数据 3社交平台数据总览 4粉丝趋势 5社交平台近期作品数据 6搜索基础数据
 *  7媒体关注基础数据  8数据总览 、 票房总览 9电影口碑数据 10获取电影票房趋势
 */
export function ReqBasicPlatform(
  {
    userGuid,
    consumptionToken,
    ipTypeSuperiorNumber,
    ipid,
    moduleNumber,
    platformNumber,
    type,
    currentPage,
    pageSize
  }: {
    userGuid: string,
    consumptionToken: string,
    ipTypeSuperiorNumber: number,
    ipid: number,
    moduleNumber: number,
    platformNumber: number,
    type?: number,
    currentPage?: number,
    pageSize?: number,
  }
) {
  return $ajax.get('/frontend-ip-detail-auth/get_platforms_data', {
    params: {
      userGuid,
      consumptionToken,
      ipTypeSuperiorNumber,
      ipid,
      moduleNumber,
      platformNumber,
      type,
      currentPage,
      pageSize,
    }
  });
}

/**
 * 详情页评估数据-受众画像（1 年龄,2 性别）
 * @param userGuid
 * @param ipid
 * @param typeId
 * @param consumptionToken
 */
export function getAgeSexAreaNew(
  { userGuid, ipid, typeId, consumptionToken }: { userGuid: string, ipid: number, typeId: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-assess-acquire", {
    params: {
      userGuid,
      ipid,
      typeId,
      consumptionToken
    }
  });
}

/**
 * 评估详情页-商业价值评估
 */
export function getBusniess(
  { userGuid, ipid, ipTypeSuperiorNumber }: { userGuid: string, ipid: number, ipTypeSuperiorNumber: number }
) {
  return $ajax.get("/frontend-ip-detail-common/get-business-value", {
    params: {
      userGuid,
      ipid,
      ipTypeSuperiorNumber
    }
  });
}

/**
 * 评估详情页-商业价值评估
 */
export function getBusniessNew(
  { userGuid, ipid, ipTypeSuperiorNumber, consumptionToken }: { userGuid: string, ipid: number, ipTypeSuperiorNumber: number, consumptionToken: string }
) {
  return $ajax.get("/frontend-ip-detail-auth/get-business-value", {
    params: {
      userGuid,
      ipid,
      ipTypeSuperiorNumber,
      consumptionToken
    }
  });
}

/**
 * POST  关注/取消关注IP  只有登陆状态下可操作
 */

export function getFollow(
  { userGuid, isFollow, guid, type }: { userGuid: string, isFollow: number, guid: string, type: number }
) {
  return $ajax.post("/frontend-user-publish/update-focus", {
    userGuid,
    isFollow,
    guid,
    type,
  });
}

/**
 * 上传文件  包括图片
 */
export function upload(params) {
  // let url = `/frontendFileUpload/upload?isImage=${params.isImage}&isFullPath=${params.isFullPath}`;
  let url = `/frontendFileUpload/upload`;
  // return  $ajax.post(url, params.file);
  return $ajax.post(url, params);
}

/**
 * 根据ipid 获取update 的详情
 */

export function getIpDetail(
  { ipid, ipTypeNumber, userGuid }: { ipid: number, ipTypeNumber: number, userGuid: any }
) {
  let url = "/frontend-user-publish/get-ip-edit";
  return $ajax.get(url, {
    params: {
      userGuid,
      ipid,
      ipTypeSuperiorNumber: ipTypeNumber
    }
  });
}

/**
 * 下载商务资料
 */
export function getDownloadMaterial(params) {
  let url = `/frontend-user-publish/download-material?materialGuid=${params.materialGuid}&userGuid=${params.userGuid}`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-邀请
 */

export function companyInviteStaff({ companyDepartment, companyPosition, userRealName, contactInformation, companyGuid }: { companyDepartment: string, companyPosition: string, userRealName: string, contactInformation: any, companyGuid: string }) {
  let url = `/frontend-user/frontend-company-invite-staff`;
  return $ajax.post(url, {
    companyGuid,
    companyDepartment,
    companyPosition,
    userRealName,
    contactInformation,
  });
}

/**
 *  企业员工-待审核职员-职员列表 --------
 * addType (integer, optional): 1申请2邀请 ,
 * auditStatus (integer, optional): 审核状态1通过2审核中3拒绝 ,
 * companyDepartment (string, optional): 公司部门 ,
 * companyGuid (string, optional): 公司guid ,
 * companyPosition (string, optional): 公司岗位 ,
 *  createDate (Timestamp, optional): 创建时间 ,
 *  id (integer, optional): 主键 ,
 *  ids (Array[integer], optional): id集合 ,
 *  picUrl (string, optional): 头像url ,
 *  realStatus (integer, optional): 实名认证状态 ,
 *  refuseReason (string, optional): 拒绝原因 ,
 *  sex (integer, optional): 性别 ,
 *  userGuid (string, optional): 对应用户表guid ,
 *  userRealName (string, optional): 真实名称
 */

export function verifyStaff(userGuid) {
  let url = `/frontend-user/wait-verify-staff`;
  return $ajax.get(url, {
    params: {
      userGuid,
    }
  });
}

/**
 *  企业员工-待审核职员-批量接受
 * 参数不确定
 */

export function acceptStaff(params) {
  let url = `/frontend-user/batch-accept-staff`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-待审核职员-批量拒绝
 * 参数不确定
 */

export function refuseStaff(params) {
  let url = `/frontend-user/batch-refuse-staff`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-审核通过列表  --------
 */

export function myStaff(userGuid, currentPage, pageSize) {
  let url = `/frontend-user/frontend-my-staff`;
  return $ajax.get(url, {
    params: {
      userGuid, currentPage, pageSize
    }
  });
}

/**
 *  企业员工-编辑员工上传的接口
 *  参数不详
 */

export function editStaff(params) {
  let url = `/frontend-user/edit-staff-info`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-批量删除员工
 * 参数不详
 */

export function deleteStaff(params) {
  let url = `/frontend-user/batch-delete-staff`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-批量添加参展人员1.0
 * 参数不详
 */

export function saveExhibitionStaff(params) {
  let url = `/frontend-user/batch-save-exhibition-people`;
  return $ajax.post(url, params);
}

/**
 *  企业员工-批量删除参展人员1.0
 * 参数不详
 */

export function deleteExhibitionStaff(params) {
  let url = `/frontend-user/batch-delete-exhibition-people`;
  return $ajax.post(url, params);
}

/**
 *  删除商务资料接口
 */

export function delMaterial(params) {
  let url = `/frontend-user-publish/del-material?materialGuid=${params.materialGuid}&userGuid=${params.userGuid}`;
  return $ajax.post(url, params);
}

/**
 *  上传海报
 */
export function savePic({ file, picType }) {
  const url = `/frontendFileUpload/savePic?picType=${picType}`;
  return $ajax.post(url, file);
}

/**
 * （IP编辑）平台类型接口
 * companyType：平台类型:1在线播放平台，2首播电视平台，3小说连载平台
 * company
 */
export function listPlatform(ipPlatformType) {
  const url = `/frontend-common/list-platform?ipPlatformType=${ipPlatformType || ''}`;
  return $ajax.get(url);
}

/**
 * （经济）公司列表接口
 * companyType：公司类型：1出品公司(制作公司)，2发行公司，3代理方，4出版社，5投资公司,6宣发公司、7版权方、8品牌方、9授权方、10零售商、11服务商"
 * company
 */
export function listCompany(params) {
  const { companyName, currentPage, companyType, pageSize } = params;
  const url = `/frontend-user-publish/list-company?companyName=${companyName || ''}&companyType=${companyType || ''}&currentPage=${currentPage || 1}&pageSize=${pageSize || 30}`;
  return $ajax.get(url);
}

/**
 * GET
 * 获取我的更新ip
 */
export function getMyUpdate(params) {
  const url = '/frontend-user-publish/get-new-my-edit';
  return $ajax.get(url, {
    params
  });
}

/**
 * 获取国家号
 */

export function getCountryCode() {
  const url = '/frontend-common/list-country-number';
  return $ajax.get(url);
}

/**
 * 获取区号
 */

export function getAreaCode() {
  const url = '/frontend-common/list-area-code';
  return $ajax.get(url);
}

/**
 * 企业实名认证
 */

export function companyVrified(params) {
  const url = '/frontend-user/frontend-company-vrified';
  return $ajax.post(url, params);
}
/**
 * 企业实名认证 - new
 */

export function companyNewVrified(params) {
  const url = '/frontend-user/frontend-user-company-vrified';
  return $ajax.post(url, params);
}

/**
 * 企业实名认证 信息
 */

export function companyVrifiedInfo(userGuid) {
  const url = '/frontend-user/frontend-company-vrified-info';
  return $ajax.get(url, {
    params: {
      userGuid
    }
  });
}

/**
 * 个人实名认证信息
 */

export function personalVrifiedinfo(userGuid) {
  const url = '/frontend-user/frontend-personal-vrified-info';
  return $ajax.get(url, {
    params: {
      userGuid
    }
  });
}

/**
 * 个人实名认证
 */

export function personalVrified(params) {
  const url = '/frontend-user/frontend-personal-vrified';
  return $ajax.post(url, params);
}
/**
 * 个人实名认证 - new
 */

export function personalNewVrified(params) {
  const url = '/frontend-user/frontend-user-personal-vrified';
  return $ajax.post(url, params);
}
/**
 * 个人实名认证 - new
 */

 export function personEnterPrise(userGuid) {
  const url = '/frontend-user/personal-turn-enterprise';
  return $ajax.get(url, {
    params: {
      userGuid
    }
  });
}
/**
 * 用户状态判断 - new
 */

 export function userPrejudgment(userGuid) {
  const url = '/frontend-user/user-prejudgment';
  return $ajax.get(url, {
    params: {
      userGuid
    }
  });
}


/**
 * 实名认证
 */
export function RealNameAuthentication(
  { papersPicGuid, papersPositivePicGuid, picGuid, userGuid, userRealName }: { papersPicGuid: string, papersPositivePicGuid: string, picGuid: string, userGuid: string, userRealName: string }
) {
  const url = '/frontend-user/realname-authentication';
  return $ajax.post(url, {
    papersPicGuid, papersPositivePicGuid,
    picGuid,
    userGuid,
    userRealName
  });
}

/**
 * GET
 * 获取我的案例
 */
export function getMyCase(params) {
  const url = '/frontend-user-portalpost/list-my-portalpost';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 获取我的案例标签
 */
export function getMyCaseLabel(params) {
  const url = '/frontend-user-portalpost/list-portalcategory';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 获取关联IP
 */
export function getRelationIP(params) {
  const url = '/frontend-user-portalpost/list-ip';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 获取关联品牌
 */
export function getRelationBrand(params) {
  const url = '/frontend-user-portalpost/list-brand';
  return $ajax.get(url, {
    params
  });
}

/**
 * Post 删除我的案例
 */
export function deleteMyCase(params) {
  let url = `/frontend-user-portalpost/del-my-portalposts?userGuid=${params.userGuid}&portalPostGuids=${params.portalPostGuids}`;
  return $ajax.post(url, params);
}

/**
 * 发布新 案例
 */
export function addNewCase(params: object) {
  let url = `/frontend-user-portalpost/save-portalpost`;
  return $ajax.post(url, params);
}

/**
 * 修改发布的案例
 */
export function UpdateNewCase(params: object) {
  let url = `/frontend-user-portalpost/update-portalpost`;
  return $ajax.post(url, params);
}

/**
 * 获取发布案例的详情
 */

export function getCaseDetail(params) {
  let url = `/frontend-user-portalpost/get-my-portalpost?portalPostGuid=${params.portalPostGuid}`;
  return $ajax.post(url, params);
}

/**
 * GET
 * 获取会员列表
 */
export function getListUser(params) {
  const url = '/frontendHomepage/list-user';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 获取企业列表
 */
export function getListCompany(params) {
  const url = '/frontendHomepage/list-company';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 1企业类别、2企业经营业务、3所属行业、4企业规模、5企业性质、6证件类型、7参展目的、8意向参展面积、9可授权区域、10预约登记经营业务、 11 承接设计类型   ，  12 擅长领域
 */
export function getCompanyType(params) {
  const url = '/frontend-common/list-company-type';
  return $ajax.get(url, {
    params
  });
}

/**
 * GET
 * 获取我的关注List
 */
export function getMyFollow(params) {
  const url = '/frontend-user/frontend-my-focus';
  return $ajax.get(url, {
    params
  });
}

/**
 * POST  修改个人信息
 * academicTitle (string, optional): 职称 ,
 * address (string, optional): 住址 ,
 * awards (string, optional): 荣获奖项，多个用分号隔开 ,
 * birthday (Timestamp, optional): 生日 ,
 * companyDepartment (string, optional): 公司部门 ,
 * companyGuid (string, optional): 所在公司 ,
 * companyName (string, optional): 公司名称 ,
 * education (integer, optional): 学历：1博士及以上，2硕士及以上，3本科，4大专，5高中及以上 ,
 * fans (integer, optional): 粉丝 ,
 * focus (integer, optional): 关注 ,
 * graduationSchool (string, optional): 毕业院校 ,
 * id (integer, optional): 主键 ,
 * interestCategory (string, optional): 兴趣品类 ,
 * isApply (string, optional): 是否申请公司 1已申请（审核中或审核通过）2未申请，无申请记录 ,
 * mailbox (string, optional): 邮箱 ,
 * mailboxSettingsVisible (integer, optional): 邮箱设置可见：0自己可见，1所有人可见 ,
 * occupation (string, optional): 职业 ,
 * paperworkNumber (string, optional): 证件号 ,
 * paperworkType (integer, optional): 证件类型 ,
 * phoneNumber (string, optional): 手机号 ,
 * phoneSettingsVisible (integer, optional): 手机号设置可见：0自己可见，1所有人可见 ,
 * picGuid (string, optional): 头像 ,
 * picUrl (string, optional): 头像url ,
 * pictureMaterial (string, optional): 证件图片材料 ,
 * qqNumber (string, optional): QQ号码 ,
 * qqSettingsVisible (integer, optional): QQ号码设置可见：0自己可见，1所有人可见 ,
 * realStatus (integer, optional): 实名认证状态,1已实名，2未实名、3审核中 ,
 * sex (integer, optional): 0:保密,1:男,2:女 ,
 * tags (string, optional): 标签 ,
 * userDesc (string, optional): 个人简介 ,
 * userGuid (string, optional): 对应用户表guid ,
 * userLogin (string, optional): 登录名 ,
 * userNickname (string, optional): 昵称 ,
 * userPass (string, optional): 登录密码 ,
 * userRealName (string, optional): 用户真实姓名 ,
 * wechatNumber (string, optional): 微信号码 ,
 * wechatSettingsVisible (integer, optional): 微信号码设置可见：0自己可见，1所有人可见
 */
export function setUserInformation(params) {
  return $ajax.post("/frontend-user/update-frontend-user-personal", params);
}

export function setCompanyInformation(params) {
  return $ajax.post("/frontend-user/update-frontend-user-company", params);
}

/**
 * 获取公司信息
 * @param userGuid
 */
export function getCompanyInfo(userGuid: string) {
  let url = `/frontend-user/get-user-company-info`;
  return $ajax.get(url, {
    params: {
      userGuid
    }
  });
}

/**
 * 获取公司相关信息
 * 1企业类别、2企业经营业务、3所属行业、4企业规模、5企业性质、6证件类型
 */
export function getCompanytype(type: number) {
  let url = `/frontend-common/list-company-type`;
  return $ajax.get(url, {
    params: {
      type
    }
  });
}

/**
 * 获取个人信息
 */

export function getUserInfo(userGuid: string) {
  let url = '/frontend-user/get-user-personal-info';
  return $ajax.get(url, { params: { userGuid } });
}

// /**
//  * 获取个人信息
//  * @param userGuid
//  */
// export  function getUserInfo(
//   userGuid: string
// ) {
//   let url = '/frontend-user/get-user-info';
//   return  $ajax.get(url, {
//     params: {
//       userGuid,
//     }
//   });
// }

/**
 * ip 一级分类
 */
export function firstOrder() {
  let url = "/frontend-portal-post/one-type-list";
  return $ajax.get(url);
}

/**
 * 行业分类
 */
export function industryOrder() {
  let url = "/frontend-portal-post/portalCategory/list";
  return $ajax.get(url);
}

/**
 * 行业案列列表
 * @param params
 */
export function industryCase(params) {
  let url = `/frontend-portal-post/list`;
  return $ajax.get(url, {
    params
  });
}

/**
 * 我发布的ip
 * @param params
 */
export function myRelease(params) {
  let url = "frontend-user-publish/list-new-my-publish";
  return $ajax.get(url, {
    params
  });
}

/**
 * 删除我发布的ip
 * @param params
 */
export function deleteMyRelease(params) {
  let url = `frontend-user-publish/del-my-ips?userGuid=${params.userGuid}&ipids=${params.ipids}`;
  return $ajax.post(url, params);
}

/**
 * 删除我编辑的的ip
 * @param params
 */
export function deleteMyUpdate(params) {
  return $ajax.post(`/frontend-user-publish/del-my-edit-ip?userGuid=${params.userGuid}&approvalGuid=${params.approvalGuid}`, params);
}

export function hotWords(params) {
  let url = 'frontend-portal-post/portalHotWords/list';
  return $ajax.get(url, { params });
}

/**
 * 详情页-ip相关介绍
 */
export function getDetail(
  { userGuid, ipTypeSuperiorNumber, ipid }: { userGuid?: string, ipTypeSuperiorNumber: string, ipid: string }
) {
  let url = "/frontend-ip-detail/get-ip-detail";
  return $ajax.get(url, {
    params: {
      userGuid,
      ipTypeSuperiorNumber,
      ipid
    }
  });
}

/**
 * 提交企业认证
 * @param params
 */
export function companyCerfication(params) {
  let url = '/frontend-user/company-authentication';
  return $ajax.post(url, params);
}

/**
 * 对比数据平台列表
 * @params.moduleNumber  模块编号
 * 3衍生品 4社交平台数据总览 5粉丝趋势
 * 6搜索基础数据 7媒体关注基础数据
 */
export function ReqContrastPlatformList(
  { userGuid, consumptionToken, ipids, moduleNumber }: { userGuid: string, consumptionToken: string, ipids: number, moduleNumber: number }
) {
  return $ajax.get('/frontend-datacomparison-auth/get_contrast_platforms_list', {
    params: {
      userGuid,
      consumptionToken,
      ipids,
      moduleNumber,
    }
  });
}

/**
 * 对比数据平台数据
 * @params.moduleNumber
 *  1、数据总览/票房总览、2院线票房趋势、3衍生品平台获取、 4社交平台数据总览、5粉丝趋势、6搜索基础数据 、7、媒体关注基础数据
 */
export function ReqContrastPlatform(
  {
    userGuid,
    consumptionToken,
    ipTypeSuperiorNumber,
    ipids,
    moduleNumber,
    platformNumber,
    type,
  }: {
    userGuid: string,
    consumptionToken: string,
    ipTypeSuperiorNumber: number,
    ipids: number,
    moduleNumber: number,
    platformNumber: number,
    type?: number,
  }
) {
  return $ajax.get('/frontend-datacomparison-auth/get_contrast_platforms_data', {
    params: {
      userGuid,
      consumptionToken,
      ipTypeSuperiorNumber,
      ipids,
      moduleNumber,
      platformNumber,
      type,
    }
  });
}
/**
 * 对比数据 关键词云
 */
export function getWbWord(
  { userGuid, ipids }: { userGuid?: string, ipids: string }
) {
  let url = `/frontend-datacomparison/list-wb-word?userGuid=${userGuid}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 对比数据 关键词云
 */
export function getWbWordNew(
  { userGuid, ipids, consumptionToken }: { userGuid?: string, ipids: string, consumptionToken: string }
) {
  // let url = `/frontend-datacomparison-auth/list-wb-word?userGuid=${userGuid}&ipids=${ipids}&consumptionToken=${consumptionToken}`;
  let url = `/frontend-datacomparison-auth/list-wb-word`;
  return $ajax.get(url, {
    params: {
      userGuid,
      ipids,
      consumptionToken
    }
  });
}

/**
 * 口碑信息 对比
 */
export function getPraise(
  { userGuid, ipids }: { userGuid?: string, ipids: string }
) {
  let url = `/frontend-datacomparison/list-public-praise?userGuid=${userGuid}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 口碑信息 对比
 */
export function getPraiseNew(
  { userGuid, ipids, consumptionToken }: { userGuid?: string, ipids: string, consumptionToken: string }
) {
  let url = `/frontend-datacomparison-auth/list-public-praise?userGuid=${userGuid}&ipids=${ipids}&consumptionToken=${consumptionToken}`;
  return $ajax.get(url, {});
}

/**
 * 院线电影票房 对比
 */
export function getBoxOffice(
  { userGuid, ipids }: { userGuid?: string, ipids: string }
) {
  let url = `/frontend-datacomparison/list-box-office?userGuid=${userGuid}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 对比数据 影视综在线平台数据对比
 * 1播放量、2热度
 */
export function getPlayTrends(
  { userGuid, type, ipids }: { userGuid?: string, ipids: string, type: string }
) {
  let url = `/frontend-datacomparison/list-play-trends?userGuid=${userGuid}&type=${type}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 对比数据 商业价值
 */
export function getbusiness(
  { userGuid, ipTypeSuperiorNumber, ipids }: { userGuid?: string, ipids: string, ipTypeSuperiorNumber: string }
) {
  let url = `/frontend-datacomparison/list-business-value?userGuid=${userGuid}&ipTypeSuperiorNumber=${ipTypeSuperiorNumber}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 对比数据 商业价值
 */
export function getbusinessNew(
  { userGuid, ipTypeSuperiorNumber, ipids, consumptionToken }: { userGuid?: string, ipids: string, ipTypeSuperiorNumber: string, consumptionToken: string }
) {
  let url = `/frontend-datacomparison-auth/list-business-value`;
  return $ajax.get(url, {
    params: {
      userGuid, ipTypeSuperiorNumber, ipids, consumptionToken
    }
  });
}

/**
 * 评估数据对比接口——受众画像
 * typeId 2性别、1年龄
 */
export function getPortrait(
  { userGuid, typeId, ipids }: { userGuid?: string, ipids: string, typeId: string }
) {
  let url = `/frontend-datacomparison/list-assess-acquire?userGuid=${userGuid}&typeId=${typeId}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 评估数据对比接口——受众画像
 * typeId 2性别、1年龄
 */
export function getPortraitNew(
  { userGuid, typeId, ipids, consumptionToken }: { userGuid?: string, ipids: string, typeId: string, consumptionToken: string }
) {
  let url = `/frontend-datacomparison-auth/list-assess-acquire`;
  return $ajax.get(url, {
    params: {
      userGuid, typeId, ipids, consumptionToken
    }
  });
}

/**
 * 基础数据对比接口-数据总揽
 *
 * typeId: 搜索基础指数(5百度搜索指数、6搜狗搜索指数)、互动基础数据(41微博超话帖子数、40微博超话阅读数、9微博话题阅读数、10微博话题帖子数)、
 * 媒体关注基础数据(13百度咨询指数、8微信公众号文章数、15微信热度指数)、粉丝趋势(14微博粉丝数、33贴吧粉丝数 、微博超话粉丝数 42)
 */
export function getAcquire(
  { userGuid, typeId, ipids, dayNumber }: { userGuid?: string, dayNumber: string, typeId: string, ipids: string }
) {
  let url = `/frontend-datacomparison/list-data-acquire?userGuid=${userGuid}&typeId=${typeId}&ipids=${ipids}&dayNumber=${dayNumber}`;
  return $ajax.get(url, {});
}

/**
 * 基础数据对比接口-数据总揽
 *
 * typeId: 搜索基础指数(5百度搜索指数、6搜狗搜索指数)、互动基础数据(41微博超话帖子数、40微博超话阅读数、9微博话题阅读数、10微博话题帖子数)、
 * 媒体关注基础数据(13百度咨询指数、8微信公众号文章数、15微信热度指数)、粉丝趋势(14微博粉丝数、33贴吧粉丝数 、微博超话粉丝数 42)
 */
export function getAcquireNew(
  { userGuid, typeId, ipids, dayNumber, consumptionToken }: { userGuid?: string, dayNumber: string, typeId: string, ipids: string, consumptionToken: string }
) {
  let url = `/frontend-datacomparison-auth/list-data-acquire?userGuid=${userGuid}&typeId=${typeId}&ipids=${ipids}&dayNumber=${dayNumber}&consumptionToken=${consumptionToken}`;
  return $ajax.get(url, {});
}

/**
 * 基础数据对比接口-数据总揽
 */
export function getScreening(
  { userGuid, ipTypeSuperiorNumber, ipids }: { userGuid?: string, ipTypeSuperiorNumber: string, ipids: string }
) {
  let url = `/frontend-datacomparison/list-data-screening?userGuid=${userGuid}&ipTypeSuperiorNumber=${ipTypeSuperiorNumber}&ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * 基础数据对比接口-数据总揽
 */
export function getScreeningNew(
  { userGuid, ipTypeSuperiorNumber, ipids, consumptionToken }: { userGuid?: string, ipTypeSuperiorNumber: string, ipids: string, consumptionToken: string }
) {
  let url = `/frontend-datacomparison-auth/list-data-screening?userGuid=${userGuid}&ipTypeSuperiorNumber=${ipTypeSuperiorNumber}&ipids=${ipids}&consumptionToken=${consumptionToken}`;
  return $ajax.get(url, {});
}

/**
 * 基础IP数据集合接口
 */
export function getlistIp(
  { ipids }: { ipids: string }
) {
  let url = `/frontend-datacomparison/list-ip?ipids=${ipids}`;
  return $ajax.get(url, {});
}

/**
 * GET /frontend-common/list-company-ip获取企业IP接口
 * @param companyGuid
 */
export function getCompanyIp({ companyGuid }: { companyGuid: string }) {
  return $ajax.get('/frontend-common/list-company-ip', {
    params: {
      companyGuid
    }
  });
}

/**
 * 获取企业信息
 * @param userGuid
 */
export function getCompany({ companyGuid }: { companyGuid: string }) {
  return $ajax.get(`/frontend-common/get-company`, {
    params: {
      companyGuid
    }
  });
}

/**
 * blance.xue
 * 添加日程
 * @param params
 */
export function saveSchedue(params) {
  return $ajax.post('/userSchedule/save', params);

}

/**
 * 日程
 * @param params  displayType:展示类型：0按月展示，1按周展示，2按天展示
 */
export function scheduleList(params) {
  return $ajax.get(`/userSchedule/list?userGuid=${params.userGuid}&displayType=${params.displayType}&chooseDate=${params.chooseDate}`,
    {});

}

/**
 * blance.xue
 * 编辑日程
 * @param params
 */
export function updateSchedule(params) {
  return $ajax.post('/userSchedule/update', params);
}

/**
 * blance.xue
 * 删除日程
 */
export function removeSchedule(param) {
  return $ajax.post('/userSchedule/remove', param);
}

/**
 * blance.xue
 * 发出的邀约列表
 */
export function invitationsList(
  { userGuid, invitationDate, title, invitationStatus, currentPage, pageSize }:
    { userGuid: string, invitationDate?: string, title?: string, invitationStatus?: number, currentPage: number, pageSize: number }
) {
  return $ajax.get('/exhibition-invitation/send-list', {
    params: {
      userGuid,
      invitationDate,
      title,
      invitationStatus,
      currentPage,
      pageSize,
    }
  });
}

/**
 * 邀请人拒绝原因
 */
export function inviterRefuseUrl(params) {
  const url = `/exhibition-invitation/refuse/invitation-personnel`;
  return $ajax.post(url, params);
}

/**
 * 邀请人接受修改
 * @param invitationGuid
 */
export function inviterAccpetUrl({ invitationGuid }: { invitationGuid: string }) {
  const url = `/exhibition-invitation/agree/invitation-personnel`;
  return $ajax.post(url, { invitationGuid });
}

/**
 * blance.xue
 * 站内消息
 * @param params
 * messageType: 1私信2关注3系统
 * isRead:0未读1已读
 */
export function privateLetter(
  {
    userGuid,
    isRead,
    messageType,
    currentPage,
    pageSize
  }: {
    userGuid: string,
    isRead?: number | string,
    messageType?: number | string,
    currentPage: number,
    pageSize: number,
  }
) {
  return $ajax.get(`/frontend-user/get-private-letters`, {
    params: {
      userGuid,
      messageType,
      isRead,
      currentPage,
      pageSize,
    }
  });
}

/**
 * blance.xue
 * 消息盒
 */
export function messageBox(params) {
  return $ajax.get(`/frontend-user/frontend-message-box?userGuid=${params.userGuid}`, {});
}

/**
 * blance.xue
 * 设置全部消息已读
 */
export function messageReaded(userGuid) {
  return $ajax.get(`/frontend-user/all-private-letters-read?userGuid=${userGuid}`, {});
}

/**
 * 展会列表接口
 */
export function exhibitionList() {
  return $ajax.get(`/exhibition/list`, {});
}

/**
 * 商贸配对接口-分页
 */
export function matchMakingListFirst(
  { loginUserGuid, exhibitionGuid, currentPage, pageSize }:
    { loginUserGuid: string, exhibitionGuid: string, currentPage: number, pageSize: number }
) {
  let url = '/exhibition/match-making-company-list';
  return $ajax.get(url, {
    params: {
      loginUserGuid,
      exhibitionGuid,
      currentPage,
      pageSize
    }
  });
}

/**
 * 商贸配对接口-搜索
 * exhibitionGuid,  展示GUID
 * userGuid,   展会人员
 * exhibitionCompanyGuid, 展会公司guid
 * ipid,
 */
export function matchMakingList(
  { exhibitionGuid, userGuid, exhibitionCompanyGuid, ipid, loginUserGuid }:
    { exhibitionGuid: string, userGuid?: string, exhibitionCompanyGuid?: string, loginUserGuid: string, ipid?: any }
) {
  let url = '/exhibition/match-making-list';
  return $ajax.get(url, {
    params: {
      exhibitionGuid,
      loginUserGuid,
      userGuid,
      exhibitionCompanyGuid,
      ipid,
    }
  });
}

/**
 * GET /exhibition/search-exhibition-list
 * 参展检索列表接口
 */
export function matchSearchList(params) {
  return $ajax.get('/exhibition/search-exhibition-list', { params });
}

/**
 * 参赛公司IP的 列表接口
 * exhibitionGuid //展会GUID
 * exhibitionCompanyGuid 展会公司GUID
 * userGuid 展会人员 GUID
 * ipid
 */
export function matchIpList(exhibitionGuid) {
  return $ajax.get(`/exhibition/company-ip-list`, { params: { exhibitionGuid } });
}

/**
 * 参赛公司IP的 列表接口
 */
export function matchCompanyList(exhibitionGuid) {
  return $ajax.get(`/exhibition/company-list`, {
    params: {
      exhibitionGuid,
    }
  });
}

/**
 * 参赛公司IP的 列表接口
 */
export function matchPersonList(exhibitionGuid) {
  return $ajax.get(`/exhibition/company-personnel-list`, {
    params: {
      exhibitionGuid,
    }
  });
}

/**
 * 发起邀约接口
 * exhibitionCompanyGuid 展会公司GUID
 * exhibitionGuid 展会GUID
 * invitationContactInformation 联系方式
 * invitationNotifyContact 是否告知联系方式 1 是 2 否
 * invitationDate 邀约日期
 * invitationPersonnel 邀约人yuan
 * invitationTime 邀约时间
 * meetAddress 会面地址
 * meetPersonnel 会面人员
 * meetReason 会面原因
 */
export function invitationSave(
  { exhibitionCompanyGuid, exhibitionGuid, invitationContactInformation, invitationNotifyContact, invitationDate, invitationPersonnel, invitationTime, meetAddress, meetPersonnel, meetReason }:
    { exhibitionCompanyGuid: string, exhibitionGuid: string, invitationDate: string, invitationNotifyContact: number, invitationPersonnel: string, invitationTime: string, meetAddress: string, meetPersonnel: string, meetReason: string, invitationContactInformation?: string }) {
  // invitationPersonnel 邀约人
  let param = {
    invitationPersonnel,
    exhibitionCompanyGuid,
    exhibitionGuid,
    invitationNotifyContact,
    invitationContactInformation,
    invitationDate,
    invitationTime,
    meetAddress,
    meetPersonnel,
    meetReason,
  };
  return $ajax.post(`/exhibition-invitation/save`, param);
}

/**
 * POST  关注/取消关注IP  只有登陆状态下可操作
 * guid (string, optional): 被关注的guid ,
 * isFollow (integer, optional): 是否关注1是2否 ,
 * type (integer, optional): 关注类型：1代表公司，2代表个人，3代表ip ,
 * userGuid (string, optional): 关注人的guid
 */

export function getFocusOn(
  { guid, isFollow, type, userGuid }: { guid: string, isFollow: number, type: number, userGuid: string }
) {
  return $ajax.post("/frontend-user-publish/update-focus", {
    guid,
    isFollow,
    type,
    userGuid,
  });
}

/**
 * 获取前台个人空间-个人信息
 * @param userGuid, visitorUserGuid
 * @param visitorUserGuid
 */
export function frontendPersonalSpaceInfo(
  userGuid: string,
  visitorUserGuid: string,
) {
  let url = '/frontend-user/frontend-personal-space-info';
  return $ajax.get(url, {
    params: {
      userGuid,
      visitorUserGuid,
    }
  });
}

/**
 * 获取前台最近访客1.0
 */
export function frontendPersonalVisitor(
  userGuid: string,
) {
  let url = '/frontend-user/frontend-personal-visitor';
  return $ajax.get(url, {
    params: {
      userGuid,
    }
  });
}

/**
 *  收到邀约列表接口
 */
export function receiveList(params) {
  const url = `/exhibition-invitation/receive-list`;
  return $ajax.get(url, { params });
}

/**
 * 被邀请人同意
 */
export function agreeReceive(params) {
  return $ajax.post('/exhibition-invitation/agree/meet-personnel', params);
}

/**
 * 被邀请人拒绝
 */
export function refuseReceive(params) {
  return $ajax.post('/exhibition-invitation/refuse/meet-personnel', params);
}

/**
 *  展会公司人员列表
 */
export function personList(params) {
  const url = `/exhibition-invitation/list/personnel`;
  return $ajax.get(url, { params });
}

/**
 * 关注/取消关注
 */
export function updateFocus(params) {
  return $ajax.post('/frontend-user-publish/update-focus', params);
}

/**
 * 前台发送私信1.0
 */
// export  function sendPrivateLetters(params) {
//   return  $ajax.post('/frontend-user/send-private-letters', params);
// }

/**
 * 前台空间-我的IP1.0
 */
export function getMyIp(userGuid: string, currentPage: number, pageSize: number) {
  let url = `/frontend-user/frontend-my-ip`;
  return $ajax.get(url, {
    params: {
      userGuid, currentPage, pageSize
    }
  });
}

/**
 * 前台空间-我的案例1.0
 */
export function getMyPortalPost(userGuid: string, beVisitUserGuid: string, currentPage: number, pageSize: number) {
  let url = `/frontend-user/frontend-my-portalPost`;
  return $ajax.get(url, {
    params: {
      userGuid, beVisitUserGuid, currentPage, pageSize
    }
  });
}

/**
 * 获取前台个人空间-个人信息
 * @param userGuid, visitorUserGuid
 * @param visitorUserGuid
 */
export function frontendCompanySpaceInfo(
  userGuid: string,
  visitorUserGuid: string,
) {
  let url = '/frontend-user/frontend-company-space-info';
  return $ajax.get(url, {
    params: {
      userGuid,
      visitorUserGuid,
    }
  });
}

/**
 * 前台发送私信1.0
 */
export function staffJoinCompany(params) {
  return $ajax.post('/frontend-user/frontend-staff-join-company', params);
}

/**
 * 获取展会被邀请人时间列表接口
 * @param exhibitionGuid, meetPersonnel
 * @param meetPersonnel
 */
export function invitePersonalTime(
  exhibitionGuid: string,
  meetPersonnel: string,
) {
  let url = '/exhibition-invitation/list/invite-personnel-time';
  return $ajax.get(url, {
    params: {
      exhibitionGuid,
      meetPersonnel,
    }
  });
}

/**
 * 省份接口
 */
export function getProvince() {
  return $ajax.get('/frontend-common/list-provice', {});
}

/**
 * 预定展位
 */
export function orderExhibition(params: object) {
  let url = `/exhibition-reserve/booth-reservation`;
  return $ajax.post(url, params);
}

/**
 * 参展意向的调查 -- 不就是【门票预定】
 */
export function addTicket(params: object) {
  let url = '/exhibition-reserve/intention-survey';
  return $ajax.post(url, params);
}

/**
 * 获取门票信息
 */
export function getConfirm(params) {
  let url = '/exhibition-reserve/get-admission-ticket';
  return $ajax.get(url, { params });
}

/**
 * 获取国家号接口
 */
export function getCountry() {
  return $ajax.get('/frontend-common/list-country-number');
}

/**
 * 获取 预定展位展商接口
 */
export function getListBoothReservation(params) {
  let url = '/exhibition-reserve/list-booth-reservation';
  return $ajax.get(url, { params });
}

/**
 * 导出日程信息
 * @param userGuid, displayType, chooseDate
 * @param displayType
 * @param chooseDate
 */
export function getExportSchedule(
  userGuid: string,
  displayType: number,
  chooseDate: string,
) {
  let url = '/userSchedule/export-schedule';
  return $ajax.get(url, {
    params: {
      userGuid, displayType, chooseDate
    }
  });
}

/**
 * 我的私信列表接口
 */

export function privateLetterList(params) {
  return $ajax.get('/frontend-privateLetter/listPrivateLetter', { params });
}

/**
 * 我与他人私信记录
 */

export function privateLetterReplyList(params) {
  return $ajax.get('/frontend-privateLetter/listPrivateLetterReply', { params });
}

/**
 * POST  前台发送私信
 */

export function sendPrivateLetter(params) {
  return $ajax.post('/frontend-privateLetter/send-secret-private-letters', params);
}

/**
 * POST 前台删除私信
 */
export function deletePrivateLetter(params) {
  return $ajax.post('/frontend-privateLetter/delete-secret-private-letters', params);
}

/**
 * 批量取消参展Ip
 */
export function cancelExhibitionIP(params) {
  return $ajax.post('/exhibition/batch-del-exhibition-ip', params);
}

/**
 * 批量添加参展Ip
 */
export function addExhibitionIP(params) {
  return $ajax.post('/exhibition/batch-save-exhibition-ip', params);
}

interface IPayParams {
  body?: string,
  return_url?: string,
  memberLevel: number,
  payMethod: number,
  subject?: string,
  totalFee?: number,
  type: number,
  userGuid: string,
}

export function generatePay(params: IPayParams) {
  return $ajax.post('/pay_result/create-pay-order', params);
}

export function getScrollAmount() {
  return $ajax.get('/frontend-index/discount-members-num', {});
}

export function getLevelAmount(params) {
  return $ajax.get('/pay_result/get-level-amount', { params });
}

export function isPaySuccess(params: { userGuid: string, memberLevel: number, type: number, payMethod: number }) {
  return $ajax.get('/pay_result/is-pay-success', { params });
}

/**
 *  IP筛选器-添加
 */
export function addForecast(params) {
  return $ajax.post("/fontend-forecast-data/save", params);

}

export function getCity() {
  return $ajax.get("/fontend-forecast-data/list-city");

}

/**
 * IP筛选器-列表
 */
export function getForecastList(params) {
  return $ajax.get("/fontend-forecast-data/list", { params });

}

/**
 * IP筛选器-列表-删除
 */
export function forecastDelete(params) {
  return $ajax.post("/fontend-forecast-data/remove", params);

}

/**
 * IP筛选器-筛选数据列表-名人
 */
export function getForecastIp(params) {
  return $ajax.post('/fontend-forecast-data/list-ip', params);
}

/**
 * TGI 明星表
 */
export function getStarTGI(params) {
  return $ajax.get('/fontend-forecast-data/list-tgi', { params });
}

/**
 * TGI 明星表
 */
export function getStarTGINew(params) {
  return $ajax.get('/fontend-forecast-data-auth/list-tgi', { params });
}

/**
 * 筛选数据-发展周期
 *
 */
export function getLifeCycle(params) {
  return $ajax.get('/fontend-forecast-data/list-life-cycle', { params });
}

/**
 * IP筛选器-四象限图
 *
 */
export function getQuadrant(params) {
  return $ajax.get('/fontend-forecast-data/list-quadrant', { params });
}

/**
 * IP筛选器- 热度趋势
 *
 */
export function getHeatTrend(params) {
  return $ajax.get('/fontend-forecast-data/list-thermal-trend', { params });
}

/**
 * IP筛选器- 热度趋势
 *
 */
export function getHeatTrendNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/list-thermal-trend', { params });
}

/**
 * IP筛选器-类型接口
 */
export function getTypeList() {
  return $ajax.get('/fontend-forecast-data/type-list');
}

/**
 * IP筛选器- 筛选条件展示接口
 */
export function getFilterData(params) {
  return $ajax.get('/fontend-forecast-data/get-client-demand', { params });
}

/**
 * IP筛选器- 筛选条件-  热门特征关键词
 */
export function getHotWords(params) {
  return $ajax.get('/fontend-forecast-data/tag-list', { params });
}

/**
 * IP筛选器详情-发展周期- 发展周期
 */
export function getGrowthCycle(params) {
  return $ajax.get('/fontend-forecast-data/list-growth-cycle', { params });
}

/**
 * IP筛选器详情-发展周期- 发展周期
 */
export function getGrowthCycleNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/list-growth-cycle', { params });
}

/**
 * IP筛选器详情-发展周期- 波动轨迹
 */
export function getWavePath(params) {
  return $ajax.get('/fontend-forecast-data/list-wave-path', { params });
}

/**
 * IP筛选器详情-发展周期- 波动轨迹
 */
export function getWavePathNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/list-wave-path', { params });
}

/**
 *  预测数据-添加
 */
export function addCalculate(params) {
  return $ajax.post("/frontendForecast/save", params);

}

/**
 *  预测数据-添加-ip类型
 */
export function getType(params) {
  return $ajax.get("/frontendForecast/list-ip-type", { params });

}

/**
 * 预测数据-导演，编剧，主演列表
 */
export function getPeopleList(params) {
  return $ajax.get("/frontendForecast/list-ip", { params });
}

/**
 * 预测数据-列表
 */
export function getCalculateData(params) {
  return $ajax.get("/frontendForecast/list", { params });
}

// 删除
export function deleteCalculate(params) {
  return $ajax.post("/frontendForecast/delete", params);

}

/**
 * 预测数据-预测结果
 */
export function getCalculateResult(params) {
  return $ajax.get("/frontendForecast/list-detail", { params });
}

/**
 * 榜单
 */
export function eqRankingList(params) {
  return $ajax.get('/fontend-platform-list-data/get-ip-production', { params });
}

// 分类：排行榜
export function eqTypeRankingList(params) {
  return $ajax.get('/fontend-platform-list-data/get-ip-list', { params });
}

/**
 * 榜单-时间下拉列表
 */
export function eqTimeList(params) {
  return $ajax.get('/fontend-platform-list-data/get-time-list', { params });
}

/**
 * 会员满意度调查
 */
export function eqSatisfactionSurvey(param) {
  return $ajax.post('/frontend-user/satisfaction-survey', param);
}

// star-- IP筛选器详情页新版版

/**
 * IP筛选器详情对接
 * 黑粉占比(风险评估)、粉丝数(知名度)、搜索量(知名度)、搜索相关结果量(知名度)、存在时间(知名度
 * 类型：1黑粉占比、2粉丝数、3搜索量、4搜索相关结果量、5存在时间
 */
export function eqFamousDanger(params) {
  return $ajax.get('/fontend-forecast-data/get-data-contrast', { params });
}

/**
 * IP筛选器详情对接
 * 黑粉占比(风险评估)、粉丝数(知名度)、搜索量(知名度)、搜索相关结果量(知名度)、存在时间(知名度
 * 类型：1黑粉占比、2粉丝数、3搜索量、4搜索相关结果量、5存在时间
 */
export function eqFamousDangerNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-data-contrast', { params });
}

/** IP基本信息-大众热议指数、媒体关注度、潜力值
 */
export function eqForecastBasic(params) {
  return $ajax.get('/fontend-forecast-data/get-ip-info', { params });
}

/** IP基本信息-大众热议指数、媒体关注度、潜力值
 */
export function eqForecastBasicNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-ip-info', { params });
}

/**
 * 趋势——涨粉趋势(热度)、价格趋势(商业价值
 */
export function eqForecastTrend(params) {
  return $ajax.get('/fontend-forecast-data/get-data-trend', { params });
}

/**
 * 趋势——涨粉趋势(热度)、价格趋势(商业价值
 */
export function eqForecastTrendNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-data-trend', { params });
}

/**
 * 黑粉风险点-词云
 */
export function eqForecastBlackWorld(params) {
  return $ajax.get('/fontend-forecast-data/get-black-powder-risk', { params });
}

// 推荐指数
export function eqRecommend(params) {
  return $ajax.get('/fontend-forecast-data/get-recommendation-index', { params });
}

// 推荐指数
export function eqRecommendNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-recommendation-index', { params });
}

// 商业合作
export function eqBusinessC(params) {
  return $ajax.get('/fontend-forecast-data/get-business-cooperation', { params });
}

// 商业合作
export function eqBusinessCNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-business-cooperation', { params });
}

// 商业生态
export function eqBusinessEcology(params) {
  return $ajax.get('/fontend-forecast-data/get-business-ecology', { params });
}

// 商业生态
export function eqBusinessEcologyNew(params) {
  return $ajax.get('/fontend-forecast-data-auth/get-business-ecology', { params });
}

// 双屏互动
export function eqRearchRecord(params) {
  return $ajax.get('/fontend-platform-list-data/get-search-record', { params });
}

// 商品列表接口
export function eqCommodityList(params) {
  return $ajax.get('/frontend-commodity/list-cards', { params });
}

// 商品详情接口
export function eqCommodityDetail(params) {
  return $ajax.get('/frontend-commodity/view-cards', { params });
}

// 收货地址
export function eqAddressList(params) {
  return $ajax.get('/user-shipping-address/list-adderss', { params });
}

// 添加收货地址
export function setSaveAddress(params) {
  const url = `/user-shipping-address/save-adderss?address=${params.address}&addressDetail=${params.addressDetail}&consignee=${params.consignee}&isDefault=${params.isDefault}&mobile=${params.mobile}&postcode=${params.postcode}&&userGuid=${params.userGuid}`;
  return $ajax.post(url, params);
}

// 删除收货地址
export function setRemoveAddress(params) {
  const url = `/user-shipping-address/remove-adderss/?userGuid=${params.userGuid}&addressGuid=${params.addressGuid}`;

  return $ajax.post(url, params);
}

// 修改收货地址
export function setUpdateAddress(params) {
  const url = `/user-shipping-address/update-adderss/?addressGuid=${params.addressGuid}&address=${params.address}&addressDetail=${params.addressDetail}&consignee=${params.consignee}&isDefault=${params.isDefault}&mobile=${params.mobile}&postcode=${params.postcode}&&userGuid=${params.userGuid}`;
  return $ajax.post(url, params);
}

// 确认订单
export function eqConfirmOrder(params) {
  const url = `/frontend-user-order/confirm-order/?userGuid=${params.userGuid}&cardGuid=${params.cardGuid}`;
  return $ajax.get(url, params);
}

// 创建订单
export function setCreateOrder(params) {
  const url = `/frontend-user-order/create-order?userGuid=${params.userGuid}&cardGuid=${params.cardGuid}&addressGuid=${params.addressGuid}&isNeedPhysicalCard=${params.isNeedPhysicalCard}&payPlatform=${params.payPlatform}`;
  return $ajax.get(url, params);
}

// 发起支付
export function setInitiatePayment(params) {
  const url = `/pay_result/initiate-payment/?userGuid=${params.userGuid}&sn=${params.sn}&payMethod=${params.payMethod}`;
  return $ajax.post(url, params);
}

// 验证支付状态
export function eqPayStatus(params) {
  return $ajax.get('/pay_result/verification-pay-success', { params });

}

// 获取省市区
export function eqListDistrict(params) {
  return $ajax.get('/user-shipping-address/list-district', { params });
}

// 我的卡包
export function edMyCards(params) {
  return $ajax.get('/frontend-user-card/list-my-cards', { params });
}

// 我的卡包消费详情
export function edMyCardsRecord(params) {
  return $ajax.get('/frontend-user-card/list-card-record', { params });
}

// 激活卡
export function eqActivationCard(params) {
  return $ajax.get('/frontend-user-card/activation-card', { params });
}

// 订单列表
export function eqMyOrder(params) {
  return $ajax.get('/frontend-user-order/list-my-orders', { params });
}

// 订单详情
export function eqOrderDetail(params) {
  return $ajax.get('/frontend-user-order/copyright-detail', { params });
}

// 提醒发货
export function reminderShipment(params) {
  const url = `/frontend-user-order/reminder-shipment?userGuid=${params.userGuid}&sn=${params.sn}`;
  return $ajax.get(url, params);
}

// 确认收货
export function confirmReceipt(params) {
  const url = `/frontend-user-order/confirm-receipt?userGuid=${params.userGuid}&sn=${params.sn}`;
  return $ajax.get(url, params);
}

// 删除订单
export function delOrder(params) {
  const url = `/frontend-user-order/del-order?userGuid=${params.userGuid}&sn=${params.sn}`;
  return $ajax.get(url, params);
}

// 获取消费Token接口
export function getConsumptionToken({ userGuid = '', type = '', ipids = '' } = {}) {
  const url = `/frontend-user-card/get-consumption-token?userGuid=${userGuid}&type=${type}${!!ipids ? `&ipids=${ipids}` : ''}`;
  return $ajax.get(url);
}

// 获取消费Token接口
export function getIsDeduction({ userGuid = '', type = '', ipids = '' } = {}) {
  const url = `/frontend-user-card/is-deduction?userGuid=${userGuid}&type=${type}${!!ipids ? `&ipids=${ipids}` : ''}`;
  return $ajax.get(url);
}

// 获取消费Token接口
export function getEmailLogo({ type = '' } = {}) {
  const url = `/email-monitor/get-email-logo?type=${type}`;
  return $ajax.get(url);
}
// 用户信息==> company  提交
export function reqSubmitCompany(params) {
  return $ajax.post('/frontend-user/improvement-enterprise-information',  params );
}
// 用户信息==> person
export function reqSubmitPerson(params) {
  return $ajax.post('/frontend-user/improvement-personal-information',  params );
}

// 用户信息==> company  编辑
export function reqEditCompany(params) {
  return $ajax.post('/frontend-user/update-enterprise-information',  params );
}
// 用户信息==> person
export function reqEditPerson(params) {
  return $ajax.post('/frontend-user/update-personal-information',  params );
}
// 上传文件（不限制类型）
export function uploadFile({ file, type, urlType }) {
  const url = `/frontendFileUpload//new-upload-file?type=${type}&urlType=${urlType}`;
  return $ajax.post(url, file);
}
// 上传文件（不限制类型）
export function uploadAllFile({ file, urlType }) {
  const url = `/frontendFileUpload/upload-flie-all?urlType=${urlType}`;
  return $ajax.post(url, file);
}
// 图库列表
export function getGalleryList(params) {
  const url = `/fontend-gallery-order/gallery-list?userGuid=${params.userGuid}&currentPage=${params.currentPage}&pageSize=${params.pageSize}&type=${params.type}&authorizeTypeGuids=${params.authorizeTypeGuids}&authorizeRegion=${params.authorizeRegion}&label=${params.label}`;
  return $ajax.get(url);
}
// 上传图库
export function saveGallery(params) {
  const url = `/fontend-gallery/save-gallery`;
  return $ajax.post(url, params);
}
// 所属IP
export function getIpName({userGuid = ""} = {}) {
  const url = `/frontend-user/get-user-certification-ip?userGuid=${userGuid}`;
  return $ajax.get(url);
}
// 我的图库
export function getMyGallery(params) {
  const url = `/fontend-gallery/list-my-gallerys?userGuid=${params.userGuid}&auditStatus=${params.auditStatus}`;
  return $ajax.get(url);
}
// 下载图库
export function downloadGallery(params) {
  const url = `/fontend-gallery-order/gallery-details?userGuid=${params.userGuid}&galleryGuid=${params.galleryGuid}`;
  return $ajax.get(url);
}
// 图库详情
export function galleryDetail(params) {
  const url = `/fontend-gallery-order/ip-gallery-details?galleryGuid=${params.galleryGuid}`;
  return $ajax.get(url);
}
// 图库详情
export function editGalleryDetail(params) {
  const url = `/fontend-gallery/edit-gallery?galleryGuid=${params.galleryGuid}`;
  return $ajax.get(url);
}
// 上下架
export function offonShelt(params) {
  const url = `/fontend-gallery/offonshelf-gallerys?galleryGuids=${params.galleryGuids}&type=${params.type}`;
  return $ajax.get(url);
}
// 删除图库
export function delGallery(params) {
  const url = `/fontend-gallery/del-gallerys?galleryGuids=${params.galleryGuids}`;
  return $ajax.get(url);
}
// 图库列表筛选
export function getGalleryFilter(params) {
  const url = `/fontend-gallery-order/conditions-screening`;
  return $ajax.post(url, params);
}
// 图库列表筛选
export function galleryDetailFilter(params) {
  const url = `/fontend-gallery-order/conditions-screening?galleryGuid=${params.galleryGuid}`;
  return $ajax.post(url, params);
}

// 买卖家-订单列表
export function buyerOrderList(params) {
 return $ajax.get('/fontend-gallery-order/my-order-list', {params})
}

// 创建订单
export function newOrder(params) {
  const url = `/fontend-gallery-order/new-order`;
  return $ajax.post(url, params);
}
// 获取二维码
export function getPayCode(params) {
  const url = `/pay_result/ip_gallery-initiate-payment`;
  return $ajax.post(url, params);
}
// 订单详情
export function buyerOrderDetail(params) {
  return $ajax.get(`/fontend-gallery-order/order-details?userGuid=${params.userGuid}&orderSn=${params.orderSn}`, params);
}
// 上传设计稿
export function submitDesign(params) {
  return $ajax.post(`/fontend-gallery-order/upload-design-draft`, params);
}

// 提交样品物流单号
export function getLogistics(params) {
  return $ajax.post(`/fontend-gallery-order/upload-sample`, params);
}

// 取消订单
export function cancelOrder(params) {
  return $ajax.post(`/fontend-gallery-order/update-order`, params);
}
// 审核设计稿
export function reviewDesign(params) {
  return $ajax.post(`/fontend-gallery-order/review-design-draft`, params);
}
// 审核样品
export function reviewSample(params) {
  return $ajax.post(`/fontend-gallery-order/review-design-sample`, params);
}
// 验证支付状态
export function eqGalleryPayStatus(params) {
  return $ajax.get('/pay_result/verification-gallerypay-success', { params });

}
// 下载源文件
export function downloadFile(params) {
  return $ajax.get(`/fontend-gallery-order/gallery-details?userGuid=${params.userGuid}&galleryGuid=${params.galleryGuid}`, params);
}
// 申请开票
export function makeCollections(params) {
  return $ajax.get(`/fontend-gallery-order/make-collections?userGuid=${params.userGuid}&orderSn=${params.orderSn}&cardholder=${params.cardholder}&bankName=${params.bankName}&bankCardNo=${params.bankCardNo}&cardholderPhone=${params.cardholderPhone}`, params);
}
