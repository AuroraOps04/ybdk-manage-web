import request from '@/utils/request';
import { Course } from '@/models/ybdk';

/**
 * 获取所有课程列表
 */
export async function getCourseList() {
  return request("/api/ybdk/course")
}

/**
 * 添加课程
 * @param course
 */
export async function addCourse(course: Course) {
  return request('/api/ybdk/course', {
    method: 'POST',
    data: course
  })
}

/**
 * 删除课程
 * @param courseId
 */
export async function removeCourse(courseId: number) {
  // TODO:  换成服务端的时候记得加路径参数
  return request('/api/ybdk/course/' + courseId, {
    method: 'DELETE'
  })

}

export async function updateCourse(course: Course) {
  // TODO: 换成服务端的时候记得加路径参数
  return request('/api/ybdk/course/' + course.id, {
    method: 'PUT',
    data: course,
  })
}
