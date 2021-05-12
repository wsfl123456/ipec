import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/map";
import "echarts/map/js/china";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IPechartMap {
  data: any,
  container?: string,
}

export default class EchartMap extends React.Component<IPechartMap, any> {

  option() {
    // {
    //   name:'',
    //   value:''
    // }
    return {
      tooltip: {
        trigger: "item",
        formatter: '{b}:{c}'
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: false, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: false },
        },
      },
      visualMap: [{
        text: ["高", "低"],
        minOpen: false,
        maxOpen: false,
        x: "right",
        realtime: false,
        // calculable: false,
        inRange: {
          color: [
            "#EDDAF7",
            "#E9D3F6",
            "#DEBEF2",
            "#D9B3EF",
            "#CE9EEB",
            "#C78EE8",
            "#C387E6",
            "#B15CDE",
            "#9D58CE",
            "#8A54BE"
          ],
        },
      }],
      series: [
        {
          type: "map",
          map: "china",
          showLegendSymbol: false,
          roam: false,
          itemStyle: {
            emphasis: { label: { show: false } },
          },
          data: this.props.data,
        },
      ],
    };
  }

  render() {
    return (
      <div className="echart-map">
        <ReactEcharts option={this.option()}/>
      </div>
    );
  }
}
