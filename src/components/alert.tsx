import * as React from "react";
import close from "assets/images/ic_close.svg";
import "@assets/scss/model.scss";

interface IModelProps {
  message: string,
  onClose: Function,
  buttonValue?: string,
  onHide?: Function,
  onSubmit?: Function,
}

interface IModelState {
  isShow: string,

}

export default class Alert extends React.Component<IModelProps, IModelState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: "block"
    };
  }

  render() {
    const { message, onClose, buttonValue, onSubmit } = this.props;
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
              onClose();
            }}/>
          </div>
          <div className="model-footer">
            <button
              className='btn btn-submit'
              onClick={() => {
                onClose();
                onSubmit && onSubmit();
              }}
            >
              {buttonValue || "确定"}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
