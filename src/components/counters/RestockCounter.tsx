
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../redux/rtk/features/product/productSlice";
import { addRestockCounter } from "../../redux/rtk/features/restockCounter/restockCounterSlice";
import Products from "./Products";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const RestockCounter = ({singleCounter}) => {
  const [loader, setLoader] = useState(false);
  const [subTotal, setSubTotal] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProduct({ status: true, page: 1, count: 10 }));
  }, [dispatch]);

  const { list: productList, loading: productLoading } = useSelector(
    (state) => state.products
  );

  // Form Function
  const [form] = Form.useForm();

  const onFormSubmit = async (values) => {
    try {
      const mergedObject = values.restockCounterProduct.reduce(
        (accumulator, currentObject) => {
          const productId = currentObject.productId;
          if (!accumulator[productId]) {
            accumulator[productId] = { ...currentObject };
          } else {
            accumulator[productId].productQuantity +=
              currentObject.productQuantity;
          }
          return accumulator;
        },
        {}
      );

      const mergedArray = Object.values(mergedObject);

      const data = {
        ...values,
        restockCounterProduct: mergedArray,
        totals: {total, totalQuantity},
        counterId: singleCounter.id
      };

      const resp = await dispatch(addRestockCounter(data));

      if (resp.payload.message === "success") {
        form.resetFields();
        setLoader(false);
        navigate(`/admin/counters/${resp.meta.arg?.counterId}`);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  // total calculate
  const totalCalculator = () => {
    const productArray = form.getFieldValue("restockCounterProduct");

    const subTotal =
      productArray?.reduce((subTotal, current) => {
        const quantity = current?.productQuantity || 0;
        const price = current?.productPurchasePrice || 0;
        return [...subTotal, price * quantity];
      }, []) || [];

    const total = subTotal.reduce((total, current) => total + current, 0) || 0;

    const totalQuantity =
    productArray?.reduce((sum, current) => {
      return sum + (current?.productQuantity || 0);
    }, 0) || 0;

    setSubTotal(subTotal);
    setTotal(total);
    setTotalQuantity(totalQuantity);
  };

  return (
    <Form
      form={form}
      className="w-full "
      name="dynamic_form_nest_item"
      onFinish={onFormSubmit}
      onFinishFailed={() => {
        setLoader(false);
      }}
      layout="vertical"
      size="large"
      autoComplete="off"
      initialValues={{
        paidAmount: 0,
        discount: 0,
        date: dayjs(),
      }}
    >
      <Products
        totalCalculator={totalCalculator}
        subTotal={subTotal}
        form={form}
        productList={productList}
        productLoading={productLoading}
      />
      <div className="flex gap-8 mt-10">
        <div className="w-1/2">
          
        </div>

        <div className="py-2  w-1/2">
          <div className="p-1 flex justify-between">
            <strong>Total Quantity: </strong>
            <strong>{totalQuantity.toFixed(2)}</strong>
          </div>
          <div className="p-1 flex justify-between">
            <strong>Total Amount: </strong>
            <strong>Ksh. {total.toFixed(2)}</strong>
          </div>
       
          <Form.Item style={{ marginTop: "15px" }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loader}
              onClick={() => setLoader(true)}
            >
              Restock {singleCounter.name}
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default RestockCounter;
