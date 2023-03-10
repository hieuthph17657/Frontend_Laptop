import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
  Image,
  Tag,
  Pagination,
  Card,
  Tabs,
  Form,
  Drawer,
  Tooltip,
  Col,
  Checkbox,
  Alert,
} from "antd";
import qs from "qs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import Moment from "react-moment";
import { useParams } from "react-router-dom";
import { render } from "@testing-library/react";
const { Option } = Select;
import Meta from "antd/lib/card/Meta";

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
  searchProductKey: params.pagination?.searchProductKey,
  searchPn: params.pagination?.searchPn,
  searchPrice: params.pagination?.searchPrice,
});

const Exchange = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataCart, setDataCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [values, setValues] = useState();
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setShowData] = useState();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [des, setDes] = useState();
  const [exChangeDetail, setExchangeDetail] = useState({});
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const [clearForm] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
      searchPn: "",
      searchPrice: "",
      searchProductKey: "",
    },
  });
  const gh = JSON.parse(localStorage.getItem("cartProduct"));

  const [dataProducts, setDataProducts] = useState(
    JSON.parse(localStorage.getItem("productFilter"))
      ? JSON.parse(localStorage.getItem("productFilter"))
      : []
  );
  const getRandomProductParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchProductKey: params.pagination?.searchProductKey,
    searchStatus: params.pagination?.searchStatus,
    searchPrice: params.pagination?.searchPrice,
    searchPn: params.pagination?.searchPn,
  });
  const [dataProductsFind, setDataProductsFind] = useState(dataProducts);
  const [dataManufacture, setDataManufacture] = useState([]);
  const [category, setCategory] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [processorsFilter, setProcessorsFilter] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [dataWin, setDataWin] = useState();
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.searchStatus,
  });

  const getDataPro = async () => {
    const response1 = await fetch(
      `http://localhost:8080/api/products/getAllProAccess?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    );
    const results = await response1.json();
    const data = [];
    console.log("dataPr", results.data.data);
    results.data.data.forEach((item) => {
      if (item.quantity > 0) {
        data.push(item);
      }
    });
    setDataProducts(data);
    setDataProductsFind(data);
    setTableParamPro({
      pagination: {
        current: results.data.current_page,
        pageSize: 200,
        total: results.data.total,
      },
    });
    chonLaptop();
  };

  const loadDataManufacture = () => {
    fetch(`http://localhost:8080/api/manufactures/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataManufacture(re);
      });
  };
  const loadDataCategory = () => {
    fetch(`http://localhost:8080/api/category/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setCategory(re);
      });
  };

  const loadDataStorage = () => {
    fetch(`http://localhost:8080/api/storage_details/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataStorage(re);
      });
  };
  const loadDataProcess = () => {
    fetch(`http://localhost:8080/api/processors/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setProcessors(re);
        let indexProcess = -1;
        let processor1 = [];
        re.forEach((item) => {
          if (processor1) {
            indexProcess = processor1.findIndex((value) => {
              return (
                value.cpuCompany.trim() + " " + value.cpuTechnology.trim() ===
                item.cpuCompany.trim() + " " + item.cpuTechnology.trim()
              );
            });
          }
          if (indexProcess === -1) {
            processor1.push(item);
          }
        });
        setProcessorsFilter(processor1);
      });
  };
  const loadDataCard = () => {
    fetch(`http://localhost:8080/api/card/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataCard(re);
      });
  };

  const loadDataRam = () => {
    fetch(`http://localhost:8080/api/rams/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataRam(re);
      });
  };
  const loadDataScreen = () => {
    fetch(`http://localhost:8080/api/screens/getAll`)
      .then((res) => res.json())
      .then((results) => {
        const re = [];
        results.data.forEach((item) => {
          if (item.status == "ACTIVE") re.push(item);
        });
        setDataScreen(re);
      });
  };

  //option Th????ng hi???u
  const thuonghieuOptions = [];
  dataManufacture?.map((item) => {
    thuonghieuOptions.push({ label: item.name, value: item.id });
  });
  const [checkedListTH, setCheckedListTH] = useState([]);
  const [checkAllTH, setCheckAllTH] = useState(true);
  var thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
  const onChangeThuongHieu = (list) => {
    console.log("thuonghieu", list);
    setCheckedListTH(list);
    setCheckAllTH(list.length === thuonghieuOptions.length || list.length == 0);
    thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
    if (list.length !== thuonghieuOptions.length || list.length > 0) {
      thuonghieuAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === thuonghieuOptions.length) {
      setCheckedListTH([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeThuongHieu = (e) => {
    setCheckedListTH(e.target.checked ? thuonghieuOptions : []);
    setCheckAllTH(e.target.checked);
    if (e.target.checked == false) {
      thuonghieuAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //onClick img h??ng
  var thuonghieuImg = [];
  const onClickThuongHieuImg = (nameTH) => {
    if (nameTH != null) {
      dataManufacture?.map((item) => {
        if (item.name.toLowerCase() == nameTH.toLowerCase())
          thuonghieuImg = [item.id];
      });
      console.log("thuonghieuImg", thuonghieuImg);
      if (thuonghieuImg.length > 0) {
        var arrTH1 = document.getElementsByClassName("thuonghieu")[0]?.children;
        for (var i = 0; i < arrTH1.length; i++) {
          if (arrTH1[i].control.value == thuonghieuImg[0]) {
            // checkbox
            arrTH1[i].control.checked = true; //set checked cho checkbox
          } else {
            arrTH1[i].control.checked = false;
          }
        }
        onChangeThuongHieu(thuonghieuImg);
      }
    }
  };
  //onClick img nhu c???u
  var categoryImg = [];
  const onClickCategoryImg = (nameNC) => {
    if (nameNC != null) {
      category?.map((item) => {
        if (item.name.toLowerCase() == nameNC.toLowerCase())
          categoryImg = [item.name];
      });
      console.log("categoryImg", categoryImg);
      if (categoryImg.length > 0) {
        var arrNC = document.getElementsByClassName("category")[0]?.children;
        for (var i = 0; i < arrNC.length; i++) {
          if (arrNC[i].control.value == categoryImg[0]) {
            // checkbox
            arrNC[i].control.checked = true; //set checked cho checkbox
          } else {
            arrNC[i].control.checked = false;
          }
        }
        onChangecategory(categoryImg);
      }
    }
  };

  //option Gi?? b??n
  const giabanOptions = [
    { label: "D?????i 10 tri???u", value: 1 },
    { label: "T??? 10-15 Tri???u", value: 2 },
    { label: "T??? 15-20 tri???u", value: 3 },
    { label: "Tr??n 20 tri???u", value: 4 },
  ];
  const [checkedListGB, setCheckedListGB] = useState([]);
  const [checkAllGB, setCheckAllGB] = useState(true);
  var giabanAll = document.getElementsByClassName("giabanAll");
  const onChangegiaban = (list) => {
    setCheckedListGB(list);
    setCheckAllGB(list.length === giabanOptions.length || list.length == 0);
    if (list.length !== giabanOptions.length || list.length > 0) {
      giabanAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === giabanOptions.length) {
      setCheckedListGB([]);
    }
    chonLaptop();
  };
  const onCheckAllChangegiaban = (e) => {
    setCheckedListGB(e.target.checked ? giabanOptions : []);
    setCheckAllGB(e.target.checked);
    if (e.target.checked == false) {
      giabanAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option M??n h??nh
  const manhinhOptions = [
    { label: "Kho???ng 13 inch", value: 1 },
    { label: "Kho???ng 14 inch", value: 2 },
    { label: "Kho???ng tr??n 15 inch", value: 3 },
  ];
  const [checkedListMH, setCheckedListMH] = useState([]);
  const [checkAllMH, setCheckAllMH] = useState(true);
  var manhinhAll = document.getElementsByClassName("manhinhAll");
  const onChangemanhinh = (list) => {
    setCheckedListMH(list);
    setCheckAllMH(list.length === manhinhOptions.length || list.length == 0);
    if (list.length !== manhinhOptions.length || list.length > 0) {
      manhinhAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === manhinhOptions.length) {
      setCheckedListMH([]);
    }
    chonLaptop();
  };
  const onCheckAllChangemanhinh = (e) => {
    setCheckedListMH(e.target.checked ? manhinhOptions : []);
    setCheckAllMH(e.target.checked);
    if (e.target.checked == false) {
      manhinhAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option CPU
  const cpuOptions = [];
  processorsFilter?.map((item) => {
    cpuOptions.push({
      label: item.cpuCompany.trim() + " " + item.cpuTechnology.trim(),
      value: item.cpuCompany.trim() + " " + item.cpuTechnology.trim(),
    });
  });
  const [checkedListCPU, setCheckedListCPU] = useState([]);
  const [checkAllCPU, setCheckAllCPU] = useState(true);
  var cpuAll = document.getElementsByClassName("cpuAll");
  const onChangecpu = (list) => {
    setCheckedListCPU(list);
    setCheckAllCPU(list.length === cpuOptions.length || list.length == 0);
    if (list.length !== cpuOptions.length || list.length > 0) {
      cpuAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === cpuOptions.length) {
      setCheckedListCPU([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecpu = (e) => {
    setCheckedListCPU(e.target.checked ? cpuOptions : []);
    setCheckAllCPU(e.target.checked);
    if (e.target.checked == false) {
      cpuAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option Ram
  const ramOptions = [
    { label: "4 gb", value: 1 },
    { label: "8 gb", value: 2 },
    { label: "16 gb", value: 3 },
    { label: "32 gb", value: 4 },
  ];
  const [checkedListRam, setCheckedListRam] = useState([]);
  const [checkAllRam, setCheckAllRam] = useState(true);
  var ramAll = document.getElementsByClassName("ramAll");
  const onChangeram = (list) => {
    setCheckedListRam(list);
    setCheckAllRam(list.length === ramOptions.length || list.length == 0);
    if (list.length !== ramOptions.length || list.length > 0) {
      ramAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === ramOptions.length) {
      setCheckedListRam([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeram = (e) => {
    setCheckedListRam(e.target.checked ? ramOptions : []);
    setCheckAllRam(e.target.checked);
    if (e.target.checked == false) {
      ramAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option card do hoa
  const cardOptions = [
    { label: "Nvidia geforce series", value: 1 },
    { label: "Amd radeon series", value: 2 },
    { label: "Intel series", value: 3 },
    { label: "Apple series", value: 4 },
  ];
  const [checkedListcard, setCheckedListcard] = useState([]);
  const [checkAllcard, setCheckAllcard] = useState(true);
  var cardAll = document.getElementsByClassName("cardAll");
  const onChangecard = (list) => {
    setCheckedListcard(list);
    setCheckAllcard(list.length === cardOptions.length || list.length == 0);
    if (list.length !== cardOptions.length || list.length > 0) {
      cardAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === cardOptions.length) {
      setCheckedListcard([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecard = (e) => {
    setCheckedListcard(e.target.checked ? cardOptions : []);
    setCheckAllcard(e.target.checked);
    if (e.target.checked == false) {
      cardAll[0].control.checked = false;
    }
    chonLaptop();
  };

  //option ocung
  const ocungOptions = [
    { label: "Ssd 1 tb", value: 1 },
    { label: "Ssd 512 gb", value: 2 },
    { label: "Ssd 256 gb", value: 3 },
    { label: "Ssd 128 gb", value: 4 },
  ];
  const [checkedListocung, setCheckedListocung] = useState([]);
  const [checkAllocung, setCheckAllocung] = useState(true);
  var ocungAll = document.getElementsByClassName("ocungAll");
  const onChangeocung = (list) => {
    setCheckedListocung(list);
    setCheckAllocung(list.length === ocungOptions.length || list.length == 0);
    if (list.length !== ocungOptions.length || list.length > 0) {
      ocungAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === ocungOptions.length) {
      setCheckedListocung([]);
    }
    chonLaptop();
  };
  const onCheckAllChangeocung = (e) => {
    setCheckedListocung(e.target.checked ? ocungOptions : []);
    setCheckAllocung(e.target.checked);
    if (e.target.checked == false) {
      ocungAll[0].control.checked = false;
    }
    chonLaptop();
  };
  //option category
  const categoryOptions = [];
  category?.map((item) => {
    categoryOptions.push({ label: item.name.trim(), value: item.name.trim() });
  });
  const [checkedListcategory, setCheckedListcategory] = useState([]);
  const [checkAllcategory, setCheckAllcategory] = useState(true);
  var categoryAll = document.getElementsByClassName("categoryAll");
  const onChangecategory = (list) => {
    setCheckedListcategory(list);
    setCheckAllcategory(
      list.length === categoryOptions.length || list.length == 0
    );
    if (list.length !== categoryOptions.length || list.length > 0) {
      categoryAll[0].control.checked = false; // use chonLaptop()
    }
    if (list.length === categoryOptions.length) {
      setCheckedListcategory([]);
    }
    chonLaptop();
  };
  const onCheckAllChangecategory = (e) => {
    setCheckedListcategory(e.target.checked ? categoryOptions : []);
    setCheckAllcategory(e.target.checked);
    if (e.target.checked == false) {
      categoryAll[0].control.checked = false;
    }
    chonLaptop();
  };

  const chonLaptop = () => {
    //chon cac thuong hieu nao => thuonghieuchon_arr
    var arr1 = document.getElementsByClassName("thuonghieu")[0]?.children;
    var thuonghieuchon_arr = [];
    for (var i = 0; i < arr1?.length; i++) {
      if (thuonghieuAll[0]?.control.checked == true) {
        arr1[i].control.checked = false;
        console.log("checkallTrue");
      } else {
        console.log("checkallFalse", arr1[i].control);
        if (arr1[i].control.checked == true)
          thuonghieuchon_arr.push(arr1[i].control.value);
      }
    }

    //chon cac khoang gia nao => giaban_arr
    var arr2 = document.getElementsByClassName("giaban")[0]?.children;
    var giaban_arr = [];
    for (var i = 0; i < arr2?.length; i++) {
      if (giabanAll[0]?.control.checked == true) {
        arr2[i].control.checked = false;
      } else {
        if (arr2[i].control.checked == true)
          giaban_arr.push(arr2[i].control.value);
      }
    }
    //chon cac man hinh nao => manhinh_arr
    var arr3 = document.getElementsByClassName("manhinh")[0]?.children;
    var manhinh_arr = [];
    for (var i = 0; i < arr3?.length; i++) {
      if (manhinhAll[0]?.control.checked == true) {
        arr3[i].control.checked = false;
      } else {
        if (arr3[i].control.checked == true)
          manhinh_arr.push(arr3[i].control.value);
      }
    }
    //chon cac cpu nao => cpu_arr
    var arr4 = document.getElementsByClassName("cpu")[0]?.children;
    var cpu_arr = [];
    for (var i = 0; i < arr4?.length; i++) {
      if (cpuAll[0]?.control.checked == true) {
        arr4[i].control.checked = false;
      } else {
        if (arr4[i].control.checked == true)
          cpu_arr.push(arr4[i].control.value);
      }
    }
    //chon cac ram nao => ram_arr
    var arr5 = document.getElementsByClassName("ram")[0]?.children;
    var ram_arr = [];
    for (var i = 0; i < arr5?.length; i++) {
      if (ramAll[0]?.control.checked == true) {
        arr5[i].control.checked = false;
      } else {
        if (arr5[i].control.checked == true)
          ram_arr.push(arr5[i].control.value);
      }
    }
    //chon cac card nao => card_arr
    var arr6 = document.getElementsByClassName("cardDohoa")[0]?.children;
    var card_arr = [];
    for (var i = 0; i < arr6?.length; i++) {
      if (cardAll[0]?.control.checked == true) {
        arr6[i].control.checked = false;
      } else {
        if (arr6[i].control.checked == true)
          card_arr.push(arr6[i].control.value);
      }
    }
    //chon cac o cung nao => storage_arr
    var arr7 = document.getElementsByClassName("ocung")[0]?.children;
    var storage_arr = [];
    for (var i = 0; i < arr7?.length; i++) {
      if (ocungAll[0]?.control.checked == true) {
        arr7[i].control.checked = false;
      } else {
        if (arr7[i].control.checked == true)
          storage_arr.push(arr7[i].control.value);
      }
    }
    //chon cac nhu cau nao => category_arr
    var arr8 = document.getElementsByClassName("category")[0]?.children;
    var category_arr = [];
    for (var i = 0; i < arr8?.length; i++) {
      if (categoryAll[0]?.control.checked == true) {
        arr8[i].control.checked = false;
      } else {
        if (arr8[i].control.checked == true)
          category_arr.push(arr8[i].control.value);
      }
    }
    hienLT(
      thuonghieuchon_arr,
      giaban_arr,
      manhinh_arr,
      cpu_arr,
      ram_arr,
      card_arr,
      storage_arr,
      category_arr
    );
  };
  function hienLT(
    thuonghieuchon_arr,
    giaban_arr,
    manhinh_arr,
    cpu_arr,
    ram_arr,
    card_arr,
    storage_arr,
    category_arr
  ) {
    console.log("thuonghieuchon_arr", thuonghieuchon_arr);
    const list = [];
    var ktThuonghieu = false;
    var ktGiaban = false;
    var ktManhinh = false;
    var ktCPU = false;
    var ktRam = false;
    var ktCard = false;
    var ktOcung = false;
    var ktCategory = false;
    for (var i = 0; i < dataProducts?.length; i++) {
      var thuonghieuLT = dataProducts[i].manufacture.id + "";
      var manhinhLT = dataProducts[i].screen.size.split(" ")[0].trim();
      var giaLT = dataProducts[i].price;
      var cpuLT =
        dataProducts[i].processor.cpuCompany.trim() +
        " " +
        dataProducts[i].processor.cpuTechnology.trim();
      var ramLT = dataProducts[i].ram.ramCapacity.split(" ")[0].trim();
      var cardLT = dataProducts[i].card.trandemark.trim();
      var storageLT = dataProducts[i].storage.storageDetail.capacity
        .split(" ")[0]
        .trim();
      var categoryLT = dataProducts[i].categoryProducts;
      if (thuonghieuchon_arr?.length > 0) {
        if (thuonghieuchon_arr.includes(thuonghieuLT) == true) {
          ktThuonghieu = true;
        }
        if (thuonghieuchon_arr.includes(thuonghieuLT) == false) continue;
      }
      if (giaban_arr?.length > 0) {
        if (
          (giaLT < 10000000 && giaban_arr.includes("1") == true) ||
          (giaLT >= 10000000 &&
            giaLT < 15000000 &&
            giaban_arr.includes("2") == true) ||
          (giaLT >= 15000000 &&
            giaLT < 20000000 &&
            giaban_arr.includes("3") == true) ||
          (giaLT >= 20000000 && giaban_arr.includes("4") == true)
        ) {
          ktGiaban = true;
        }
        if (giaLT < 10000000 && giaban_arr.includes("1") == false) continue;
        if (
          giaLT >= 10000000 &&
          giaLT < 15000000 &&
          giaban_arr.includes("2") == false
        )
          continue;
        if (
          giaLT >= 15000000 &&
          giaLT < 20000000 &&
          giaban_arr.includes("3") == false
        )
          continue;
        if (giaLT >= 20000000 && giaban_arr.includes("4") == false) continue;
      }
      if (manhinh_arr?.length > 0) {
        if (
          (manhinhLT >= 13 &&
            manhinhLT < 14 &&
            manhinh_arr.includes("1") == true) ||
          (manhinhLT >= 14 &&
            manhinhLT < 15 &&
            manhinh_arr.includes("2") == true) ||
          (manhinhLT >= 15 && manhinh_arr.includes("3") == true)
        ) {
          ktManhinh = true;
        }
        if (
          manhinhLT >= 13 &&
          manhinhLT < 14 &&
          manhinh_arr.includes("1") == false
        )
          continue;
        if (
          manhinhLT >= 14 &&
          manhinhLT < 15 &&
          manhinh_arr.includes("2") == false
        )
          continue;
        if (manhinhLT >= 15 && manhinh_arr.includes("3") == false) continue;
      }
      if (cpu_arr?.length > 0) {
        if (cpu_arr.includes(cpuLT) == true) {
          ktCPU = true;
        }
        if (cpu_arr.includes(cpuLT) == false) continue;
      }
      if (ram_arr?.length > 0) {
        if (
          (ramLT == 4 && ram_arr.includes("1") == true) ||
          (ramLT == 8 && ram_arr.includes("2") == true) ||
          (ramLT == 16 && ram_arr.includes("3") == true) ||
          (ramLT == 32 && ram_arr.includes("4") == true)
        ) {
          ktRam = true;
        }
        if (ramLT == 4 && ram_arr.includes("1") == false) continue;
        if (ramLT == 8 && ram_arr.includes("2") == false) continue;
        if (ramLT == 16 && ram_arr.includes("3") == false) continue;
        if (ramLT == 32 && ram_arr.includes("4") == false) continue;
      }
      if (card_arr?.length > 0) {
        if (
          (cardLT == "NVIDIA" && card_arr.includes("1") == true) ||
          (cardLT == "AMD" && card_arr.includes("2") == true) ||
          (cardLT == "Intel" && card_arr.includes("3") == true) ||
          (cardLT == "Apple" && card_arr.includes("4") == true)
        ) {
          ktCard = true;
        }
        if (cardLT == "NVIDIA" && card_arr.includes("1") == false) continue;
        if (cardLT == "AMD" && card_arr.includes("2") == false) continue;
        if (cardLT == "Intel" && card_arr.includes("3") == false) continue;
        if (cardLT == "Apple" && card_arr.includes("4") == false) continue;
      }
      if (storage_arr?.length > 0) {
        if (
          (storageLT == 1 && storage_arr.includes("1") == true) ||
          (storageLT == 512 && storage_arr.includes("2") == true) ||
          (storageLT == 256 && storage_arr.includes("3") == true) ||
          (storageLT == 128 && storage_arr.includes("4") == true)
        ) {
          ktOcung = true;
        }
        if (storageLT == 1 && storage_arr.includes("1") == false) continue;
        if (storageLT == 512 && storage_arr.includes("2") == false) continue;
        if (storageLT == 256 && storage_arr.includes("3") == false) continue;
        if (storageLT == 128 && storage_arr.includes("4") == false) continue;
      }
      if (category_arr?.length > 0) {
        var cate = [];
        categoryLT.forEach((item) => {
          cate.push(item.category.name.trim());
        }); //lay cate trong categoryProduct
        console.log("cate", cate.toString());
        for (var j = 0; j < cate.length; j++) {
          var stop = false;
          //console.log("cate"+[j], cate[j]);
          if (!category_arr.includes(cate[j]) == true) {
            stop = true;
          } else {
            stop = false;
            ktCategory = true;
            break;
          }
        }
        if (stop) {
          continue;
        }
      }
      console.log("dataProducts[i]", dataProducts[i]);
      list.push(dataProducts[i]);
      console.log("list", list);
      setDataProductsFind(list);
    }
    if (ktThuonghieu == false && thuonghieuchon_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktGiaban == false && giaban_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktManhinh == false && manhinh_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCPU == false && cpu_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktRam == false && ram_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCard == false && card_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktOcung == false && storage_arr?.length > 0) {
      setDataProductsFind(null);
    }
    if (ktCategory == false && category_arr?.length > 0) {
      setDataProductsFind(null);
    }
  }
  useEffect(() => {
    getDataPro();
    loadDataManufacture();
    loadDataCategory();
    loadDataProcess();
    loadDataScreen();
    loadDataRam();
    loadDataCard();
    loadDataStorage();
  }, []);
  const handleClear = () => {
    tableParamPro.pagination.searchProductKey = "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = "";
    tableParamPro.pagination.searchPn = "";
    tableParamPro.pagination.current = 1;
    tableParamPro.pagination.pageSize = 200;
    // setDataProduct(
    //   JSON.parse(localStorage.getItem("productFilter"))
    //     ? JSON.parse(localStorage.getItem("productFilter"))
    //     : []
    // );
    // setDataProductsFind(
    //   JSON.parse(localStorage.getItem("productFilter"))
    //     ? JSON.parse(localStorage.getItem("productFilter"))
    //     : []
    // );
    getDataPro();
    clearForm.resetFields();
    var thuonghieuAll = document.getElementsByClassName("thuonghieuAll");
    setCheckedListTH([]);
    setCheckAllTH(true);
    thuonghieuAll[0].control.checked = true;
    //
    var giabanAll = document.getElementsByClassName("giabanAll");
    setCheckedListGB([]);
    setCheckAllGB(true);
    giabanAll[0].control.checked = true;
    //
    var manhinhAll = document.getElementsByClassName("manhinhAll");
    setCheckedListMH([]);
    setCheckAllMH(true);
    manhinhAll[0].control.checked = true;
    //
    var cpuAll = document.getElementsByClassName("cpuAll");
    setCheckedListCPU([]);
    setCheckAllCPU(true);
    cpuAll[0].control.checked = true;
    //
    var ramAll = document.getElementsByClassName("ramAll");
    setCheckedListRam([]);
    setCheckAllRam(true);
    ramAll[0].control.checked = true;
    //
    var cardAll = document.getElementsByClassName("cardAll");
    setCheckedListcard([]);
    setCheckAllcard(true);
    cardAll[0].control.checked = true;
    //
    var ocungAll = document.getElementsByClassName("ocungAll");
    setCheckedListocung([]);
    setCheckAllocung(true);
    ocungAll[0].control.checked = true;
    //
    var categoryAll = document.getElementsByClassName("categoryAll");
    setCheckedListcategory([]);
    setCheckAllcategory(true);
    categoryAll[0].control.checked = true;
  };
  const handlePagination = (pagination) => {
    console.log("pagination: " + pagination);
    tableParamPro.pagination.pageSize = 200;
    tableParamPro.pagination.current = pagination;
    tableParamPro.pagination.searchProductKey = "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = "";
    tableParamPro.pagination.searchPn = "";
    getDataPro();
  };
  const getDataProductById1 = (id) => {
    fetch(`http://localhost:8080/api/products/${id}?`)
      .then((res) => res.json())
      .then((results) => {
        setShowData(results);
      });
  };
  const onClickEye = (data) => {
    getDataProductById1(data.id);
    showDrawer1();
  };
  const [open1, setOpen1] = useState(false);
  const showDrawer1 = () => {
    setOpen1(true);
  };
  const handleSearchProduct = (values) => {
    tableParamPro.pagination.searchProductKey = values.name ? values.name : "";
    tableParamPro.pagination.searchStatus = "ACTIVE";
    tableParamPro.pagination.searchPrice = values.price ? values.price : "";
    tableParamPro.pagination.searchPn = values.pn ? values.pn : "";
    tableParamPro.pagination.current = 1;
    tableParamPro.pagination.pageSize = 200;
    getDataPro();
    //setDataProductsFind(dataProducts);
  };
  useEffect(() => {
    setDataProductsFind(dataProducts);
    chonLaptop();
  }, [dataProducts]);
  //end
  const showModal = (item) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("item show modal");
    console.log(item);

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
        handleDataExchange(results.exchangeId);
      });
  };

  const handleDataExchange = (id) => {
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail`)
      .then((res) => res.json())
      .then((res) => {
        setDes(res.data.description);
      });
  }

  const handleSubmitReturn = (data, dataOrderDetail) => {
    const ExchangeDetail = [];
    let count = 0;
    // order.forEach((item) => {
    //   if (item.id == dataOrderDetail.isCheck) {
    //     count++;
    //   }
    // });
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

    // alert(dataOrderDetail.quantity);
    // let quantity= 0;
    // order.forEach(item => {
    //   if(item.id == dataOrderDetail.isCheck){
    //    count ++;
    //   }
    // })
    // if(dataOrderDetail.quantity > 0) {
    //   quantity = (orderDetail.quantity - count);
    // }
    

    fetch("http://localhost:8080/api/auth/returns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        orderId: order.id,
        description: note,
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
    setOpen(false);
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
    console.log("order detail g???i y??u c???u");
    console.log(orderDetail);

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

  useEffect(() => {
    loadDataOrder(id);
    loadDataProduct2();
  }, [checked]);

  const loadDataProduct = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
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
    setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("load data order by id");
        console.log(res);
        setOrder(res);
      });
  };

  const deleteProduct = (item) => {
    let total = 0;
    dataCart.forEach((element, i) => {
      if (element.id === item.id && element.index == item.index) {
        dataCart.splice(i, 1);
      }
    });

    dataCart.forEach((element) => {
      total += element.price;
    });
    setTotalProduct(total);

    loadDataProduct();
  };

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    const dataPro = [];
    let productValue;
    console.log("proSelect", value);
    let isUpdate = false;
    if (value !== undefined) {
      dataProducts
        .filter((item, index) => item.id === value.id)
        .map((product, index) => {
          dataPro.push({
            index: index,
            id: product.id,
            images: product?.images[0]?.name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          // product= {
          //   index: index,
          //   id: product.id,
          //   images: product?.images[0]?.name,
          //   name: product?.name,
          //   price: product?.price,
          //   debut: product?.debut,
          // }
          // productValue = product;
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

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onChangeReason = (value, id) => {
    let check = false;
    console.log(value);
    if (!isNaN(value)) {
      console.log("--------------- v??o r???ng --------------");
      dataCart?.forEach((element, index) => {
        if (element.index == id) {
          console.log("r???ng ?????u ti??n");
          element.reason = "null";
          // setReason(count);
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

  const showDrawer = (item) => {
    showModal(item);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
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

  const columnDetail = [
    {
      title: "H??nh ???nh",
      dataIndex: "id",
      width: "10%",
      // render: (orderDetail) => {
      //   return (
      //     <>
      //      {orderDetail.product.id}
      //     </>
      //   );
      // },
    },
    // {
    //   title: "S???n ph???m tr?????c ????",
    //   dataIndex: "productNameOd",
    //   width: "14%",
    // },
    // {
    //   title: "Gi?? ti???n",
    //   dataIndex: "priceProductOd",
    //   width: "10%",
    //   render: (priceProductOd) => {
    //     return (
    //       <>
    //         {priceProductOd.toLocaleString("it-IT", {
    //           style: "currency",
    //           currency: "VND",
    //         })}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "H??nh ???nh",
    //   dataIndex: "imageProductE",
    //   width: "10%",
    //   render: (imageProductE) => {
    //     return <Image width={100} src={imageProductE} />;
    //   },
    // },
    // {
    //   title: "?????i sang s???n ph???m",
    //   dataIndex: "productNameE",
    //   width: "15%",
    // },
    // {
    //   title: "Gi?? ti???n",
    //   dataIndex: "priceProductE",
    //   width: "10%",
    //   render: (priceProductE) => {
    //     return (
    //       <>
    //         {priceProductE.toLocaleString("it-IT", {
    //           style: "currency",
    //           currency: "VND",
    //         })}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "S???n ph???m l???i",
    //   dataIndex: "isCheck",
    //   width: "7%",
    //   render: (isCheck) => {
    //     return <Checkbox checked={isCheck == "1" ? true : false} />;
    //   },
    // },
    // {
    //   title: "L?? do",
    //   dataIndex: "reason",
    //   width: "15%",
    // },
    // {
    //   title: "Tr???ng th??i",
    //   dataIndex: "status",
    //   width: "10%",
    //   render: (status) => {
    //     return (
    //       <>
    //         {status != "YEU_CAU" ? (
    //           status === "DA_XAC_NHAN" ? (
    //             <Tag
    //               icon={<CheckCircleOutlined />}
    //               className="pt-1 pb-1 text-center"
    //               color="success"
    //               style={{ width: "100%" }}
    //             >
    //               ???? x??c nh???n
    //             </Tag>
    //           ) : (
    //             <Tag
    //               icon={<CloseCircleOutlined />}
    //               className="pt-1 pb-1 text-center"
    //               color="error"
    //               style={{ width: "100%" }}
    //             >
    //               Hu???
    //             </Tag>
    //           )
    //         ) : (
    //           <Tag
    //             icon={<ExclamationCircleOutlined />}
    //             className="pt-1 pb-1 text-center"
    //             color="warning"
    //             style={{ width: "100%" }}
    //           >
    //             Y??u c???u ?????i h??ng
    //           </Tag>
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">?????i h??ng</h4>
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
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5 text-success">
                M?? ho?? ????n: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Kh??ch h??ng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                S??? ??i???n tho???i: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 ms-5 text-success">
                Ghi ch?? ????n h??ng: <b>{order?.note}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2 text-success">
                Ng??y mua: <b className="">{order?.createdAt}</b>
              </div>
              <div className="mt-2 text-success">
                T???ng ti???n:
                <b>
                  {" "}
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2 text-success">
                ?????a ch??? nh???n h??ng: <b>{order?.address}</b>
              </div>
              <div className="mt-2 text-success">
                Tr???ng th??i: <b>???? nh???n h??ng</b>{" "}
              </div>
              <div className=""></div>
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
                <th scope="col">Gi??</th>
                <th scope="col">S??? l?????ng</th>
                <th>Th???i gian </th>

                <th scope="col">T???ng ti???n</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product?.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product?.name}</td>
                    <td>
                      {item.product?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>{item.quantity}</td>

                    <td>
                      {" "}
                      <Moment format="DD-MM-YYYY HH:mm:ss">
                        {item.updatedAt}
                      </Moment>
                    </td>
                    <td>
                      {item.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {item.isCheck === null && order.status == "DA_NHAN"&&compareDates(order.updatedAt)!=true ? (
                        <Button
                          shape="round"
                          onClick={() => showDrawer(item)}
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
                        order.status == "DA_NHAN" &&compareDates(order.updatedAt)!=true? (
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
                        item.isCheck > 0 &&
                        item.isCheck != 3 ? (
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
                            ????n y??u c???u ?????i  b??? hu???
                          </i>
                          <Button
                            className=""
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
        <Drawer
          title="Ch???n s???n ph???m mu???n ?????i h??ng"
          placement="right"
          onClose={onClose}
          width={1000}
          open={open}
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
                      : 0}
                  </i>
                </p>
              </div>
            </div>
            {/* <AutoComplete
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
            /> */}
            <div className="row">
              <div className="col-12 col-sm-6"></div>
              <div className="col-12 col-sm-4"></div>
              <div className="col-12 col-sm-2">
                <Button
                  shape="round"
                  className="mt-3 ms-5 mb-3"
                  style={{ background: "#22075e", color: "white" }}
                  onClick={showModal1}
                >
                  Ch???n s???n ph???m
                </Button>
              </div>
              {/* Ch???n s???n ph???m */}
              <Modal
                width={1000}
                title="Ch???n s???n ph???m"
                open={isModalOpen1}
                onOk={handleOk1}
                cancelText={"????ng"}
                okButtonProps={{
                  style: {
                    display: "none",
                  },
                }}
                onCancel={handleCancel1}
              >
                <Tabs
                  defaultActiveKey="1"
                  //onChange={onChange}
                  items={[
                    {
                      label: `S???n ph???m`,
                      key: "1",
                      children: (
                        <>
                          <div className="">
                            <div className="">
                              <Form
                                form={clearForm}
                                name="nest-messages"
                                className="me-2 ms-2"
                                layout="vertical"
                                autoComplete="off"
                                onFinish={(values) => {
                                  handleSearchProduct(values);
                                }}
                                onFinishFailed={(error) => {
                                  console.log({ error });
                                }}
                              >
                                <div className="row">
                                  <div className="col-6 ">
                                    <Form.Item name="name">
                                      <Select
                                        allowClear={true}
                                        style={{
                                          width: "300px",
                                          borderRadius: "5px",
                                        }}
                                        showSearch
                                        placeholder="Nh???p t??n s???n ph???m"
                                        optionFilterProp="children"
                                      >
                                        {dataProducts
                                          ? dataProducts.map((item) => (
                                              <Select.Option
                                                value={item.name}
                                                selected
                                              >
                                                {item.name}
                                              </Select.Option>
                                            ))
                                          : ""}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-6 ">
                                    <Form.Item name="pn">
                                      <Input placeholder="M?? s???n ph???m" />
                                    </Form.Item>
                                  </div>
                                  {/* <div className="col-4">
                                      <Form.Item name="price">
                                        <Select
                                          allowClear={true}
                                          style={{
                                            width: "400px",
                                            borderRadius: "5px",
                                          }}
                                          showSearch
                                          placeholder="Ch???n m???c gi??"
                                          optionFilterProp="children"
                                          filterOption={(input, option) =>
                                            option.children
                                              .toLowerCase()
                                              .includes(input.toLowerCase())
                                          }
                                        >
                                          <Select.Option value="9999999">
                                            D?????i 10 tri???u
                                          </Select.Option>
                                          <Select.Option value="10000000">
                                            T??? 10 - 15 tri???u
                                          </Select.Option>
                                          <Select.Option value="15000000">
                                            T??? 15 - 20 tri???u
                                          </Select.Option>
                                          <Select.Option value="20000000">
                                            Tr??n 20 tri???u
                                          </Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </div> */}
                                </div>
                                <Form.Item className="text-center mt-2">
                                  <Button
                                    className=""
                                    type="primary-outline"
                                    shape="round"
                                    onClick={handleClear}
                                  >
                                    ?????t l???i
                                  </Button>
                                  <Button
                                    block
                                    className="mx-2"
                                    type="primary"
                                    shape="round"
                                    htmlType="submit"
                                    style={{ width: "120px" }}
                                  >
                                    T??m ki???m
                                  </Button>
                                </Form.Item>
                              </Form>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-3">
                              <Card
                                className="mt-2"
                                title="H??ng s???n xu???t"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={10}>
                                  <Checkbox
                                    className="thuonghieuAll"
                                    onChange={onCheckAllChangeThuongHieu}
                                    checked={checkAllTH}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="thuonghieu"
                                    options={thuonghieuOptions}
                                    value={checkedListTH}
                                    onChange={onChangeThuongHieu}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="M???c gi??"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="giabanAll"
                                    onChange={onCheckAllChangegiaban}
                                    checked={checkAllGB}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="giaban"
                                    options={giabanOptions}
                                    value={checkedListGB}
                                    onChange={onChangegiaban}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="M??n h??nh"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="manhinhAll"
                                    onChange={onCheckAllChangemanhinh}
                                    checked={checkAllMH}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="manhinh"
                                    options={manhinhOptions}
                                    value={checkedListMH}
                                    onChange={onChangemanhinh}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="CPU"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="cpuAll"
                                    onChange={onCheckAllChangecpu}
                                    checked={checkAllCPU}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="cpu"
                                    options={cpuOptions}
                                    value={checkedListCPU}
                                    onChange={onChangecpu}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="Ram"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="ramAll"
                                    onChange={onCheckAllChangeram}
                                    checked={checkAllRam}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="ram"
                                    options={ramOptions}
                                    value={checkedListRam}
                                    onChange={onChangeram}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="Card ????? h???a"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="cardAll"
                                    onChange={onCheckAllChangecard}
                                    checked={checkAllcard}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="cardDohoa"
                                    options={cardOptions}
                                    value={checkedListcard}
                                    onChange={onChangecard}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="??? c???ng"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="ocungAll"
                                    onChange={onCheckAllChangeocung}
                                    checked={checkAllocung}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="ocung"
                                    options={ocungOptions}
                                    value={checkedListocung}
                                    onChange={onChangeocung}
                                  />
                                </Col>
                              </Card>
                              <Card
                                className="mt-2"
                                title="Nhu c???u"
                                style={{
                                  width: 200,
                                }}
                                type="inner"
                              >
                                <Col span={12}>
                                  <Checkbox
                                    className="categoryAll"
                                    onChange={onCheckAllChangecategory}
                                    checked={checkAllcategory}
                                  >
                                    T???t c???
                                  </Checkbox>
                                  <Checkbox.Group
                                    className="category"
                                    options={categoryOptions}
                                    value={checkedListcategory}
                                    onChange={onChangecategory}
                                  />
                                </Col>
                              </Card>
                            </div>
                            <div className="col-9">
                              <div className="row">
                                {dataProductsFind?.map((item, index) => (
                                  <div className="col-4 mt-2 mb-1" key={index}>
                                    <Card
                                      key={index}
                                      style={{ height: "420px" }}
                                      cover={
                                        <img
                                          style={{ height: "150px" }}
                                          alt="example"
                                          src={
                                            item?.images[0]?.name
                                              ? item.images[0].name
                                              : ""
                                          }
                                        />
                                      }
                                      actions={[
                                        <EyeOutlined
                                          key="setting"
                                          style={{
                                            fontSize: "20px",
                                            color: "#009999",
                                          }}
                                          onClick={() => onClickEye(item)}
                                        />,
                                        <ShoppingCartOutlined
                                          key="edit"
                                          style={{
                                            fontSize: "25px",
                                            color: "#08c",
                                          }}
                                          onClick={() => onSelectAuto(item)}
                                        ></ShoppingCartOutlined>,
                                      ]}
                                    >
                                      <Meta
                                        title={item.name}
                                        description={item.price.toLocaleString(
                                          "it-IT",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                      />
                                      <div
                                        className="text-secondary"
                                        style={{
                                          height: "125px",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"M??n h??nh"}
                                          >
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nM3SsQkCURCE4Q9MxcAOtAEDQ4PrxshM8ELrMDJ4mJjcVWAN1mAlsmCggrh3B+LAvGjfvzvL8g9qcOjpJgBlQPPSFbDAEqM+gAo3nLpOUOGMHWaYZgErHLHH5ENNeQdExvWjY43xl+nKMyAWc8E18TEVIaMST4t5T7cBiKxD/KJt4nw3qXA/0x0FTCzDM8S0ngAAAABJRU5ErkJggg==" />
                                            {item.screen?.size.trim() + " "}
                                          </Tooltip>
                                          <Tooltip
                                            placement="top"
                                            title={"CPU"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-cpu-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                              <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                                            </svg>
                                            {item.processor?.cpuTechnology.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Ram"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-memory"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
                                            </svg>
                                            {item.ram?.ramCapacity.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"??? c???ng"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-hdd-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M0 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM.91 7.204A2.993 2.993 0 0 1 2 7h12c.384 0 .752.072 1.09.204l-1.867-3.422A1.5 1.5 0 0 0 11.906 3H4.094a1.5 1.5 0 0 0-1.317.782L.91 7.204z" />
                                            </svg>
                                            {item.storage?.storageDetail.storageType.name.trim() +
                                              " " +
                                              item.storage?.storageDetail.capacity.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"????? h???a"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-gpu-card"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
                                              <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z" />
                                            </svg>
                                            {item.card?.trandemark.trim() +
                                              " " +
                                              item.card?.model.trim() +
                                              " " +
                                              item.card?.memory.trim()}
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <Tooltip
                                            placement="top"
                                            title={"Tr???ng l?????ng"}
                                          >
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAp0lEQVR4nI3RzQpBURQF4G/AlAcwkWtAGZkoI8UTKCaS8jPGCJObdyBv5n106qR7L1dW7TqnvdbZa6/DJ6rYYoOKP3BAgjb2v4hNtHCLgiSeW7GXwwApZiWVRs4bR9R/TK8V7YUXAjrolojSb5cxdpjijCv6RUFYbpERPNHAA3NMYi9wAtcyk0IPQ6xjvHeMMikGbt5bBmHaKn5kznqZoHTxC05/1uUF3gwbVU0GVYUAAAAASUVORK5CYII=" />
                                            {item.weight + " kg"}
                                          </Tooltip>
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                ))}
                              </div>
                              <div
                                style={{ width: "100%" }}
                                className="d-flex justify-content-evenly"
                              >
                                <Pagination
                                  className="mt-4"
                                  onChange={handlePagination}
                                  simple
                                  defaultCurrent={
                                    tableParamPro.pagination.current == 0
                                      ? 1
                                      : tableParamPro.pagination.current
                                  }
                                  total={10}
                                />
                              </div>
                            </div>
                          </div>

                          <Drawer
                            title={product?.name}
                            size="large"
                            placement="right"
                            onClose={onClose}
                            open={open1}
                          >
                            <div className="card">
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                Th??ng tin h??ng h??a
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>Xu???t x???: {product?.origin.name}</li>
                                  <li>
                                    Th????ng hi???u: {product?.manufacture.name}{" "}
                                  </li>
                                </div>
                                <div className="col-6">
                                  <li>Th???i ??i???m ra m???t:{product?.debut} </li>
                                  <li>
                                    H?????ng d???n b???o qu???n: ????? n??i kh?? r??o, nh??? tay
                                  </li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                Thi???t k??? tr???ng l?????ng
                              </div>
                              <div className="card-body">
                                <li>
                                  K??ch th?????c: {product?.width} x{" "}
                                  {product?.height} x {product?.length}
                                </li>
                                <li>
                                  Tr???ng l?????ng s???n ph???m: {product?.weight}kg
                                </li>
                                <li>Ch???t li???u: {product?.material}</li>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                B??? x??? l??
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    H??ng CPU: {product?.processor?.cpuCompany}
                                  </li>
                                  <li>
                                    C??ng ngh??? CPU:{" "}
                                    {product?.processor?.cpuTechnology}
                                  </li>
                                  <li>
                                    T???c ????? CPU: {product?.processor?.cpuSpeed}
                                  </li>
                                  <li>
                                    T???c ????? t???i ??a CPU:{" "}
                                    {product?.processor?.maxSpeed}
                                  </li>
                                </div>
                                <div className="col-6">
                                  <li>
                                    Lo???i CPU: {product?.processor?.cpuType}
                                  </li>
                                  <li>
                                    S??? nh??n: {product?.processor?.multiplier}
                                  </li>
                                  <li>
                                    S??? lu???ng:{" "}
                                    {product?.processor?.numberOfThread}
                                  </li>
                                  <li>
                                    B??? nh??? ?????m: {product?.processor?.caching}
                                  </li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                RAM
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    Dung l?????ng RAM: {product?.ram?.ramCapacity}
                                  </li>
                                  <li>Lo???i RAM: {product?.ram?.typeOfRam}</li>
                                  <li>T???c ????? RAM: {product?.ram?.ramSpeed}</li>
                                  <li>
                                    S??? khe c???m r???i: {product?.ram?.looseSlot}
                                  </li>
                                </div>
                                <div className="col-6">
                                  <li>
                                    S??? khe RAM c??n l???i:{" "}
                                    {product?.ram?.remainingSlot}
                                  </li>
                                  <li>
                                    S??? RAM onboard: {product?.ram?.onboardRam}
                                  </li>
                                  <li>
                                    H??? tr??? RAM t???i ??a:{" "}
                                    {product?.ram?.maxRamSupport}
                                  </li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                M??n H??nh
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    K??ch th?????c m??n h??nh: {product?.screen?.size}
                                  </li>
                                  <li>
                                    C??ng ngh??? m??n h??nh:{" "}
                                    {product?.screen?.screenTechnology}
                                  </li>
                                  <li>
                                    ????? ph??n gi???i: {product?.screen?.resolution}
                                  </li>
                                  <li>
                                    T???n s??? qu??t:{" "}
                                    {product?.screen?.scanFrequency}
                                  </li>
                                  <li>
                                    T???m n???n: {product?.screen?.backgroundPanel}
                                  </li>
                                </div>
                                <div className="col-6">
                                  <li>
                                    ????? s??ng: {product?.screen?.brightness}
                                  </li>
                                  <li>
                                    ????? ph??? m??u: {product?.screen?.colorCoverage}
                                  </li>
                                  <li>
                                    T??? l??? m??n h??nh:{" "}
                                    {product?.screen?.resolution}
                                  </li>
                                  <li>
                                    M??n h??nh c???m ???ng:{" "}
                                    {product?.screen?.backgroundPanel}
                                  </li>
                                  <li>
                                    ????? t????ng ph???n: {product?.screen?.contrast}
                                  </li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                ????? h???a
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    <span
                                      style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Card onboard
                                    </span>
                                  </li>
                                  <li>
                                    H??ng: {product?.cardOnboard?.trandemark}
                                  </li>
                                  <li>Model: {product?.cardOnboard?.model}</li>
                                  <li>
                                    B??? nh???: {product?.cardOnboard?.memory}
                                  </li>
                                </div>
                                <div className="col-6">
                                  <li>
                                    <span
                                      style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Card r???i
                                    </span>
                                  </li>
                                  <li>H??ng: {product?.card?.trandemark}</li>
                                  <li>Model: {product?.card?.model}</li>
                                  <li>B??? nh???: {product?.card?.memory}</li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                L??u tr???
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    Ki???u ??? c???ng:{" "}
                                    {product?.storage?.storageDetail?.type}
                                  </li>
                                  <li>
                                    S??? khe c???m: {product?.storage?.number}
                                  </li>
                                  <li>
                                    Lo???i SSD:
                                    {
                                      product?.storage?.storageDetail
                                        .storageType.name
                                    }
                                  </li>
                                  <li>
                                    Dung l?????ng:{" "}
                                    {product?.storage?.storageDetail.capacity}
                                  </li>
                                </div>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                B???o m???t
                              </div>
                              <div className="card-body row">
                                <li>{product?.security}</li>
                              </div>
                              <div
                                className="card-header"
                                style={{ textAlign: "left" }}
                              >
                                H??? ??i???u h??nh
                              </div>
                              <div className="card-body row">
                                <li>OS: {product?.win.name}</li>
                                <li>Version: {product?.win.version}</li>
                              </div>
                            </div>
                          </Drawer>
                        </>
                      ),
                    },
                  ]}
                />
              </Modal>
            </div>
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
          <Button
            className="offset-6"
            disabled={dataCart.length == 0}
            type="primary"
            shape="round"
            onClick={handleOk}
          >
            G???i y??u c???u
          </Button>
        </Drawer>
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
          <h6 className="text-danger fw-bold">
            ????n ?????i c???a ho?? ????n chi ti???t : {exChangeDetail?.orderDetail?.id}
          </h6>
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
          <h6 className="text-danger fw-bold">
            Ghi ch??: {des}
          </h6>
        </Modal>
      </div>
    </div>
  );
};

export default Exchange;
