import React, {Component} from 'react';
import './index.css';
import AvailableCab from '../../section/components/AvailableCab';
import { updateUser, updateActiveUser } from '../Home/action';
import { updateAvailableCabs } from './action';
import { getLocationStorage } from '../../section/constants/constants'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Header from '../../section/components/Header';
import RideConfirmed from '../../section/components/RideConfirmed';
import {Maps} from '../../section/components/Maps';

class Carpool extends Component {
    constructor(props){
        super(props);

        this.state = ({
            selectedIndex: null,
            rideConfirmed: false,
            tripCreated: false,
        });
    }

    componentWillMount(){
        this.props.updateUser(getLocationStorage('user'));
        this.props.updateActiveUser(getLocationStorage('activeUser'));
        this.props.updateAvailableCabs(getLocationStorage('availableCabs'));
        
        setTimeout(()=>{
            let {activeUser} = this.props;
            if(!(activeUser && Object.keys(activeUser).length > 0)){
                window.location.href = window.location.origin;
            }        
        },1000);
    }

    selectCab(key){
        this.setState({
            selectedIndex: key
        });
    }

    getDataBasedOnLocation(){
        let list = [];
        try{
            let { newAddressSelected:{origin, destination} } = this.state,
                { availableCabs } = this.props,
                firstOLatIndex = parseInt(origin.lat),
                firstOLngIndex = parseInt(origin.lng),
                firstDLatIndex = parseInt(destination.lat),
                firstDLngIndex = parseInt(destination.lng),
                secondOLatIndex = parseInt((parseFloat(origin.lat) - parseInt(origin.lat)).toString().substr(2,2)),
                secondOLngIndex = parseInt((parseFloat(origin.lng) - parseInt(origin.lng)).toString().substr(2,2)),
                secondDLatIndex = parseInt((parseFloat(destination.lat) - parseInt(destination.lat)).toString().substr(2,2)),
                secondDLngIndex = parseInt((parseFloat(destination.lng) - parseInt(destination.lng)).toString().substr(2,2));
            
            let cabs = availableCabs[
                firstOLatIndex + '|' + firstOLngIndex + '/' + firstDLatIndex + '|' + firstDLngIndex
            ];

            let searchIndex = [
                this.getSearchingIndex(4, 1),
                this.getSearchingIndex(4, 2),
                this.getSearchingIndex(4, 3),
                this.getSearchingIndex(4, -1),
                this.getSearchingIndex(4, -2),
                this.getSearchingIndex(4, -3),
            ];

            if(cabs){
                searchIndex.map((searchKey, key)=>{
                    searchKey.map((value)=>{
                        if(key > 0) return;

                        let index = secondOLatIndex + value[0] + '|' + secondOLngIndex + value[1] + '/' + secondDLatIndex + value[2] + '|' + secondDLngIndex + value[3];
                        if(cabs[index]){
                            Object.keys(cabs[index]).map((key)=>{
                                list.push(cabs[index][key]);
                            })
                        }
                    })
                })
            }
        }
        catch(e){}
        return list;
    }

    getSearchingIndex(n, defaultV){
        let list = [];
        let num = 1, numList = [];

        for(let i = 0;i < n; i++){
            num *= 2;
            numList.push(num);
        }

        for(let i = 0;i < (n*n); i++){
            list[i] = [];
            for(let j = 0;j < n;j++){
                if((i % numList[j]) < (numList[j] / 2)) list[i].push('');
                else list[i].push(defaultV);
            }
        }
        return list;
    }

    confirmRide(){
        let { user, availableCabs, activeUser } = this.props,
            { selectedIndex } = this.state,
            splitIndex1 = selectedIndex.toString().split('/'), 
            splitIndex10 = splitIndex1[0].split('|'), 
            splitIndex11 = splitIndex1[1].split('|'), 
            firstOLatIndex = parseInt(splitIndex10[0]),
            firstOLngIndex = parseInt(splitIndex10[1]),
            firstDLatIndex = parseInt(splitIndex11[0]),
            firstDLngIndex = parseInt(splitIndex11[1]),
            secondOLatIndex = (parseFloat(splitIndex10[0]) - parseInt(splitIndex10[0])).toString().substr(2,2),
            secondOLonIndex = (parseFloat(splitIndex10[1]) - parseInt(splitIndex10[1])).toString().substr(2,2),
            secondDLatIndex = (parseFloat(splitIndex11[0]) - parseInt(splitIndex11[0])).toString().substr(2,2),
            secondDLonIndex = (parseFloat(splitIndex11[1]) - parseInt(splitIndex11[1])).toString().substr(2,2);

        user.details[activeUser.email].hasBookedCab = selectedIndex;
        availableCabs[
            firstOLatIndex + '|' + firstOLngIndex + '/' + firstDLatIndex + '|' + firstDLngIndex
        ][
            secondOLatIndex + '|' + secondOLonIndex + '/' + secondDLatIndex + '|' + secondDLonIndex            
        ][selectedIndex].seatsLeft -= 1;

        this.props.updateAvailableCabs(availableCabs);
        this.props.updateUser(user);
        this.setState({
            rideConfirmed: true
        });
    }

