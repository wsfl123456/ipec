import * as React from 'react';
import _isEmpty from 'lodash/isEmpty';
import ic_content_validity from '@assets/images/ip_detail/ic_content_validity.svg';
import ic_show from '@assets/images/ip_detail/ic_show.svg';
import ic_cooperate from '@assets/images/ip_detail/ic_cooperate.svg';
import ic_brand from '@assets/images/ip_detail/ic_co_branding.svg';
import ic_product from '@assets/images/ip_detail/ic_representative_works.svg';
import Swipers from '@pages/detail/components/swiper';
import default_img from '@assets/images/default/ic_default_shu.png';
import ic_upcomingg from '@assets/images/ip_detail/ic_upcoming.svg';
import ic_Picture_details from '@assets/images/ip_detail/ic_Picture_details.svg';
import ic_cnxh from '@assets/images/ip_detail/ic_cnxh.svg';
import { Link } from 'react-router-dom';
import icon_dou from '@assets/images/ip_icon_dou.png';
import { observer, inject } from 'mobx-react';
import _isArray from 'lodash/isArray';
import _chunk from 'lodash/chunk';

interface IIntroductionProps {
  isShow1: any,
  ipDetailData: any,
  ipTypeNumber: string | number,
  coBrands: any,
  ipPeopleList: any,
  ipArtLikeData: any,
  arr: Array<any>,
  arr2: Array<any>,
  options: object,
  history: any,

}

