import React from 'react';
import './index.css';

export default class RideConfirmed extends React.Component {

    close(){
        this.props.closeWindow();
    }

    render(){        
        return(
            <div className="">
                <div className="confirmed-popup text-align-center">
                    <i className="fa fa-times" onClick={this.close.bind(this)}></i>
                    <div className="msg">{this.props.label}</div>
                    <div class="circle-loader">
                        <div class="checkmark draw"></div>
                    </div>
                </div>
                <div className="model" onClick={this.close.bind(this)}></div>
            </div>
        )
    }
};