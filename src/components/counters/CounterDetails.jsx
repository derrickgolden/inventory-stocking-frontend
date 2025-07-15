
import { SolutionOutlined } from "@ant-design/icons";
import { Badge, Button, Card, DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { clearRestockCounter, loadAllRestockCounter } from "../../redux/rtk/features/restockCounter/restockCounterSlice";
import { loadSingleCounter } from "../../redux/rtk/features/counter/counterSlice";
import Loader from "../loader/loader";
import RestockCounter from "./RestockCounter";
import CreateDrawer from "../CommonUi/CreateDrawer";
import CounterProductList from "./CounterProductList";
import CounterRestockHistory from "./CounterRestockHistory";
import DashboardCard from "./Cards";

const CounterDetails = () => {
    const { id } = useParams();
    let navigate = useNavigate();

    //dispatch
    const dispatch = useDispatch();
    const counter = useSelector((state) => state.counters.counter);
    const { list } = useSelector((state) => state.restockCounter);
    const {status, singleCounter, information,total } = counter ? counter : {};
    const { allRestockCounter, allCounterProducts, aggregations } = list ? list : {};

    const { RangePicker } = DatePicker;
    const [startdate, setStartDate] = useState( moment().startOf("month").format("YYYY-MM-DD"));
    const [enddate, setEndDate] = useState(moment().endOf("month").format("YYYY-MM-DD"));

    useEffect(() => {
        dispatch(loadSingleCounter(id));
        dispatch(loadAllRestockCounter({ 
            counterId: id, count: 10, query: "" ,startdate: startdate,
            enddate: enddate,
        }));

        return () => {
            dispatch(clearRestockCounter());
        };
    }, [dispatch, id]);

    const isLogged = Boolean(localStorage.getItem("isLogged"));

    if (!isLogged) {
        return <Navigate to={"/admin/auth/login"} replace={true} />;
    }

    const onCalendarChange = (dates) => {
        const startdate = (dates?.[0]).format("YYYY-MM-DD");
        const enddate = (dates?.[1]).format("YYYY-MM-DD");
        setStartDate(startdate);
        setEndDate(enddate);
        dispatch(
        loadAllRestockCounter({
            counterId: id,
            status: true,
            page: 1,
            count: 10,
            startdate: startdate,
            enddate: enddate,
        })
        );
    };

    return (
        <div className='card card-custom '>
            <div className='card-body'>
                <div className="my-3">
                    <RangePicker
                    onCalendarChange={onCalendarChange}
                    defaultValue={[
                        dayjs(startdate, "YYYY-MM-DD"),
                        dayjs(enddate, "YYYY-MM-DD"),
                    ]}
                    className='range-picker'
                    style={{ maxWidth: "400px" }}
                    />
                </div>

                {singleCounter ? (
                    <Fragment key={singleCounter.id}>
                        <Card bordered={false} className='criclebox h-full'>
                            <div className='flex justify-between'>
                                <h5>
                                    <SolutionOutlined />
                                    <span className='mr-left'>
                                        ID : {singleCounter.id} | {singleCounter.name}
                                    </span>
                                </h5>
                                <div className='card-header flex justify-between'>
                                    <div className='mr-4'>
                                        <CreateDrawer
                                            permission={"create-stock"}
                                            title={"Restock"}
                                            width={85}
                                        >
                                            <RestockCounter 
                                                singleCounter = {singleCounter}
                                            />
                                        </CreateDrawer>
                                    </div>

                                </div>
                            </div>

                            <DashboardCard information={aggregations} count={total} />
                            
                            <div className='card-body mt-4'>
                                {/* <Row justify='space-around'>
                                    <Col span={11}>
                                        <Badge.Ribbon
                                            text={status}
                                            color={status === "PAID" ? "green" : "red"}>
                                            <CardComponent title='Purchase Invoice Information '>
                                                <h5 className='text-center mt-2 mb-2'>
                                                    {" "}
                                                    Initial Invoice Info{" "}
                                                </h5>
                                                <p>
                                                    <Typography.Text strong>
                                                        Total Amount :
                                                    </Typography.Text>{" "}
                                                    <strong>{singleCounter.totalAmount} </strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>Due Amount :</Typography.Text>{" "}
                                                    <strong className='text-danger'>
                                                        {" "}
                                                        {singleCounter.dueAmount}
                                                    </strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>
                                                        Paid Amount :
                                                    </Typography.Text>{" "}
                                                    <strong>{singleCounter.paidAmount}</strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>Discount :</Typography.Text>{" "}
                                                    <strong>{singleCounter.discount}</strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>
                                                        Purchase Date :
                                                    </Typography.Text>{" "}
                                                    <strong>
                                                        {singleCounter.createdAt.slice(0, 10)}
                                                    </strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>
                                                        Supplier Memo No :
                                                    </Typography.Text>{" "}
                                                    <strong>
                                                        {singleCounter.supplierMemoNo}
                                                    </strong>
                                                </p>

                                                <p>
                                                    <Typography.Text strong>Note :</Typography.Text>{" "}
                                                    <strong>{singleCounter.note}</strong>
                                                </p>

                                                <div>
                                                    <h5 className='text-center mt-2 mb-2'>
                                                        Update Invoice Info
                                                    </h5>

                                                    <p>
                                                        <Typography.Text strong>
                                                            Total Paid Amount :
                                                        </Typography.Text>{" "}
                                                        <strong>{totalPaidAmount}</strong>
                                                    </p>

                                                    <p>
                                                        <Typography.Text strong>
                                                            Total Return Amount:
                                                        </Typography.Text>{" "}
                                                        <strong>{totalReturnAmount}</strong>
                                                    </p>

                                                    <p>
                                                        <Typography.Text strong>
                                                            Due Amount :
                                                        </Typography.Text>{" "}
                                                        <strong style={{ color: "red" }}>
                                                            {dueAmount}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </CardComponent>
                                        </Badge.Ribbon>
                                    </Col>
                                    <Col span={12}>
                                        <CardComponent title='Supplier Information'>
                                            <p>
                                                <Typography.Text strong>
                                                    Supplier Name :
                                                </Typography.Text>{" "}
                                                <strong>{singleCounter.supplier?.name}</strong>
                                            </p>

                                            <p>
                                                <Typography.Text strong>Phone :</Typography.Text>{" "}
                                                <strong>{singleCounter.supplier?.phone}</strong>
                                            </p>

                                            <p>
                                                <Typography.Text strong>Address :</Typography.Text>{" "}
                                                <strong>
                                                    {singleCounter.supplier?.address}
                                                </strong>
                                            </p>
                                        </CardComponent>
                                    </Col>
                                </Row>
                                <br /> */}


                                <CounterProductList list={allCounterProducts} />
                                <CounterRestockHistory list={allRestockCounter} />
                            </div>
                        </Card>
                    </Fragment>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default CounterDetails;
