export const updateLocalStorage = function(key, data){
    let oldData = JSON.parse(localStorage.getItem('pooling'));
    if(oldData == null){
        oldData = {
            user: {
                accounts: {},
                details: {}
            },
            availableCabs: {},
            activeUser: {}
        };
    }

    if(key && data) oldData[key] = data;

    localStorage.setItem('pooling', JSON.stringify(oldData));
}

export const getLocationStorage = function(key){
    return JSON.parse(localStorage.getItem('pooling'))[key];
}

export const googleMaps = {
    key: 'AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU'
}