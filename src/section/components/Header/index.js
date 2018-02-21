import React from 'react';
import './index.css';
import { updateActiveUser } from '../../../views/Home/action.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateLocalStorage} from '../../constants/constants';
// import {browserHistory} from 'react-router';

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            showLogout: false
        });
    }

    logout(){
        this.setState({
            showLogout: false
        })
        updateLocalStorage('activeUser',{});
        window.location.href = window.location.origin;
    }

    render(){
        let { activeUser, label } = this.props;
        return (
            <div className="header full-width">
                <img 
                    className="logo" 
                    src={'assets/img/logo.png'}/>
                {(activeUser && Object.keys(activeUser).length > 0) && 
                    <div className="header-user text-align-center">
                        <i className="fa fa-user cursor-pointer" onClick={()=>{
                            this.setState({
                                showLogout: !this.state.showLogout
                            });
                        }}></i>
                        {this.state.showLogout &&
                            <div
                                className="logout" 
                                onClick={this.logout.bind(this)}>
                            Logout
                            </div>
                        }
                    </div>
                }
                <div className="header-title">{label}</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        updateActiveUser: updateActiveUser
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
