import { Card, Col, Row, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import ViewBtn from "../Buttons/ViewBtn";

const CounterProductList = ({ list }) => {
    const [columnsToShow, setColumnsToShow] = useState([]);

    const columns = [
        {
            id: 1,
            title: "Product ID",
            dataIndex: "productId",
            key: "productId",
            render: (id) => <Link to={`/admin/product/${id}`}>{id}</Link>,
        },
        {
            id: 2,
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            id: 4,
            title: "Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            id: 5,
            title: "Current Quantity",
            dataIndex: "currentQuantity",
            key: "currentQuantity",
        },
        {
            id: 8,
            title: "Action",
            dataIndex: "productId",
            key: "productId",
            render: ( id ) => <ViewBtn path={`/admin/product/${id}`} />,
        },
    ];

    useEffect(() => {
        setColumnsToShow(columns);
    }, []);

    const columnsToShowHandler = (val) => {
        setColumnsToShow(val);
    };

    const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.productId }));

    return (
        <Row>
            <Col span={24} className='mt-2'>
                <Card
                    className='header-solid h-full'
                    bordered={false}
                    title={[
                        <h6 className='font-bold text-warning m-0 text-center'>
                            Counter product list
                        </h6>,
                    ]}
                    bodyStyle={{ paddingTop: "0" }}>
                    {list && (
                        <div style={{ marginBottom: "30px" }}>
                            <ColVisibilityDropdown
                                options={columns}
                                columns={columns}
                                columnsToShowHandler={columnsToShowHandler}
                            />
                        </div>
                    )}
                    <div className='col-info'>
                        <Table
                            scroll={{ x: true }}
                            loading={!list}
                            columns={columnsToShow}
                            dataSource={list ? addKeys(list) : []}
                        />
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default CounterProductList;
