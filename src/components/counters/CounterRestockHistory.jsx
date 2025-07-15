import { Card, Col, Row, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import ViewBtn from "../Buttons/ViewBtn";

const CounterRestockHistory = ({ list }) => {
    const [columnsToShow, setColumnsToShow] = useState([]);

    const columns = [
        {
            id: 1,
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => <Link to={`/admin/restock-history/${id}`}>{id}</Link>,
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
            title: "Quantity",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
        },
        {
            id: 5,
            title: "Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
        },

        {
            id: 6,
            title: "Items ",
            dataIndex: "items",
            key: "items",
            render: (items) => items.length,
        },
        {
            id: 7,
            title: "Restocked_by",
            dataIndex: "user",
            key: "user",
            render: (user) => user.username,
        },
        {
            id: 8,
            title: "Action",
            key: "action",
            render: ({ id }) => <ViewBtn path={`/admin/restock-history/${id}`} />,
        },
    ];

    useEffect(() => {
        setColumnsToShow(columns);
    }, []);

    const columnsToShowHandler = (val) => {
        setColumnsToShow(val);
    };

    const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

    return (
        <Row>
            <Col span={24} className='mt-2'>
                <Card
                    className='header-solid h-full'
                    bordered={false}
                    title={[
                        <h6 className='font-semibold m-0 text-center'>
                            Counter restocking history
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

export default CounterRestockHistory;
