import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Modal } from 'antd';
import ModalForm from './AddNewForm';
const originData = [];
for (let i = 0; i < 4; i++) {
    originData.push({
        key: i.toString(),
        from: i + 1,
        to: i + 4,
        price: 10000 * i,
        unit: "set"
    });
}
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    min,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={min} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title}!`,
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
const TableEditable = (props) => {
    const [data, setData] = useState(originData);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalText, setModalText] = useState('Content of the modal');

    const [editingKey, setEditingKey] = useState('');

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };



    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            from: '',
            to: '',
            price: '',
            unit: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const handleDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                console.log(row, key)
                setData(newData);
                setEditingKey('');
            } else {
                setEditingKey('');
            }

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Từ',
            dataIndex: 'from',
            width: '15%',
            editable: true,
        },
        {
            title: 'Đến',
            dataIndex: 'to',
            width: '15%',
            editable: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '20%',
            editable: true,
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            width: '10%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a style={{ color: "red" }}>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (<div className='px-1'>
                    <Typography.Link disabled={editingKey !== ''} style={{
                        marginRight: 8,
                    }} onClick={() => edit(record)}>
                        Chỉnh sửa
                    </Typography.Link>

                    <span>
                        {data.length >= 1 ? (
                            <Popconfirm disabled={editingKey !== ''} title="Sure to delete?" onConfirm={() => handleDelete(record.key)} >
                                <a style={{ color: "red" }}>Xóa</a>
                            </Popconfirm>
                        ) : null}

                    </span>

                </div>



                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'unit' ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                min: col.dataIndex === 'price' ? 10000 : 1
            }),
        };
    });
    return (
        <div  className='p-4'>
            <div   className='p-3 d-flex float-end'>
                <Button
                  
                    type="primary"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Add new price
                </Button>
                <ModalForm
                    open={open}
                    onCreate={save}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </div>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                />
            </Form>

        </div>

    );
};
export default TableEditable;