import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  InputNumber,
  Image,
  AutoComplete,
  Tag,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Order/ConfirmOrder.css";
import Moment from "react-moment";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
const url = "http://localhost:8080/api/orders";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchStatus: params.pagination?.searchStatusOrder,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchName: params.pagination?.searchName,
  searchPayment: params.pagination?.searchPayment,
  searchMoney: params.pagination?.searchMoney,
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

const PendingInvoice = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [put, setPut] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [orderHistory, setOrderHistory] = useState();
  const [dataO, setDataO] = useState([]);
  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [note, setNote] = useState();
  const [dataClient, setDataClient] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [optionName, setOptionName] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      searchStatusOrder: "CHO_XAC_NHAN",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
      searchMoney: 0,
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

  const columnOrderHistory = [
    {
      title: "M?? ho?? ????n",
      dataIndex: "orderId",
      width: "20%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Ng?????i x??c nh???n",
      dataIndex: "verifier",
      width: "25%",
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
      title: "Tr???ng th??i",
      dataIndex: "status",
      with: "45%",
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

  const loadDataOrderHistoryById = (id) => {
    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
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

  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  }
  const handleOk = (record, check) => {
    const isPut = false;
    if (check == true) {
      Modal.confirm({
        title: "X??c nh???n ????n h??ng",
        content: `B???n c?? mu???n x??c nh???n ????n h??ng ${record?.id} 
          c???a kh??ch h??ng ${record?.customerName} kh??ng?`,
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
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.searchMoney = 0;
    loadDataOrder();
  };

  const loadDataOrder = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/ordersFilterPrice?${qs.stringify(
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
        console.log("d??? li???u tr??? ra");
        console.log(results);
        setLoading(false);
        setDataOrder(results.data.data);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const search = () => {
    setDataOrder([]);
    setData([]);
    setSelectedRowKeys([]);
    tableParams.pagination.searchName = searchName ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.searchMoney = 0;
    tableParams.pagination.current = 1;
    setLoading(true);
    loadDataOrder();
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
        setNote(results.note);
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

  const columnsTest = [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
    },
    {
      title: "Column 1",
      dataIndex: "address",
      key: "1",
    },
    {
      title: "Column 2",
      dataIndex: "address",
      key: "2",
    },
    {
      title: "Column 3",
      dataIndex: "address",
      key: "3",
    },
    {
      title: "Column 4",
      dataIndex: "address",
      key: "4",
    },
    {
      title: "Column 5",
      dataIndex: "address",
      key: "5",
    },
    {
      title: "Column 6",
      dataIndex: "address",
      key: "6",
    },
    {
      title: "Column 7",
      dataIndex: "address",
      key: "7",
    },
    {
      title: "Column 8",
      dataIndex: "address",
      key: "8",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  const datatest = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 40,
      address: "London Park",
    },
  ];

  const columns = [
    {
      title: "M?? ????n ?????t",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "7%",
      fixed: "left",
    },

    {
      title: "Th???i gian ?????t",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "10%",
    },
    {
      title: "Ng?????i ?????t",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "8%",
    },
    {
      title: "S??? ??i???n tho???i",
      dataIndex: "phone",
      width: "8%",
    },
    {
      title: "T???ng ti???n",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      width: "10%",
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
      width: "10%",
      render(money) {
        return (
          <>
            {money == 0
              ? money.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              : ""}
          </>
        );
      },
    },
    {
      title: "?????a ch???",
      dataIndex: "address",
      width: "15%",
    },
    {
      title: "Thanh to??n",
      dataIndex: "payment",
      width: "15%",
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
            <Tag color="blue" className="pt-1 pb-1">
              Ch??? x??c nh???n
            </Tag>
          </>
        );
      },
    },
    {
      title: "Thao t??c",
      width: "5%",
      dataIndex: "id",
      dataIndex: "data",
      fixed: "right",
      render: (id, data) => {
        return (
          <>
            {data.status == "CHO_XAC_NHAN" ? (
              <EditOutlined
                onClick={() => navigate(`/admin/order/${data.id}/confirm`)}
                style={{ fontSize: "20px" }}
              />
            ) : (
              ""
            )}
            <EyeOutlined
              onClick={() => {
                showModalData(data.id);
              }}
              style={{ fontSize: "20px", marginLeft: "10px" }}
            />
          </>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const confirmOrder = (record, IsPut) => {
    console.log(record);
    console.log(Number(record.phone));
    const sdt = record.phone;
    console.log(record.note);
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.orderDetails.productId,
            total: record.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      tableParams.pagination.searchName = "";
      tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
      tableParams.pagination.searchEndDate = "";
      tableParams.pagination.searchPhone = "";
      tableParams.pagination.searchStartDate = "";
      tableParams.pagination.searchPayment = "";
      loadDataOrder();
    });
  };

  const handleConfirm = (isPut, record) => {
    const dataOrder1 = [];
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((item) => {
        let ob = dataOrder.filter((o) => o.id == item);
        if (ob[0].address === "T???i c???a h??ng") {
         
          console.log('v??o ?????u')
          dataOrder1.push({
            id: item,
            status: isPut === true ? "DA_NHAN" : "DA_HUY",
          });
         
        } else if(ob[0].address != "T???i c???a h??ng") {
          dataOrder1.push({
            id: item,
            status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          });
        }
        ob = [];
      });
    } else {
      if (record.address == "T???i c???a h??ng") {
        dataOrder1.push({
          id: record.id,
          status: isPut === true ? "DA_NHAN" : "DA_HUY",
        });
      } else {
        dataOrder1.push({
          id: record.id,
          status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        });
      }
      setView(false);
    }

    if (dataOrder1.length > 0) {
      fetch(`http://localhost:8080/api/staff/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(dataOrder1),
      }).then((res) => {
        clearSearchForm();
        if (isPut == true) {
          toastSuccess("X??c nh???n ????n h??ng th??nh c??ng !");
        } else {
          toastSuccess("Hu??? ????n h??ng th??nh c??ng !");
        }
      });
    }
  };

  const onChangeInputNumber = (value, id) => {
    console.log("changed", value, id);
    const set = new Set();
    const orderDetail = {
      id: id,
      quantity: value,
    };
    if (todos.length === 0) {
      todos.push(orderDetail);
    } else {
      todos.forEach((item) => {
        set.add(item.id);
      });
      console.log(set);
      if (set.has(id)) {
        let abc = -1;
        todos?.forEach((item, index) => {
          if (item.id === id) {
            abc = index;
            console.log(abc);
          }
        });
        todos[abc].quantity = value;
      } else {
        todos.push({
          id: id,
          quantity: value,
        });
      }
    }
    console.log(todos);
  };

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

  const clearSearchForm = () => {
    onReset();
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });
    setSelectedRowKeys([]);
    tableParams.pagination.current = 1;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatusOrder = "CHO_XAC_NHAN";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.searchMoney = 0;
    setSearchName("");
    setPhoneClient("");
    loadDataOrder();
  };

  const handleUpdateOrderDetail = (item) => {
    console.log(item);
  };

  const resetEditing = () => {
    setEditing(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const updateNote = () => {
    fetch(`http://localhost:8080/api/auth/orders/update/${dataO?.id}/note`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(note),
    }).then((res) => {
      toastSuccess("C???p nh???t ghi ch?? th??nh c??ng !");
    });
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

            item.information.forEach((element) => {
              if (element.fullName != "none") {
                optionName.push({
                  value: element.fullName,
                  id: element.id,
                });
              }
            });
          });
          console.log("load data client");
          // console.log(option);
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
      });
  };

  const onReset = () => {
    clearForm.resetFields();
    onchangeSearch();
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };
  const [clearForm] = Form.useForm();

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Ho?? ????n ch???</h4>
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
        <ToastContainer></ToastContainer>
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
        <div className="col-12 mt-4 confirm">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button type="primary" shape="round" onClick={confirmCheckBox}>
                X??c nh???n ????n h??ng
              </Button>
              <Button
                className="ms-2"
                type="primary"
                shape="round"
                danger
                onClick={cancelCheckBox}
              >
                Hu???
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
            scroll={{
              x: 1900,
            }}
            rowKey={(record) => record.id}
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            open={isView}
            title="Chi ti???t ????n h??ng"
            onOk={handleOk}
            onCancel={() => {
              setView(false);
            }}
            width={800}
            footer={[
              <Button key="back" shape="round" onClick={() => setView(false)}>
                ????ng
              </Button>,
              <Button
                key="submit"
                type="primary"
                shape="round"
                disabled = {selectedRowKeys.length  > 0}
                onClick={() => handleOk(dataO, true)}
              >
                X??c nh???n ????n h??ng
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
            ]}
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
                  <div>
                    Ghi ch??:
                    <div className="row mb-2">
                      <div className="col-md-9">
                        <TextArea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          cols={9}
                        />
                      </div>
                      <div className="col-3 mt-4">
                        <Button shape="round" onClick={() => updateNote()}>
                          C???p nh???t ghi ch??
                        </Button>
                      </div>
                    </div>
                  </div>
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
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>
                        <Image width={100} src={item.product.images[0]?.name} />{" "}
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

export default PendingInvoice;
