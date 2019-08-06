import * as usersService from '../services/users'

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null
  },
  reducers: {
    //reduce方法，从payload 给的data以及total 塞进users页面modals的state中
    save(state, { payload: { data: list, total } }) {
      return { ...state, list, total }
    },
  },
  effects: {
    //effects方法，在获取接口返回的数据后调用reduce的方法save
    *fetch({ payload: { page } }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({ type: 'save', payload: { data, total: headers['x-total-count'] } });
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
