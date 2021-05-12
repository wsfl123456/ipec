import * as React from "react";
import echarts from "echarts";
import ReactEcharts from 'echarts-for-react';
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';

interface IPie {
  data: any;
}

@inject("detail")
@observer
export default class EchartPie extends React.Component<IPie, any> {
  constructor(props){
    super(props);

  }

  componentDidMount() {
    // let myChart = echarts.init(document.querySelector(".echart-pie") as HTMLDivElement);
    // // console.log(myChart);
    // myChart.setOption({
    //   title: {
    //     subtext: "性别比例",
    //     subtextStyle: {
    //       fontSize: 16,
    //       color: "#4A4A4A",
    //     },
    //   },
    //   tooltip: {
    //     trigger: "item",
    //     // formatter: "{c}",
    //     formatter: "{b}:{c}: ({d}%)",
    //     // formatter: "{a} <br/>{b} : {c} ({d}%)"
    //   },
    //   color: [" #8570B0", "#F760D5"],
    //   legend: {
    //     show: true,
    //     orient: "vertical",
    //     right: "20",
    //     top: "150",
    //     fontSize: 14,
    //     color: "#6B7177",
    //     data: ["男", "女"],
    //     // data:[
    //     //   {
    //     //     name:"男",
    //     //     icon:"image://../assets/images/ip-detail/ic_men.svg"//格式为"image://+icon文件地址"
    //     //   },
    //     //   {
    //     //     name:"女",
    //     //     icon:"image://../assets/images/ip-detail/ic_women.svg"
    //     //
    //     //   }
    //     // ]
    //   },
    //   series: [
    //     {
    //       name: "性别比列",
    //       type: "pie",
    //       radius: "55%",
    //       center: ["38%", "55%"],
    //       data: this.props.data,
    //       // data: [
    //       //   { value: 60, name: "男" },
    //       //   { value: 40, name: "女" },
    //       // ],
    //       itemStyle: {
    //         emphasis: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: "rgba(0, 0, 0, 0.5)",
    //         },
    //         normal: {
    //           borderColor: "#FFFFFF", borderWidth: 20,
    //         },
    //
    //       },
    //       label: {
    //         normal: {
    //           show: true,
    //           position: "inner",
    //           textStyle: {
    //             fontSize: 14,
    //           },
    //           formatter: "{d}%",
    //         },
    //       },
    //     },
    //   ],
    // });
    // console.log(toJS(this.props.data));
  }
  option(){
    return{
      title: {
        subtext: "性别比例",
        subtextStyle: {
          fontSize: 16,
          color: "#4A4A4A",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}:{c}",
        // formatter: "{b}:{c}: ({d}%)",
        // formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      color: [" #8570B0", "#F760D5"],
      legend: {
        show: true,
        orient: "vertical",
        right: "20",
        top: "150",
        fontSize: 14,
        color: "#6B7177",
        data: ["男", "女"],
        // data:[
        //   {
        //     name:"男",
        //     icon:"image://../assets/images/ip-detail/ic_men.svg"//格式为"image://+icon文件地址"
        //   },
        //   {
        //     name:"女",
        //     icon:"image://../assets/images/ip-detail/ic_women.svg"
        //
        //   }
        // ]
      },
      series: [
        {
          name: "性别比列",
          type: "pie",
          radius: "55%",
          center: ["38%", "55%"],
          data: this.props.data,
          // data: [
          //   { value: 60, name: "男" },
          //   { value: 40, name: "女" },
          //   { value: 44, name: "男" },
          //   { value: 78, name: "女" },
          // ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            normal: {
              // borderColor: "#FFFFFF", borderWidth: 20,
            },

          },
          label: {
            normal: {
              show: true,
              position: "inner",
              textStyle: {
                fontSize: 14,
              },
              formatter: "{d}%",
            },
          },
        },
      ],
    }
  }

  render() {

    return (
      <div className="echart-pie">
        <ReactEcharts option={this.option()} />
      </div>
    );
  }
}
