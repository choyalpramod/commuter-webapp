export const activeUser = function (state = null, action) {
    switch (action.type) {
        case 'updateActiveUser':
            return Object.assign({}, action.payload);
        default: break; 
    }
    return state;
}

export const user = function (state = null, action) {
    switch (action.type) {
        case 'updateUser':
        return Object.assign({}, action.payload);
        default: break; 
    }
    return state;
}
