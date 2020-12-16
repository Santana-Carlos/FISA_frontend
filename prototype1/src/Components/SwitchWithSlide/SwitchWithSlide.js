import React from "react";
import { Switch, Route } from "react-router-dom";
import Slider from "./Slider";
import "../Main/Main.css";

class SlideOut extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      childPosition: Slider.CENTER,
      curChild: props.children,
      curUniqId: props.uniqId,
      prevChild: null,
      prevUniqId: null,
      animationCallback: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const prevUniqId = prevProps.uniqKey || "";
    const uniqId = this.props.uniqKey || "";
    let prev = 0;
    let now = 0;

    if (prevUniqId !== uniqId) {
      switch (prevUniqId) {
        case "/dashboard":
          break;
        case "/dashboard/organizacion":
          prev = 1;
          break;
        case "/dashboard/contacto":
          prev = 2;
          break;
        case "/dashboard/seguimiento":
          prev = 3;
          break;
        case "/dashboard/reportes":
          prev = 4;
          break;
        case "/dashboard/administracion":
          prev = 5;
          break;
        case "/dashboard/seguridad":
          prev = 6;
          break;
        default:
          break;
      }
      switch (uniqId) {
        case "/dashboard":
          break;
        case "/dashboard/organizacion":
          now = 1;
          break;
        case "/dashboard/contacto":
          now = 2;
          break;
        case "/dashboard/seguimiento":
          now = 3;
          break;
        case "/dashboard/reportes":
          now = 4;
          break;
        case "/dashboard/administracion":
          now = 5;
          break;
        case "/dashboard/seguridad":
          now = 6;
          break;
        default:
          break;
      }
      if (prev > now) {
        this.setState({
          childPosition: Slider.TO_RIGHT,
          curChild: this.props.children,
          curUniqId: uniqId,
          prevChild: prevProps.children,
          prevUniqId,
          animationCallback: this.swapChildrenL,
        });
      } else {
        this.setState({
          childPosition: Slider.TO_LEFT,
          curChild: this.props.children,
          curUniqId: uniqId,
          prevChild: prevProps.children,
          prevUniqId,
          animationCallback: this.swapChildrenR,
        });
      }
    }
  }

  swapChildrenL = () => {
    this.setState({
      childPosition: Slider.FROM_LEFT,
      prevChild: null,
      prevUniqId: null,
      animationCallback: null,
    });
  };

  swapChildrenR = () => {
    this.setState({
      childPosition: Slider.FROM_RIGHT,
      prevChild: null,
      prevUniqId: null,
      animationCallback: null,
    });
  };

  render() {
    return (
      <Slider
        position={this.state.childPosition}
        animationCallback={this.state.animationCallback}
        className="o-switch"
      >
        {this.state.prevChild || this.state.curChild}
      </Slider>
    );
  }
}

const animateSwitch = (CustomSwitch, AnimatorComponent) => ({
  updateStep,
  children,
}) => (
  <Route
    render={({ location }) => (
      <AnimatorComponent uniqKey={location.pathname} updateStep={updateStep}>
        <CustomSwitch location={location}>{children}</CustomSwitch>
      </AnimatorComponent>
    )}
  />
);

const SwitchWithSlide = animateSwitch(Switch, SlideOut);

export default SwitchWithSlide;
