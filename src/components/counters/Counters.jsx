import { Link, Navigate } from "react-router-dom";

import { Card, DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCounter } from "../../redux/rtk/features/counter/counterSlice";
import ViewBtn from "../Buttons/ViewBtn";
import CreateDrawer from "../CommonUi/CreateDrawer";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import DashboardCard from "./Cards";
import AddCounter from "./AddCounter";
// import AddPurchase from "./addPurchase";

const Counters = (props) => {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector(
    (state) => state.counters
  );

  const { RangePicker } = DatePicker;
  const [startdate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [enddate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const columns = [
    {
    title: "Thumbnail",
    dataIndex: "counterThumbnailImageUrl",
    key: "counterThumbnailImageUrl",
    render: (url) => (
      <img
        src={url}
        alt="counter"
        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        onError={(e) => (e.target.src = "/images/default.jpg")}
      />
    ),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Bartender Name",
    key: "users",
    render: (_, record) => record.users?.username || "N/A",
  },
  {
    title: "ID No",
    key: "idNo",
    render: (_, record) => record.users?.idNo || "N/A",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => new Date(date).toLocaleString(),
  },

  {
    id: 8,
    title: "Action",
        dataIndex: "id",
        key: "id",
        render: (id, { dueAmount }) => (
          <div className='flex flex-row'>
            <ViewBtn path={`/admin/counters/${id}`} />
          </div>
        ),
  },
];

  useEffect(() => {
    dispatch(
      loadAllCounter({
        query: "all",
        status: true,
        page: 1,
        count: 10,
      })
    );

  }, [dispatch]);

  const onCalendarChange = (dates) => {
    const startdate = (dates?.[0]).format("YYYY-MM-DD");
    const enddate = (dates?.[1]).format("YYYY-MM-DD");
    setStartDate(startdate);
    setEndDate(enddate);
    dispatch(
      loadAllCounter({
        status: true,
        page: 1,
        count: 10,
        startdate: startdate,
        enddate: enddate,
      })
    );
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  return (
    <>
      <div className='card card-custom mt-3 '>
        <div className='card-body'>
          <div>
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

          {/* <DashboardCard information={information} count={total} /> */}
          <br />
          <Card
            className='border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]'
            bodyStyle={{ padding: 0 }}
          >
            <div className='flex items-center justify-between pb-3'>
              <h1 className='text-lg font-bold'>Counter list</h1>
              <div className='justify-between md:justify-start flex gap-3 items-center'>
                <CreateDrawer
                  permission={"create-counter"}
                  title={"Add Counter"}
                  width={85}
                >
                  <AddCounter />
                </CreateDrawer>
              </div>
            </div>
            <UserPrivateComponent permission={"readAll-purchaseInvoice"}>
              <TableComponent
                list={list}
                total={total}
                columns={columns}
                loading={loading}
                paginatedThunk={loadAllCounter}
                csvFileName={"purchase list"}
                query={{ startdate, enddate }}
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Counters;
