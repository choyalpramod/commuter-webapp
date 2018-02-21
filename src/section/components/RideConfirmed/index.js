import React from 'react';
import './index.css';

export default class RideConfirmed extends React.Component {
    render(){        
        return(
            <div className="">
                <div className="">
                    {this.props.label}
                    <div className="">
                        <div className=""></div>
                    </div>
                </div>
                <div className="model"></div>
            </div>
        )
    }
};