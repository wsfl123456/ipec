import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
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
    // let dataShadow = [];
    // let yMax = 100;
    // for (let i = 0; i < xData.length; i++) {
    //   dataShadow.push(yMax);
    // }

    return {
      title: {
        subtext,
        subtextStyle: {
          fontSize: 16,
          color: "#4A4A4A",
        },
      },
      // tooltip: {
      //   trigger: 'item',
      // },
      grid: {
        top: 5,
        left: 65,
        bottom: 5,
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
        // max: 20,
      },
      series: [
        {
          // name: "2011年",
          type: "bar",
          // barCategory: 20,
          barCateGoryGap: '80%',
          // barGap: 20,
          barMaxWidth: 10,
          itemStyle: {
            normal: {
              color(params) {
                // build a color map as your need.
                // let colorList = ["#FF6B6B", "#FF678E", "#FC63B2", "#F760D5", "#D760E6", "#C560EF", " #B15CDE", " #9D58CE", " #8A54BE"];
                let colorList = [
                  // "#EDDAF7",
                  // "#E9D3F6",
                  "#DEBEF2",
                  "#D9B3EF",
                  "#CE9EEB",
                  "#C78EE8",
                  "#C387E6",
                  "#D760E6",
                  "#C560EF",
                  "#B15CDE",
                  "#9D58CE",
                  "#8A54BE"];
                // let colorList = ["#7B3DCB"];
                return colorList[params.dataIndex];
              },
              // color: new echarts.graphic.LinearGradient(
              //   0, 0, 0, 1,
              //   [
              //     { offset: 0, color: '#C560EF' },
              //     { offset: 0.5, color: '#A95AD8' },
              //     { offset: 1, color: '#8A54BE' }
              //   ]
              // ),
              barBorderRadius: 7, // 圆角
            },
          },
          label: {
            // show: true,
            // position: "right",
            right: 0,
            textStyle: {
              color: "#343A40",
              fontSize: 14,
            },
            // formatter: '{c}%'
          },
          data: xData,
        },
        // { // For shadow
        //   type: 'bar',
        //   itemStyle: {
        //     normal: { color: 'rgba(0,0,0,0.05)' }
        //   },
        //   barGap: '-100%',
        //   barCategoryGap: '40%',
        //   data: dataShadow,
        //   animation: false
        // },
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
