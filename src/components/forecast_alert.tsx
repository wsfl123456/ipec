import * as React from "react";
import close from "assets/images/ic_close.svg";
import "@assets/scss/model.scss";

interface IModelProps {
  message: string,
  onClose: Function,
  onCancel: Function,
  buttonValue?: string,
  onHide?: Function,
  onSubmit?: Function,
}

interface IModelState {
  isShow: string,

}

export default class ForecastAlert extends React.Component<IModelProps, IModelState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: "block"
    };
  }

  render() {
    const { message, onClose, buttonValue, onSubmit, onCancel } = this.props;
    return (
      <div className="model model-info">
        <div
          className='menban'
          onClick={() => onClose()}
        />
        <div className="model-container">
          <div className="model-body">
            {message}
            <img src={close} alt="" onClick={() => {
              onCancel();
            }}/>
          </div>
          <div className="model-footer">
            <button
              className='btn btn-submit'
              style={{'background': '#fff', 'color': '#6248ff', 'border': '1px solid #6248ff'}}
              onClick={() => {
                onClose();
              }}
            >
              {buttonValue || "不保留"}
            </button>
            <button
              className='btn btn-submit'
              onClick={() => {
                onClose();
                onSubmit && onSubmit();
              }}
            >
              {buttonValue || "保留"}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
