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
}

export default class EchartBarDouble extends React.Component<IPEchartBarDouble, any> {
  option() {
    const { data: { legend: xAxis, male, female } } = this.props;
    let barMaxWith: number;
    male.map((item) => {
      return { ...item, "barMaxWidth": 20 };
    });
    female.map((item) => {
      return { ...item, "barMaxWidth": 20 };
    });

    return {
      title: {
        subtext: "粉丝占比(%)",
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        formatter: `{b}<br/>{a0}:{c0}%<br/>{a1}:{c1}%`,
      },

      legend: {
        data: ['男', '女'],
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
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 10,
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
      series: [
        {
          name: '男',
          type: 'bar',
          barGap: 0,
          barMaxWidth: 40,
          data: male,
        },
        {
          name: '女',
          type: 'bar',
          barMaxWidth: 40,
          data: female,
        }
      ]
    };
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
