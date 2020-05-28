import { Request, Response } from 'express';

// export default {
//   'GET /api/ybdk/course': [
//     {
//       id: '1',
//       name: '毛概',
//       kId: 189
//     },
//     {
//       id: '2',
//       name: '形势政策',
//       kId: 589,
//     }
//   ],
//   'POST /api/ybdk/course': (req: Request, res: Response) => {
//     const { kId } = req.body;
//     if( kId === 0){
//       res.send({
//         success: false,
//         code: -1,
//         message: '添加失败'
//       })
//     } else {
//       res.send({
//         success: true,
//         code: 0,
//         message: '添加成功'
//       })
//     }
//   },
//   'DELETE /api/ybdk/course/': {
//     success: true,
//     code: 0,
//     message: '删除成功'
//   },
//   'PUT /api/ybdk/course': (req: Request, res: Response) => {
//     const { kId } = req.body;
//     if( kId === 0){
//       res.send({
//         success: false,
//         code: -1,
//         message: '更新失败'
//       })
//     } else {
//       res.send({
//         success: true,
//         code: 0,
//         message: '更新成功'
//       })
//     }
//   },
// }
