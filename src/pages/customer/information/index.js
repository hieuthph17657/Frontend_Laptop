import React, { useContext, useEffect, useState } from "react";
import { Button, Input, message, Modal, Select, Table } from "antd";
import { ToastContainer, toast } from 'react-toastify';

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
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

function Information() {
    const [loading, setLoading] = useState(false);
    const [address, setAddRess] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [data, setData] = useState();
    const [id, setId] = useState();
    const [username, setUsername] = useState();
    const [status, setStatus] = useState(1);
    const [isEditing, setEditing] = useState(false);
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();
    const [password3, setPassword3] = useState();


    const information = JSON.parse(localStorage.getItem("information"));

    const user = localStorage.getItem("username");

    const idUser = localStorage.getItem("id");

    const changeAddress = (event) => {
        setAddRess(event.target.value);
    };

    const changeName = (event) => {
        setName(event.target.value);
    };

    const changePhone = (event) => {
        setPhone(event.target.value);
    };

    const changeEmail = (event) => {
        setEmail(event.target.value);
    };

    const loadDataByID = () => {
        console.log(information[0]?.id);
        fetch(`http://localhost:8080/api/information/` + idUser)
            .then((res) => res.json())
            .then((res) => {
                setName(res.data.fullName);
                setEmail(res.data.email)
                setPhone(res.data.phoneNumber)
                setAddRess(res.data.address)
            });
    };

    useEffect(() => {
        loadDataByID();
    }, []);

    const handleSubmitUpdate = (data) => {
        const edit = {
            fullName: name,
            phoneNumber: phone,
            email: email,
            address: address,
        };
        console.log(information[0]?.id);
        fetch("http://localhost:8080/api/auth/information/" + idUser, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(edit),
        })
            .then((response) => response.json())
            .then((results) => {
                if (results.data == null) {
                    toastError(results.message);
                } else {
                    localStorage.removeItem("information");
                    toastSuccess("C???p nh???t th??ng tin th??nh c??ng!");
                    localStorage.setItem("information", JSON.stringify([results.data]));
                    loadDataByID();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    };

    const onEdit = (status) => {
        setId(idUser);
        setEditing(true);
        setUsername(user);
        setStatus(1);
    };

    const changeUsername = (event) => {
        setUsername(event.target.value);
    };

    const changePassword1 = (event) => {
        setPassword1(event.target.value);
    };

    const changePassword2 = (event) => {
        setPassword2(event.target.value);
    };

    const changePassword3 = (event) => {
        setPassword3(event.target.value);
    };

    return (
        <div className="row ">
            <ToastContainer></ToastContainer>
            <div className="col-12">
                <h6 className="pt-5 pb-5">
                    <div className="row">
                        <div className="col-6" style={{
                            margin: "auto", border: "1px solid",
                            padding: "15px"
                        }}>
                            <h2><b>H??? s?? c???a b???n</b></h2>
                            <h4>Qu???n l?? th??ng tin h??? s?? ????? b???o m???t t??i kho???n</h4>
                            <hr></hr>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>T??n ????ng nh???p: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        defaultValue={user}
                                        disabled
                                    ></input>
                                </div>
                                <br></br>
                                <a onClick={onEdit} style={{ color: "red", float: "right", margin: "unset" }}>?????i m???t kh???u</a>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>H??? v?? t??n: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        placeholder="H??? t??n"
                                        onChange={changeName}
                                        defaultValue={name}
                                    ></input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>S??? ??i???n tho???i: </label>
                                    <Input
                                        
                                        className="form-control radio-ip"
                                        placeholder="S??? ??i???n tho???i"
                                        onChange={changePhone}
                                        value={phone}
                                    ></Input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>Email: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        onChange={changeEmail}
                                        defaultValue={email}
                                    ></input>
                                </div>
                            </div>
                            <div className="col-8 mt-3" style={{ margin: "auto" }}>
                                <div className="form-group">
                                    <label>?????a ch???: </label>
                                    <input
                                        type={"text"}
                                        className="form-control radio-ip"
                                        onChange={changeAddress}
                                        defaultValue={address}
                                    ></input>
                                </div>
                            </div>
                            <div className="row mb-2 mt-4">
                                <div className="btn-submit">
                                    <Button
                                        className="text-center"
                                        type="button"
                                        shape="round"
                                        onClick={handleSubmitUpdate}
                                    >
                                        C???p nh???t th??ng tin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </h6>
                <Modal
                    title="C???p nh???t"
                    open={isEditing}
                    okText={"C???p nh???t"}
                    cancelText={"Hu???"}
                    onCancel={() => {
                        setEditing(false);
                    }}
                    onOk={() => {
                        if (password1 == null || password2 == null || password3 == null) {
                            toastError("Vui l??ng nh???p ?????y ????? th??ng tin!")
                        } else {
                            if (password2 != password1) {
                                toastError("Nh???p l???i m???t kh???u kh??ng ch??nh x??c!");
                            } else {
                                setLoading(true);
                                fetch(
                                    `http://localhost:8080/api/users/` + id, { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password3, newPassword: password1, status: status }) }).then((res) => res.json())
                                    .then((results) => {
                                        if (results.data == null) {
                                            toastError(results.message);
                                        } else {
                                            toastSuccess("?????i m???t kh???u th??nh c??ng!");
                                            setUsername("");
                                            setPassword3("");
                                            setPassword1("");
                                            setPassword2("");
                                            setEditing(false);
                                        }
                                    });
                            }
                        }
                    }}
                >
                    <label>
                        T??i kho???n
                    </label>
                    <Input type="text" name="username" value={user} placeholder="Nh???p t??i kho???n" onChange={changeUsername} disabled={true} />
                    <label>
                        M???t kh???u c??
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password3" value={password3} placeholder="Nh???p m???t kh???u c??" onChange={changePassword3} />
                    <label>
                        M???t kh???u m???i
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password1" value={password1} placeholder="Nh???p m???t kh???u m???i" onChange={changePassword1} />
                    <label>
                        X??c nh???n m???t kh???u
                        <span className="text-danger"> *</span>
                    </label>
                    <Input type="password" name="password2" value={password2} placeholder="Nh???p l???i m???t kh???u" onChange={changePassword2} />
                </Modal>
            </div>
        </div>
    );
}

export default Information;
