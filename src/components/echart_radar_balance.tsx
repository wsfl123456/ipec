import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_redar.scss";
import _isEmpty from 'lodash/isEmpty';

interface IProps {
  container: any,
  data: any,
  indicator?: any,
}

export default class EchartsRadarBalance extends React.Component<any, any> {
  option() {
    const { data, indicator } = this.props;
    return {
      title: {
        text: ''
      },
      tooltip: {
        position(point, params, dom, rect, size) {
          // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
          let x = point[0],
            y = point[1],
            viewWidth = size.viewSize[0],
            viewHeight = size.viewSize[1],
            boxWidth = size.contentSize[0],
            boxHeight = size.contentSize[1],
            posX = 0, // x坐标位置
            posY = 0; // y坐标位置

          if (x < boxWidth) { // 左边放不开
            posX = 5;
          } else { // 左边放的下
            posX = x - boxWidth;
          }

          if (y < boxHeight) { // 上边放不开
            posY = 5;
          } else { // 上边放得下
            posY = y - boxHeight;
          }
          return [posX, posY];
        }
      },
      radar: {
        name: {
          textStyle: {
            color: '#343a40',
            backgroundColor: '#fff',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator,
      },
      series: [{
        name: '商业价值评估模型',
        type: 'radar',
        itemStyle: {
          normal: {
            color: '#6248ff'
          },
        },
        data: [
          {
            value: data,
            areaStyle: {
              normal: {
                color: 'rgba(98,72,255,0.10)',
              }
            },
            lineStyle: {
              color: '#6248ff',
            },
          }
        ]
      }]
    };
  }

  render() {
    const { container, data, indicator } = this.props;
    return (
      <div className={container}>
        {
          !_isEmpty(data) && !_isEmpty(indicator) &&
          <ReactEcharts option={this.option()}/>
        }
      </div>
    );
  }
}
