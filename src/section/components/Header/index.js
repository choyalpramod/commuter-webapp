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
                <img src={'assets/img/logo.png'}/>
                <div className="">{label}</div>
                {(activeUser && Object.keys(activeUser).length > 0) && 
                    <div className="">
                        <i className="fa fa-user-o" onClick={()=>{
                            this.setState({
                                showLogout: !this.state.showLogout
                            });
                        }}></i>
                        {this.state.showLogout &&
                            <div onClick={this.logout.bind(this)}>Logout</div>
                        }
                    </div>
                }
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
