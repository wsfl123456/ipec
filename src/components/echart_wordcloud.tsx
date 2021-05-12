import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import "echarts-wordcloud/src/wordCloud";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IProps {
  container: any,
  ipWordCloudData: any,
}

export default class EchartWordcloud extends React.Component<IProps, any> {

  option() {
    const { ipWordCloudData } = this.props;
    return {
      tooltip: { show: false },
      series: [{
        type: "wordCloud",
        // textRotation : [0, 45, 90, -45],
        rotationRange: [0, 0],
        textPadding: 0,
        autoSize: {
          enable: true,
          minSize: 14,
        },
        textStyle: {
          normal: {
            color() {
              let colors = [
                "#FF6B6B", "#FC63B2", "#F760D5", "#D760E6", "#F95714",
                " #B15CDE", " #9D58CE", " #8A54BE", '#fda67e', '#81cacc', '#cca8ba',
                "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074',
                '#546570', '#c4ccd3'];
              return colors[Math.round(Math.random() * 10)];
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: ipWordCloudData,
        /*data:
           [
           {
             name: "Sam S Club",
             value: 10000,
             // textStyle: {
             //   normal: {
             //     color: "black",
             //   },
             //   emphasis: {
             //     color: "red",
             //   },
             // },
           },
           {
             name: "Macys",
             value: 6181,
           },
           {
             name: "Amy Schumer",
             value: 4386,
           },
           {
             name: "Jurassic World",
             value: 4055,
           },
           {
             name: "Charter Communications",
             value: 2467,
           },
           {
             name: "Chick Fil A",
             value: 2244,
           },
           {
             name: "Planet Fitness",
             value: 1898,
           },
           {
             name: "Pitch Perfect",
             value: 1484,
           },
           {
             name: "Express",
             value: 1112,
           },
           {
             name: "Home",
             value: 965,
           },
           {
             name: "Johnny Depp",
             value: 847,
           },
           {
             name: "Lena Dunham",
             value: 582,
           },
           {
             name: "Lewis Hamilton",
             value: 555,
           },
           {
             name: "KXAN",
             value: 550,
           },
           {
             name: "Mary Ellen Mark",
             value: 462,
           },
           {
             name: "Farrah Abraham",
             value: 366,
           },
           {
             name: "Rita Ora",
             value: 360,
           },
           {
             name: "Serena Williams",
             value: 282,
           },
           {
             name: "NCAA baseball tournament",
             value: 273,
           },
           {
             name: "Point Break",
             value: 265,
           },
         ],*/
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
