export const PATH = 'table'
export const SET_SORT = `${PATH}/SET_SORT `
export const SET_PAGE = `${PATH}/SET_PAGE`
export const SET_SEARCH_TERM = `${PATH}/SET_SEARCH_TERM`
export const SET_RESULT = `${PATH}/SET_RESULT`

export const createTableReducer = (state = {}, { payload = {}, type = '' }) => {
  switch (type) {
    case SET_PAGE: {
      return {
        ...state,
        page: payload.page,
      }
    }
    case SET_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: payload.searchTerm,
      }
    }
    case SET_RESULT: {
      return {
        ...state,
        result: payload.result,
      }
    }
    case SET_SORT: {
      return {
        ...state,
        sort: payload.sort,
      }
    }
    default: return state
  }
}
