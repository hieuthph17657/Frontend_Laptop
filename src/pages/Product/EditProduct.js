import { MenuFoldOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  Image,
  InputNumber,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import qs from "qs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 } from "uuid";
import { storage } from "../../image/firebase/firebase";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});


const toastError = (message) => {
  toast.error(message, {
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

function EditProduct() {
  const set = new Set();
  const props = {
    name: "file",
    multiple: true,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status == "error") {
        info.file.status = "done";
      }
      if (info.file.status == "removed") {
        console.log(info);
        console.log("removed");
      }
      if (info.file.status === "done") {
        info.fileList.forEach((item) => {
          set.add(item.originFileObj);
        });
      }
    },
  };
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [size, setSize] = useState();
  const [length, setLength] = useState();
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [debut, setDebut] = useState(getDate);
  const [description, setDescription] = useState();
  const [origin, setOrigin] = useState();
  const [imei, setImei] = useState();
  const [win, setWin] = useState();
  const [slot, setSlot] = useState();
  const [optical, setOptical] = useState();
  const [processor, SetProcessor] = useState();
  const [battery, setBattery] = useState();
  const [capacity, setCapacity] = useState("VGA ADM");
  const [ram, setRam] = useState("4GB");
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [warrantyPeriod, setWarrantyPeriod] = useState();
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);

  const [clearForm] = Form.useForm();

  const onReset = () => {
    clearForm.resetFields();
    clearForm.setFieldValue();
  };

  const imagesListRef = ref(storage, "images/"); //all url
  const uploadFile = (image) => {
    if (image == null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        console.log("url", url);
        // console.log("snapshot.ref", snapshot.ref); //_service: {???}, _location: {???}
        setImageUrls((prev) => [...prev, url]); //set url ->all url
        console.log("??i qua ch??? n??y");
      });
      setImageUpload((prev) => [...prev, image]);
      console.log("??i xu???ng cu???i c??ng");
    });
  };

  //x??? l?? sau khi uploadfile
  useEffect(() => {
    // listAll(imageUpload).then((response) => {
    //   console.log("imagesListRef", imagesListRef);
    //   response.items.forEach((item) => {
    //     console.log("item", item);
    //     getDownloadURL(item).then((url) => {
    //       setImageUrls((prev) => [...prev, url]);
    //       setImages((prev) => [...prev, url]);
    //     });
    //   });
    // });
    loadDataWin();
    imageUrls.forEach((image) => console.log(image));
  }, [images]);

  const loadDataWin = () => {
    fetch(
      `http://localhost:8080/api/auth/wins?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setWin(results.data.data);
      });
  };

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const productEdit = JSON.parse(localStorage.getItem("productEdit"));

  const [data, setData] = useState({
    name: productEdit?.name,
    quantity: productEdit?.quantity,
    price: productEdit?.price,
    imei: productEdit?.imei,
    weight: productEdit?.weight,
    size: productEdit?.size,
    debut: productEdit?.debut,
    material: productEdit?.material,
    p_n: productEdit?.p_n,
    origin: productEdit?.origin,
    categoryProducts: productEdit?.categoryProducts,
    manufacture: productEdit?.manufacture,
    description: productEdit?.description,
    accessoryProducts: productEdit?.accessoryProducts,
    productColors: productEdit?.productColors,
    storage: productEdit?.storage,
    length: productEdit?.length,
    width: productEdit?.width,
    height: productEdit?.height,
    warrantyPeriod: productEdit.warrantyPeriod,
    images: productEdit?.images.map((item) => ({
      name: item.name,
      product: null,
      return_id: null,
      exchange_id: null,
    })),
    configuration: {
      processor: productEdit?.processor,
      ram: productEdit?.ram,
      slot: productEdit?.slot,
      battery: productEdit?.battery,
      security: productEdit?.security,
      screen: productEdit?.screen,
      card: productEdit?.card,
      cardOnboard: productEdit?.cardOnboard,
      hard_drive: productEdit?.hard_drive,
      win: productEdit?.win,
      capacity: productEdit?.capacity,
    },
  });

  const [form, setValues] = useState({
    name: data?.name,
    quantity: data?.quantity,
    price: data?.price,
    imei: data?.imei,
    weight: data?.weight,
    size: data?.size,
    debut: data?.debut,
    p_n: data?.p_n,
    origin: data?.origin,
    categoryProducts: data?.categoryProducts,
    manufacture: data?.manufacture,
    material: data?.material,
    length: data?.length,
    width: data?.width,
    height: data?.height,
    images: data?.images
      ? data.images.map((item) => ({
          name: item.name,
          product: null,
          return_id: null,
          exchange_id: null,
        }))
      : null,
    processor: data?.configuration.processor,
    ram: data?.configuration.ram,
    slot: data?.configuration.slot,
    battery: data?.configuration.battery,
    security: data?.configuration.security,
    screen: data?.configuration.screen,
    storage: data?.storage,
    card: data?.configuration.card,
    description: data?.description,
    accessoryProducts: data?.accessoryProducts,
    productColors: data?.productColors,
    cardOnboard: data?.configuration.cardOnboard,
    hard_drive: data?.configuration.hard_drive,
    win: data?.configuration.win,
    capacity: data?.configuration.capacity,
    warrantyPeriod: data.warrantyPeriod,
  });

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
    },
  });

  function getDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    var date = year + "/" + month + "/" + day;
    return date;
  }

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

  const getRandomMuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  const loadDataManufacture = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/manufactures?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setManufacture(results.data.data);
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

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataColor(results.data.data);
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

  const loadDataCategory = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setCategory(results.data.data);
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

  const loadDataRam = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataRam(results.data.data);
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

  const loadDataScreen = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/screens?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataScreen(results.data.data);
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

  const loadDataProcess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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

  const loadDataOrigin = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOrigin(results.data.data);
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

  const loadDataCard = () => {
    fetch(
      `http://localhost:8080/api/card?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCard(results.data.data);
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

  const loadDataBattery = () => {
    fetch(
      `http://localhost:8080/api/auth/batteryCharger?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setBattery(results.data.data);
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

  const loadDataAccessor = () => {
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataAccessory(results.data.data);
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

  const dateFormat = "YYYY";

  const loadDataStorage = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataStorage(results.data.data);
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
    // listAll(imageUpload).then((response) => {
    //   // console.log("imagesListRef",imagesListRef)
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       setImageUrls((prev) => [...prev, url]);
    //       setImages((prev) => [...prev, url]);
    //     });
    //   });
    // });
    loadDataOrigin();
    loadDataProcess();
    loadDataScreen();
    loadDataRam();
    loadDataCard();
    loadDataBattery();
    loadDataManufacture();
    loadDataAccessor();
    loadDataStorage();
    loadDataColor();
    loadDataCategory();

    console.log("product edit");
    console.log(productEdit);

    console.log("d??? li???u set data");
    console.log(data);
  }, [images]);
  console.log("form", form);

  const handleClick = (data) => {
    console.log("image url");
    console.log(imageUrls);

    if (imageUrls.length > 0) {
      data.images = imageUrls;
      data.status = "ACTIVE";
      data.debut = moment(data.debut).format("yyyy");
      const quantity = Number(data.quantity);
      data.images = imageUrls.map((item) => ({
        name: item,
        product: null,
        return_id: null,
        exchange_id: null,
      }));
    }
    const product = {
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: moment(data.debut).format("yyyy"),
      categoryId: data.categoryId,
      manufactureId: data.manufactureId,
      images: imageUrls.length > 0 ? data.images : [],
      status: "ACTIVE",
      processorId: data.processorId,
      screenId: data.screenId,
      cardId: data.cardId,
      originId: data.originId,
      colorId: data.colorId,
      batteryId: data.batteryId,
      ramId: data.ramId,
      winId: data.win,
      material: data.material,
      cardOnboard: data.cardOnboard,
      accessoryId: data.accessoryId,
      security: data.security,
      description: data.description,
      storageId: data.storageId,
      warrantyPeriod: data.warrantyPeriod,
    };
    handleSubmit(product);
  };

  const handleSubmit = (product) => {
    const yearCurrent = new Date().getFullYear();
    if (Number(product.debut > yearCurrent)) {
      toastError("N??m ra m???t l???n n??m hi???n t???i!");
    } else if (Number(product.debut) < yearCurrent - 4) {
      toastError("N??m ra m???t nh??? h??n n??m hi???n t???i kh??ng qu?? 4 n??m!");
    } else {
      fetch(`http://localhost:8080/api/products/${productEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
        .then((response) => {})
        .then((results) => {
          console.log(results);
          onReset();
          localStorage.removeItem("productEdit");
          toastSuccess("C???p nh???t s???n ph???m th??nh c??ng!");
          setTimeout(() => {
            navigate("/admin/product");
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleUpload = () => {
    set.forEach((item) => {
      uploadFile(item);
    });
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
    <div className="row">
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">C???p nh???t s???n ph???m</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "100%",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <ToastContainer></ToastContainer>
        <div>
          <Form
            name="nest-messages"
            validateMessages={validateMessages}
            form={clearForm}
            className="me-2 ms-2"
            initialValues={{
              cpuCompany: name,
            }}
            layout="vertical"
            autoComplete="off"
            onFinish={(values) => {
              handleClick(values);
            }}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            <div className="row">
              <div className=" mt-4 col-4">
                <Form.Item
                  className="mt-2"
                  name="name"
                  label="T??n s???n ph???m"
                  initialValue={form.name}
                  rules={[
                    {
                      required: true,
                      message: "T??n s???n ph???m kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nh???p t??n s???n ph???m"
                    value={name}
                  />
                </Form.Item>
              </div>
              <div className=" mt-4 col-4">
                <Form.Item
                  className="mt-2"
                  name="imei"
                  label="M?? m??y"
                  initialValue={form.imei}
                  rules={[
                    {
                      required: true,
                      message: "M?? m??y kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                    { min: 3, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nh???p m?? m??y"
                    // value={imei}
                    // readOnly={true}
                  />
                </Form.Item>
              </div>
              <div className="col-4 mt-4">
                <Form.Item
                  className="mt-2"
                  name="categoryId"
                  label="Th??? lo???i s???n ph???m"
                  requiredMark="optional"
                  initialValue={form.categoryProducts?.map(
                    (item) => item.category.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "Th??? lo???i s???n ph???m kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n th??? lo???i" mode="multiple">
                    {category.map((cate, index) => (
                      <Select.Option value={cate.id} key={index}>{cate.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="  col-4">
                <Form.Item
                  className="mt-2"
                  name="price"
                  label="Gi?? ti???n"
                  initialValue={form.price}
                  rules={[
                    {
                      type: "number",
                      min: 10000000,
                      max: 100000000,
                      required: true,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                    placeholder="Nh???p gi?? ti???n"
                    value={price}
                  />
                </Form.Item>
              </div>
              <div className=" col-4">
                <Form.Item
                  className="mt-2"
                  name="quantity"
                  label="S??? l?????ng"
                  initialValue={form.quantity}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    value={quantity}
                    placeholder="Nh???p s??? l?????ng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col-4 ">
                <Form.Item
                  className="mt-2"
                  name="colorId"
                  label="M??u s???c"
                  requiredMark="optional"
                  initialValue={form.productColors?.map(
                    (item) => item.color.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "M??u s???c kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Ch???n m??u">
                    {dataColor?.map((item, index) => (
                      <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <Form.Item
                  name="length"
                  label="Chi???u d??i"
                  initialValue={form.length}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nh???p chi???u d??i"
                    style={{ width: "100%" }}
                    value={length}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="width"
                  label="Chi???u r???ng"
                  initialValue={form.width}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nh???p chi???u r???ng"
                    style={{ width: "100%" }}
                    value={width}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="height"
                  label="Chi???u cao"
                  initialValue={form.height}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nh???p chi???u cao"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="weight"
                  label="C??n n???ng"
                  initialValue={form.weight}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 10,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    placeholder="Nh???p c??n n???ng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  label="N??m s???n xu???t"
                  name="debut"
                  initialValue={moment(form.debut)}
                  rules={[
                    {
                      required: true,
                      message: "N??m s???n xu???t kh??ng ???????c ????? tr???ng!",
                    },
                  ]}
                >
                  <DatePicker
                    picker="year"
                    placeholder="Ch???n n??m s???n xu???t"
                    format={dateFormat}
                  />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  className=""
                  name="originId"
                  label="Xu???t x???"
                  requiredMark="optional"
                  initialValue={form.origin?.id}
                  rules={[
                    {
                      required: true,
                      message: "Xu???t x??? kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n xu???t x???">
                    {dataOrigin?.map((cate, index) => (
                      <Select.Option value={cate.id} key={index}>{cate.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="material"
                  label="Ch???t li???u"
                  initialValue={form.material}
                  rules={[
                    {
                      required: true,
                      message: "Ch???t li???u kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nh???p ch???t li???u"
                  />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="ramId"
                  label="Ram"
                  requiredMark="optional"
                  initialValue={form.ram?.id}
                  rules={[
                    {
                      required: true,
                      message: "Ram kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n ram">
                    {dataRam?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.ramCapacity +
                          " " +
                          item.typeOfRam +
                          " " +
                          item.ramSpeed +
                          " " +
                          item.maxRamSupport}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="processorId"
                  label="CPU"
                  requiredMark="optional"
                  initialValue={form.processor?.id}
                  rules={[
                    {
                      required: true,
                      message: "CPU kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n CPU">
                    {processors?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.cpuCompany +
                          " " +
                          item.cpuTechnology +
                          " " +
                          item.cpuType +
                          " " +
                          item.cpuSpeed}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="screenId"
                  label="M??n h??nh"
                  requiredMark="optional"
                  initialValue={form.screen?.id}
                  rules={[
                    {
                      required: true,
                      message: "M??n h??nh kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n m??n h??nh">
                    {dataScreen?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.size +
                          " " +
                          item.screenTechnology +
                          " " +
                          item.resolution +
                          " " +
                          item.screenType}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="cardId"
                  label="Card r???i"
                  initialValue={form.card?.id}
                  rules={[
                    {
                      required: true,
                      message: "Card r???i kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  requiredMark="optional"
                >
                  <Select placeholder="Ch???n card r???i">
                    {dataCard?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.trandemark + " " + item.model + " " + item.memory}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="win"
                  label="H??? ??i???u h??nh"
                  requiredMark="optional"
                  initialValue={form.win?.id}
                  rules={[
                    {
                      required: true,
                      message: "H??? ??i???u h??nh kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n h??? ??i???u h??nh">
                    {win?.map((item,index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.name + " - " + item.version}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="cardOnboard"
                  label="Card onboard"
                  requiredMark="optional"
                  initialValue={form.cardOnboard?.id}
                  rules={[
                    {
                      required: true,
                      message: "Card r???i kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n card onboard">
                    {dataCard?.map((item,index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.trandemark + " " + item.model + " " + item.memory}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="storageId"
                  label="L??u tr???"
                  initialValue={form.storage?.id}
                  rules={[
                    {
                      required: true,
                      message: "L??u tr??? kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  requiredMark="optional"
                >
                  <Select placeholder="Ch???n ??? c???ng">
                    {dataStorage?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.storageType.name +
                          " " +
                          item.type +
                          " " +
                          item.capacity}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="batteryId"
                  label="Pin"
                  requiredMark="optional"
                  initialValue={form.battery?.id}
                  rules={[
                    {
                      required: true,
                      message: "Pin kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n lo???i pin">
                    {battery?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>
                        {item.batteryType +
                          " " +
                          item.battery +
                          " " +
                          item.charger}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Item
                  name="manufactureId"
                  label="H??ng s???n xu???t"
                  requiredMark="optional"
                  initialValue={form.manufacture?.id}
                  rules={[
                    {
                      required: true,
                      message: "H??ng s???n xu???t kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n lo???i pin">
                    {manufacture?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  className=""
                  name="security"
                  label="B???o m???t"
                  initialValue={form.security}
                  rules={[
                    {
                      required: true,
                      message: "B???o m???t kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input style={{ width: "100%" }} placeholder="B???o m???t" />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="accessoryId"
                  label="Ph??? ki???n trong h???p"
                  requiredMark="optional"
                  initialValue={form.accessoryProducts?.map(
                    (item) => item.accessory.id
                  )}
                  rules={[
                    {
                      required: true,
                      message: "Ph??? ki???n kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Ch???n c??c ph??? ki???n">
                    {dataAccessory?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <Form.Item
                  label="M?? t??? s???n ph???m"
                  name="description"
                  initialValue={form.description}
                  onChange={(e) => setDescription(e.target.value)}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </div>
              <div className="col-3">
                <Form.Item
                  name="warrantyPeriod"
                  label="Th???i gian b???o h??nh"
                  initialValue={form.warrantyPeriod}
                  rules={[
                    {
                      required: true,
                      message: "Th???i gian b???o h??nh kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "100%" }}
                    value={warrantyPeriod}
                    placeholder="Th???i gian b???o h??nh"
                  />
                </Form.Item>
              </div>
              <div className="col-4">
                <div className="row">
                  <div className="col-12">
                    <Form.Item name="upload" label="Upload">
                      <Upload
                        {...props}
                        listType="picture"
                        maxCount={5 - productEdit.images.length}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          disabled={productEdit.images.length === 5}
                        >
                          Ch???n h??nh ???nh (T???i ??a: {5 - productEdit.images.length}
                          )
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="row">
              <div className="col-7">
                <Image.PreviewGroup>
                  <Image width={100} src={productEdit?.images[0]?.name} />
                  {productEdit.length > 2 ? (
                    <Image width={100} src={productEdit?.images[1]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 3 ? (
                    <Image width={100} src={productEdit?.images[2]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 4 ? (
                    <Image width={100} src={productEdit?.images[3]?.name} />
                  ) : (
                    ""
                  )}
                  {productEdit.length > 4 ? (
                    <Image width={100} src={productEdit?.images[4]?.name} />
                  ) : (
                    ""
                  )}
                </Image.PreviewGroup>
              </div>
            </div>
            <Form.Item className="text-center mt-4">
              {productEdit.images.length < 5 ? (
                <Button
                  block
                  type="primary"
                  danger
                  shape="round"
                  disabled={imageUrls.length > 0 ? true : false}
                  style={{ width: "100px" }}
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              ) : (
                ""
              )}
              <Button
                block
                className="ms-2"
                type="primary"
                htmlType="submit"
                shape="round"
                style={{ width: "100px" }}
              >
                C???p nh???t
              </Button>
              <Button htmlType="button"  shape="round" className="ms-2" onClick={onReset}>
                L??m m???i
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default EditProduct;
