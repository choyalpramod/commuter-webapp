import {combineReducers} from 'redux';
import { user, activeUser } from '../../views/Home/reducer';
import { availableCabs } from '../../views/Carpool/reducer';

const Reducers = combineReducers({
  availableCabs,
  activeUser,
  user
});

export default Reducers;
