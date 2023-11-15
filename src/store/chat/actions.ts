import io, { connect } from 'socket.io-client';
import {SET_SOCKET,SET_DROPPED,SET_ACTIVE_GROUP_USER,ADD_GROUP_MESSAGE,ADD_FRIEND_MESSAGE,SET_FRIEND_MESSAGES,SET_GROUP_GATHER,SET_FRIEND_GATHER,SET_USER_GATHER,SET_ACTIVE_ROOM,DEL_GROUP,DEL_FRIEND,ADD_UNREAD_GATHER} from './mutation-types';


const actions = {   
  async connectSocket(items) {
      console.log("Asdfasdf",items)
  }

}
export default actions;