    addToTrips(){
        let { newAddressSelected: {origin, destination}} = this.state;
        let oLat = origin.lat,
            oLng = origin.lng,
            dLat = destination.lat,
            dLng = destination.lng,
            { availableCabs } = this.props,
            firstOLatIndex = parseInt(oLat),
            firstOLngIndex = parseInt(oLng),
            firstDLatIndex = parseInt(dLat),
            firstDLngIndex = parseInt(dLng),
            secondOLatIndex = (parseFloat(oLat) - parseInt(oLat)).toString().substr(2,2),
            secondOLngIndex = (parseFloat(oLng) - parseInt(oLng)).toString().substr(2,2),
            secondDLatIndex = (parseFloat(dLat) - parseInt(dLat)).toString().substr(2,2),
            secondDLngIndex = (parseFloat(dLng) - parseInt(dLng)).toString().substr(2,2);
        
        let firstIndex = firstOLatIndex + '|' + firstOLngIndex + '/' + firstDLatIndex + '|' + firstDLngIndex;
        if(!availableCabs[firstIndex]){
            availableCabs[firstIndex] = {};
        }

        let secondIndex = secondOLatIndex + '|' + secondOLngIndex + '/' + secondDLatIndex + '|' + secondDLngIndex; 
        if(!availableCabs[firstIndex][secondIndex]){
            availableCabs[firstIndex][secondIndex] = {};
        }

        let actualLocationIndex = this.getValidLocation(availableCabs[firstIndex][secondIndex], {oLat,oLng,dLat,dLng});
        availableCabs[firstIndex][secondIndex][actualLocationIndex] = {
            origin,
            destination,
            route: origin.address +'-'+ destination.address,
            email: this.props.activeUser.email,
            key: actualLocationIndex,
            seatsLeft: 3
        };
        
        this.setState({
            tripCreated: true
        });
        this.props.updateAvailableCabs(availableCabs);
        this.props.user.details[this.props.activeUser.email].trip = actualLocationIndex;
        this.props.updateUser(this.props.user);
    }

    getValidLocation(data, location, index=0){
        let newLng = location.oLat + '' + index + '|' + location.oLng  + '' + index + '/' + location.dLat + '|' + location.dLng;
        if(data[newLng]) return this.getValidLocation(data, location, index + 1);
        return newLng;
    }

    handleOnDirectionSelected(location) {
        this.setState({
            newAddressSelected: location
        });
    }
    
    getDriverCabList(){
        let { user: {details}, activeUser } =  this.props;
        if(details[activeUser.email].trip)
            return(
                <div className="">You have already created today's trip</div>
            )
        else
            return(
                <div className="">Please create today's trip</div>
            )
    }

    getTripCreatedSuccess(){
        if(this.state.tripCreated)
            return <RideConfirmed label="You have successfully created a trip!" />
        else null;
    }

    getDriverCreateButton(){
        let { user: {details}, activeUser } =  this.props;
        let attr = {
            className: 'button-btn'
        };

        if(this.state.newAddressSelected){
            attr.onClick = this.addToTrips.bind(this);
        }
        else{
            attr.disabled = true;
            attr.className += ' disabled';
        }

        if(details[activeUser.email].trip)
            return null;
        else
            return (
                <div className="">
                    <button {...attr}>POOL YOUR CAR</button>
                </div>
            )
    }

    getCustomerCabList(){
        let { user: {details}, activeUser } =  this.props;

        if(details[activeUser.email].hasBookedCab){
            return (
                <div>You have already booked a cab, please use different account to book a cab.</div>
            )
        }
        else{
            let list = this.getDataBasedOnLocation(),
                { selectedIndex } = this.state; 

            if(!(list && list.length > 0)){
                return <div>No Cabs available</div>
            }
            return(
                <div>
                {list.map((cab) =>{
                    cab.name = details[cab.email].fullName;
                    cab.car = details[cab.email].car;
                    return(
                        <AvailableCab
                            key={cab.email} 
                            onSelect={this.selectCab.bind(this)} 
                            details={cab}
                            selected={cab.key == selectedIndex}/>
                    )
                }
                )}
                </div>
            )
        }        
    }

    getCabConfirmed(){
        if(this.state.rideConfirmed)
            return <RideConfirmed label="You have successfully book the pool cab!" />
        else return null;
    }

    getBookCabButton(){
        if(this.state.rideConfirmed) return null;
        
        let buttonAttr = {
            type: 'button',
            onClick: this.confirmRide.bind(this)
        },{ 
            selectedIndex 
        } = this.state;
    
        if(!selectedIndex){
            buttonAttr.disabled = true;
        }
        return(
            <div className="">
                <button {...buttonAttr}>CONFIRM RIDE</button>
            </div>    
        )
    }

    render(){
        let { user, activeUser } =  this.props;
        let defaultObj = {
            lat: 12.9279232,
            lng: 77.62710779999998
        };
        if(!(user && activeUser)) 
            return null;

        if(user.details[activeUser.email] && user.details[activeUser.email].userType == 'driver'){
            return(
                <div>
                    <Header label='Create Trip'/>
                    <Maps source={defaultObj} destination={defaultObj} onChange={this.handleOnDirectionSelected.bind(this)}/>
                    {this.getDriverCabList()}
                    {this.getTripCreatedSuccess()}
                    {this.getDriverCreateButton()}
                </div>
            )
        }
        else{
            return(
                <div>
                    <Header label='PICK A RIDE'/>
                    <Maps source={defaultObj} destination={defaultObj} onChange={this.handleOnDirectionSelected.bind(this)}/>
                    {this.getCustomerCabList()}
                    {this.getCabConfirmed()}
                    {this.getBookCabButton()}
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        availableCabs: state.availableCabs,
        activeUser: state.activeUser,
        user: state.user
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        updateAvailableCabs: updateAvailableCabs,
        updateUser: updateUser,
        updateActiveUser: updateActiveUser
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Carpool);
