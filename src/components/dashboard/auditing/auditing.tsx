import CardViewIcon from "@/components/icons/dashboard/auditing/cardview-icon";
import TableViewIcon from "@/components/icons/dashboard/auditing/tableview-icon";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import image from "@/images/mock-photo.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  weight: number;
  hsCode: string;
  image: StaticImageData;
}

const products: Product[] = [
  {
    id: "1",
    name: "Potty (Leslie Patricelli board books)",
    price: 93,
    weight: 93,
    hsCode: "930300",
    image,
  },
  {
    id: "2",
    name: "Goodnight Moon",
    price: 150,
    weight: 120,
    hsCode: "940300",
    image,
  },
  {
    id: "3",
    name: "Where the Wild Things Are",
    price: 200,
    weight: 130,
    hsCode: "950300",
    image,
  },
  {
    id: "4",
    name: "The Very Hungry Caterpillar",
    price: 120,
    weight: 80,
    hsCode: "960300",
    image,
  },
  {
    id: "5",
    name: "Brown Bear, Brown Bear, What Do You See?",
    price: 100,
    weight: 75,
    hsCode: "970300",
    image,
  },
  {
    id: "6",
    name: "The Cat in the Hat",
    price: 180,
    weight: 95,
    hsCode: "980300",
    image,
  },
  {
    id: "7",
    name: "Green Eggs and Ham",
    price: 170,
    weight: 110,
    hsCode: "990300",
    image,
  },
  {
    id: "8",
    name: "Goodnight, Goodnight, Construction Site",
    price: 140,
    weight: 90,
    hsCode: "100300",
    image,
  },
  {
    id: "9",
    name: "Guess How Much I Love You",
    price: 130,
    weight: 85,
    hsCode: "101300",
    image,
  },
  {
    id: "10",
    name: "The Tale of Peter Rabbit",
    price: 160,
    weight: 100,
    hsCode: "102300",
    image,
  },
];

const Auditing = () => {
  const [view, setView] = useState<"table" | "card">("card");

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button
          type="button"
          className="px-3 py-1 ms-auto flex items-center font-semibold rounded-full border bg-white text-auth-purple group relative"
        >
          {view === "table" ? (
            <>
              <TableViewIcon className="mr-2 w-4 h-4" />
              <span>Table View</span>
              <span className="ms-2">&#x25BC;</span>
            </>
          ) : (
            <>
              <CardViewIcon className="mr-2 w-4 h-4" />
              <span>Card View</span>
              <span className="ms-2">&#x25BC;</span>
            </>
          )}
          <div className="absolute -mt-1 z-10 top-10 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-hidden shadow-md hidden group-focus:block">
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100 border-t">
                  <td className="p-4 text-nowrap">{product.name}</td>
                  <td className="p-4 text-nowrap">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="min-w-40 h-20 rounded-xl"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="p-4 text-nowrap">{product.price}</td>
                  <td className="p-4 text-nowrap">{product.weight}</td>
                  <td className="p-4 text-nowrap">{product.hsCode}</td>
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
          {products.map((product) => (
            <div key={product.id} className="p-4 bg-white rounded-3xl">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-2xl"
                width={300}
                height={300}
              />
              <h2 className="text-auth-purple text-xl text-nowrap truncate w-full pt-4 font-bold">
                {product.name}
              </h2>
              {/* values */}
              <div className="mt-8 w-full text-auth-purple font-medium grid grid-cols-2 gap-4">
                <label
                  htmlFor="price"
                  className="flex gap-1 flex-col overflow-hidden"
                >
                  Price
                  <input
                    type="text"
                    id="price"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    value={product.price}
                  />
                </label>
                <label
                  htmlFor="weight"
                  className="flex gap-1 flex-col overflow-hidden"
                >
                  Weight
                  <input
                    type="text"
                    id="weight"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    value={product.weight}
                  />
                </label>
                <label
                  htmlFor="hsCode"
                  className="flex gap-1 flex-col overflow-hidden"
                >
                  Hs Code
                  <input
                    type="text"
                    id="hsCode"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    value={product.hsCode}
                  />
                </label>
                <label
                  htmlFor="EditedHsCode"
                  className="flex gap-1 flex-col text-nowrap truncate w-full overflow-hidden"
                >
                  Edited Hs Code
                  <input
                    type="text"
                    id="EditedHsCode"
                    className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                    value={940367}
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
