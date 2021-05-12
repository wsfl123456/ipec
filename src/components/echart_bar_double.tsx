import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IPEchartBarDouble {
  container?: string,
  data?: any,
  yName?: string,
  subText?: string,
}

export default class EchartBarDouble extends React.Component<IPEchartBarDouble, any> {
  option() {
    const { data: { legend, xAxis, series, title }, yName, subText } = this.props;
    let barMaxWith: number;
    if (yName === '年龄占比') {
      series.map((item) => {
        return { ...item, "barMaxWidth": 20 };
        // return [...series, { ...item, "barMaxWidth": 20 }];
      });
    } else {
      series.map((item) => {

        return [...series, { ...item, "barMaxWidth": 40 }];
        // return item = { ...item, "barMaxWidth": 40 };
      });

    }
    return {
      title: {
        // subtext: subText,
        subtextStyle: {
          color: "#4a4a4a",
          fontSize: 16,
          verticalAlign: "top",
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        data: legend, // ['年龄占比', 'TGI值']
      },
      color: ['#644AFF', '#DCB9F1'],
      xAxis: [
        {
          type: 'category',
          data: xAxis, // ['>=19', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: "#999",
              fontSize: 12,
            }
          },
          axisLine: {       // y轴
            lineStyle: {
              color: "#999",
            }
          },
          // x 轴 刻度线居中
          axisTick: {
            alignWithLabel: true,
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName,
          min: 0,
          max: 100,
          interval: 20,
          nameTextStyle: {
            color: "#999",
            align: "right",
          },
          axisLabel: {
            formatter: '{value} %',
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            }
          },
          axisLine: {       // y轴
            show: false
          },
          axisTick: {       // y轴刻度线
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },

        {
          type: 'value',
          name: 'TGI值',
          min: 0,
          max: 500,
          interval: 100,
          nameTextStyle: {
            color: "#999",
            align: "left",
          },
          axisLabel: {
            formatter: '{value} ',
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
          axisLine: {       // y轴
            show: false
          },
          axisTick: {       // y轴刻度线
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },

      ],
      series,
      /*[
        {
          name: '年龄占比',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        },
        {
          name: 'TGI值',
          type: 'bar',
          // yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        }
      ]*/
    };
  }

  render() {
    const { container, subText } = this.props;
    return (
      <div className={container}>
        <p style={{ "color": "#4a4a4a" }}>{subText}</p>
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