@inject('detail', 'ip_list')
@observer
export default class IntroductionTab extends React.Component<IIntroductionProps, any> {
  render() {
    const { isShow1, ipDetailData, ipTypeNumber, coBrands, ipArtLikeData, ipPeopleList, arr, arr2, options } = this.props;
    let prodect, cooperationCase, arr3 = [], arr4 = [], options3 = {}, options4 = {};
    if (ipDetailData.isProdect === 1) {
      prodect = '';
    } else if (ipDetailData.isProdect === 2) {
      prodect = JSON.parse(ipDetailData.prodect).filter(v => v.pic !== '');
      prodect = prodect.map(v => v.pic !== '' && v.pic);
    } else {
      prodect = ipDetailData.prodect && JSON.parse(ipDetailData.prodect);
    }
    if (ipDetailData.isCooperationCase === 1) {
      cooperationCase = '';
    } else if (ipDetailData.isCooperationCase === 2) {
      cooperationCase = JSON.parse(ipDetailData.cooperationCase).filter(v => v.pic !== '');
      cooperationCase = cooperationCase.map(v => v.pic !== '' && v.pic);
    } else {
      cooperationCase = ipDetailData.cooperationCase && JSON.parse(ipDetailData.cooperationCase);
    }

    if (_isArray(prodect) || _isArray(cooperationCase)) {
      arr3 = _chunk(prodect, 4);
      arr4 = _chunk(cooperationCase, 4);
      if (prodect.length > 4 ) {
        options3 = {
          effect: "slide",
          loop: true,
          pagination: null,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          autoplay: false,
        };
      } else if (prodect.length < 4 ) {
        options3 = {
          effect: "slide",
          pagination: null,
          autoplay: false,
          loop: false,
        };
      }
      if (cooperationCase.length > 4 ) {
        options4 = {
          effect: "slide",
          loop: true,
          pagination: null,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          autoplay: false,
        };
      } else if (cooperationCase.length < 4 ) {
        options4 = {
          effect: "slide",
          pagination: null,
          autoplay: false,
          loop: false,
        };
      }
    }

    // console.log(prodect, cooperationCase);
    return (
      <div className="tab-content" style={{ display: isShow1 }}>
        {ipDetailData.ipDesc &&
        <div className="module-box ">
          <p className="area-title">
            <img src={ic_content_validity} alt=""/>
            IP简介
          </p>
          <div className="area-content">
            <div className="area-words" dangerouslySetInnerHTML={{ __html: ipDetailData.ipDesc }}/>
          </div>
        </div>
        }
        {
         !_isEmpty(prodect) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_show} alt=""/>
              IP素材图库
            </p>
            <div className="area-content">
              <Swipers options={{ ...options3 }}>
                {
                  arr3 && arr3.map((item: any, index) => (
                    <div key={index} className="swiper-slide  swipe-slide-area area-box">
                      {
                        item && item.map((v, idx) => {
                          if (v) {
                            let flag;
                            (v).indexOf("http") === 0 ? flag = true : flag = false;
                            return (
                              <div className="swipe-slide-custom box" key={idx}>
                                <div className="box-con">
                                  {
                                    flag === true ?
                                      <img src={`${v}`} alt="" className="imgMid"/>
                                      :
                                      <img src={`${ipDetailData.picPrefix}${v}`} alt="" className="imgMid"/>
                                  }
                                </div>
                              </div>
                            );
                          }
                        })}
                    </div>
                  ))}
              </Swipers>
            </div>
          </div>
        }
        {
         !_isEmpty(cooperationCase) &&
          <div className="module-box">
            <p className="area-title">
              <img src={ic_cooperate} alt=""/>
              衍生品图库
            </p>
            <div className="area-content">
              <Swipers options={{ ...options4 }}>
                {
                  arr4 && arr4.map((item: any, index) => (
                    <div key={index} className="swiper-slide  swipe-slide-area area-box">
                      {
                        item && item.map((v, idx) => {
                          if (v) {
                            let flag;
                            (v).indexOf("http") === 0 ? flag = true : flag = false;
                            return (
                              <div className="swipe-slide-custom box" key={idx}>
                                <div className="box-con">
                                  {
                                    flag === true ?
                                      <img src={`${v}`} alt="" className="imgMid"/>
                                      :
                                      <img src={`${ipDetailData.picPrefix}${v}`} alt="" className="imgMid"/>
                                  }
                                </div>
                              </div>
                            );
                          }
                        })}
                    </div>
                  ))}
              </Swipers>
            </div>
          </div>
        }
        {ipTypeNumber === 8 && (
          <div className="people-content">
            {!_isEmpty(coBrands) && (
              <div className="right-brand module-box">
                <p className="area-title">
                  <img src={ic_brand} alt=""/>
                  合作品牌
                </p>
                <div className="area-content">
                  {
                    coBrands && coBrands.split(",").map((i, k) => {
                      return <span className="word-ellipsis" key={k}>-{i}</span>;
                    })}
                </div>
              </div>
            )}
            <div className="star-top-more flex-column">
              <div className="star-div flex-row ">
                {!_isEmpty(arr) && (
                  <div className="child-star-div left-star-div  ">
                    <p className="area-title">
                      <img src={ic_product} alt=""/>
                      代表作品
                    </p>
                    <div className="area-content swiper-star">
                      <Swipers options={{ ...options }}>
                        {arr &&
                        arr.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="swiper-slide  swipe-slide-area"
                          >
                            {item &&
                            item.map((i: any, idx: number) => (
                              <div
                                key={idx}
                                className="swipe-slide-custom "
                                onClick={() => {
                                  this.props.history.push(
                                    `/detail/${i.ipTypeSuperiorNumber}/${i.ipid}`
                                  );
                                }}
                              >
                                <img
                                  src={i.picUrl || default_img}
                                  alt=""
                                />
                                <div className="cooperate-ip-last-line">
                                  {i.ipName}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Swipers>
                    </div>
                  </div>
                )}
                {!_isEmpty(arr2) && (
                  <div className="child-star-div">
                    <p className="area-title">
                      <img src={ic_upcomingg} alt=""/>
                      即将上映
                    </p>
                    <div className="area-content swiper-star right-swiper">
                      <Swipers options={{ ...options }}>
                        {arr2 &&
                        arr2.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="swiper-slide  swipe-slide-area"
                          >
                            {item &&
                            item.map((i: any, idx: number) => (
                              <div
                                key={idx}
                                className="swipe-slide-custom "
                              >
                                <img
                                  src={i.picUrl || default_img}
                                  alt=""
                                />
                                <div className="cooperate-ip-last-line">
                                  {i.ipName}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Swipers>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {ipDetailData.detail && (
          <div className="module-box">
            <p className="area-title">
              <img src={ic_Picture_details} alt=""/>
              图文详情
            </p>
            <div className="area-content book-area-content">
              <div
                className="area-words"
                dangerouslySetInnerHTML={{ __html: ipDetailData.detail }}
              />
            </div>
          </div>
        )}
        {Number(ipTypeNumber) > 4 &&
        Number(ipTypeNumber) < 8 &&
        !_isEmpty(ipPeopleList) &&
        <div className="module-box">
          <p className="area-title">
            <img src={ic_cnxh} alt=""/>
            影人相关播放量
          </p>
          <div className="area-content like-content">
            <div className="area-box flex-row justify-content-around">
              {ipPeopleList &&
              ipPeopleList.map((item, index) => {
                return (
                  <div className="box" key={index}>
                    <div className="child-box">
                      <img
                        src={item.picUrl}
                        alt=""
                        className="imgMid"
                      />
                      <div className="hover-bg">
                        {/*<span>近三年播放量: {item.playbackVolume}</span>*/}
                        <span>
                                      微博粉丝数量: {item.postBarAttentionsNum}
                                    </span>
                        <span>
                                      贴吧关注数量: {item.weiboFansNum}
                                    </span>
                      </div>
                    </div>
                    <p>{item.ipName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        }
        {!_isEmpty(ipArtLikeData) &&
        <div className="module-box">
          <p className="area-title">
            <img src={ic_cnxh} alt=""/>
            猜你喜欢
          </p>
          <div className="area-content like-content">
            <div className="area-box flex-row justify-content-around">
              {ipArtLikeData && ipArtLikeData.map((item, index) => {
                return (
                  <div className="box" key={index}>
                    <Link
                      to={`/detail/${item.ipTypeSuperiorNumber}/${item.ipid}`}
                      target="blank"
                    >
                      <div className="likeDemoImgOut">
                        <img src={item.picUrl} alt=""/>
                      </div>
                      <div className="box-name justify-content-between">
                        <p className="name word-ellipsis">
                          {item.ipName}
                        </p>
                        {Number(ipTypeNumber) > 4 &&
                        Number(ipTypeNumber) < 8 &&
                        !_isEmpty(item.beanScore) && (
                          <div className="item-dou  justify-content-between align-items-center">
                            <img src={icon_dou} alt=""/>
                            <span className="score">
                                          {item.beanScore}
                                        </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}
