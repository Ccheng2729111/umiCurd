import * as usersService from '../services/users'

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: null
  },
  reducers: {
    //reduce方法，从payload 给的data以及total 塞进users页面modals的state中
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page }
    },
  },
  effects: {
    //effects方法，在获取接口返回的数据后调用reduce的方法save
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data,
          total: parseInt(headers['x-total-count'], 10),
          page: parseInt(page, 10)
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //监听器，监听history的pathname是否是users 如果是的话dispatch type是fetch带有副作用的effect方法
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query })
        }
      })
    }
  }
}
