import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import moment from 'moment'
import store from './store/index'

const VUE_APP_INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR
const VUE_APP_TOKEN_URL = process.env.VUE_APP_TOKEN_URL
const VUE_APP_MESSAGE_LIMIT = Number(process.env.VUE_APP_MESSAGE_LIMIT) || 10

let currentUser = null
let activeRoom = null

async function connectUser(userId) {
  const chatManager = new ChatManager({
    instanceLocator: VUE_APP_INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: VUE_APP_TOKEN_URL }),
    userId
  })
  currentUser = await chatManager.connect()
  return currentUser
}

function setMembers() {
  const members = activeRoom.users.map((user) => ({
    username: user.id,
    name: user.name,
    presence: user.presence.state
  }))
  store.commit('setUsers', members)
}

async function subscribeToRoom(roomId) {
  store.commit('clearChatRoom')
  activeRoom = await currentUser.subscribeToRoom({
    roomId,
    messageLimit: VUE_APP_MESSAGE_LIMIT,
    hooks: {
      onMessage: (message) => {
        store.commit('addMessage', {
          name: message.sender.name,
          username: message.senderId,
          text: message.text,
          date: moment(message.createdAt).format('YYYY-MM-D h:mm:ss')
        })
      },
      onPresenceChanged: () => {
        setMembers()
      },
      onUserStartedTyping: (user) => {
        store.commit('setUserTyping', user.id)
      },
      onUserStoppedTyping: () => {
        store.commit(('setUserTyping', null))
      }
    }
  })
  setMembers()
  return activeRoom
}

export default {
  connectUser,
  subscribeToRoom
}
