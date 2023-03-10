import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
  Tag,
  AutoComplete,
  Form,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import React, { useEffect, useState } from "react";
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

const OrderSuccess = () => {
  let navigate = useNavigate();
  const [dataO, setDataO] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [optionName, setOptionName] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_NHAN",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
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

  function compareDates(d2) {
    // console.log("th???i gian truy???n v??o: ", d2);

    const currentDate = new Date().getTime();
    // console.log("th???i gian hi???n t???i:", new Date());
    // console.log("current date", currentDate);
    const date = new Date(d2);
    date.setDate(date.getDate() + 10);
    let date3 = new Date(date).getTime();
    console.log(date3);
    if (date3 < currentDate) {
      // console.log(`Th???i gian hi???n t???i nh??? h??n`);
      return true;
    } else if (date3 > currentDate) {
      // console.log(`Th???i gian hi???n t???i l???n h??n`);
      return false;
    } else {
      // console.log(`B???ng nhau`);
      return true;
    }
  }

  function startTimer(duration, display) {
    var timer = duration,
      minutes,
      seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = duration;
      }

      if (timer === 0) {
        document.querySelector("#button").setAttribute("disabled", true);
      }
    }, 1000);
  }

  window.onload = function () {
    var tenMinutes = 60 * 10,
      display = document.querySelector("#time");
    startTimer(tenMinutes, display);
  };

  useEffect(() => {
    loadDataOrder();
    loadDataClient();
  }, []);

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParamsUser)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
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
              });
            }
          });
        });
        console.log("load data client");
        setOptionName(optionName);
        setDataClient(option);
        setLoading(false);
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("pagination:", pagination);
    tableParams.pagination = pagination;
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const search = () => {
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchName =
      searchName != undefined ? searchName : "";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
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
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
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
        customerName: record.customerName | undefined,
        phone: sdt,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: "DA_NHAN",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
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
        console.log("data on init");
        console.log(results.data.data);
        setDataOrder(results.data.data);
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
      width: "15%",
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
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "15%",
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
      width: "15%",
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
    },
    {
      title: "H??nh th???c thanh to??n",
      dataIndex: "payment",
      width: "16%",
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
      title: "Thao t??c",
      width: "40%",
      dataIndex: "id",
      dataIndex: "data",
      render: (id, data) => {
        return (
          <>
            <Button
              shape="round"
              onClick={() => {
                showModalData(data.id);
              }}
            >
              Hi???n th???
            </Button>
            {/* {dataOD} */}
            {compareDates(data.updatedAt) != true ? (
              <Button
                shape="round"
                className="ms-2"
                danger
                onClick={() => navigate(`/admin/order/exchange/${data.id}`)}
              >
                ?????i h??ng
              </Button>
            ) : (
              ""
            )}
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

  const resetEditing = () => {
    setEditing(false);
  };
  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const onReset = () => {
    clearForm.resetFields();
    tableParams.pagination.current = 1;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_NHAN";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setPhoneClient("");
    setSearchName("");
    onchangeSearch();
  };

  const [clearForm] = Form.useForm();
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">????n h??ng ???? nh???n</h4>
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
            style={{ width: "200px  !important" }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"????ng"}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
            width={950}
          >
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <p>M?? kh??ch h??ng: {dataO?.id}</p>
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
                    <p>?????a ch??? nh???n h??ng: {dataO?.address}</p>

                    <p>
                      ???? thanh to??n:{" "}
                      {dataO?.money?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
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
                      if ((item.quantity > 0)) {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>
                              {" "}
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
              </div>
            </div>
            <h6 className="text-danger ms-1 mt-2">L???ch s??? ????n h??ng</h6>
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

export default OrderSuccess;
