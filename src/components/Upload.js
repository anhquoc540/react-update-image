import React, { useCallback, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Form, Button, Input } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';






const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const App = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [image, setImage] = useState();
    const [file, setFile] = useState();
    const handleChange = useCallback((info) => {

        if (info.file.status === 'uploading') {
            setImageUrl({ loading: true, image: null });
            info.file.status = 'done';
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => {
                const img = new Image();
                img.src = imageUrl;
                img.addEventListener('load', function () {
                    setImageUrl({ loading: false, image: imageUrl });

                });
            });
        }
    }, []);
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const getFile = (e) => {
        console.log('Upload event:', e);
        setFile(e)
    };



    const onFinish = async (values) => {
        console.log(values)
        const formData = new FormData();
        // for (const name in values) {
        //     formData.append(name, values[name]); // there should be values.avatar which is a File object
        // }
        formData.append('file', file);
        formData.append('id', values.id);

        const config = {
            "headers": {
                "content-type": 'multipart/form-data;'
            }
        }
        setLoading(true)

        const res = await axios.post("http://localhost:7011/upload", formData, config
        );
        // handle res however you want
        if (res.status === 200) {
            setImage(res.data)
            setLoading(false)
            toast.success("Success Notification !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }



    }

    const onDelete = async (id) => {
        // console.log(values)
        // const formData = new FormData();
        // // for (const name in values) {
        // //     formData.append(name, values[name]); // there should be values.avatar which is a File object
        // // }
        // formData.append('file', file);
        // formData.append('id', 1);

        // // const config = {
        // //     "headers": {
        // //         "content-type": 'multipart/form-data;'
        // //     }
        // // }
        setLoading(true)

        const res = await axios.delete(`http://localhost:7011/delete?id=${id}`
        );
        // handle res however you want
        if (res.status === 200) {
            //setImage(res.data)
            setLoading(false)
            toast.success("Success Notification !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }



    }



    return (
        <>

            <Form
                form={form}
                onFinish={onFinish}>

                <Form.Item name='id'>
                    <Input type='text' />
                </Form.Item>
                <Form.Item getValueFromEvent={getFile}>

                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        action="http://localhost:7011/upload"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}

                        customRequest={(options) => {
                            setFile(options.file)
                        }}
                    // customRequest={dummyRequest}

                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl.image}
                                alt="avatar"
                                style={{
                                    width: '90%',
                                }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Save
                    </Button>
                </Form.Item>
            </Form>
            {image}
            {loading ? <LoadingOutlined /> : <>
                <img
                    src={image}
                    alt="avatar"
                    style={{
                        width: '100%',
                    }}
                />

                <Button type='primary' onClick={() => onDelete(image)}>
                    Delete
                </Button>

            </>



            }



        </>


    );
};
export default App;