import { UploadOutlined, MenuFoldOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useContext } from "react";
import product1 from "../../../asset/images/products/product01.png";
import { Modal, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import "./discountProduct.css";

function formatCash(str) {
  if (str.length > 1) {
    return str
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ",") + prev;
      });
  } else {
    return "";
  }
}

function DiscountProduct() {
  const [products, setData] = useState([
    {
      id: "",
      name: "",
      price: null,
      quantity: null,
      active: 1,
      imei: null,
      weight: null,
      size: null,
      debut: null,
      categoryId: null,
      images: null,
    },
  ]);

  console.log(products);

  const allProWithDiscount = () => {
    fetch(`http://localhost:8080/api/products/allProWithDiscount`)
      .then((response) => response.json())
      .then((results) => {
        setData(results.data);
      });
  };

  useEffect(() => {
    allProWithDiscount();
  }, []);

  let navigate = useNavigate();

  const handelCLickProduct = (product) => {
    getProductById(product.id);
    console.log(product.id);
  };

  const [product, setProduct] = useState([]);

  const getProductById = (id) => {
    console.log("productId:", id);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setProduct(res);
        localStorage.removeItem("product_detail");
        localStorage.setItem("product_detail", JSON.stringify(res));
      });
    // product = JSON.parse(localStorage.getItem("product_detail"));
    // setProduct(JSON.parse(localStorage.getItem("product_detail")));
    // setProduct == product;
  };
  // product = JSON.parse(localStorage.getItem("product_detail"));
  console.log(product);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangePagination =(pagination) => {
    tableParamPro.pagination.limit = 12;
    tableParamPro.pagination.current = pagination;
  }

  return (
    <div className="row">
      <div className="col-1" style={{ width: "10px" }}>
        <MenuFoldOutlined style={{ fontSize: "20px" }} />
      </div>
      <div className="col-11">
        <h4 className="text-danger fw-bold">S???n ph???m gi???m gi??</h4>
      </div>
      <div className="col-md-12">
        <div className="row">
          {products
            ? products.map((item) => (
                <div className="col-md-3 col-xs-6 discount" key={item.id}>
                  <div
                    className="product discount"
                    onClick={() => handelCLickProduct(item)}
                  >
                    <div className="product-img discount">
                      <img
                        src={item.images ? item.images[0]?.name : product1}
                        alt=""
                      />
                      <div className="product-label discount">
                        {item.discount ? (
                          <span className="sale">{item.discount.ratio}%</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="product-body">
                      <p className="product-category">
                        {item.categoryProducts?.category?.name
                          ? item.categoryProducts.category.name
                          : ""}
                      </p>
                      <h3 className="product-name">
                        <a onClick={showModal}>{item.name}</a>
                      </h3>
                      <h4 className="product-price">
                        {formatCash(item.price + "")} VN??{" "}
                        {item.discount ? (
                          <del className="product-old-price">
                            {formatCash(
                              item.price / ((100 - item.discount.ratio) / 100) +
                                ""
                            )}{" "}
                            VN??
                          </del>
                        ) : (
                          ""
                        )}
                      </h4>
                    </div>
                  </div>
                  
                </div>
                
              ))
            : "Kh??ng c?? s???n ph???m"}
          <Modal
            title={`Chi ti???t th??ng s??? k?? thu???t ` + product?.name}
            open={isModalOpen}
            // onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"????ng"}
          >
            <div className="card">
              <div className="card-header" style={{ textAlign: "left" }}>
                Th??ng tin h??ng h??a
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Xu???t x???: {product?.origin?.name}</li>
                  <li>Th????ng hi???u: {product?.manufacture?.name} </li>
                </div>
                <div className="col-6">
                  <li>Th???i ??i???m ra m???t:{product?.debut} </li>
                  <li>H?????ng d???n b???o qu???n: ????? n??i kh?? r??o, nh??? tay</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Thi???t k??? tr???ng l?????ng
              </div>
              <div className="card-body">
                <li>
                  K??ch th?????c: {product?.width} x {product?.height} x{" "}
                  {product?.length}
                </li>
                <li>Tr???ng l?????ng s???n ph???m: {product?.weight}kg</li>
                <li>Ch???t li???u: {product?.material}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                B??? x??? l??
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>H??ng CPU: {product?.processor?.cpuCompany}</li>
                  <li>C??ng ngh??? CPU: {product?.processor?.cpuTechnology}</li>
                  <li>T???c ????? CPU: {product?.processor?.cpuSpeed}</li>
                  <li>T???c ????? t???i ??a CPU: {product?.processor?.maxSpeed}</li>
                </div>
                <div className="col-6">
                  <li>Lo???i CPU: {product?.processor?.cpuType}</li>
                  <li>S??? nh??n: {product?.processor?.multiplier}</li>
                  <li>S??? lu???ng: {product?.processor?.numberOfThread}</li>
                  <li>B??? nh??? ?????m: {product?.processor?.caching}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                RAM
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Dung l?????ng RAM: {product?.ram?.ramCapacity}</li>
                  <li>Lo???i RAM: {product?.ram?.typeOfRam}</li>
                  <li>T???c ????? RAM: {product?.ram?.ramSpeed}</li>
                  <li>S??? khe c???m r???i: {product?.ram?.looseSlot}</li>
                </div>
                <div className="col-6">
                  <li>S??? khe RAM c??n l???i: {product?.ram?.remainingSlot}</li>
                  <li>S??? RAM onboard: {product?.ram?.onboardRam}</li>
                  <li>H??? tr??? RAM t???i ??a: {product?.ram?.maxRamSupport}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                M??n H??nh
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>K??ch th?????c m??n h??nh: {product?.screen?.size}</li>
                  <li>
                    C??ng ngh??? m??n h??nh: {product?.screen?.screenTechnology}
                  </li>
                  <li>????? ph??n gi???i: {product?.screen?.resolution}</li>
                  <li>T???n s??? qu??t: {product?.screen?.scanFrequency}</li>
                  <li>T???m n???n: {product?.screen?.backgroundPanel}</li>
                </div>
                <div className="col-6">
                  <li>????? s??ng: {product?.screen?.brightness}</li>
                  <li>????? ph??? m??u: {product?.screen?.colorCoverage}</li>
                  <li>T??? l??? m??n h??nh: {product?.screen?.resolution}</li>
                  <li>M??n h??nh c???m ???ng: {product?.screen?.backgroundPanel}</li>
                  <li>????? t????ng ph???n: {product?.screen?.contrast}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                ????? h???a
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card onboard
                    </span>
                  </li>
                  <li>H??ng: {product?.cardOnboard?.trandemark}</li>
                  <li>Model: {product?.cardOnboard?.model}</li>
                  <li>B??? nh???: {product?.cardOnboard?.memory}</li>
                </div>
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card r???i
                    </span>
                  </li>
                  <li>H??ng: {product?.card?.trandemark}</li>
                  <li>Model: {product?.card?.model}</li>
                  <li>B??? nh???: {product?.card?.memory}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                L??u tr???
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Ki???u ??? c???ng: {product?.storage?.storageDetail?.type}</li>
                  <li>S??? khe c???m: {product?.storage?.number}</li>
                  <li>
                    Lo???i SSD:
                    {product?.storage?.storageDetail?.storageType?.name}
                  </li>
                  <li>
                    Dung l?????ng: {product?.storage?.storageDetail?.capacity}
                  </li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                B???o m???t
              </div>
              <div className="card-body row">
                <li>{product?.security}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                H??? ??i???u h??nh
              </div>
              <div className="card-body row">
                <li>OS: {product?.win?.name}</li>
                <li>Version: {product?.win?.version}</li>
              </div>
            </div>
          </Modal>
        </div>
        {/* <Pagination className="text-center"  onChange={handlePagination} simple defaultCurrent={1} total={15} /> */}
      </div>
    </div>
  );
}

export default DiscountProduct;
