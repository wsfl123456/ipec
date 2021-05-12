import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import "echarts-wordcloud/src/wordCloud";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/bar_darren.scss";
import { toJS } from "mobx";

interface IProps {
  container: any,
  data: any,
}

export default class EchartWordcloud extends React.Component<IProps, any> {
  getName(data) {
    let _color = ['rgba(254,163,158,0.60)', ' rgba(46,142,248,0.60)', 'rgba(146,84,222,0.60)'];
    //这里的_data和 filterOption都是同一条数据 从后台获取
    let _data = {
      name: data.name,
    };
    // let _data = data;
    let _option = [];
    _data['name'] && _data.name.forEach((val, index) => {
      _option.push({
        name: val,
        color: _color[index],
      });
    });
    return _option;
  }

  filterOption(data) {
    //本地控制实例颜色
    let _color = ['rgba(254,163,158,0.60)', ' rgba(46,142,248,0.60)', 'rgba(146,84,222,0.60)'];
    //传进来的数据
    // let _data = {
    //   name: ['喵呜琪琪梦 EchartwordCloud', '柴犬馒头', '疯了，桂宝'],
    //   data: [[
    //     {
    //       name: '萨达',
    //       value: 10000,
    //     }, {
    //       name: '阿',
    //       value: 6181
    //     }, {
    //       name: '热河',
    //       value: 4386
    //     }, {
    //       name: '乐山大佛',
    //       value: 4055
    //     }, {
    //       name: '快结婚',
    //       value: 2467
    //     }, {
    //       name: '破恶妇',
    //       value: 2244
    //     }, {
    //       name: '轻柔',
    //       value: 1898
    //     }, {
    //       name: '地方',
    //       value: 1484
    //     }, {
    //       name: '闹剧呼应',
    //       value: 1112
    //     }, {
    //       name: '哦屁呀',
    //       value: 965
    //     }, {
    //       name: '萨达',
    //       value: 100,
    //     }, {
    //       name: '阿',
    //       value: 611
    //     }, {
    //       name: '热河',
    //       value: 386
    //     }, {
    //       name: '乐山大佛',
    //       value: 455
    //     }, {
    //       name: '快结婚',
    //       value: 247
    //     }, {
    //       name: '破恶妇',
    //       value: 244
    //     }, {
    //       name: '轻柔',
    //       value: 898
    //     }, {
    //       name: '地方',
    //       value: 184
    //     }, {
    //       name: '闹剧呼应',
    //       value: 112
    //     }, {
    //       name: '哦屁呀',
    //       value: 965
    //     }, {
    //       name: '哦 i 啊分开哦反应',
    //       value: 847
    //     }, {
    //       name: '空间哦句',
    //       value: 582
    //     }, {
    //       name: 'i 哦 hi hi 哦好哇',
    //       value: 555
    //     }, {
    //       name: 'KXAN',
    //       value: 550
    //     }, {
    //       name: 'Mary Ellen Mark',
    //       value: 462
    //     }, {
    //       name: 'Farrah Abraham',
    //       value: 366
    //     }, {
    //       name: 'Rita Ora',
    //       value: 360
    //     }, {
    //       name: 'Serena Williams',
    //       value: 282
    //     }, {
    //       name: 'NCAA baseball tournament',
    //       value: 273
    //     }], [
    //     {
    //       name: 'Sam S Club',
    //       value: 10000,
    //     }, {
    //       name: 'Macys',
    //       value: 6181
    //     }, {
    //       name: 'Amy Schumer',
    //       value: 4386
    //     }, {
    //       name: 'Jurassic World',
    //       value: 4055
    //     }, {
    //       name: 'Charter Communications',
    //       value: 2467
    //     }, {
    //       name: 'Chick Fil A',
    //       value: 2244
    //     }, {
    //       name: 'Planet Fitness',
    //       value: 1898
    //     }, {
    //       name: 'Pitch Perfect',
    //       value: 1484
    //     }, {
    //       name: 'Express',
    //       value: 1112
    //     }, {
    //       name: 'Home',
    //       value: 965
    //     }, {
    //       name: 'Johnny Depp',
    //       value: 847
    //     }, {
    //       name: 'Lena Dunham',
    //       value: 582
    //     }, {
    //       name: 'Lewis Hamilton',
    //       value: 555
    //     }, {
    //       name: 'KXAN',
    //       value: 550
    //     }, {
    //       name: 'Mary Ellen Mark',
    //       value: 462
    //     }, {
    //       name: 'Farrah Abraham',
    //       value: 366
    //     }, {
    //       name: 'Rita Ora',
    //       value: 360
    //     }, {
    //       name: 'Serena Williams',
    //       value: 282
    //     }, {
    //       name: 'NCAA baseball tournament',
    //       value: 273
    //     }], [
    //     {
    //       name: 'Sam S Club',
    //       value: 10000,
    //     }, {
    //       name: 'Macys',
    //       value: 6181
    //     }, {
    //       name: 'Amy Schumer',
    //       value: 4386
    //     }, {
    //       name: 'Jurassic World',
    //       value: 4055
    //     }, {
    //       name: 'Charter Communications',
    //       value: 2467
    //     }, {
    //       name: 'Chick Fil A',
    //       value: 2244
    //     }, {
    //       name: 'Planet Fitness',
    //       value: 1898
    //     }, {
    //       name: 'Pitch Perfect',
    //       value: 1484
    //     }, {
    //       name: 'Express',
    //       value: 1112
    //     }, {
    //       name: 'Home',
    //       value: 965
    //     }, {
    //       name: 'Johnny Depp',
    //       value: 847
    //     }, {
    //       name: 'Lena Dunham',
    //       value: 582
    //     }, {
    //       name: 'Lewis Hamilton',
    //       value: 555
    //     }, {
    //       name: 'KXAN',
    //       value: 550
    //     }, {
    //       name: 'Mary Ellen Mark',
    //       value: 462
    //     }, {
    //       name: 'Farrah Abraham',
    //       value: 366
    //     }, {
    //       name: 'Rita Ora',
    //       value: 360
    //     }, {
    //       name: 'Serena Williams',
    //       value: 282
    //     }, {
    //       name: 'NCAA baseball tournament',
    //       value: 273
    //     }]]

    //   };

    let _data = data;
    let _option = [];
    _data['data'] && _data.data.forEach((val, index) => {
      _option.push(this.option({
        data: val,
        color: _color[index],
      }));
    });
    return _option;
  }

