import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
  AutoComplete,
  Tag,
  Form,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  PrinterOutlined,
  MenuFoldOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  QuestionCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../Order/order.css";
import Moment from "react-moment";
import qs from "qs";
import axios from "axios";
import toastrs from "toastr";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode";

const { Option } = Select;
const url = "http://localhost:8080/api/orders";
const url_pro = "http://localhost:8080/api/products";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
  searchPhone: params.pagination?.searchPhone,
  searchPayment: params.pagination?.searchPayment,
});

const getRandomUserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});
//date
const { RangePicker } = DatePicker;

const Order = () => {
  const id = "ok";
  const [data, setData] = useState([]);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataDelivering, setDataDelivering] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataO, setDataO] = useState();
  const [dataO1, setDataO1] = useState();
  const [dataOD1, setDataOD1] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [searchStatus, setSearchStatus] = useState();
  const [searchName, setSearchName] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [phoneClient, setPhoneClient] = useState();
  const [images, setImages] = useState([]);
  const [orderHistory, setOrderHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const componentRef = useRef();
  const [dataCancel, setDataCancel] = useState([]);
  const [dataWait, setDataWait] = useState([]);
  const [dataPending, setDataPedning] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [checkId, setCheckId] = useState();
  const [qrImageUrl, setQRImageUrl] = useState();
  const [dataClient, setDataClient] = useState();
  const [optionName, setOptionName] = useState();
  const imagesListRef = ref(storage, "images/"); //all url
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });
  const [tableParamsPending, setTableParamsPending] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      searchStatus: "CHO_XAC_NHAN",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchPayment: "",
    },
  });

  const [tableParamsWait, setTableParamsWait] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_LAY_HANG",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });

  const [tableParamsCancel, setTableParamsCancel] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_HUY",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });

  const onchangeSearch = (val, dateStrings) => {
    console.log("d??? li???u onChange search:" + dateStrings);
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

  const [tableParamsDelivering, setTableParamsDelivering] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DANG_GIAO",
      search1: "",
      searchStartDate: "",
      searchEndDate: "",
      searchPhone: "",
      searchName: "",
      searchPayment: "",
    },
  });
  const [tableParamsSuccess, setTableParamsSuccess] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_NHAN",
      search1: "",
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
  const [idCancel, setIDCancel] = useState();

  const qrCodeData = [
    { id: 1234, value: "TEST1" },
    { id: 1235, value: "TEST2" },
  ];
  const qrCodeIds = qrCodeData.map((data) => data.id);

  const loadDataOrderWait = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsWait)
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
        setDataWait(results.data.data);
        setLoading(false);
        setTableParamsWait({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderCancel = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsCancel)
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
        setDataCancel(results.data.data);
        setLoading(false);
        setTableParamsCancel({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderDelivering = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsDelivering)
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
        console.log("orderDelivering");
        console.log(results);
        setDataDelivering(results.data.data);
        setLoading(false);
        setTableParamsDelivering({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderStatusPending = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsPending)
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
        if (results.status) console.log(results);
        if (results.status === 200) {
          setDataPedning(results.data.data);
          setLoading(false);
          setTableParamsPending({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        }
      });
  };

  const loadDataOrderStatusSuccess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParamsSuccess)
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
        setDataSuccess(results.data.data);
        setLoading(false);
        setTableParamsSuccess({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/orders?${qs.stringify(
        getRandomuserParams(tableParams)
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
        setData(results.data.data);
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

  useEffect(() => {
    load();
    loadDataClient();
    loadDataOrderStatusPending();
    loadDataOrderStatusSuccess();
    loadDataOrderDelivering();
    loadDataOrderCancel();
    loadDataOrderWait();
  }, []);

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomUserParams(tableParamsUser)
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
        console.log("load data client");
        // console.log(option);
        setDataClient(option);
        setOptionName(optionName);
        setLoading(false);
      });
  };

  const search = () => {
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus =
      searchStatus != undefined ? searchStatus : "";
    tableParams.pagination.searchPayment = "";
    tableParams.pagination.current = 1;
    load();
  };

  const searchDate = () => {
    setLoading(true);
    console.log(dateOrder);
    fetch(`http://localhost:8080/api/orders/list/date/` + dateOrder)
      .then((res) => res.json())
      .then((results) => {
        setData(results);
        setLoading(false);
        setTableParams({});
      });
  };

  const changeSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  //date
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

  const changeSearchDate = (val, dateStrings) => {
    setDateOrder(dateStrings);
  };

  const [clearForm] = Form.useForm();

  const onReset = () => {
    clearForm.resetFields();
    setSearchStatus("");
    setSearchName("");
    onchangeSearch();
  };

  const showModalData = (id) => {
    fetch(
      `http://localhost:8080/api/auth/orders/get/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
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
        getRandomuserParams(tableParams)
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
    console.log("t??n kh??ch h??ng trong modal: ", dataO?.name);
    // createQRCode();
    setCheckId(
      `S??? ??I???N THO???I: 0338861522` +
        `\nEMAIL: ptung539@gmail.com` +
        `\n?????A CH???: L???ng Giang - B???c Giang` +
        `\nNG??N H??NG: NCB - S??? t??i kho???n: 899983869999` +
        `\nCH??? T??I KHO???N: NGUY???N V??N A` +
        `\nHO?? ????N MUA H??NG` +
        `\nM?? HO?? ????N: ${id}` +
        `\nCH??? T??I KHO???N: NGUY???N V??N A`
    );
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const loadDataOrderHistoryById = (id) => {
    console.log("id ho?? ????n log ra", id);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const showModalOrder = (id) => {
    fetch(
      `http://localhost:8080/api/auth/orders/get/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
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
        setDataO1(results);
        createQRCode(results);
      });

    let dataOrder = "";
    fetch(
      `http://localhost:8080/api/auth/orders/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
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
        setDataOD1(results);
      });
    // axios.get(url + "/" + id).then((res) => {
    //   setDataOD1(res.data);
    // });
    setOrder(true);
  };

  const showModalCancel = () => {
    setEditing(true);
  };

  const columns = [
    {
      title: "M?? HD",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
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
      width: "15%",
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
      title: "Thanh to??n",
      dataIndex: "payment",
      width: "13%",
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
      title: "?????a ch??? nh???n h??ng",
      dataIndex: "address",
      width: "25%",
    },
    {
      title: "Tr???ng th??i ????n h??ng",
      dataIndex: "status",
      width: "13%",
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
    {
      title: "Thao t??c",
      dataIndex: "id",
      dataIndex: "data",
      width: "8%",
      render: (id, data) => {
        if (data.status != "DA_HUY") {
          return (
            <div className="thao_tac">
              <EyeOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              {/* <EditOutlined
                onClick={() => {
                  console.log("key key");
                  navigate("update");
                }}
              />
              <DeleteOutlined
                onClick={() => {
                  showModalCancel(data.id);
                  console.log(data.id);
                  setIDCancel(data.id);
                }}
              /> */}
              <PrinterOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalOrder(data.id);
                }}
              />
            </div>
          );
        } else {
          return (
            <div className="thao_tac">
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
            </div>
          );
        }
      },
    },
  ];

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
      title: "Ng?????i th???c hi???n",
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

  const handleTableChange = (pagination, filters, sorter) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName != undefined ? searchName : "";
    tableParams.pagination.searchPhone =
      phoneClient != undefined ? phoneClient : "";
    tableParams.pagination.searchStartDate =
      searchStartDate != undefined ? searchStartDate : "";
    tableParams.pagination.searchEndDate =
      searchEndDate != undefined ? searchEndDate : "";
    tableParams.pagination.searchStatus =
      searchStatus != undefined ? searchStatus : "";
    tableParams.pagination.searchPayment = "";
    load();
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const clearSearchForm = () => {
    onReset();
    tableParams.pagination.current = 1;
    tableParams.pagination.search1 = "";
    tableParams.pagination.searchStatus = "";
    tableParams.pagination.searchEndDate = "";
    tableParams.pagination.searchPhone = "";
    tableParams.pagination.searchStartDate = "";
    tableParams.pagination.searchPayment = "";
    load();
    setPhoneClient("");
    setSearchName("");
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleUploadFile = () => {
    const check = "1";
    const imageRef = ref(storage, `images/${check + v4()}`);
    // console.log("imageRef",imageRef)//_service: {???}, _location: {???}
    uploadBytes(imageRef, check).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        console.log("snapshot.ref", snapshot.ref); //_service: {???}, _location: {???}
        setImageUrls((prev) => [...prev, url]); //set url ->all url
      });
      // toastSuccess("upload ???nh th??nh c??ng !");
    });
  };

  async function createQRCode(data) {
    const b =
      `\nM?? HO?? ????N: ${data?.id}` +
      `\nNG??Y MUA H??NG: ${data?.createdAt}` +
      `\nT??N KH??CH H??NG: ${data?.customerName}` +
      `\n?????A CH???: ${data?.address}` +
      `\nS??? ??I???N THO???I: ${data?.phone}` +
      data?.orderDetails.map((item) => {
        return (
          `\nT??n s???n ph???m: ${item?.product.name}` +
          ` - S??? l?????ng: ${item.quantity}` +
          ` - ????n gi??: ${item.product.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}` +
          ` - T???ng ti???n: ${item.total.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}`
        );
      }) +
      `\n???? ?????T C???C: ${data?.money}` +
      `\n???? THANH TO??N: ${data?.total}` +
      `\nTR???NG TH??I ????N H??NG: ${data?.status}`;
    const response = await QRCode.toDataURL(b);
    setQRImageUrl(response);
  }

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
  };

  const navigate = useNavigate();
  const [keyOrder, setKey] = useState("/order/create");
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Danh s??ch ????n h??ng</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-2 ">
              <div className="card ">
                <div className="card-body ">
                  <h3 className="text-center text-warning">
                    {tableParamsPending.pagination.total > 0
                      ? tableParamsPending.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center text-warning">
                    Ch??? x??c nh???n
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body ">
                  <h3 className="text-center text-success">
                    {tableParamsSuccess.pagination.total > 0
                      ? tableParamsSuccess.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center">???? nh???n</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-primary">
                    {tableParamsDelivering.pagination.total > 0
                      ? tableParamsDelivering.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-primary text-center">??ang giao</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-danger">
                    {tableParamsCancel.pagination.total > 0
                      ? tableParamsCancel.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-danger">???? hu???</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body text-secondary">
                  <h3 className="text-center text-secondary">
                    {tableParamsWait.pagination.total > 0
                      ? tableParamsWait.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-secondary">Ch??? l???y h??ng</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-info">
                    {tableParams.pagination.total > 0
                      ? tableParams.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-info">T???ng ????n h??ng</h6>
                </div>
              </div>
            </div>
          </div>
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
            <div className="col-md-4 mt-3 pe-5">
              <Form.Item name="status">
                <label>Tr???ng th??i</label>
                <br />
                <Select
                  width={200}
                  allowClear={true}
                  showSearch
                  placeholder="Ch???n tr???ng th??i"
                  optionFilterProp="children"
                  onChange={changeSearchStatus}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="CHUA_THANH_TOAN" selected>
                    Ch??a thanh to??n
                  </Option>
                  <Option value="CHO_XAC_NHAN">Ch??? x??c nh???n</Option>
                  <Option value="CHO_LAY_HANG">Ch??? l???y h??ng</Option>
                  <Option value="DANG_GIAO">??ang giao</Option>
                  <Option value="DA_NHAN">???? nh???n</Option>
                  <Option value="DA_HUY">???? h???y</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
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
        {/* <div className="col-4 mt-3">
          <label>T??n kh??ch h??ng</label>
          <AutoComplete
            style={{ width: 400 }}
            onChange={(event) => setSearchName(event)}
            options={optionName}
            value={searchName}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </div>
        <div className="col-4 mt-3">
          <label>S??? ??i???n tho???i kh??ch h??ng</label>
          <br />
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
          <label>Tr???ng th??i</label>
          <br />
          <Select
            allowClear={true}
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Ch???n tr???ng th??i"
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="CHUA_THANH_TOAN" selected>
              Ch??a thanh to??n
            </Option>
            <Option value="CHO_XAC_NHAN">Ch??? x??c nh???n</Option>
            <Option value="CHO_LAY_HANG">Ch??? l???y h??ng</Option>
            <Option value="DANG_GIAO">??ang giao</Option>
            <Option value="DA_NHAN">???? nh???n</Option>
            <Option value="DA_HUY">???? h???y</Option>
          </Select>
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
        <div className="col-12 text-center mt-4">
          <Button
            className="mt-2"
            shape="round"
            type="primary-uotline"
            onClick={clearSearchForm}
          >
            <ReloadOutlined />
            ?????t l???i
          </Button>
          <Button
            shape="round"
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
          >
            <SearchOutlined />
            T??m ki???m
          </Button>
        </div> */}
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            shape="round"
            onClick={() => {
              navigate("create");
            }}
          >
            <PlusOutlined /> Th??m m???i
            <ToastContainer />
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
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Hu??? ????n h??ng"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/orders/cancelled/${idCancel}`, {
                method: "PUT",
              }).then(() => load());
              toastrs.options = {
                timeOut: 6000,
              };
              toast.success("H???y th??nh c??ng!", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setEditing(false);
              setLoading(true);
            }}
          >
            <label>B???n c?? mu???n hu??? ????n h??ng n??y kh??ng ?</label>
          </Modal>

          <Modal
            title="Chi ti???t ????n h??ng"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"????ng"}
            onOk={() => {
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
                  <p>
                    Ghi ch??:
                    <div className="row">
                      <p>{dataO?.note}</p>
                    </div>
                  </p>
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
                    ?????t c???c:{" "}
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
                      {/* <td>{item.status}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h6 className="text-danger mt-5">L???ch s??? ????n h??ng</h6>
            <Table
              columns={columnOrderHistory}
              rowKey={(record) => record.id}
              dataSource={orderHistory}
              pagination={{ position: ["none", "none"] }}
            />
          </Modal>

          <Modal
            title="Hi???n th??? h??a ????n"
            footer={null}
            open={isOrder}
            onCancel={() => {
              setOrder(false);
            }}
            width={850}
          >
            <div>
              <div className="order" ref={componentRef}>
                <div className="qrcode ">
                  {qrImageUrl && (
                    <div className="mt-4">
                      <a
                        href={qrImageUrl}
                        download={`HoaDon` + dataO?.id + ".png"}
                      >
                        <img
                          src={qrImageUrl}
                          style={{ width: "140px", height: "140px" }}
                          alt="QR CODE"
                        />
                      </a>
                    </div>
                  )}
                </div>
                <div className="title">
                  <p className="fs-6">S??? ??i???n tho???i: 0338861522</p>
                  <p className="fs-6">Email: ptung539@gmail.com</p>
                  <p className="fs-6">?????a ch???: L???ng Giang - B???c Giang</p>
                  <p className="fs-6">
                    Ng??n h??ng: NCB - S??? t??i kho???n: 899983869999{" "}
                  </p>
                  <p className="fs-6">Ch??? t??i kho???n: Nguy???n V??n A</p>
                  <h2 className="fw-bold">HO?? ????N MUA H??NG</h2>
                </div>
                <div className="">
                  <p className="fw-bold">M?? h??a ????n: {dataO1?.id}</p>
                  <p className="fw-bold">
                    Ng??y mua h??ng:{" "}
                    <Moment format="DD-MM-YYYY">{dataO1?.createdAt}</Moment>
                  </p>
                  <p className="fw-bold">
                    T??n kh??ch h??ng: {dataO1?.customerName}
                  </p>
                  <p className="fw-bold">?????a ch???: {dataO1?.address}</p>
                  <p className="fw-bold">S??? ??i???n tho???i: {dataO1?.phone}</p>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">M?? HDCT</th>
                        <th scope="col">T??n s???n ph???m</th>
                        <th scope="col">Gi??(VN??)</th>
                        <th scope="col">S??? l?????ng</th>
                        <th scope="col" className="fw-bold">
                          T???ng ti???n(VN??)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataOD1?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.product?.name}</td>
                            <td>
                              {item.product?.price.toLocaleString("it-IT", {
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
                      <tr>
                        <td colSpan={4}>T???ng ti???n</td>
                        <td>
                          {dataO1?.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="fw-bold">
                    Ph?? ship :{" "}
                    <i className="text-danger fw-bold">
                      {" "}
                      {dataO1?.shippingFree.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    ???? ?????t c???c :{" "}
                    <i className="text-danger fw-bold">
                      {" "}
                      {dataO1?.money.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    T???ng s??? ti???n ph???i thanh to??n:{" "}
                    <i className="text-danger">
                      {(dataO1?.total - dataO1?.money).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Tr???ng th??i ????n h??ng:
                    {dataO1?.status == "CHO_XAC_NHAN" ? (
                      <i className="text-danger">Ch??? x??c nh???n</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "CHUA_THANH_TOAN" ? (
                      <i className="text-danger">Ch??a thanh to??n</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DANG_GIAO" ? (
                      <i className="text-danger">??ang giao</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DA_NHAN" ? (
                      <i className="text-danger">???? nh???n</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "DA_HUY" ? (
                      <i className="text-danger">???? hu???</i>
                    ) : (
                      ""
                    )}
                    {dataO1?.status == "CHO_LAY_HANG" ? (
                      <i className="text-danger">Ch??? l???y h??ng</i>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
              <ReactToPrint
                className="text-center"
                trigger={() => {
                  return (
                    <Button
                      onClick={handleUploadFile}
                      className="text-center print"
                    >
                      Xu???t h??a ????n
                    </Button>
                  );
                }}
                content={() => componentRef.current}
                documentTitle={"Order" + dataO?.id}
                pageStyle="print"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Order;
