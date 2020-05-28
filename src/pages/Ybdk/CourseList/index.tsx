import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Card, Table, Button, Modal, message, Form, Input, InputNumber, Popconfirm} from 'antd';
import {connect, Dispatch} from 'umi';
import {Course} from '@/models/ybdk';
import {addCourse, removeCourse, updateCourse} from '@/services/ybdk';
import styles from './index.less';
import {FormInstance} from "antd/lib/form";


interface CourseListProps {
    dispatch: Dispatch;
    courseList: Course[];
}

interface CourseListState {
    addCourseModalVisible?: boolean;
    editingKey?: string;
}


interface CollectionCreateFormProps {
    visible: boolean;
    onCreate: (course: Course) => void;
    onCancel: () => void;
}

/**
 * 创建课程的组件
 * @param visible 组件中 modal 是否显示
 * @param onCreate 创建课程的方法，接受参数为 course: Course
 * @param onCancel 点击取消或者关闭 modal 的回调方法
 * @constructor
 */
const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       visible,
                                                                       onCreate,
                                                                       onCancel,
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title="添加课程"
            okText="添加"
            cancelText="取消添加"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        // @ts-ignore
                        onCreate(values);
                    })
                    .catch(() => {
                        message.error('表单校验失败');
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="name"
                    label="课程名称"
                    rules={[{required: true, message: '必须输入课程名字'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="kId" label="课程考试Id" rules={[{required: true, message: '必须输入课程考试id'}]}>
                    <InputNumber min={0}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Course;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       editing,
                                                       dataIndex,
                                                       title,
                                                       inputType,
                                                       record,
                                                       index,
                                                       children,
                                                       ...restProps
                                                   }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;

    return (
        <td {...restProps}>
            {/* 在这里判断是否是当前编辑的行，如果是正在编辑的行才会返回表单 */}
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `请输入${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

// @ts-ignore
@connect(({ybdk: {courseList}}) => ({courseList}))
// React.Component<PropsInterface, StateInterFace >
class CourseList extends React.Component<CourseListProps, CourseListState> {
    constructor(props: CourseListProps) {
        super(props);
        this.state = {
            addCourseModalVisible: false,
            editingKey: ''
        };

    }


    componentDidMount() {
        this.getCourseList();
    }

    formRef = React.createRef<FormInstance>();


    /**
     * 确认是当前行是否被编辑
     */
    isEditing(record: Course): boolean {
        return record.id === this.state.editingKey;
    }

    cancelEditing = (): void => {
        message.info('取消更新')
        this.setState({editingKey: ''})
    }
    editRow = (record: Course) => {
        // @ts-ignore
        this.formRef.current.setFieldsValue({name: '', age: '', address: '', ...record});
        this.setState({
            editingKey: record.id
        })
    }
    updateCourse = async () => {
        try {

            // @ts-ignore 获取当前编辑的行的数据
            // 因为只有被编辑的行才处在表单上面。所以这个可以获取被编辑的数据
            // var as Type 类型转换
            const row = (await this.formRef.current.validateFields()) as Course;
            row.id = this.state.editingKey as string;
            row.kId = row.kId as number;
            // 发送更新请求
            const {code, message: msg} = await updateCourse(row);
            if (code === 200) {
                message.success(msg);
                // TODO: 修改数据源中当前行的值
                this.setState({
                    editingKey: '',
                })
            } else {
                message.error(msg);
            }
        } catch (errInfo) {
            message.warn(`Validate Failed: ${errInfo}`);
        }
    }


    getCourseList = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'ybdk/fetchCourseList',
        });
    };

    addCourse = async (course: Course) => {
        const response = await addCourse(course);
        if (response.code === 200) {
            message.success(response.message);
            this.setState({
                addCourseModalVisible: false,
            });
        } else {
            message.error(response.message);
        }


    };

    removeCourse = async (courseId: number): Promise<void> => {
        const response = await removeCourse(courseId);
        if (response.code === 200) {
            message.success(response.message)
            this.getCourseList();
        } else {
            message.error(response.message)
        }
    };

    handleCancel = () => {
        message.info('取消添加课程');
        this.setState({
            addCourseModalVisible: false
        });
    };

    render() {
        const columns = [
            {
                name: '课程名',
                dataIndex: 'name',
                editable: true,
            },
            {
                name: '课程考试Id',
                dataIndex: 'kId',
                editable: true,
            },
            {
                render: (_: any, record: Course) => {
                    const editable = this.isEditing(record);

                    return editable ? (
                        <span>
            <a onClick={() => this.updateCourse()} style={{marginRight: 8}}>
              save
            </a>
            <Popconfirm title="确认取消更新?" onConfirm={this.cancelEditing}>
              <a>cancel</a>
            </Popconfirm>
          </span>
                    ) : (
                        <span>
							<a disabled={this.state.editingKey !== ''} onClick={() => this.editRow(record)}>
							edit
						</a>
						<a onClick={this.removeCourse}>delete</a>
						</span>
                    );
                },
                name: 'action',
            },
        ];

        const {addCourseModalVisible} = this.state;

        const mergedColumns = columns.map((col: any) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: Course) => ({
                    record,
                    inputType: col.dataIndex === 'kId' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.name,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <PageHeaderWrapper>
                <Card>
                    <Button type='primary' className={styles.addButton} onClick={() => {
                        this.setState(
                            {addCourseModalVisible: true},
                        );
                    }}>{'添加课程'}</Button>
                    <CollectionCreateForm onCancel={this.handleCancel} onCreate={this.addCourse}
                                          visible={addCourseModalVisible}/>
                    {/* TODO: 允许行编辑功能 */}
                    <Form component={false} ref={this.formRef}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            rowKey={record => record.id}
                            dataSource={this.props.courseList}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                        />
                    </Form>

                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default CourseList;
