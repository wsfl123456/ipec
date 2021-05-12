import * as React from "react";
import _isFunc from "lodash/isFunction";

interface IIpTypeItemProps {
  data: any;
  ip_list: any;
  callback: Function;
  ipTypeSuperiorNumber: string;
}

interface IIpTypeItemState {
  selected: object;
  selectedType: any
  theAllId: "",
  ipLocation: string,
  ipTypeNumber: "",
  ipFormNumber: string,
  ipTypeListData: string[],
  ipSex: string,
  ipStatus: string,
}

export default class IpTypeItem extends React.Component<IIpTypeItemProps, IIpTypeItemState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: {},
      selectedType: [],
      theAllId: "",
      ipLocation: "",
      ipTypeNumber: "",
      ipFormNumber: "",

      ipTypeListData: [],
      ipSex: "",
      ipStatus: "",
    };
  }

  private timeCallback = (o: any) => {
    const { date = "" } = o;
    this.callback({ releaseDate: date });
  };

  private callback = o => _isFunc(this.props.callback) && this.props.callback(o);

  async _selectSubType(sub, item) {
    const { ip_list, } = this.props;

    let { selected, theAllId, ipLocation, ipFormNumber, ipTypeNumber, selectedType, ipSex, ipStatus } = this.state;
    if (sub.ipType === "全部") {
      selected = {};
      // selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
      theAllId = sub.ipTypeGuid;
    } else if (item.ipType === "类型") {
      // selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
      theAllId = sub.ipTypeGuid;
      let ipTypeNumber = sub.ipTypeNumber;
      // this.props.ipTypeNumber=sub.ipTypeNumber
      // selectedType["name"] = sub.ipTypeNumber;
      await ip_list.ipTypeListTab({
        ipTypeSuperiorNumber: this.props.ipTypeSuperiorNumber,
        ipTypeNumber,
        ipLocation,
        currentPage: 1,
        pageSize: 20
      });
    } else if (item.ipType === "地区") {
      selected = {};
      // selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
      ipLocation = sub.ipTypeNumber;
      let obj = {
        ipTypeSuperiorNumber: this.props.ipTypeSuperiorNumber,
        ipLocation, ipTypeNumber: "",
        currentPage: 1, pageSize: 20,
      };
      await ip_list.ipTypeListTab({ ...obj });
    } else if (item.ipType === "形式") {
      selected = {};
      // selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
      ipFormNumber = sub.ipTypeNumber;
      let obj = {
        ipTypeSuperiorNumber: this.props.ipTypeSuperiorNumber,
        ipLocation, ipTypeNumber: "", ipFormNumber,
        currentPage: 1, pageSize: 20,
      };
      await ip_list.ipTypeListTab({ ...obj });
    } else if (item.ipType === "时间") {
      selected = {};

    } else if (item.ipType === "性别") {
      ipSex = sub.ipTypeNumber;
      let obj = {
        ipTypeSuperiorNumber: this.props.ipTypeSuperiorNumber,
        ipLocation, ipTypeNumber, ipFormNumber: "", ipSex,
        currentPage: 1, pageSize: 20,
      };
      await ip_list.ipTypeListTab({ ...obj });
    } else if (item.ipType === "状态") {
      ipStatus = sub.ipTypeNumber;
      let obj = {
        ipTypeSuperiorNumber: this.props.ipTypeSuperiorNumber,
        ipLocation, ipTypeNumber, ipFormNumber: "", ipStatus,
        currentPage: 1, pageSize: 20,
      };
      await ip_list.ipTypeListTab({ ...obj });
    } else {
      selected[theAllId] = false;
      selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
    }
    selected[sub.ipTypeGuid] = !(selected[sub.ipTypeGuid]);
    this.setState({ selected, theAllId, ipLocation, ipTypeNumber, selectedType, ipSex, ipStatus });
  }

  render() {
    const { data } = this.props;
    return (
      <div className="select-bar-operation">
        {data && data.map((item: any) => {
          const { sublist, ipTypeGuid }: { sublist: any[], ipTypeGuid: string } = item;
          return (
            <div key={ipTypeGuid} className="operation-type flex-fill">
              <div className="classify-type-item">{item.ipType}:</div>
              <div className="sub-type-item flex-row flex-wrap align-items-center">
                {sublist && sublist.map((sub) => {
                  return (
                    <span
                      key={sub.ipTypeGuid}
                      className={`ip-category-item ${this.state.selected[sub.ipTypeGuid] ? "span-selected" : ""}`}
                      onClick={
                        async () => await this._selectSubType(sub, item)}>
                      {sub.ipType}
                    </span>
                  );
                })}
                {
                  item.ipType === "时间" && <div className="time-picker-area">
                    {/*<TimeRange callback={this.timeCallback} />*/}
                  </div>
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
