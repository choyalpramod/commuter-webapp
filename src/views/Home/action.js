import {updateLocalStorage} from '../../section/constants/constants';

export const updateActiveUser = (data)=>{
    updateLocalStorage('activeUser', data);
    return {
        type: 'updateActiveUser',
        payload: data
    }
}

export const updateUser = (data)=>{
    updateLocalStorage('user', data);
    return {
        type: 'updateUser',
        payload: data
    }
}