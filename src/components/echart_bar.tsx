import * as React from "react";
import echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";
import moment from 'moment';

interface IPEchartBar {
  container: string,
  data: any,
  subtext: any,
}

export default class EchartBar extends React.Component<IPEchartBar, any> {
  option() {
    const { data, subtext } = this.props;
    let x = [], y = [];
    data && data.map((item) => {
      x.push(moment(item.data_riiq).format('MM/DD'));
      y.push(item.data_number);
    });
    return {
      title: {
        subtext,
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: x,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#999999",
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: "#999",
              fontSize: 12,
            },
          },
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#999999",
            },
          },
        }
      ],
      series: [
        {
          type: "bar",
          barMaxWidth: 30,
          itemStyle: {
            color: '#D8CDFF',

            // normal: {
            //   color: new echarts.graphic.LinearGradient(
            //     0, 0, 0, 1,
            //     [
            //       { offset: 0, color: "#2853ff" },
            //       { offset: 1, color: "#933efe" },
            //     ],
            //   ),
            // },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: "#6248ff" },
                ],
              ),
            },
          },
          data: y,
        },
      ],
    };
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()} lazyUpdate={true}/>
      </div>
    );
  }
}