  option(data) {
    return {
      tooltip: {
        show: false,
      },
      backgroundColor: data.color,
      series: [
        {
          type: 'wordCloud',
          gridSize: '-4',
          sizeRange: [12, 25],
          rotationRange: [-90, 90],
          width: 140,
          height: 140,
          shape: 'pentagon',
          textStyle: {
            normal: {
              // color: function () {
              //   return 'rgb(' + [
              //     Math.round(Math.random() * 255),
              //     Math.round(Math.random() * 255),
              //     Math.round(Math.random() * 255)
              //   ].join(',') + ')';
              // }
              color: '#ffffff'
            },
            emphasis: {
              shadowBlur: 12,
              shadowColor: '#333'
            }
          },
          data: data.data
        }
      ]
    };
  }

  render() {
    // echart_wordcloud_three
    let _ishaveDate = false;
    let { container, data } = this.props;
    data = toJS(data);
    if (data == null) {
      data = {
        name: [],
        data: []
      };
    }
    if (data.data && data.data.length > 0) {
      data.data.forEach((el) => {
        el.length !== 0 ? _ishaveDate = true : '';
      });
    }
    const fileOption = this.filterOption(data);
    const _namelist = this.getName(data);
    return (
      !_ishaveDate ? <div className="wordCloudDtaNull dataNull">暂无数据</div> :
        <div className="search wordCloud">
          <div className={container}>
            {fileOption && fileOption.map((obj, index) => {
              return (
                <div className="wordCloud" key={index}>
                  <ReactEcharts option={obj}/>
                </div>);
            })}

            <div className="tips">
              {_namelist && _namelist.map((obj, index) => {
                return (
                  <div key={index}>
                    <span className="icon" style={{ backgroundColor: obj.color }}></span>
                    <span>{obj.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    );
  }
}
