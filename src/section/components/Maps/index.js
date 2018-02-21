import React from 'react';
import './index.css';
const _ = require("lodash");
const {compose, withProps, lifecycle} = require("recompose");
const {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} = require("react-google-maps");
const {SearchBox} = require("react-google-maps/lib/components/places/SearchBox");

export const Maps = compose(withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1k" +
            "iRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{
        height: `100%`
    }}/>,
    containerElement: <div style={{
        height: `350px`,
    }}/>,
    mapElement: <div style={{
            height: `100%`
        }}/>
}), withScriptjs, withGoogleMap, lifecycle({
    componentWillMount() {
        let google = window.google;
        let {source, destination} = this.props;
        const DirectionsService = new google
            .maps
            .DirectionsService();

        DirectionsService.route({
            origin: new google
                .maps
                .LatLng(source.lat, source.lng),
            destination: new google
                .maps
                .LatLng(destination.lat, destination.lng),
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({directions: result});
            }
        });

        const refs = {}
        this.setState({
            bounds: null,
            center: {
                lat: 41.9,
                lng: -87.624
            },
            markers: [],
            onMapMounted: ref => {
                refs.map = ref;
            },
            onBoundsChanged: () => {
                this.setState({
                    bounds: refs
                        .map
                        .getBounds(),
                    center: refs
                        .map
                        .getCenter()
                })
            },
            onDestination: ref => {
                refs.onDestination = ref;
            },
            onOrigin: ref => {
                refs.onOrigin = ref;
            },
            onOriginChanged: () => {
                const places = refs.onOrigin.getPlaces();
                const bounds = new google
                    .maps
                    .LatLngBounds();

                places.forEach(place => {
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                    } else {
                        bounds.extend(place.geometry.location)
                    }
                });
                const nextMarkers = places.map(place => ({position: place.geometry.location}));
                const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                this.setState({
                    center: nextCenter, 
                    markers: nextMarkers,
                    stateOrigin: {
                        lat: nextMarkers[0].position.lat(),
                        lng: nextMarkers[0].position.lng(),
                        address: places[0].address_components[0].long_name
                    }
                });

                let { stateOrigin, stateDestination } = this.state;
                if(stateOrigin && stateDestination){
                    this.state.setDirection();
                    this.props.onChange({
                        origin: stateOrigin,
                        destination: stateDestination
                    })
                }
            },
            setDirection: ()=>{
                let google = window.google;
                let {stateOrigin, stateDestination} = this.state;
                const DirectionsService = new google
                    .maps
                    .DirectionsService();
        
                DirectionsService.route({
                    origin: new google
                        .maps
                        .LatLng(stateOrigin.lat, stateOrigin.lng),
                    destination: new google
                        .maps
                        .LatLng(stateDestination.lat, stateDestination.lng),
                    travelMode: google.maps.TravelMode.DRIVING
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.setState({directions: result});
                    }
                });        
            },
            onDestinationChanged: () => {
                const places = refs.onDestination.getPlaces();
                const bounds = new google
                    .maps
                    .LatLngBounds();

                places.forEach(place => {
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                    } else {
                        bounds.extend(place.geometry.location)
                    }
                });
                const nextMarkers = places.map(place => ({position: place.geometry.location}));
                const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                this.setState({
                    stateDestination: {
                        lat: nextMarkers[0].position.lat(),
                        lng: nextMarkers[0].position.lng(),
                        address: places[0].address_components[0].long_name
                    }
                });

                let { stateOrigin, stateDestination } = this.state;
                if(stateOrigin && stateDestination){
                    this.state.setDirection();
                    this.props.onChange({
                        origin: stateOrigin,
                        destination: stateDestination
                    })
                }
            }
        })
    }
}))(props => {
    let google = window.google;
    let {stateSource} = props;

    if(!stateSource){
        stateSource = {
            lat: 12.9279232,
            lng: 77.62710779999998
        };
    }

    return (
        <GoogleMap
            defaultZoom={7}
            defaultCenter={new google
            .maps
            .LatLng(stateSource.lat, stateSource.lng)}>
            <SearchBox
                ref={props.onOrigin}
                controlPosition={google.maps.ControlPosition.TOP_CENTER}
                onPlacesChanged={props.onOriginChanged}>
                <div className="search-block">
                    <div className="search-child">
                        <label>Start from</label>
                        <input
                            type="text"
                            placeholder="Origin"/>
                    </div>
                </div>
            </SearchBox>

            <SearchBox
                ref={props.onDestination}
                controlPosition={google.maps.ControlPosition.TOP_CENTER}
                onPlacesChanged={props.onDestinationChanged}>
                <div className="search-block">
                    <div className="search-child">
                        <label>Destination</label>
                        <input
                            type="text"
                            placeholder="Destination"/>
                    </div>
                </div>
            </SearchBox>
            {props.directions && <DirectionsRenderer directions={props.directions}/>}
        </GoogleMap>
    )
});
