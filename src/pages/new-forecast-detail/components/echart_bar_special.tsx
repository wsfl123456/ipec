import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IPEchartBar {
  container: string,
  data: any,
  subtext?: string,
}

export default class EchartBarSpecial extends React.Component<IPEchartBar, any> {
  option() {
    const { data: { xAxis, series, legends, }, subtext } = this.props;
    // const { data: { xData, yData, subtext } } = this.props;
    // let xData = ['猪小弟', '救援宝贝'];
    // let yData = [20, 50];
    // let subtext = '粉丝占比';
    return {
      title: {
        subtext,
        left: 'center',
        subtextStyle: {
          color: '#666',
          fontSize: 16,
        },
      },
      tooltip: {
        // formatter: '{b}<br/>{a}：{c}%',
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
      },
      yAxis: {
        type: 'category',
        data: xAxis,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#999",
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series: [
        {
          type: "bar",
          barMaxWidth: 40,
          itemStyle: {
            color: {
              type: 'line',
              x: 0,
              y: 0,
              x1: 1,
              y1: 1,
              colorStops: [
                { offset: 0, color: "#2853ff" },
                { offset: 1, color: "#933efe" },
              ],
            },
            globalCoord: false, // 缺省为 false
            repeat: 'repeat',
          },
          label: {
            show: true,
            position: 'right',
          },
          data: series,
        },
      ],
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
