import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
  Tag,
  AutoComplete,
  Form
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import qs from "qs";
import Moment from "react-moment";
import React, { useEffect, useState } from "react";
import "./OrderWait.css";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
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

const OrderWait = () => {
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataO, setDataO] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [note, setNote] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [optionName, setOptionName] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_LAY_HANG",
      search1: "",
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
        title: "X??c nh???n ????n h??ng",
        content: `B???n c?? mu???n x??c nh???n ????n h??ng ${record?.id} 
        c???a kh??ch h??ng ${record?.customerName}  kh??ng?`,
        okText: "C??",
        cancelText: "Kh??ng",
        onOk: () => {
          handleConfirm(true, record);
        },
      });
    }
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
          });
        });
        results.data.data.forEach((item) => {
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
  };

  const cancelCheckBox = (data) => {
    console.log(data);
    console.log("data l??c hu??? ????n h??ng: " + data);
    if (data.id != undefined) {
      Modal.confirm({
        icon: <CheckCircleOutlined />,
        title: "Hu??? ????n h??ng ",
        content: `B???n c?? mu???n hu??? ????n h??ng ${data?.id} 
          c???a kh??ch h??ng ${data?.customerName}  kh??ng?`,
        okText: "C??",
        cancelText: "Kh??ng",
        okType: "primary",
        onOk: () => {
          handleCancel(data);
        },
      });
    } else {
      Modal.confirm({
        icon: <CheckCircleOutlined />,
        title: "Hu??? ????n h??ng ",
        content: `B???n c?? mu???n hu??? nh???ng ????n h??ng n??y kh??ng?`,
        okText: "C??",
        cancelText: "Kh??ng",
        okType: "primary",
        onOk: () => {
          handleCancel();
        },
      });
    }
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSelectedRowKeys([]);
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "CHO_LAY_HANG";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
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

  const handleCancel = (data) => {
    const dataOrder = [];
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((item) => {
        dataOrder.push({
          id: item,
          status: "DA_HUY",
        });
      });
    } else {
      dataOrder.push({
        id: data.id,
        status: "DA_HUY",
      });
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
      setView(false);
      toastSuccess("Hu??? ????n h??ng th??nh c??ng!");
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
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
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
      width: "25%",
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
  const search = () => {
    setDataOrder([]);
    setData([]);
    setSelectedRowKeys([]);
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "CHO_LAY_HANG";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
    loadDataOrder();
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

  const rollBackCheckbox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Chuy???n tr???ng v??? ch??? x??c nh???n ",
      content: `B???n c?? mu???n chuy???n tr???ng th??i ????n h??ng v??? ch??? x??c nh???n kh??ng?`,
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
          status: isPut == true ? "DANG_GIAO" : "CHO_XAC_NHAN",
        });
      });
    } else {
      dataOrder.push({
        id: record.id,
        status: isPut == true ? "DANG_GIAO" : "CHO_XAC_NHAN",
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
        toastSuccess("X??c nh???n ????n h??ng th??nh c??ng!");
      } else {
        toastSuccess("????n h??ng ???????c chuy???n v??? tr???ng th??i ch??? x??c nh???n!");
      }
    });
  };

  const clearSearchForm = () => {
    onReset();
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });
    setSelectedRowKeys([]);
    tableParams.pagination.current = 1;
    tableParams.pagination.search1 = "";
    tableParams.pagination.searchStatus = "CHO_LAY_HANG";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setPhoneClient("");
    setSearchName("");
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
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
        status: "DANG_GIAO",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.productId,
            total: record.total,
            quantity: record.quantity,
            status: "DANG_GIAO",
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

  const loadDataOrderHistoryById = (id) => {
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
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
      width: "8%",
    },
    {
      title: "Th???i gian ?????t",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Ng?????i ?????t",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "15%",
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
      width: "15%",
    },
    {
      title: "???? thanh to??n",
      dataIndex: "money",
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
      width: "10%",
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
      title: "Tr???ng th??i ????n h??ng",
      dataIndex: "status",
      width: "13%",
      render: (status) => {
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
      },
    },
    {
      title: "Thao t??c",
      width: "30%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <EyeOutlined
              style={{ marginLeft: 12, color: "red", fontSize: "23px" }}
              onClick={() => {
                showModalData(id);
              }}
            />
          </>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const OrderDelivering = (record, IsPut) => {
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
        customerName: record.customerName | undefined,
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

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const resetEditing = () => {
    setEditing(false);
  };

  const onReset = () => {
    onchangeSearch();
    clearForm.resetFields();
  };

  const [clearForm] = Form.useForm();
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Ch??? l???y h??ng</h4>
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
                placeholder="s??? ??i???n tho???i kh??ch h??ng"
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
        <div className="col-12 mt-4 confirmWait">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button
                type="primary"
                shape="round"
                icon={<CheckCircleOutlined />}
                className=""
                onClick={confirmCheckBox}
              >
                X??c nh???n
              </Button>
              <Button
                type="dashed"
                shape="round"
                icon={<CheckCircleOutlined />}
                className="ms-2"
                onClick={cancelCheckBox}
              >
                Hu??? ????n h??ng
              </Button>
              {/* <Button
                type="primary"
                shape="round"
                icon={<RollbackOutlined />}
                className="ms-2"
                danger
                onClick={rollBackCheckbox}
              >
                Chuy???n v??? ch??? x??c nh???n
              </Button> */}
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
            title="X??c nh???n ????n h??ng"
            open={isEditing}
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setEditing(true);
            }}
          >
            B???n c?? mu???n x??c nh???n ????n h??ng kh??ng ?
          </Modal>

          <Modal
            title="Chi ti???t ????n h??ng"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
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
                onClick={() => cancelCheckBox(dataO, false)}
              >
                Hu??? ????n h??ng
              </Button>,
            ]}
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
                  <div>Ghi ch??: 
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
                        <Button  shape="round" onClick={() => updateNote()}>
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
                  if(item.quantity > 0){
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

export default OrderWait;
