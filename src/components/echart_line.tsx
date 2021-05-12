import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";
import moment from "moment";

interface IProps {
  container: any,
  // xHot: any,
  // yHot: any,
  data: any,
  subtext: string
}

export default class EchartLine extends React.Component<IProps, any> {
  constructor(props) {
    super(props);

  }

  option() {
    const { subtext, data } = this.props;
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
        // formatter: "{b}:{c}",
      },
      // tooltip: {},
      grid: {
        left: 0, // '50',
        right: 0,
        bottom: 10,
        // top: 'top',
        containLabel: true, // 溢出容器显示
      },
      xAxis: {
        type: "category",
        data: x && x,
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
      yAxis: {
        type: "value",
        splitLine: {
          show: false,
          // lineStyle: {
          //   type: "dashed",
          // },
        },
        axisLine: { show: false },
        axisTick: {
          show: true,
          lineStyle: {
            color: "#999999",
          },
        },
        axisLabel: {
          show: true,
          // formatter: (value, index) => {
          //   if (value >= 100000000) {
          //     return value / 100000000 + "亿";
          //   } else if (value >= 10000) {
          //     return value / 10000 + "万";
          //   } else {
          //     return value;
          //   }
          // },
          textStyle: {
            color: "#999",
            fontSize: 12,
          },
        },
      },
      series: [{
        data: y,
        type: "line",
        itemStyle: {
          color: "#6236ff",
        },
        lineStyle: {
          width: 2,
          shadowColor: ' rgba(98,54,255,0.50)',
          shadowBlur: 5,
          shadowOffsetY: 2
        },
        areaStyle: {
          color: '#eee7ff',
          // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //   offset: 0,
          //   color: "#6248ff",
          // }, {
          //   offset: 1,
          //   color: "#fff",
          // }]),
        },
      }],
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
