import chatkit from '../chatkit'

function handleError(commit, error) {
  const message = error.message || error.info.error_description
  commit('setError', message)
}

export default {
  async login({ commit, state }, userId) {
    try {
      commit('setError', '')
      commit('setLoading', true)
      // user
      const currentUser = await chatkit.connectUser(userId)
      commit('setUser', {
        username: currentUser.id,
        name: currentUser.name
      })
      // rooms
      const rooms = currentUser.rooms.map((room) => ({
        id: room.id,
        name: room.name
      }))
      commit('setRooms', rooms)
      // subscribe
      const activeRoom = state.activeRoom || rooms[0]
      commit('setActiveRoom', {
        id: activeRoom.id,
        name: activeRoom.name
      })
      await chatkit.subscribeToRoom(activeRoom.id)
      return true
    } catch (error) {
      handleError(commit, error)
    } finally {
      commit('setLoading', false)
    }
  }
}
