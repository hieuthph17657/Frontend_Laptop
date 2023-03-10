import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  Image,
  AutoComplete,
  Tag,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  RollbackOutlined,
  EyeOutlined,
  RetweetOutlined,
  MenuFoldOutlined,
  DownloadOutlined,
  SyncOutlined,
  QuestionCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Order/ConfirmOrder.css";
import Moment from "react-moment";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.searchName,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchPayment: params.pagination?.searchPayment,
});

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const OrderDelivering = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [dataO, setDataO] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [dataClient, setDataClient] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [optionName, setOptionName] = useState();
  const [valueDatePicker, setValueDatePicker] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DANG_GIAO",
      searchName: "",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchPayment: "",
    },
  });

  const [tableParamsUser, setTableParamsUser] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  useEffect(() => {
    loadDataOrder();
    loadDataClient();
  }, []);

  const handleOk = (record, check) => {
    const isPut = false;
    if (check == true) {
      Modal.confirm({
        title: "Nh???n ????n h??ng",
        content: `B???n c?? mu???n nh???n ????n h??ng ${record?.id} 
        c???a kh??ch h??ng ${record?.customerName}  kh??ng?`,
        okText: "C??",
        cancelText: "Kh??ng",
        onOk: () => {
          handleConfirm(true, record);
        },
      });
    } else {
      Modal.confirm({
        title: "Hu??? ????n h??ng",
        content: `B???n c?? mu???n hu??? ????n h??ng ${record?.id} 
        c???a kh??ch h??ng ${record?.customerName}  kh??ng?`,
        okText: "C??",
        cancelText: "Kh??ng",
        onOk: () => {
          handleConfirm(false, record);
        },
      });
    }
  };

  const onReset = () => {
    onchangeSearch();
    clearForm.resetFields();
  };

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParamsUser)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log("data client");
        console.log(results.data.data);
        const option = [];
        const optionName = [];
        results.data.data.forEach((item) => {
          item.information.forEach((element) => {
            if (element.phoneNumber != "none") {
              option.push({
                value: element.phoneNumber,
                id: element.id,
                fullName: element.fullName,
              });
            }
            if (element.fullName != "none") {
              optionName.push({
                value: element.fullName,
                id: element.id,
              });
            }
          });
        });
        setDataClient(option);
        setOptionName(optionName);
        setLoading(false);
        setTableParamsUser({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const columnOrderHistory = [
    {
      title: "M?? ho?? ????n",
      dataIndex: "orderId",
      width: "10%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Ng?????i x??c nh???n",
      dataIndex: "verifier",
      width: "20%",
    },
    {
      title: "Th???i gian",
      dataIndex: "createdAt",
      width: "25%",
    },
    {
      title: "T???ng ti???n",
      dataIndex: "total",

      width: "20%",
      render(total) {
        return (
          <>
            {total?.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Tr???ng th??i ????n h??ng",
      dataIndex: "status",
      width: "30%",
      render: (status) => {
        if (status === "CHUA_THANH_TOAN") {
          return (
            <>
              <Tag
                icon={<QuestionCircleOutlined />}
                style={{ width: "100%" }}
                className="pt-1 pb-1 text-center"
                color="default"
              >
                Ch??a thanh to??n
              </Tag>
            </>
          );
        }
        if (status === "CHO_XAC_NHAN") {
          return (
            <Tag
              icon={<IssuesCloseOutlined />}
              className="pt-1 pb-1 text-center"
              color="cyan"
              style={{ width: "100%" }}
            >
              Ch??? x??c nh???n
            </Tag>
          );
        }
        if (status === "CHO_LAY_HANG") {
          return (
            <>
              <Tag
                icon={<ExclamationCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="warning"
                style={{ width: "100%" }}
              >
                Ch??? l???y h??ng
              </Tag>
            </>
          );
        }
        if (status === "DANG_GIAO") {
          return (
            <>
              <Tag
                icon={<SyncOutlined spin />}
                className="pt-1 pb-1 text-center"
                color="processing"
                style={{ width: "100%" }}
              >
                ??ang giao h??ng
              </Tag>
            </>
          );
        }
        if (status === "DA_NHAN") {
          return (
            <>
              <Tag
                icon={<CheckCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="success"
                style={{ width: "100%" }}
              >
                ???? nh???n h??ng
              </Tag>
            </>
          );
        }
        if (status === "DA_HUY") {
          return (
            <>
              <Tag
                icon={<CloseCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="error"
                style={{ width: "100%" }}
              >
                ???? hu??? h??ng
              </Tag>
            </>
          );
        }
      },
    },
  ];
  const onchangeSearch = (val, dateStrings) => {
    if (dateStrings === undefined) {
      setSearchStartDate("");
      setSearchEndDate("");
    } else {
      setSearchStartDate(dateStrings[0]);
      setSearchEndDate(dateStrings[1]);
    }
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "X??c nh???n ????n h??ng",
      content: `B???n c?? mu???n x??c nh???n ????n h??ng ${record.id}  kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const search = () => {
    setDataOrder([]);
    setData([]);
    setSelectedRowKeys([]);
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DANG_GIAO";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
    loadDataOrder();
  };

  const onCancel = (record) => {
    const isPut = false;
    Modal.error({
      title: `B???n c?? mu???n hu??? ????n h??ng ${record.id}  kh??ng?`,
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const confirmOrder = (record) => {
    const sdt = record.phone;
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: "DA_NHAN",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.productId,
            total: record.total,
            quantity: record.quantity,
            status: "DA_NHAN",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };

  const showModalData = (id) => {
    fetch(
      `http://localhost:8080/api/auth/orders/get/${id}?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setDataO(results);
      });

    fetch(
      `http://localhost:8080/api/auth/orders/${id}?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOD(results);
      });
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const loadDataOrderHistoryById = (id) => {
    console.log("id ho?? ????n log ra", id);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
  };

  const loadDataOrder = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);

        const data = [];
        results.data.data?.forEach((item) => {
          data.push({
            key: item.id,
            id: item.id,
            payment: item.payment,
            customerName: item.customerName,
            total: item.total,
            status: item.status,
            quantity: item.quantity,
            createdAt: item.createdAt,
            money: item.money,
            phone: item.phone,
          });
        });
        setDataOrder(data);
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

  const columns = [
    {
      title: "M?? ????n ?????t",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Th???i gian ?????t",
      dataIndex: "createdAt",
      width: "15%",
    },
    {
      title: "Ng?????i ?????t",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "18%",
    },
    {
      title: "S??? ??i???n tho???i",
      dataIndex: "phone",
      width: "10%",
    },
    {
      title: "T???ng ti???n",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      width: "15%",
      render(total) {
        return (
          <>
            {total.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "???? thanh to??n",
      dataIndex: "money",
      width: "12%",
      render(money) {
        return (
          <>
            {money.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "H??nh th???c thanh to??n",
      dataIndex: "payment",
      width: "20%",
      render: (payment) => {
        if (payment == "VN_PAY" && payment != "NGAN_HANG") {
          return (
            <>
              <Tag color="cyan" className="pt-1 pb-1">
                Thanh to??n VNPAY
              </Tag>
            </>
          );
        }
        if (payment == "NGAN_HANG") {
          return (
            <>
              <Tag color="blue" className="pt-1 pb-1">
                Thanh to??n t??i kho???n ng??n h??ng
              </Tag>
            </>
          );
        }
        if (payment == "DAT_COC") {
          return (
            <Tag color="purple" className="pt-1 pb-1">
              Thanh to??n ti???n m???t
            </Tag>
          );
        } else {
          return (
            <>
              <Tag color="red" className="pt-1 pb-1">
                {payment}
              </Tag>
            </>
          );
        }
      },
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      with: "45%",
      render: (status) => {
        return (
          <>
            <Tag
              icon={<SyncOutlined spin />}
              className="pt-1 pb-1 text-center"
              color="processing"
              style={{ width: "100%" }}
            >
              ??ang giao h??ng
            </Tag>
          </>
        );
      },
    },
    {
      title: "Thao t??c",
      width: "35%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              className="secondary"
              shape="round"
              onClick={() => {
                showModalData(id);
              }}
            >
              Hi???n th???
            </Button>
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const OrderDelivering = (record, IsPut) => {
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: record.phone | undefined,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };

  const clearSearchForm = () => {
    onReset();
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });

    setSelectedRowKeys([]);
    tableParams.pagination.current = 1;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DANG_GIAO";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setSearchName("");
    setPhoneClient("");
    setValueDatePicker("");
    onchangeSearch([]);
    setSearchStartDate("");
    setSearchEndDate("");
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const confirmCheckBox = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "X??c nh???n ????n h??ng ",
      content: `B???n c?? mu???n x??c nh???n nh???ng ????n h??ng n??y kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

  const cancelCheckBox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Hu??? ????n h??ng ",
      content: `B???n c?? mu???n hu??? nh???ng ????n h??ng n??y kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

  const handleConfirm = (isPut, record) => {
    const dataOrder = [];
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((item) => {
        dataOrder.push({
          id: item,
          status: isPut == true ? "DA_NHAN" : "DA_HUY",
        });
      });
    } else {
      dataOrder.push({
        id: record.id,
        status: isPut == true ? "DA_NHAN" : "DA_HUY",
      });
      setView(false);
    }
    fetch(`http://localhost:8080/api/staff/orders/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dataOrder),
    }).then((res) => {
      clearSearchForm();
      if (isPut == true) {
        toastSuccess("Nh???n ????n h??ng th??nh c??ng !");
      } else {
        toastSuccess("Hu??? ????n h??ng th??nh c??ng !");
        setView(false);
      }
    });
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSelectedRowKeys([]);
    tableParams.pagination = pagination;
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DANG_GIAO";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const [clearForm] = Form.useForm();

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">????n h??ng ??ang giao</h4>
        </div>
      </div>

      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          paddingBottom: "40px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
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
          <div className="row">
            <div className="col-4 mt-3">
              <label>T??n kh??ch h??ng</label>
              <AutoComplete
                placeholder="T??n kh??ch h??ng"
                style={{ width: 400 }}
                onChange={(event) => setSearchName(event)}
                options={optionName}
                value={searchName}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="col-4 mt-3">
              <label>S??? ??i???n tho???i kh??ch h??ng</label>
              <br />
              <AutoComplete
                placeholder="S??? ??i???n tho???i kh??ch h??ng"
                style={{ width: 400 }}
                onChange={(event) => setPhoneClient(event)}
                options={dataClient}
                value={phoneClient}
                onSelect={(event) => onSelectAutoClient(event)}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="col-4 mt-3">
              <Form.Item name="range-time-picker">
                <label>Th???i gian ?????t: </label>
                <br />
                <Space
                  direction="vertical"
                  size={12}
                  style={{ width: "97%", borderRadius: "5px" }}
                >
                  <RangePicker
                    showTime={{ format: "HH:mm:ss" }}
                    format={"yyyy-MM-DD HH:mm:ss"}
                    onChange={onchangeSearch}
                    onCalendarChange={handleChangeDateSearch}
                    type="datetime"
                  />
                </Space>
              </Form.Item>
            </div>
          </div>
          <Form.Item className="text-center mt-2">
            <Button
              className=""
              type="primary-outline"
              onClick={clearSearchForm}
              shape="round"
            >
              <ReloadOutlined />
              ?????t l???i
            </Button>
            <Button
              block
              className="mx-2"
              type="primary"
              shape="round"
              htmlType="submit"
              icon={<SearchOutlined />}
              style={{ width: "120px" }}
            >
              T??m ki???m
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="row">
        <div className="col-12 mt-4 confirmDeleving">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button
                type="primary"
                shape="round"
                icon={<CheckCircleOutlined />}
                className="ms-5"
                onClick={confirmCheckBox}
                
                danger
              >
                Nh???n h??ng
              </Button>
              <Button
                type="primary"
                shape="round"
                className="ms-2"
                onClick={cancelCheckBox}
                
              >
                Hu??? ????n h??ng
              </Button>
            </div>
          ) : (
            ""
          )}
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
            rowSelection={rowSelection}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            id="a"
            title="Chi ti???t ????n h??ng"
            open={isView}
            footer={[
              <Button
                key="submit"
                type="primary"
                shape="round"
                disabled = {selectedRowKeys.length  > 0}
                onClick={() => handleOk(dataO, true)}
              >
                Nh???n h??ng
              </Button>,
              <Button
                key="link"
                type="danger"
                shape="round"
                disabled = {selectedRowKeys.length  > 0}
                onClick={() => handleOk(dataO, false)}
              >
                Hu??? ????n h??ng
              </Button>,
              <Button key="back" shape="round" onClick={() => setView(false)}>
                ????ng
              </Button>,
            ]}
            onCancel={() => {
              setView(false);
            }}
            width={800}
          >
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <p>M?? ho?? ????n: {dataO?.id}</p>
                  <p>Kh??ch h??ng: {dataO?.customerName}</p>
                  <p>S??? ??i???n tho???i: {dataO?.phone} </p>
                  <p>
                    T???ng ti???n:{" "}
                    {dataO?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>Ghi ch??: {dataO?.note}</p>
                </div>
                <div className="col-6">
                  <p>
                    Ng??y ?????t h??ng:{" "}
                    <Moment format="DD-MM-YYYY HH:mm:ss">
                      {dataO?.createdAt}
                    </Moment>
                  </p>
                  <p>
                    Ph?? v???n chuy???n:{" "}
                    {dataO?.shippingFree?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>

                  <p>
                    ???? thanh to??n:{" "}
                    {dataO?.money?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>?????a ch??? nh???n h??ng: {dataO?.address}</p>
                </div>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">M?? HDCT</th>
                  <th>H??nh ???nh</th>
                  <th scope="col">T??n s???n ph???m</th>
                  <th scope="col">Gi??</th>
                  <th scope="col">S??? l?????ng</th>
                  <th scope="col">T???ng ti???n</th>
                </tr>
              </thead>
              <tbody>
                {dataOD?.map((item, index) => {
                  if (item.quantity > 0) {
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                          <Image
                            width={100}
                            src={item.product.images[0]?.name}
                          />{" "}
                        </td>
                        <td>{item.product.name}</td>
                        <td>
                          {item.product.price.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {item.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
            <h6 className="text-danger ms-1">L???ch s??? ????n h??ng</h6>
            <Table
              columns={columnOrderHistory}
              rowKey={(record) => record.id}
              dataSource={orderHistory}
              pagination={{ position: ["none", "none"] }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default OrderDelivering;
