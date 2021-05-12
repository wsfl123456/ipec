import * as React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts/lib/chart/tree";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "@assets/scss/echart_bar.scss";

interface IEchartTree {
  container?: string,
  data: object,
}

export default class EchartTree extends React.Component<IEchartTree, any> {
  option() {
    const { data } = this.props;
    return {
      title: {
        text: '市场表现排名',
        left: 'center',
        textStyle: {
          color: '#4a4a4a',
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '10%',
          left: '25%',
          bottom: '10%',
          right: '25%',
          symbolSize: 12,
          orient: 'RL',
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          },
          leaves: {
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
  }

  render() {
    const { container } = this.props;
    return (
      <div className={container}>
        <ReactEcharts option={this.option()} style={{ height: 600 }}/>
      </div>
    );
  }
}
