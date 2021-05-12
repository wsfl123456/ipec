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

interface IPEchartBarSpecial {
  container: string,
  subtext: string,
  xData: any,
  yPercent: any,
}

export default class EchartBarSpecial extends React.Component<IPEchartBarSpecial, any> {
  option() {
    const { subtext, xData, yPercent } = this.props;
    let dataShadow = [];
    let yMax = 100;
    for (let i = 0; i < xData.length; i++) {
      dataShadow.push(yMax);
    }
    return {
      title: {
        subtext,
        subtextStyle: {
          fontSize: 16,
          color: "#4A4A4A",
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: "{b}:{c}%",
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: "3%",
        // right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLine: { show: false },
        show: false,
      },
      yAxis: {
        type: "category",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          show: false,
        },
        data: yPercent,
      },
      series: [
        {
          type: "bar",
          itemStyle: {
            normal: {
              color(params) {
                // build a color map as your need.
                let colorList = [" #8A54BE", " #B15CDE", " #C560EF", "#E760DE", " #FC63B2"];
                // let colorList = ["#FF6B6B", "#FF678E", "#FC63B2", "#F760D5", "#D760E6", "#C560EF", " #B15CDE", " #9D58CE", " #8A54BE"];
                return colorList[params.dataIndex];
              },
            },
          },
          label: {
            right: 0,
            normal: {
              show: true,
              position: [480, 8],
              textStyle: {
                color: "#343A40",
                fontSize: 14,
              },
              formatter: "{c}%",
            },

          },
          data: xData,
        },
        { // For shadow
          type: 'bar',
          // stack: 'chart',
          // silent: true,
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false

        },
        //  {
        //   type: 'bar',
        //   stack: 'chart',
        //   // yAxisIndex: 1,
        //   silent: true,
        //   itemStyle: {
        //     normal: {
        //       color: '#eee'
        //     }
        //   },
        //   data: xData.map( (item) => {
        //     return 100 - item;
        //   })
        // }
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
