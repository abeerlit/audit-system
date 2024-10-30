import CardViewIcon from "@/components/icons/dashboard/auditing/cardview-icon";
import TableViewIcon from "@/components/icons/dashboard/auditing/tableview-icon";
import Image from "next/image";
import { useState } from "react";
import image from "@/images/mock-photo.jpg";
import DropdownIcon from "@/components/icons/dashboard/auditing/dropdown-icon";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { AuditingItems } from "@/store/slices/auditingItemsSlice";

const Auditing = () => {
  const [view, setView] = useState<"table" | "card">("card");
  const auditingData: AuditingItems[] = useSelector(
    (state: RootState) => state.auditingItems
  );

  if (auditingData[0]?.id == -1 || auditingData.length === 0) {
    return (
      <div className="text-center text-auth-purple text-xl italic leading-[100px]">
        Nothing to show
      </div>
    );
  }
  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <button
          type="button"
          className="px-3 py-2 ms-auto flex items-center font-semibold rounded-full border bg-white text-auth-purple group relative"
        >
          {view === "table" ? (
            <>
              <TableViewIcon className="mr-2 w-4 h-4" />
              <span>Table View</span>
              <DropdownIcon className="ms-4" />
            </>
          ) : (
            <>
              <CardViewIcon className="mr-2 w-4 h-4" />
              <span>Card View</span>
              <DropdownIcon className="ms-4" />
            </>
          )}
          <div className="absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">
            <div
              onClick={() => setView("table")}
              className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
            >
              Table View
            </div>
            <div
              onClick={() => setView("card")}
              className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap border-t border-gray-300"
            >
              Card View
            </div>
          </div>
        </button>
      </div>

      {view === "table" ? (
        <div className="overflow-auto rounded-2xl text-gray-600">
          <table className="bg-white table-auto w-full">
            <thead className="bg-light-blue text-white">
              <tr>
                <th className="p-4 text-left text-nowrap">Description</th>
                <th className="p-4 text-left text-nowrap">Image</th>
                <th className="p-4 text-left text-nowrap">Price</th>
                <th className="p-4 text-left text-nowrap">Weight</th>
                <th className="p-4 text-left text-nowrap">HS Code</th>
                <th className="p-4 text-left text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditingData?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-nowrap">{product.search_sentence}</td>
                  <td className="p-4 text-nowrap">
                    <Image
                      src={
                        product.item_image?.includes("http")
                          ? product.item_image
                          : image
                      }
                      alt={
                        product.item_image?.includes("http")
                          ? String(product.search_sentence)
                          : "Mock Image"
                      }
                      className="min-w-40 h-20 rounded-xl border"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="p-4 text-nowrap">
                    {product.item_price ? product.item_price : "No Price"}
                  </td>
                  <td className="p-4 text-nowrap">
                    {product.item_weight ? product.item_weight : "No Weight"}
                  </td>
                  <td className="p-4 text-nowrap">
                    <div className="border rounded-full px-4 py-1">
                      {product.original_hs_code
                        ? product.original_hs_code
                        : "No HS Code"}
                    </div>
                  </td>
                  <td className="p-4 text-nowrap relative">
                    <button
                      type="button"
                      className="font-extrabold text-xl px-2 rounded-lg hover:bg-gray-100 group "
                    >
                      &#x22EE; {/* Dotted actions menu */}
                      <div
                        className="absolute z-10 text-left text-sm font-normal right-4 mt-1 w-full min-w-fit
                        bg-white border rounded-xl overflow-hidden shadow-md hidden group-focus:block"
                      >
                        <ul>
                          <li
                            onClick={() => console.log(product)}
                            className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            Accept
                          </li>
                          <li
                            onClick={() => console.log(product)}
                            className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            Skip
                          </li>
                          <li
                            onClick={() => console.log(product)}
                            className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            Edit
                          </li>
                          <li
                            onClick={() => console.log(product)}
                            className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            Flag Item
                          </li>
                        </ul>
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols xl:grid-cols-3 2xl:grid-cols-4 xl:gap-8 md:gap-6 gap-4">
          {auditingData.map((product) => (
            <div key={product.id} className="p-4 bg-white rounded-3xl">
              <Image
                src={
                  product.item_image?.includes("http")
                    ? product.item_image
                    : image
                }
                alt={
                  product.item_image?.includes("http")
                    ? String(product.search_sentence)
                    : "Mock Image"
                }
                className="w-full h-48 object-cover rounded-2xl border"
                width={300}
                height={300}
              />
              <h2 className="text-auth-purple text-xl text-nowrap truncate w-full pt-4 font-bold">
                {product.search_sentence}
              </h2>
              {/* values */}
              <div className="mt-8 w-full text-auth-purple font-medium grid grid-cols-2 gap-4">
                <label className="flex gap-1 flex-col overflow-hidden">
                  Price
                  <input
                    readOnly
                    type="text"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    defaultValue={
                      product.item_price ? product.item_price : "No Price"
                    }
                  />
                </label>
                <label className="flex gap-1 flex-col overflow-hidden">
                  Weight
                  <input
                    readOnly
                    type="text"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    defaultValue={
                      product.item_weight ? product.item_weight : "No Weight"
                    }
                  />
                </label>
                <label className="flex gap-1 flex-col overflow-hidden">
                  Hs Code
                  <input
                    readOnly
                    type="text"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    defaultValue={
                      product.original_hs_code
                        ? product.original_hs_code
                        : "No HS Code"
                    }
                  />
                </label>
                <label className="flex gap-1 flex-col text-nowrap truncate w-full overflow-hidden">
                  Edited Hs Code
                  <input
                    readOnly
                    type="text"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    defaultValue={
                      product.original_hs_code
                        ? product.original_hs_code
                        : "No Edited HS Code"
                    }
                  />
                </label>
              </div>
              {/* actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => console.log(product)}
                  className="bg-green-500 text-white p-2 rounded-full px-2 py-1"
                >
                  Accept
                </button>
                <button
                  onClick={() => console.log(product)}
                  className="bg-gray-500 text-white p-2 rounded-full px-2 py-1"
                >
                  Skip
                </button>
                <button
                  onClick={() => console.log(product)}
                  className="bg-yellow-500 text-white p-2 rounded-full px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => console.log(product)}
                  className="bg-red-500 text-white p-2 rounded-full px-2 py-1"
                >
                  Flag Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auditing;
