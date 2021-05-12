import * as React from "react";
import "@assets/scss/no_result.scss";
import ic_no_result from "@assets/images/contrast/ic_result_iveness.png";

export default class NoResult extends React.Component {
  render() {
   return (
     <div className="no-data">
       <img src={ic_no_result} alt=""/>
       <p>暂无数据！</p>
     </div>
   );
  }
};
