import Vuex from 'vuex'
export default new Vuex.createStore({
  state: {
    vIndex:0,
    sIndex:0
  },
  mutations: {
    setVIndex(state,indexes){
      state.vIndex=indexes.index
      state.sIndex=indexes.subIndex
    },
    increVIndex(state){
      state.vIndex++
    },
    decreVIndex(state){
      state.vIndex--
    },
    increSIndex(state){
      state.sIndex++
    },
    decreSIndex(state){
      state.sIndex--
    },
    makeSIndexZero(state){
      state.sIndex=0
    },
    setPreSIndex(state,preIndex){
      state.sIndex=preIndex
    }
  },
  actions: {
  },
  modules: {
  }
})
