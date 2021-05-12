import * as React from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";
// @ts-ignore
import geoJson from "echarts/map/json/china.json";
import { geoCoordMap, provienceData } from "echarts/lib/component/geo.js";
import "echarts/lib/chart/map";
import "echarts/map/js/china";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

// interface IPechartMap {
//   // data: any,
// }
let data = [
  { name: '华东', value: 9 },
  { name: '华南', value: 12 },
  { name: '华北', value: 12 },
  { name: '西北', value: 12 },
  { name: '西南', value: 12 },
  { name: '华中', value: 12 },
];
let geoCoordMap = {
  '华东': [114.48, 38.03],
  '华南': [117.67, 36.19],
  '华北': [111.69, 29.05],
  '西北': [115.48, 38.85],
  '西南': [112.91, 27.87],
  '华中': [119.64, 29.12],
};
export default class EchartMap2 extends React.Component<any, any> {
  convertData(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }
    console.log(res);
    return res;
  }

  option() {
    const option = {
      // backgroundColor: '#404a59',
      title: {
        text: '全国主要城市空气质量',
        subtext: 'data from PM25.in',
        sublink: 'http://www.pm25.in',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item'
      },

      series: [
        {
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: this.convertData(data),
          // symbolSize: function(val) {
          //   return val[2] / 10;
          // },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          }
        },
        {
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: this.convertData(data.sort((a, b) => {
            return b.value - a.value;
          }).slice(0, 6)),
          // symbolSize: function(val) {
          //   return val[2] / 10;
          // },
          showEffectOn: 'emphasis',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        },
        {
          type: 'custom',
          coordinateSystem: 'bmap',
          // renderItem: renderItem,
          itemStyle: {
            normal: {
              opacity: 0.5
            }
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10
        }
      ]
    };
    return option;
  }

  render() {
    return (
      <div className="echart-map">
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
