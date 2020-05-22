import { Effect, Reducer } from 'umi';
import { getCourseList } from '@/services/ybdk';

export interface Course {
  id: string;
  name: string;
  kId: number;
}

export interface YbdkStateType {
  courseList: Course[];
}

export interface YbdkModelType {
  namespace: 'ybdk',
  state: YbdkStateType;
  reducers: {
    saveCourseList: Reducer;
  };
  effects: {
    fetchCourseList: Effect;
  }
}

const YbdkModel: YbdkModelType = {
  namespace: 'ybdk',
  state: {
    courseList: []
  },
  reducers: {
    saveCourseList(state, action){

      return {
        ...state,
        courseList: action.payload
      }
    }
  },
  effects: {
    *fetchCourseList(action ,{ call, put }){
      const response = yield call(getCourseList);
      // 注意put的时候也必须yield
      yield put({
        type:'saveCourseList',
        payload: response
      })
    }

  },

};

export default YbdkModel;
