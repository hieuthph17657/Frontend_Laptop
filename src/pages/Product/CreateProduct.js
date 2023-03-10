import { UploadOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import {
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Upload,
  InputNumber,
} from "antd";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import qs from "qs";
import "./product.css";
import moment from "moment";

const { TextArea } = Input;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchStatus: params.pagination?.searchStatus,
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

function CreateProduct() {
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

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [length, setLength] = useState();
  const [width, setWidth] = useState();
  const [imei, setImei] = useState();
  const [battery, setBattery] = useState();
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [dataWin, setDataWin] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "ACTIVE",
      searchStatus: "ACTIVE",
    },
  });
  const [imageUpload, setImageUpload] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
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
      });
      setImageUpload((prev) => [...prev, image]);
    });
  };
  const [form] = Form.useForm();

  //x??? l?? sau khi uploadfile
  useEffect(() => {
    // listAll(imageUpload).then((response) => {
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       setImageUrls((prev) => [...prev, url]);
    //       setImages((prev) => [...prev, url]);
    //     });
    //   });
    // });
    loadDataCategory();
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
    loadDataWin();
  }, [images || images.length == 0]);

  const loadDataWin = () => {
    fetch(
      `http://localhost:8080/api/auth/wins?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataWin(results.data.data);
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
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataRam(results.data.data);

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
    fetch(
      `http://localhost:8080/api/auth/screens?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataScreen(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

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

  const getRandomMuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  const loadDataStorage = () => {
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataStorage(results.data.data);

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
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataManufacture = () => {
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

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onReset = () => {
    if (set.length > 0) {
      set.forEach((item, index) => {
        set.splice(index, set.length);
        setImages([]);
      });
    }

    images.forEach((item, index) => {
      images.splice(index, images.length);
    });
    console.log("image");
    console.log(images);
    imageUrls.forEach((item, index) => {
      imageUrls.splice(index, imageUrls.length);
    });
    imageUpload.forEach((item, index) => {
      imageUpload.splice(index, imageUpload.length);
    });
    console.log(imageUrls);
    console.log(imageUpload);
    setImageUrls(imageUrls);
    setImageUrls(imageUpload);
    setImages(images);
    form.resetFields();
  };

  const handleSubmit = (data) => {
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
    const product = {
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: data.debut,
      categoryId: data.categoryId,
      manufactureId: data.manufactureId,
      images: data.images,
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
    console.log(product);
    const yearCurrent = new Date().getFullYear();
   
    if (Number(product.debut > yearCurrent)) {
      toastError("N??m ra m???t l???n n??m hi???n t???i!");
    } else if (Number(product.debut) < yearCurrent - 4) {
      toastError("N??m ra m???t nh??? h??n n??m hi???n t???i kh??ng qu?? 4 n??m!");
    } else {
      fetch("http://localhost:8080/api/staff/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            console.log(results);
            onReset();
            toastSuccess("Th??m m???i s???n ph???m th??nh c??ng !");
          } else {
            toastError("Th??m m???i s???n ph???m th???t b???i !");
          }
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
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">T???o m???i s???n ph???m</h4>
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
            form={form}
            name="nest-messages"
            validateMessages={validateMessages}
            className="me-2 ms-2"
            initialValues={{
              cpuCompany: name,
            }}
            layout="vertical"
            autoComplete="off"
            onFinish={(values) => {
              handleSubmit(values);
              console.log({ values });
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
                  rules={[
                    {
                      required: true,
                      message: "T??n s???n ph???m kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true },
                    { min: 3, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                  ]}
                  
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
                  rules={[
                    {
                      required: true,
                      message: "M?? m??y kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                    { min: 3, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                  ]}
                  
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Nh???p m?? m??y"
                    value={imei}
                  />
                </Form.Item>
              </div>
              <div className="col-4 mt-4">
                <Form.Item
                  className="mt-2"
                  name="categoryId"
                  label="Th??? lo???i s???n ph???m"
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Ch???n th??? lo???i">
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
                  rules={[
                    {
                      type: "number",
                      min: 10000000,
                      max: 100000000,
                      required: true,
                      
                    },
                  ]}
                  
                >
                  <InputNumber
                    placeholder="Nh???p gi?? ti???n"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-4">
                <Form.Item
                  className="mt-2"
                  name="quantity"
                  label="S??? l?????ng"
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 1000,
                    },
                  ]}
                  
                >
                  <InputNumber
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
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "M??u s???c kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Ch???n m??u">
                    {dataColor?.map((item, index) => (
                      <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
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
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                
                >
                  <InputNumber
                    placeholder="Nh???p chi???u d??i"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="width"
                  label="Chi???u r???ng"
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nh???p chi???u r???ng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              <div className=" col-2">
                <Form.Item
                  name="height"
                  label="Chi???u cao"
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 50,
                      max: 1000,
                    },
                  ]}
                  
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
                  rules={[
                    {
                      type: "number",
                      required: true,
                      min: 1,
                      max: 10,
                    },
                  ]}
                 
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
                  rules={[
                    {
                      required: true,
                      message: "N??m s???n xu???t kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <DatePicker placeholder="Ch???n n??m s???n xu???t" picker="year" />
                </Form.Item>
              </div>
              <div className="col-2">
                <Form.Item
                  className=""
                  name="originId"
                  label="Xu???t x???"
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "Xu???t x??? kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n xu???t x???">
                    {dataOrigin?.map((cate,index) => (
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
                  rules={[
                    {
                      required: true,
                      message: "Ch???t li???u kh??ng ???????c ????? tr???ng",
                    },
                   
                    { whitespace: true },
                    { min: 3, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                  ]}
                 
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
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "Ram kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n ram">
                    {dataRam?.map((item , index) => (
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
                  //requiredMark="optional"
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
                  //requiredMark="optional"
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
                  rules={[
                    {
                      required: true,
                      message: "Card r???i kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  //requiredMark="optional"
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
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "H??? ??i???u h??nh kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n h??? ??i???u h??nh">
                    {dataWin?.map((item, index) => (
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
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "Card r???i kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Select placeholder="Ch???n card onboard">
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
                  name="storageId"
                  label="L??u tr???"
                  rules={[
                    {
                      required: true,
                      message: "L??u tr??? kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                  //requiredMark="optional"
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
                  //requiredMark="optional"
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
                  //requiredMark="optional"
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
                  rules={[
                    {
                      required: true,
                      message: "B???o m???t kh??ng ???????c ????? tr???ng",
                    },
                    { whitespace: true },
                    { min: 3, message: "Gi?? tr??? l???n h??n 3 k?? t???" },
                  ]}
                
                >
                  <Input style={{ width: "100%" }} placeholder="B???o m???t" />
                </Form.Item>
              </div>
              <div className="col-4">
                <Form.Item
                  name="accessoryId"
                  label="Ph??? ki???n trong h???p"
                  //requiredMark="optional"
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
                <Form.Item label="M?? t??? s???n ph???m" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </div>
              <div className="col-3">
                <Form.Item
                  name="warrantyPeriod"
                  label="Th???i gian b???o h??nh"
                  //requiredMark="optional"
                  rules={[
                    {
                      required: true,
                      message: "Th???i gian b???o h??nh kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "100%" }}
                    type="number"
                    placeholder="Th???i gian b???o h??nh"
                  />
                </Form.Item>
              </div>
              <div className="col-4">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="upload"
                      label="Upload"
                      rules={[
                        {
                          required: true,
                          message: "Vui l??ng ch???n ???nh!",
                        },
                      ]}
                    >
                      <Upload {...props} listType="picture" maxCount={5}>
                        <Button icon={<UploadOutlined />}>
                          {" "}
                          Ch???n h??nh ???nh (T???i ??a: 5)
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <Form.Item className="text-center mt-4">
              {images.length > 0 || imageUrls.length > 0 ? (
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  style={{ width: "100px" }}
                >
                  T???o m???i
                </Button>
              ) : (
                <Button  shape="round" type="primary" onClick={handleUpload}>
                  Upload
                </Button>
              )}

              <Button  shape="round" htmlType="button" className="ms-2" onClick={onReset}>
                L??m m???i
              </Button>
            </Form.Item>
          </Form>
          <div className="img"></div>
          <div className="row"></div>
          <div className="row"></div>
        </div>
      </div>
    </div>
  );
}
export default CreateProduct;
