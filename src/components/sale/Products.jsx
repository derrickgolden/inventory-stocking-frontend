import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { toast } from "react-toastify";

export default function ProductAdd({
  form,
  productList,
  productLoading,
  totalCalculator,
  subTotal,
}) {
  const handleSetInitial = (productId, index) => {
    const productArray = form.getFieldValue("saleInvoiceProduct") || [];
    const selectedProduct = productList.find((pro) => pro.id === productId);

    if (!selectedProduct) return;

    if (selectedProduct.productQuantity === 0) {
      toast.warning("Product is out of stock");
    }

    const newArray = productArray.map((product, i) => {
      if (i === index) {
        return {
          ...product,
          productQuantity: selectedProduct.productQuantity ? 0 : 0,
          productSalePrice: selectedProduct.productSalePrice,
          productVat: selectedProduct.productVat || 0,
          unitMeasurement: selectedProduct.unitMeasurement,
          currentQuantity: selectedProduct.currentQuantity,
        };
      }
      return product;
    });

    form.setFieldsValue({ saleInvoiceProduct: newArray });
    totalCalculator(index);
  };

  return (
    <>
      {/* Header Row */}
      <div className='grid grid-cols-12 gap-3'>
        {["SL", "Product", "U.M.", "C.Q.", "Qty", "Price", "Total", "Delete"].map((item, i) => (
          <div
            key={i}
            className={`${
              i === 1 ? "col-span-3" :
              i === 5 ? "col-span-2" :
              i === 6 ? "col-span-2" :
              "col-span-1"
            } font-bold md:text-base xxs:text-xs sm:text-sm`}
          >
            {item}
          </div>
        ))}
      </div>

      <hr className='mt-2 bg-black' />

      <Form.List name='saleInvoiceProduct'>
        {(fields, { add, remove }) => (
          <>
            <div className='max-h-[300px] overflow-y-auto mt-2 space-y-2'>
              {fields.map(({ key, name, ...restField }, index) => (
                <div className='grid grid-cols-12 gap-3' key={key}>
                  <div className='col-span-1'>{index + 1}</div>

                  {/* Product Select */}
                  <div className='col-span-3'>
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Product is required" }]}
                    >
                      <Select
                        placeholder='Select Product'
                        showSearch
                        loading={productLoading}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => handleSetInitial(value, index)}
                      >
                        {productList?.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  {/* U.M. */}
                  <div className='col-span-1'>
                    <Form.Item {...restField} name={[name, "unitMeasurement"]}>
                      <Input disabled size='small' placeholder='U.M.' />
                    </Form.Item>
                  </div>

                  {/* C.Q. */}
                  <div className='col-span-1'>
                    <Form.Item {...restField} name={[name, "currentQuantity"]}>
                      <Input disabled size='small' placeholder='C.Q.' />
                    </Form.Item>
                  </div>

                  {/* Quantity Input with Validation */}
                  <div className='col-span-1'>
                    <Form.Item
                      {...restField}
                      name={[name, "productQuantity"]}
                      rules={[
                        { required: true, message: "Quantity required" },
                        {
                          validator: (_, value) => {
                            const currentQty = form.getFieldValue([
                              "saleInvoiceProduct",
                              name,
                              "currentQuantity",
                            ]);
                            if (value > currentQty) {
                              return Promise.reject(
                                new Error(`Only ${currentQty} in stock`)
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        size='small'
                        min={1}
                        placeholder='Qty'
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          const currentQty = form.getFieldValue([
                            "saleInvoiceProduct",
                            name,
                            "currentQuantity",
                          ]);
                          if (value > currentQty) {
                            message.warning(`Max allowed is ${currentQty}`);
                            const values = form.getFieldValue("saleInvoiceProduct") || [];
                            values[index].productQuantity = currentQty;
                            form.setFieldsValue({ saleInvoiceProduct: values });
                          }
                          totalCalculator(index);
                        }}
                      />
                    </Form.Item>
                  </div>

                  {/* Sale Price */}
                  <div className='col-span-2'>
                    <Form.Item
                      {...restField}
                      name={[name, "productSalePrice"]}
                      rules={[{ required: true, message: "Price required" }]}
                    >
                      <InputNumber
                        size='small'
                        placeholder='Price'
                        onChange={() => totalCalculator(index)}
                      />
                    </Form.Item>
                  </div>

                  {/* Total */}
                  <div className='col-span-2'>
                    <div className='font-medium md:text-base xxs:text-xs'>
                      {subTotal[index]?.subPrice?.toFixed(2) || 0}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className='col-span-1'>
                    <Form.Item>
                      <button
                        type='button'
                        onClick={() => {
                          remove(name);
                          totalCalculator(index);
                        }}
                        className='bg-red-600 text-white p-2 rounded-md flex justify-center items-center'
                      >
                        <DeleteOutlined />
                      </button>
                    </Form.Item>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <Form.Item className='mt-4'>
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Product
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
