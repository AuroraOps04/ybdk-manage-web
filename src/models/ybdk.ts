import { Effect, Reducer } from 'umi';
import { getCourseList } from '@/services/ybdk';
import {message} from "antd";

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
      if(response.code !== 200){
        message.error("无法获取到课程列表")
      }
      // 注意put的时候也必须yield
      yield put({
        type:'saveCourseList',
        payload: response.data
      })
    }

  },

};

export default YbdkModel;
