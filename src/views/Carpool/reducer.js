export const availableCabs = function (state = null, action) {
    switch (action.type) {
        case 'updateAvailableCabs':
            return Object.assign({}, action.payload);
        default: break;
    }
    return state;
}
