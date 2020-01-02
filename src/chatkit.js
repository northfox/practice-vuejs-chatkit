import { ChatManager, TokenProvider } from '@pusher/chatkit-client'

const VUE_APP_INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR
const VUE_APP_TOKEN_URL = process.env.VUE_APP_TOKEN_URL
// const VUE_APP_MESSAGE_LIMIT = Number(process.env.VUE_APP_MESSAGE_LIMIT) || 10

let currentUser = null
// let activeRoom = null

async function connectUser(userId) {
  const chatManager = new ChatManager({
    instanceLocator: VUE_APP_INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: VUE_APP_TOKEN_URL }),
    userId
  })
  currentUser = await chatManager.connect()
  return currentUser
}

export default {
  connectUser
}
