import { Table, Select, Input, Button, Modal, Form, InputNumber } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState, useRef } from "react";
import "./Processor.css";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchRamCapacity: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const Ram = () => {
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState([]);
  const [data, setData] = useState();
  const [rams, setRams] = useState();
  const [processor, setProcessor] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [searchName, setSearchName] = useState();
  const [cpuTechnology, setCpuTechnology] = useState();
  const [cpuCompany, setCpuCompany] = useState("2");
  const [searchStatus, setSearchStatus] = useState();
  const [formEdit] = Form.useForm();
  const [isDraft, setIsDraft] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const inputRef = useRef(null);

  const onReset = () => {
    form.resetFields();
  };

  const [clearForm] = Form.useForm();

  const onClearForm = () => {
    clearForm.resetFields();
    onchangeSearch();
  };
  const columns = [
    {
      title: "Lo???i Ram",
      dataIndex: "typeOfRam",
      width: "7%",
    },
    {
      title: "Dung l?????ng Ram",
      dataIndex: "ramCapacity",
      width: "14%",
    },
    {
      title: "T???c ????? ram",
      dataIndex: "ramSpeed",
      width: "8%",
    },
    {
      title: "H??? tr??? RAM t???i ??a",
      dataIndex: "maxRamSupport",
      width: "11.5%",
    },
    {
      title: "S??? Ram onboard",
      dataIndex: "onboardRam",
      width: "10.7%",
    },
    {
      title: "S??? khe c???m r???i",
      dataIndex: "looseSlot",
      width: "10%",
    },
    {
      title: "S??? khe RAM c??n l???i",
      dataIndex: "remainingSlot",
      width: "12.5%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "12%",
      render: (status) => {
        if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Nh??p
              </div>
            </>
          );
        }
        if (status === "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Ho???t ?????ng
              </div>
            </>
          );
        } else if (status === "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
              >
                Kh??ng ho???t ?????ng
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao t??c",
      dataIndex: "id",
      dataIndex: "data",
      width: "11%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <DeleteOutlined
                onClick={() => onDelete(data)}
                style={{ color: "red" }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
              <UnlockOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("M??? kh??a th??nh c??ng!");
                }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Kho?? th??nh c??ng !");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("M??? kh??a th??nh c??ng!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }}
              />
            </>
          );
        }
        return (
          <>
            <EyeOutlined
              onClick={() => {
                onView(data);
              }}
            />
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                showModalE(data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(data)}
              style={{ color: "red", fontSize: "20px", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const loadDataRam = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setRams(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onDelete = (record) => {
    Modal.confirm({
      icon: <CloseCircleOutlined />,
      title: "Xo?? RAM ",
      content: `B???n c?? mu???n xo?? ram ${record.ramCapacity} ${record.ramSpeed} kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        fetch(`http://localhost:8080/api/staff/rams/${record.id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }).then((res) => loadDataRam());
      },
    });
  };

  useEffect(() => {
    loadDataRam();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [cpuCompany != undefined]);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    loadDataRam();
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    loadDataRam();
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (data) => {
    setOpen(true);
  };

  const [dataEdit, setDataEdit] = useState({});
  const showModalE = (data) => {
    setDataEdit(data);
    setOpenE(true);
    formEdit.setFieldsValue(data);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    setOpenE(false);
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      console.log("gi?? tr??? draft khi submit" + isDraft);
      if (isDraft == true) {
        data.status = "ACTIVE";
      } else {
        data.status = "DRAFT";
      }
      fetch("http://localhost:8080/api/staff/rams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => loadDataRam())
        .then((data) => {
          toastSuccess("Th??m m???i th??nh c??ng !");
          onReset();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setOpen(false);
    }
  };
  const handleSubmitE = (data) => {
    const edit = {
      id: dataEdit.id,
      categoryId: data.categoryId,
      looseSlot: data.looseSlot,
      maxRamSupport: data.maxRamSupport,
      onboardRam: data.onboardRam,
      ramCapacity: data.ramCapacity,
      ramSpeed: data.ramSpeed,
      remainingSlot: data.remainingSlot,
      status: dataEdit.status,
      typeOfRam: data.typeOfRam,
    };
    fetch(`http://localhost:8080/api/staff/rams/` + edit.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(edit),
    })
      .then((response) => loadDataRam())
      .then((data) => {
        toastSuccess("C???p nh???t th??nh c??ng!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setOpenE(false);
  };

  const clearSearchForm = () => {
    loadDataRam();
    setSearchName("");
    setSearchStatus();
    onClearForm();
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  const validateMessages = {
    required: "${label} kh??ng ???????c ????? tr???ng!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} ph???i l?? ki???u s???!",
    },
    number: {
      range: "${label} ph???i t??? ${min} ?????n ${max}",
    },
  };

  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "170px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-4 mt-4">
          <label>Nh???p dung l?????ng ram</label>
          <Input
            placeholder="Nh???p dung l?????ng ram"
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-4">
          <Form
            form={clearForm}
            name="nest-messages"
            className="me-2 ms-2"
            layout="vertical"
            autoComplete="off"
            onFinish={(values) => {
              search();
            }}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            <Form.Item name="select">
            <label>Tr???ng th??i</label>
              <br />
              <Select
                allowClear={true}
                style={{ width: "400px", borderRadius: "5px" }}
                showSearch
                placeholder="Ch???n tr???ng th??i"
                optionFilterProp="children"
                onChange={changeSearchStatus}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Select.Option value="ACTIVE" selected>
                  Ho???t ?????ng
                </Select.Option>
                <Select.Option value="INACTIVE">Kh??ng ho???t ?????ng</Select.Option>
                <Select.Option value="DRAFT">Nh??p</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className="col-12 text-center mb-4">
          <Button
            className="mt-2"
            type="primary-uotline"
            onClick={clearSearchForm}
            shape="round"
          >
            <ReloadOutlined />
            ?????t l???i
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
            shape="round"
          >
            <SearchOutlined />
            T??m ki???m
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={showModal}
            shape="round"
          >
            <PlusOutlined /> Th??m m???i
          </Button>
          <Modal
            title="T???o m???i"
            open={open}
            onOk={handleOk}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
          >
            <Form
             form={form}
              validateMessages={validateMessages}
              initialValues={{
                cpuCompany,
              }}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmit(values);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung l?????ng RAM"
                rules={[
                  {
                    required: true,
                    message: "Dung l?????ng ram kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
              >
                <Input placeholder="Nh???p dung l?????ng RAM" ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Lo???i RAM"
                rules={[
                  {
                    required: true,
                    message: "Lo???i ram kh??ng ???????c ????? tr???ng",
                  },
                ]}
              >
                <Input placeholder="Nh???p lo???i ram" />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="T???c ????? RAM"
                rules={[
                  {
                    required: true,
                    message: "T???c ????? RAM kh??ng ???????c ????? tr???ng",
                  },
                ]}
              >
                <Input placeholder="Nh???p t???c ????? RAM" />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="S??? khe c???m r???i"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,   
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="S??? khe c???m r???i" />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                label="S??? khe c??n l???i"
                rules={[
                  {
                    
                    type:"number",
                    min: 1,
                    max: 100,
                    required: true,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nh???p s??? khe c??n l???i" />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="S??? RAM onboard"
                rules={[
                  {
                    type: "number",
                      required: true,
                      min: 1,
                      max: 1000,      
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="S??? RAM onboard" />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                label="H??? tr??? RAM t???i ??a "
                rules={[
                  {
                    required: true,
                    message: "H??? tr??? RAM t???i ??a kh??ng ???????c ????? tr???ng",
                  },
                ]}
              >
                <Input placeholder="Nh???p h??? tr??? RAM t???i ??a" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      onClick={() => onChangeIsDraft(true)}
                      style={{ width: "100px", marginLeft: "170px" }}
                    >
                      T???o m???i
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      onClick={() => onChangeIsDraft(false)}
                      danger
                      style={{ width: "100px", marginLeft: "150px" }}
                    >
                      T???o nh??p
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "130px" }}
                    >
                      Hu???
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          {/* modal edit */}
          <Modal
            title="C???p nh???t"
            open={openE}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={650}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitE(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung l?????ng RAM"
                initialValue={dataEdit.ramCapacity}
                rules={[
                  {
                    required: true,
                    message: "Dung l?????ng ram kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Lo???i RAM"
                initialValue={dataEdit.typeOfRam}
                rules={[
                  {
                    required: true,
                    message: "Lo???i ram kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="T???c ????? RAM"
                initialValue={dataEdit.ramSpeed}
                rules={[
                  {
                    required: true,
                    message: "T???c ????? RAM kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="S??? khe c???m r???i"
                initialValue={dataEdit.looseSlot}
                rules={[
                  {
                    required: true,
                    message: "S??? khe c???m r???i kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                initialValue={dataEdit.remainingSlot}
                label="S??? khe c??n l???i"
                rules={[
                  {
                    required: true,
                    message: "S??? khe c??n l???i kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="S??? RAM onboard"
                initialValue={dataEdit.onboardRam}
                rules={[
                  {
                    required: true,
                    message: "S??? RAM onboard ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                initialValue={dataEdit.maxRamSupport}
                label="H??? tr??? RAM t???i ??a "
                rules={[
                  {
                    required: true,
                    message: "H??? tr??? RAM t???i ??a kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      style={{ width: "100px", marginLeft: "230px" }}
                    >
                      C???p nh???t
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "170px" }}
                    >
                      Hu???
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div
        className="mt-4 row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12">
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rams}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="C???p nh???t"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              setEditing(false);
            }}
          >
            <label>
              T??n th??? lo???i
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="T??n th??? lo???i" />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Ram;
