import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Drawer,
  Alert,
  Image,
  Checkbox,
  AutoComplete,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import Moment from "react-moment";
import { useParams } from "react-router-dom";
import { render } from "@testing-library/react";
const { Option } = Select;

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchStatus: params.pagination?.searchStatus,
  searchProductKey: params.pagination?.searchProductKey,
  searchPn: params.pagination?.searchImei,
  searchPrice: params.pagination?.searchPrice,
});

const ExchangeUser = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState();
  const [dataCart, setDataCart] = useState([]);
  const [valueInputNumber, setValueInputNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [exChangeDetail, setExchangeDetail] = useState({});
  const [des, setDes] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
      searchImei: "",
      searchPrice: "",
      searchProductKey: "",
    },
  });

  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
      searchImei: "",
      searchProductKey: "",
      searchPrice: "",
    },
  });
  const showModal = (item) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const onChangeReason = (value, id) => {
    let check = false;
    console.log(value);
    if (!isNaN(value)) {
      dataCart?.forEach((element, index) => {
        if (element.index == id) {
          element.reason = "null";
        }
      });
      check = true;
    }
    let count = 0;
    dataCart?.forEach((element, index) => {
      if (element.index == id && isNaN(value)) {
        console.log("r???ng: ", check);
        console.log("v??o ?????m count");
        count++;
        element.reason = value;
        // setReason(count);
      }
    });
  };

  const onCancel = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CloseCircleOutlined className="text-danger" />,
      title: "Hu??? y??u c???u ?????i h??ng",
      content: `B???n c?? mu???n hu??? y??u c???u ?????i h??ng ${record.id} kh??ng ?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        cancelOrderDetail(record);
      },
    });
  };

  const cancelOrderDetail = (data) => {
    const orderDetail = [];
    orderDetail.push({
      id: data.id,
      isCheck: data.id,
      productId: data.product.id,
      quantity: data.quantity,
      total: 0,
      isBoolean: false,
      status: "0",
    });
    fetch(
      `http://localhost:8080/api/auth/orders/update/exchange/${data.id}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(orderDetail),
      }
    ).then((res) => {
      loadDataOrder(id);
    });
    toastSuccess("Hu??? y??u c???u ?????i h??ng th??nh c??ng !");
  };

  const handleOk = () => {
    if (dataCart.length == 0) {
      toastError("B???n ch??a ch???n s???n ph???m ????? ?????i h??ng");
    } else {
      const data = [];
      dataCart?.forEach((element, index) => {
        data.push({
          index: index,
          orderId: id,
          productId: element.id,
          total: element.price,
          quantity: 1,
          isCheck: item?.id,
        });
      });

      let count = 0;
      dataCart.forEach((item) => {
        if (item.reason != undefined && item.reason != "null") {
          count++;
        }
      });

      if (dataCart.length == count) {
        fetch("http://localhost:8080/api/auth/orders/exchanges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((results) => {
            console.log(results);
            handleSubmitReturn(results.data, item);
          })
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        setIsModalOpen(false);
      } else {
        toastError("B???n ch??a nh???p ?????y ????? l?? do !");
      }
    }
  };

  const onChangeChecked = (value, id) => {
    console.log("value checked");
    console.log(value);
    setChecked(value);
    dataCart?.forEach((element, index) => {
      if (element.index == id) {
        element.checked = value;
      }
    });
    console.log("data checked");
    console.log(dataCart);
  };

  const handleSubmitReturn = (data, dataOrderDetail) => {
    const ExchangeDetail = [];
    let count = 0;
    data?.forEach((element, index) => {
      ExchangeDetail.push({
        productId: element.product.id,
        orderDetailId: item.id,
        quantity: 1,
        reason: dataCart[index].reason,
        orderChange: element.id,
        status: "YEU_CAU",
        isCheck: dataCart[index].checked == true ? "1" : "",
        id: null,
      });
      count++;
    });

    // console.log("data exchange");
    // console.log(ExchangeDetail);

    // var date = new Date().getDate();
    // var month = new Date().getMonth() + 1;
    // var year = new Date().getFullYear();
    // var hours = new Date().getHours();
    // var min = new Date().getMinutes();
    // var sec = new Date().getSeconds();
    // setCurrentDate(date + "-" + month + "-" + year + " ");
    // const event = new Date(order?.updatedAt);
    // const event1 = new Date("2022-11-11 18:56:26");
    // console.log(
    //   moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY")
    // );
    // if (reason != undefined) {
    ///t???o ????n ?????i
    // try {
    fetch("http://localhost:8080/api/auth/returns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        orderId: order.id,
        description:note,
        status: "CHUA_XU_LY",
        returnDetailEntities: ExchangeDetail,
      }),
    }).then((res) => {});
    fetch(
      `http://localhost:8080/api/auth/orders/${dataOrderDetail.id}/updateOrderDetail`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId: dataOrderDetail.product.id,
          total: dataOrderDetail.total,
          quantity: 1,
          status: dataOrderDetail.status,
          isCheck: dataOrderDetail.id,
          isUpdate: 1,
        }),
      }
    ).then((res) => loadDataOrder(id));
    toastSuccess("G???i y??u c???u th??nh c??ng!");
    setReason("");
    setChecked(false);
    setIsModalOpen(false);
    setNote("");
    setLoading(false);

    setChecked(false);
    setDataCart([]);
    loadDataOrder(id);
  };
  const handleCancel = () => {
    setDataCart([]);
    setIsModalOpen(false);
  };

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

  const toastError = (message) => {
    toast.error(message, {
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

  useEffect(() => {
    loadDataOrder(id);
    // loadDataProduct();
    loadDataProduct2();
  }, []);

  const loadDataProduct2 = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
        const dataResult = [];
        results.data.data.forEach((item) => {
          if (item.quantity > 0) {
            dataResult.push(
              renderItem(
                item.id,
                item.name,
                item?.images[0]?.name,
                item.price,
                item.debut
              )
            );
          }
          setData(dataResult);
        });
      });
  };

  const renderItem = (id, title, count, price, debut) => ({
    value: id,
    label: (
      <div
        style={{
          display: "flex",
        }}
      >
        <span>
          <Image width={85} src={count} />
        </span>
        {" " + title + " (" + debut + ") "}{" "}
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    price: price,
  });

  // const loadDataProduct = () => {
  //   setLoading(true);
  //   fetch(
  //     `http://localhost:8080/api/products?${qs.stringify(
  //       getRandomProductParams(tableParams)
  //     )}`
  //   )
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setDataProduct(results.data.data);
  //       setLoading(false);
  //       setTableParams({
  //         pagination: {
  //           current: results.data.current_page,
  //           pageSize: 10,
  //           total: results.data.total,
  //         },
  //       });
  //     });
  // };

  const onConfirm = (record) => {
    const isPut = true;

    Modal.confirm({
      title: "Y??u c???u tr??? h??ng ho??n ti???n",
      icon: <CheckCircleOutlined />,
      content: render(
        <h1>
          <h1>{record.id}</h1>
        </h1>
      ),
      okText: "C??",
      cancelText: "Kh??ng",
      onOk: () => {
        handleSubmitReturn(record);
      },
    });
  };

  const loadDataOrder = (id) => {
    console.log(id);
    setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOrder(res);
      });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
  };

  const onChangeProduct = (value) => {
    // loadDataProduct();
    const dataPro = [];
    let productValue;
    setValueProduct(value);
    console.log(dataProduct);
    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          console.log("v??o push");
          dataPro.push({
            id: product.id,
            images: product?.images[0].name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          productValue = product;
        });
    }
    if (dataCart === undefined) {
      dataPro.forEach((element, index) => {
        if (element.price < item.product.price) {
          dataPro.splice(index, 1);
          toastError(
            "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("S???n ph???m kh??ng ???????c v?????t qu?? s??? l?????ng mua ban ?????u !");
      } else {
        dataPro.forEach((element, index) => {
          if (element.price < item.product.price) {
            dataPro.splice(index, 1);
            toastError(
              "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
            );
          } else {
            setDataCart((t) => [...t, productValue]);
          }
        });
      }
    }

    let total = dataPro[0]?.price;
    if (dataCart?.length === undefined) {
      setTotalProduct(total);
    }
    if (dataCart?.length + 1 <= item.quantity) {
      dataCart?.forEach((item) => {
        total += item.price;
      });
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + searchItem);
  };
  const deleteProduct = (item) => {
    let total = 0;
    dataCart.forEach((element, index) => {
      if (element.id === item.id && element.index == item.index) {
        dataCart.splice(index, 1);
      }
    });

    dataCart.forEach((element) => {
      total += element.price;
    });
    setTotalProduct(total);

    // loadDataProduct();
  };

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onDetail = (id) => {
    setView(true);
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail/exchange`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log("onDetail");
        console.log(results);
        setExchangeDetail(results);
        handleDataExchange(results.exchangeId)
      });

     
  };

  const handleDataExchange = (id) => {
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail`)
      .then((res) => res.json())
      .then((res) => {
        setDes(res.data.description);
      });
  }

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    const dataPro = [];
    let productValue;

    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item, index) => item.id === value)
        .map((product, index) => {
          dataPro.push({
            index: index,
            id: product.id,
            images: product?.images[0]?.name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
        });
      console.log(dataPro);
    }
    if (dataCart === undefined || dataCart === [] || dataCart.length == 0) {
      dataPro.forEach((element, index) => {
        if (Number(element.price) < Number(item.product.price)) {
          dataPro.splice(index, 1);
          toastError(
            "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity && item.isCheck == null) {
        toastError("S???n ph???m kh??ng ???????c v?????t qu?? s??? l?????ng mua ban ?????u !");
      } else if (
        dataCart.length + 1 > Math.abs(item.isCheck) &&
        item.isCheck != null
      ) {
        toastError("S???n ph???m kh??ng ???????c v?????t qu?? s??? l?????ng cho ph??p !");
      } else {
        dataPro.forEach((element, index) => {
          if (Number(element.price) < Number(item.product.price)) {
            dataPro.splice(index, 1);
            toastError(
              "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
            );
          } else {
            console.log("v??o else cu???i c??ng");
            console.log(dataCart[dataCart.length - 1].index);
            console.log(dataPro[0]);
            const pro = {
              index: Number(dataCart[dataCart.length - 1].index) + 1,
              id: dataPro[0].id,
              images: dataPro[0].images,
              name: dataPro[0].name,
              price: dataPro[0].price,
              debut: dataPro[0].debut,
            };
            // console.log((t) => [...t, dataPro[0]]);
            setDataCart((t) => [...t, pro]);
            console.log(dataCart);
          }
        });
      }
    }

    let total = dataPro[0]?.price;
    if (dataCart?.length === undefined) {
      setTotalProduct(total);
    }
    if (dataCart?.length + 1 <= item.quantity) {
      dataCart?.forEach((item) => {
        total += item.price;
      });
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };
  function compareDates(d2) {
    const currentDate = new Date().getTime();
    const date = new Date(d2);
    date.setDate(date.getDate() + 10);
    let date3 = new Date(date).getTime();
    console.log(date3);
    if (date3 < currentDate) {
      return true;
    } else if (date3 > currentDate) {
      return false;
    } else {
      return true;
    }
  }
  return (
    <div className="container mt-4">
      <ToastContainer></ToastContainer>
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
        <h4 className="text-danger fw-bold mt-4 text-center">?????i h??ng</h4>
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5">
                M?? ho?? ????n: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5">
                Kh??ch h??ng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5">
                S??? ??i???n tho???i: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 ms-5">Ghi ch??: {order?.note}</div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Ng??y mua:{" "}
                <b>
                  {" "}
                  <Moment format="DD-MM-YYYY HH:mm:ss">
                    {order?.createdAt}
                  </Moment>
                </b>
              </div>
              <div className="mt-2">
                T???ng ti???n:
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                ?????a ch??? nh???n h??ng: <b>{order?.address}</b>
              </div>
              <div className="mt-2">
                Tr???ng th??i: <b>???? nh???n h??ng</b>{" "}
              </div>
            </div>
          </div>
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">M?? HDCT</th>
                <th>H??nh ???nh</th>
                <th scope="col">T??n s???n ph???m</th>
                <th scope="col">Gi?? ti???n</th>
                <th scope="col">S??? l?????ng</th>
                <th scope="col">T???ng ti???n</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product.name}</td>
                    <td>
                      {item?.product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      {item?.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {item.isCheck === null && order.status == "DA_NHAN"&&compareDates(order.updatedAt) != true ? (
                        <Button
                          shape="round"
                          type="primary"
                          onClick={() => showModal(item)}
                          hidden={
                            Math.abs(item.isCheck) == 0 && item.isCheck != null
                          }
                        >
                          Ch???n s???n ph???m (
                          {item.isCheck == null
                            ? item.quantity
                            : Math.abs(item.isCheck)}
                          )
                        </Button>
                      ) : item.isCheck != null &&
                        item.isCheck < 0 &&
                        Math.abs(item.isCheck) > 0 &&
                        order.status == "DA_NHAN"&&compareDates(order.updatedAt) ? (
                        <Button
                          shape="round"
                          onClick={() => showDrawer(item)}
                          hidden={Math.abs(item.isCheck) == 0}
                        >
                          Ch???n s???n ph???m (
                          {item.isCheck == null
                            ? item.quantity
                            : Math.abs(item.isCheck)}
                          )
                        </Button>
                      ) : (
                        ""
                      )}
                      {item.isCheck === 1 ? (
                        item.total > 0 ? (
                          <Alert
                            message="Ho?? ????n ch??nh"
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="Ho?? ????n tr?????c khi ?????i"
                            type="info"
                            showIcon
                          />
                        )
                      ) : item.isCheck != 1 &&
                        item.isCheck !== null &&
                        item.isCheck != 3 &&
                        item.isCheck > 0 ? (
                        <>
                          <Button
                            type="primary"
                            onClick={() => onCancel(item)}
                            danger
                          >
                            Hu???
                          </Button>
                          <Button
                            className="ms-2"
                            onClick={() => onDetail(item.id)}
                            danger
                          >
                            Chi ti???t
                          </Button>
                          <i className="text-primary mx-2">
                            ????n y??u c???u ?????i ho?? ????n {item.isCheck}
                          </i>
                        </>
                      ) : item.isCheck == 3 ? (
                        <>
                          <i className="text-danger fw-bold">
                            ????n y??u c???u ?????i b??? hu???
                          </i>
                          <Button
                            className="ms-2"
                            onClick={() => onDetail(item.id)}
                            danger
                          >
                            Chi ti???t
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal
          title="Ch???n s???n ph???m mu???n ?????i h??ng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1400}
          cancelText={"????ng"}
          okText={"G???i y??u c???u"}
        >
          <div className="search-inner mb-2">
            <div className="row">
              <div className="col-7">
                <p>
                  S???n ph???m tr?????c ????:{" "}
                  <i className="text-danger">{item?.product.name}</i>
                </p>
                <p>
                  S??? l?????ng: <i className="text-danger">{item?.quantity}</i>
                </p>
                <p>
                  T???ng ti???n tr?????c ????:{" "}
                  <i className="text-danger">
                    {item?.total.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </i>
                </p>
                <div className="mt-2 mb-3">
                  <TextArea
                    onChange={(e) => setNote(e.target.value)}
                    className=""
                    value={note}
                    style={{ width: "100%" }}
                    placeholder="Ghi ch?? ????n ?????i"
                    rows={3}
                    cols={4}
                  />
                </div>
              </div>
              <div className="col-5">
                <p>
                  T???ng ti???n hi???n t???i:{" "}
                  <i className="text-danger">
                    {totalProduct > 0
                      ? totalProduct?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 VND "}
                  </i>
                </p>
                <p>
                  S??? ti???n kh??ch h??ng ph???i tr??? th??m:{" "}
                  <i className="text-danger">
                    {totalProduct > item?.total
                      ? (totalProduct - item?.total).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : (item?.total - totalProduct).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </i>
                </p>
              </div>
            </div>
            <AutoComplete
              style={{
                width: 760,
              }}
              value={values}
              options={data}
              onChange={(event) => onChangeSearch(event)}
              onSelect={onSelectAuto}
              placeholder="T??n s???n ph???m"
              filterOption={(inputValue, option) =>
                option.label.props.children[1]
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" cols="1">
                  STT
                </th>
                <th className="text-center" cols="2">
                  H??nh ???nh
                </th>
                <th className="text-center">T??n s???n ph???m</th>
                <th className="text-center">L?? do ?????i h??ng</th>
                <th className="text-center">S???n ph???m l???i ?</th>
                <th className="text-center">Thao t??c</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      {item.images[0].name === undefined ? (
                        <Image width={90} src={item.images} />
                      ) : (
                        <Image width={90} src={item.images[0].name} />
                      )}
                    </td>
                    <td>
                      {item.name}{" "}
                      {item?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      <TextArea
                        rows={4}
                        style={{ width: "300px" }}
                        onChange={(event) =>
                          onChangeReason(event.target.value, index)
                        }
                        cols={4}
                        placeholder="Nh???p l?? do"
                      />
                    </td>
                    <td>
                      <Checkbox
                        onChange={(e) =>
                          onChangeChecked(e.target.checked, index)
                        }
                      />
                    </td>
                    <td>
                      <CloseCircleOutlined
                        onClick={() => deleteProduct(item)}
                        style={{ fontSize: "20px", color: "red" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal>
        <Modal
          title="Chi ti???t ????n g???i y??u c???u"
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
          <table className="table">
            <thead>
              <tr>
                <th>H??nh ???nh</th>
                <th>S???n ph???m tr?????c ????</th>
                <th>H??nh ???nh</th>
                <th>?????i sang s???n ph???m</th>
                <th>S???n ph???m l???i</th>
                <th>L?? do</th>
              </tr>
            </thead>
            <tbody>
              <td>
                <img
                  width={100}
                  src={exChangeDetail?.orderDetail?.product?.images[0]?.name}
                ></img>
              </td>
              <td>
                {exChangeDetail?.orderDetail?.product?.name +
                  "(" +
                  exChangeDetail?.orderDetail?.product?.price.toLocaleString(
                    "it-IT",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  ) +
                  ")"}
              </td>
              <td>
                <img
                  width={100}
                  src={exChangeDetail?.productId?.images[0]?.name}
                ></img>
              </td>
              <td>
                {exChangeDetail?.productId?.name +
                  "(" +
                  exChangeDetail?.productId?.price.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  }) +
                  ")"}
              </td>
              <td>
                <Checkbox
                  checked={exChangeDetail?.isCheck == "1" ? true : false}
                />
              </td>
              <td>{exChangeDetail?.reason}</td>
            </tbody>
          </table>
          <h6 className="text-danger fw-bold">Ghi ch??: {des} </h6>
        </Modal>
      </div>
    </div>
  );
};

export default ExchangeUser;
