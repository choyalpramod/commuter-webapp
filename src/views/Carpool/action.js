import * as constants from '../../section/constants/constants';

export const updateAvailableCabs = (data)=>{
    constants.updateLocalStorage('availableCabs', data);
    return {
        type: 'updateAvailableCabs',
        payload: data
    }
}