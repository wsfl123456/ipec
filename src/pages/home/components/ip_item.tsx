import * as React from "react";
import { Link } from "react-router-dom";
import default_img from "@assets/images/default/ic_default_shu.png";
import { inject, observer } from 'mobx-react';

interface IpItemProps extends IComponentProps {
  data: any,
}

const numberKV = {
  'IP形象': 1,
  '艺术': 2,
  '图书': 3,
  '网文': 4,
  '电视剧': 5,
  '电影': 6,
  '综艺': 7,
  '明星艺人': 8,
  '动画': 9,
  '漫画': 10,
};
const number_k = {
  '艺术': "文创艺术",
  '动画': "动画",
};

@inject("ip_list")
@observer
export default class IpItem extends React.Component<IpItemProps> {
  render() {
    const { data: { sublist: tmp = [] }, ip_list } = this.props;
    let { customStatus } = ip_list;
    const { selected } = customStatus;
    return (
      <div>
        {
          tmp && tmp.map((item: any) => {
            return (
              <div
                key={item.dataName}
                className="content-container flex-column special-container">
                <div className="ip-s flex-row justify-content-between flex-wrap">
                  <div className="ip-item-type">
                    <img className="ip-item-type-img" src={item.dataPicUrl || default_img} alt=""/>
                    <span className="ip-item-type-text">{item.dataName}</span>
                    <Link  to="/ip-list"
                        onClick={async () => {
                      let dataName = number_k[item.dataName];
                      await ip_list.changeStatus({
                        selected: dataName,
                        ipTypeSuperiorNumber: numberKV[item.dataName]
                      });
                    }}>查看全部</Link>
                  </div>
                  {
                    item.sublist && item.sublist.map((val: any) => {
                      const { dataType }: { dataType: string } = val;
                      let sub_type = dataType && dataType.split(",");
                      return (
                        <Link to={`/detail/${val.ipTypeSuperiorNumber}/${val.ipid}`} key={val.dataName}
                              className="ip-item flex-column align-items-center">
                          <div className="ip-item-imgOut">
                            <img className="ip-item-img" src={val.dataPicUrl || default_img} alt=""/>
                          </div>
                          <span>{`${val.dataName}`}</span>
                          <div className="ip-item-sub-type justify-content-around align-items-center flex-wrap">
                            {sub_type && sub_type.map((sub: string, idx: number) =>
                              <span className="ip-item-sub-type-span" key={idx}>{`${sub}`}</span>)}
                          </div>
                        </Link>
                      );
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
