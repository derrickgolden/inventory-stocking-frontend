import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Upload } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCounter} from "../../redux/rtk/features/counter/counterSlice";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";

import fileConfig from "../../utils/fileConfig";
import BigDrawer from "../Drawer/BigDrawer";
import AddProductCategory from "../ProductSubcategory/addProductSubcategory";
import AddUser from "../user/addUser";
import CreateDrawer from "../CommonUi/CreateDrawer";

const AddCounter = () => {
  const users = useSelector((state) => state.users?.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllStaff({ page: 1, count: 100, status: true }));
  }, [dispatch]);

  const [thumbFileList, setThumbFileList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [form] = Form.useForm();

  const [counterDescription, setCounterDescription] = useState("");

  const onFinish = async (values) => {
    try {
      let formData = new FormData();

      if (thumbFileList.length > 0 && thumbFileList[0]?.originFileObj) {
        formData.append(
          fileConfig() === "laravel" ? "images[]" : "images",
          thumbFileList[0].originFileObj
        );
      }

      formData.append("name", values.name);
      formData.append("staffId", values.staffId);
      formData.append("description", counterDescription);

      const resp = await dispatch(addCounter(formData));

      if (resp.payload.message === "success") {
        form.resetFields();
        setThumbFileList([]);
        setCounterDescription("");
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
  };

  const handelThumbImageChange = ({ fileList }) => {
    setThumbFileList(fileList);
  };

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      style={{ marginLeft: "40px", marginRight: "40px" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        style={{ marginBottom: "15px" }}
        label="Counter Name"
        name="name"
        rules={[{ required: true, message: "Please input counter name!" }]}
      >
        <Input />
      </Form.Item>

		<div className='flex gap-3 items-center'>
			<Form.Item
				style={{ marginBottom: "15px" }}
				name="staffId"
				label="Select Bartender"
				rules={[{ required: true, message: "Please select bartender" }]}
			>
				<Select
					loading={!users}
					showSearch
					placeholder="Select Bartender"
					optionFilterProp="children"
				>
					{users &&
					users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
						{user.username}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			{/* <CreateDrawer permission={"create-user"} btnTitle={"Bartender"} title="Add Bartender" >
				<AddUser />
			</CreateDrawer> */}

			<BigDrawer btnTitle={"Bartender"} title="Bartender">
				<AddUser drawer={true} />
			</BigDrawer>
		</div>

      <Form.Item label="Upload Thumbnail Image" valuePropName="thumbnail_image">
        <Upload
          listType="picture-card"
          beforeUpload={() => false}
          name="image"
          fileList={thumbFileList}
          maxCount={1}
          onChange={handelThumbImageChange}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      {/* 👇 Hidden field to attach counterDescription */}
      <Form.Item name="description" hidden>
        <Input />
      </Form.Item>

      <Form.Item label="Counter Description">
        <ReactQuill
          value={counterDescription}
          onChange={(val) => {
            setCounterDescription(val);
            form.setFieldValue("description", val);
          }}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline"],
              ["link", "image"],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
          ]}
        />
      </Form.Item>

      <Form.Item className="flex justify-center mt-[24px]">
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          loading={loader}
          onClick={() => setLoader(true)}
        >
          Add Counter
        </Button>
      </Form.Item>
    </Form>
  );
};


export default AddCounter;
