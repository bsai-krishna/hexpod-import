import React, { Component } from "react"
import { renderToString } from "react-dom/server"
import LegPoseWidget from "./LegPoseWidgets"
import { Card, ToggleSwitch, BasicButton, NumberInputField, Slider } from "../generic"
import { DEFAULT_POSE } from "../../templates"
import { SECTION_NAMES, LEG_NAMES, RESET_LABEL } from "../vars"

class ForwardKinematicsPage extends Component {
    pageName = SECTION_NAMES.forwardKinematics
    state = { WidgetType: NumberInputField }

    componentDidMount() {
        this.props.onMount(this.pageName)
    }

    reset = () => this.props.onUpdate(DEFAULT_POSE)

    updatePose = (name, angle, value) => {
        const pose = this.props.params.pose
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        this.props.onUpdate(newPose)
    }

    currentlySlider = () => this.state.WidgetType === Slider

    toggleMode = () => {
        const WidgetType = this.currentlySlider() ? NumberInputField : Slider
        this.setState({ WidgetType })
    }

    makeCell = name => (
        <div className="cell">
            <LegPoseWidget
                key={name}
                name={name}
                pose={this.props.params.pose[name]}
                onUpdate={this.updatePose}
                WidgetType={this.state.WidgetType}
                renderStacked={this.currentlySlider()}
            />
        </div>
    )

    get toggleSwitch() {
        return (
            <ToggleSwitch
                id="FwdKinematicsSwitch"
                value={renderToString(this.state.WidgetType)}
                handleChange={this.toggleMode}
                showValue={false}
            />
        )
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>} other={this.toggleSwitch}>
            <div className="grid-cols-2">
                {LEG_NAMES.map(name => this.makeCell(name))}
            </div>
            <BasicButton handleClick={this.reset}>{RESET_LABEL}</BasicButton>
        </Card>
    )
}

export default ForwardKinematicsPage
