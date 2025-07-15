import React, { Fragment } from "react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FaCoins } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
const DashboardCard = ({ information, count }) => {
	console.log({information});
	return (
		<Fragment>
			<section className='grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-5 mb-5'>
				<div className='ant-shadow dark:bg-[#2e2d35] flex items-center p-8 bg-white rounded-lg dashboard-card-bg '>
					<div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-lg mr-6'>
						<LiaFileInvoiceSolid size={40} />
					</div>
					<div>
						<span className='block text-2xl font-bold'>
							{" "}
							{information ? information._count.id : 0}
						</span>
						<span className='block text-gray-500 dark:text-yellow-50'>
							{" "}
							Total Restocks{" "}
						</span>
					</div>
				</div>
				<div className='ant-shadow dark:bg-[#2e2d35] flex items-center p-8 bg-white rounded-lg dashboard-card-bg'>
					<div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-violet-600 bg-violet-100 rounded-lg mr-6'>
						<FaCoins size={30} />
					</div>
					<div>
						<span className='block text-2xl font-bold'>
							{"Ksh. "}
							{information?._sum?.totalAmount ? information?._sum?.totalAmount : 0}
						</span>
						<span className='block text-gray-500 dark:text-yellow-50'>
							Total Unsold Amount
						</span>
					</div>
				</div>
				<div className='ant-shadow dark:bg-[#2e2d35] flex items-center p-8 bg-white rounded-lg dashboard-card-bg'>
					<div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-rose-500 bg-rose-100 rounded-lg mr-6'>
						<FaMoneyBillTrendUp size={30} />
					</div>
					<div>
						<span className='inline-block text-2xl font-bold'>
							{information?._sum?.totalQuantity ? information?._sum?.totalQuantity : 0}
						</span>

						<span className='block text-gray-500 dark:text-yellow-50'>
							Total Unsold Quantity
						</span>
					</div>
				</div>
				{/* <div className='ant-shadow dark:bg-[#2e2d35] flex items-center p-8 bg-white rounded-lg dashboard-card-bg'>
					<div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-violet-600 bg-violet-100 rounded-lg mr-6'>
						<FaMoneyBillTransfer size={35} />
					</div>
					<div>
						<span className='inline-block text-2xl font-bold'>
							{information?.paidAmount ? information?.paidAmount : 0}
						</span>

						<span className='block text-gray-500 dark:text-yellow-50'>
							Total Paid Amount{" "}
						</span>
					</div>
				</div> */}
			</section>
		</Fragment>
	);
};

export default DashboardCard;
