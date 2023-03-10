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
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import qs from "qs";

import React, { useEffect, useState } from "react";
import Moment from "react-moment";
const url = "http://localhost:8080/api/orders";
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

const CancelOrder = () => {
  const [data, setData] = useState([]);
  const [dataO, setDataO] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [phoneClient, setPhoneClient] = useState();
  const [dataClient, setDataClient] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [dataOrder, setDataOrder] = useState();
  const [searchName, setSearchName] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_HUY",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchPayment: "",
      searchName: "",
    },
  });


  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

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
    console.log(dataOrder);
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
        console.log("data client");
        console.log(results.data.data);
        const option = [];
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
        console.log('load data client');
        // console.log(option);
        setDataClient(option);
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

  const onCancel = (record) => {
    Modal.confirm({
      title: 'Xo?? ????n h??ng',
      content: `B???n c?? mu???n xo?? ????n h??ng ${record.id} c???a kh??ch h??ng ${record.customerName} kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        deleteOrder(record);
      },
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

    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {  
        setOrderHistory(res);
      });
  };

  const deleteOrder = (record) => {
    fetch(`http://localhost:8080/api/auth/orders/${record.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
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
        console.log('d??? li???u tr??? ra');
        console.log(results.data.data);
        setDataOrder(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total
          },
        });
      });
      
  };


  const handleTableChange = (pagination, filters, sorter) => {
    tableParams.pagination = pagination;
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_HUY";
    tableParams.pagination.searchEndDate= "";
    tableParams.pagination.searchPhone= "";
    tableParams.pagination.searchStartDate= "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
  };

  const columns = [
    {
      title: "M?? ????n ?????t",
      dataIndex: "id",
      width: "7%",
    },
    {
      title: "Th???i gian ?????t",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "18%",
    },
    {
      title: "Ng?????i ?????t",
      dataIndex: "customerName",
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
      width: "10%",
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
      title: "H??nh th???c thanh to??n",
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
      title: "?????a ch???",
      dataIndex: "address",
      width: "17%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      with: "25%",
      render: (status) => {
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
              onClick={() => {
                showModalData(id);
              }}
              style={{ fontSize: "20px" }}
            />
            <DeleteOutlined
              onClick={() => onCancel(record)}
              hidden={record.total == record.money}
              style={{ color: "red", marginLeft: 12, fontSize: "20px" }}
            />
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const search = () => {
    tableParams.pagination.searchName =(searchName != undefined ? searchName : "") ;
    tableParams.pagination.searchPhone =(phoneClient != undefined ? phoneClient : "") ;
    tableParams.pagination.searchStartDate = (searchStartDate != undefined ? searchStartDate : "");
    tableParams.pagination.searchEndDate = (searchEndDate != undefined ? searchEndDate : "");
    tableParams.pagination.searchStatus = "DA_HUY"
    tableParams.pagination.searchPayment = ""
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
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

  const resetEditing = () => {
    setEditing(false);
  };

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const clearSearchForm = () => {
    
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchStatus = "DA_HUY";
    tableParams.pagination.searchEndDate= "";
    tableParams.pagination.searchPhone= "";
    tableParams.pagination.searchStartDate= "";
    tableParams.pagination.searchPayment = "";
    loadDataOrder();
    setPhoneClient("");
    setSearchName("");
  };

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
                icon={<ExclamationCircleOutlined/>}
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
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">????n h??ng ???? hu???</h4>
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
        <div className="col-4 mt-3">
          <label>T??n kh??ch h??ng</label>
          <Input
            type="text"
            name="searchName"
            value={searchName}
            placeholder="Nh???p t??n kh??ch h??ng"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-4 mt-3">
          <label>S??? ??i???n tho???i kh??ch h??ng</label>
          <br/>
          <AutoComplete
            style={{ width: 400 }}
            onChange={(event) => setPhoneClient(event)}
            options={dataClient}
            value={phoneClient}
            onSelect={(event) => onSelectAutoClient(event)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </div>
        <div className="col-4 mt-3">
          <label>Th???i gian ?????t: </label>
          <br />
          <Space
            direction="vertical"
            size={12}
            style={{ width: "100%", borderRadius: "5px" }}
          >
            <RangePicker
              showTime={{ format: "HH:mm:ss" }}
              format={"yyyy-MM-DD HH:mm:ss"}
              onChange={onchangeSearch}
              onCalendarChange={handleChangeDateSearch}
              type="datetime"
            />
          </Space>
        </div>
        <div className="col-12 text-center mt-3 ">
          <Button
            className="mt-2"
            type="primary-outline"
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
            onChange = {handleTableChange}
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
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"????ng"}
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
            width={850}
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
                  <p>?????a ch??? nh???n h??ng: {dataO?.address} </p>

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
            <h6 className="mt-5 ms-1 text-danger">L???ch s??? ????n h??ng</h6>
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

export default CancelOrder;
