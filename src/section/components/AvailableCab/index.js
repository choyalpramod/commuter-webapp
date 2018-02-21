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
            <div className={`cabs-cards ${this.props.selected ? 'card-selected' : ''}`}>
                <div className="cabs-cards-inner" onClick={this.cabSelected.bind(this, key)}>
                    <div className="icon">
                        <i className="fa fa-user-o for-non-selected" />
                        <i className="fa fa-check for-selected" />
                    </div>
                    <i className="last-icon fa fa-phone for-selected text-align-center" />
                    <div className="last-icon for-non-selected line-height-nrml">
                        <span className="additional-info">4.5 | <i className="fa fa-star" /></span>
                    </div>
                    <div className="content">
                        <div>{name} <span className="additional-info">6 mins(s) away</span></div>
                        <div className="font-12 padding-v-2">Route: <span className="font-bold">{route}</span></div>
                        <div className="font-12">Car: <span className="font-bold">{car}</span> &nbsp;&nbsp; Seats: <span className="font-bold">{seatsLeft}</span></div>
                    </div>
                </div>
            </div>
        )
    }
}