import React from 'react';
import './index.css';

export default class AvailableCab extends React.Component {

    cabSelected(key){
        this.props.onSelect(key);
    }

    render(){
        let { name, route, car, seatsLeft, key } = this.props.details;
        if(seatsLeft <=0 ){
            return null;
        }
        
        return(
            <div className="" onClick={this.cabSelected.bind(this, key)}>
                <div className="">
                    {!this.props.selected && 
                        <i className="fa fa-user-o" />
                    }
                    {this.props.selected && 
                        <i className="fa fa-check" />
                    }
                </div>
                <div className="">
                    <div>
                        <div>{name} <span>6 mins(s) away</span></div>
                        <div className="">
                            <span>4.5 | <i className="fa fa-star" /></span>
                        </div>
                    </div>
                    <div>Route: {route}</div>
                    <div>Car: {car} &nbsp;&nbsp; Seats: {seatsLeft}</div>
                </div>
                <i className="fa fa-phone" />
            </div>
        )
    }
}