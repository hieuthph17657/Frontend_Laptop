import {
  Table,
  Form,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Drawer,
  Image,
  Option,
  Checkbox,
  Spin,
  Tag,
  AutoComplete,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import Moment from "react-moment";
import React, { useEffect, useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const { RangePicker } = DatePicker;
const url = "http://localhost:8080/api/returns";

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  check: params.pagination?.check,
  searchStatus: params.pagination?.searchStatus,
  searchName: params.pagination?.searchName,
  searchPhone: params.pagination?.searchPhone,
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
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const ExchangeSuccess = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [dataRequest, setDataRequest] = useState([]);
  const [dataExchange, setDataExchange] = useState();
  const [isView, setView] = useState(false);
  const [dataExchange1, setDataExchange1] = useState();
  const [dataExchangeDetail, setDataExchangeDetail] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState();
  const [clearForm] = Form.useForm();
  const [searchName, setSearchName] = useState();
  const [optionName, setOptionName] = useState();
  const [dataClient, setDataClient] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [open, setOpen] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "",
      searchName: "",
      searchPhone: "",
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
    loadDataExchange();
    loadDataClient();
  }, [JSON.stringify(tableParams)]);

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

  const clearSearchForm = () => {
    onReset();
    tableParams.pagination.searchStatus = "";
    tableParams.pagination.searchName = "";
    tableParams.pagination.searchPhone = "";
    setSearchName("");
    setPhoneClient("");
    setValueSearch("");
    loadDataExchange();
  };

  const onReset = () => {
    clearForm.resetFields();
  }

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "X??c nh???n ?????i ????n h??ng",
      content: `B???n c?? mu???n x??c nh???n ?????i ????n h??ng n??y kh??ng ?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        handleSubmit(isPut);
      },
    });
  };

  const handleSubmit = (isPut) => {
    const orderDetail = [];
    const array = [];
    selectedRowKeys.forEach((item) => {
      dataRequest.forEach((element) => {
        if (item == element.id) {
          array.push({
            id: element.id,
            productId: element.productIdE,
            orderDetailId: element.orderDetailId,
            quantity: element.quantity,
            orderChange: element.orderChange,
            status: isPut === true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
          });
        }
      });
    });
    array.forEach((element) => {
      orderDetail.push({
        id: element.orderDetailId,
        isCheck: element.orderChange,
        productId: element.productId,
        quantity: element.quantity,
        total: 0,
        isBoolean: true,
        status: "0",
      });
    });

    const exchangeDetails = [];
    fetch(`http://localhost:8080/api/returns/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: data.orderId.id,
        reason: "a",
        description: "a",
        isCheck: 1,
        status: "DA_XU_LY",
        returnDetailEntities: array,
      }),
    }).then((res) => {});
    if (isPut === true) {
      fetch(
        `http://localhost:8080/api/staff/orders/update/exchange/${data.orderId.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(orderDetail),
        }
      ).then((res) => {
        loadDataExchangeDetailById(data.id);
        loadDataExchange();
      });
      toastSuccess("X??c nh???n y??u c???u ?????i h??ng th??nh c??ng !");
    } else {
      fetch(
        `http://localhost:8080/api/auth/orders/update/exchange/${data.orderId.id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(orderDetail),
        }
      ).then((res) => {
        loadDataExchangeDetailById(data.id);
        loadDataExchange();
      });
      toastSuccess("Hu??? y??u c???u ?????i h??ng th??nh c??ng !");
    }
  };

  const ConfirmReturn = (data, isPut) => {
    const returnDetail = [];
    data.returnDetailEntities.forEach((element) => {
      returnDetail.push({
        productId: element.productId.id,
        orderDetailId: element.orderDetail.id,
        quantity: element.quantity,
        status: isPut == true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
      });
    });
    toastSuccess("C???p nh???t th??nh c??ng !");
  };

  const loadDataExchange = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/returns?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        const data = [];
        setDataExchange(results.data.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.data.total,
          },
        });
      });
  };

  const columnDetail = [
    {
      title: "H??nh ???nh",
      dataIndex: "imageProductOd",
      width: "10%",
      render: (imageProductOd) => {
        return (
          <>
            {imageProductOd != undefined ? (
              <Image width={100} src={imageProductOd} />
            ) : (
              <Spin></Spin>
            )}
          </>
        );
      },
    },
    {
      title: "S???n ph???m tr?????c ????",
      dataIndex: "productNameOd",
      width: "14%",
    },
    {
      title: "Gi?? ti???n",
      dataIndex: "priceProductOd",
      width: "10%",
      render: (priceProductOd) => {
        return (
          <>
            {priceProductOd.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "H??nh ???nh",
      dataIndex: "imageProductE",
      width: "10%",
      render: (imageProductE) => {
        return <Image width={100} src={imageProductE} />;
      },
    },
    {
      title: "?????i sang s???n ph???m",
      dataIndex: "productNameE",
      width: "15%",
    },
    {
      title: "Gi?? ti???n",
      dataIndex: "priceProductE",
      width: "10%",
      render: (priceProductE) => {
        return (
          <>
            {priceProductE.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "S???n ph???m l???i",
      dataIndex: "isCheck",
      width: "7%",
      render: (isCheck) => {
        return <Checkbox checked={isCheck == "1" ? true : false} />;
      },
    },
    {
      title: "L?? do",
      dataIndex: "reason",
      width: "15%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        return (
          <>
            {status != "YEU_CAU" ? (
              status === "DA_XAC_NHAN" ? (
                <Tag
                  icon={<CheckCircleOutlined />}
                  className="pt-1 pb-1 text-center"
                  color="success"
                  style={{ width: "100%" }}
                >
                  ???? x??c nh???n
                </Tag>
              ) : (
                <Tag
                  icon={<CloseCircleOutlined />}
                  className="pt-1 pb-1 text-center"
                  color="error"
                  style={{ width: "100%" }}
                >
                  Hu???
                </Tag>
              )
            ) : (
              <Tag
                icon={<ExclamationCircleOutlined />}
                className="pt-1 pb-1 text-center"
                color="warning"
                style={{ width: "100%" }}
              >
                Y??u c???u ?????i h??ng
              </Tag>
            )}
          </>
        );
      },
    },
  ];

  const loadDataExchangeDetailById = (id) => {
    fetch(`http://localhost:8080/api/returns/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const data = [];
        const dataRequest = [];
        console.log(res);
        res.forEach((item) => {
          if (item.status === "YEU_CAU") {
            data.push({
              key: item.id,
              id: item.id,
              status: item.status,
              productNameOd: item.orderDetail.product.name,
              priceProductOd: item.orderDetail.product.price,
              imageProductOd: item.orderDetail.product.images[0]?.name,
              productNameE: item.productId.name,
              priceProductE: item.productId.price,
              imageProductE: item.productId.images[0]?.name,
              productIdE: item.productId.id,
              productIdOd: item.orderDetail.product.id,
              isCheck: item.isCheck,
              reason: item.reason,
              quantity: item.quantity,
              orderDetailId: item.orderDetail.id,
              orderChange: item.orderChange,
            });
          } else {
            dataRequest.push({
              key: item.id,
              id: item.id,
              status: item.status,
              productNameOd: item.orderDetail.product.name,
              priceProductOd: item.orderDetail.product.price,
              imageProductOd: item.orderDetail.product.images[0]?.name,
              productNameE: item.productId.name,
              priceProductE: item.productId.price,
              imageProductE: item.productId.images[0]?.name,
              isCheck: item.isCheck,
              reason: item.reason,
            });
          }
        });
        setDataRequest(data);
        setDataExchangeDetail(dataRequest);
      });
  };

  const showModalData = (id) => {
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
      });

    loadDataExchangeDetailById(id);
    setView(true);
  };

  const columns = [
    {
      title: "M?? ????n ?????i",
      dataIndex: "id",
      width: "7%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "M?? ho?? ????n",
      dataIndex: "orderId",
      width: "10%",
      sorter: (a, b) => a.orderId.id - b.orderId.id,
      render: (orderId) => {
        return <p> {orderId.id}</p>;
      },
    },
    {
      title: "T??n kh??ch h??ng",
      dataIndex: "orderId",
      width: "17%",
      render: (orderId) => {
        return <>{orderId.customerName}</>;
      },
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: "S??? ??i???n thoai",
      dataIndex: "orderId",
      width: "15%",
      render: (orderId) => {
        return <>{orderId.phone}</>;
      },
    },
    {
      title: "Th???i gian",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY HH:mm:ss">{createdAt}</Moment>;
      },
      width: "18%",
    },
    {
      title: "Ghi ch??",
      dataIndex: "description",
      width: "20%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      with: "30%",
      render: (status) => {
        if (status === "CHUA_XU_LY") {
          return (
            <>
              <div
                className=" text-center text-light"
                style={{ width: "150px",background: "#f5222d", borderRadius: "5px", padding: "4px" }}
              >
                Ch??a x??? l??
              </div>
            </>
          );
        } else if (status === "KHONG_XU_LY") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Kh??ng x??? l??
              </div>
            </>
          );
        } else {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                ???? x??? l??
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao t??c",
      width: "35%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <Button type="primary" shape="round" onClick={() => showDrawer(id)}>
              Chi ti???t
            </Button>
          </>
        );
      },
    },
  ];

  const showDrawer = (id) => {
    showModalData(id);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [valueSearch, setValueSearch] = useState("");
  const onChange = (value) => {
    setValueSearch(value);
  };
  const onClickDatLai = () => {
    setValueSearch("");
    tableParams.pagination.searchStatus = "";
    loadDataExchange();
  };
  const onClickSearch = () => {
    tableParams.pagination.searchStatus =
      valueSearch != undefined ? valueSearch : "";
    tableParams.pagination.searchName = searchName ? searchName : "";
    (tableParams.pagination.searchPhone = phoneClient ? phoneClient : ""),
      (tableParams.pagination.current = 1);
    loadDataExchange();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onCancel = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "Hu??? x??c nh???n ?????i ????n h??ng",
      content: `B???n c?? hu??? mu???n x??c nh???n ?????i ????n h??ng n??y kh??ng ?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        handleSubmit(isPut);
      },
    });
  };

  
  const onSelectAutoClient = (value) => {
    console.log(value);
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Y??u c???u ?????i h??ng</h4>
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
            onClickSearch();
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
              <label>Tr???ng th??i</label>
              <br />
              <Select
                placeholder="Ch???n tr???ng th??i ????n ?????i"
                style={{ width: "300px", borderRadius: "5px" }}
                value={valueSearch}
                onChange={onChange}
                options={[
                  {
                    value: "DA_XU_LY",
                    label: "???? x??? l??",
                  },
                  {
                    value: "CHUA_XU_LY",
                    label: "Ch??a x??? l??",
                  },
                ]}
              ></Select>
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
            dataSource={dataExchange}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
        <Drawer
          title="Chi ti???t ????n ?????i"
          placement="right"
          onClose={onClose}
          open={open}
          width={1200}
        >
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                <p>M?? ????n ?????i: {data?.id} </p>
                <p>M?? ho?? ????n: {data?.orderId.id} </p>
                <p>
                  Ng??y g???i y??u c???u:{" "}
                  <Moment format="DD-MM-YYYY HH:mm:ss">
                    {data?.createdAt}
                  </Moment>
                </p>
              </div>
              <div className="col-6">
                <p>T??n kh??ch h??ng: {data?.orderId.customerName}</p>
                <p>S??? ??i???n tho???i: {data?.orderId.phone}</p>
                <p>Ghi ch??: {data?.description}</p>
              </div>
            </div>
            <div>
              <div className="col-12 mt-4 mb-2 confirm">
                {selectedRowKeys.length > 0 ? (
                  <div className="text-center ">
                    <Button type="primary" shape="round" onClick={onConfirm}>
                      X??c nh???n ????n h??ng
                    </Button>
                    <Button
                      className="ms-2"
                      type="primary"
                      shape="round"
                      danger
                      onClick={onCancel}
                    >
                      Hu???
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <h6 className="text-danger fw-bold ">????n ?????i ch??a x??? l??</h6>
              <Table
                rowSelection={rowSelection}
                columns={columnDetail}
                rowKey={(record) => record.id}
                dataSource={dataRequest}
                pagination={{ position: ["none", "none"] }}
              />
              <h6 className="text-danger fw-bold mt-5">????n ?????i ???? x??? l??</h6>
              <Table
                columns={columnDetail}
                rowKey={(record) => record.id}
                dataSource={dataExchangeDetail}
                pagination={{ position: ["none", "none"] }}
              />
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default ExchangeSuccess;
