import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import image from "@/images/mock-photo.jpg";
import DiscussionIcon from "@/components/icons/dashboard/discussion-icon";

interface Product {
  id: string;
  name: string;
  price: number;
  weight: number;
  hsCode: string;
  image: StaticImageData;
  discussions: { author: string; message: string; date: string }[];
}

const products: Product[] = [
  {
    id: "1",
    name: "Potty (Leslie Patricelli board books)",
    price: 93,
    weight: 93,
    hsCode: "930300",
    image,
    discussions: [
      {
        author: "Ralph Edwards (Broker)",
        message: "In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.",
        date: "Aug 19, 2021",
      },
    ],
  },
  {
    id: "2",
    name: "Goodnight Moon",
    price: 150,
    weight: 120,
    hsCode: "940300",
    image,
    discussions: [],
  },
  {
    id: "3",
    name: "Where the Wild Things Are",
    price: 200,
    weight: 130,
    hsCode: "950300",
    image,
    discussions: [],
  },
  {
    id: "4",
    name: "The Very Hungry Caterpillar",
    price: 120,
    weight: 80,
    hsCode: "960300",
    image,
    discussions: [],
  },
  {
    id: "5",
    name: "Brown Bear, Brown Bear, What Do You See?",
    price: 100,
    weight: 75,
    hsCode: "970300",
    image,
    discussions: [],
  },
  {
    id: "6",
    name: "The Cat in the Hat",
    price: 180,
    weight: 95,
    hsCode: "980300",
    image,
    discussions: [],
  },
  {
    id: "7",
    name: "Green Eggs and Ham",
    price: 170,
    weight: 110,
    hsCode: "990300",
    image,
    discussions: [],
  },
  {
    id: "8",
    name: "Goodnight, Goodnight, Construction Site",
    price: 140,
    weight: 90,
    hsCode: "100300",
    image,
    discussions: [],
  },
  {
    id: "9",
    name: "Guess How Much I Love You",
    price: 130,
    weight: 85,
    hsCode: "101300",
    image,
    discussions: [],
  },
  {
    id: "10",
    name: "The Tale of Peter Rabbit",
    price: 160,
    weight: 100,
    hsCode: "102300",
    image,
    discussions: [],
  },
];

const Discussion = () => {
  const [activeDiscussion, setActiveDiscussion] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  return (
    <div className="overflow-auto rounded-2xl text-gray-600">
      <table className="bg-white table-auto w-full">
        <thead className="bg-light-blue text-white">
          <tr>
            <th className="p-4 text-left text-nowrap">Description</th>
            <th className="p-4 text-left text-nowrap">Image</th>
            <th className="p-4 text-left text-nowrap">Price</th>
            <th className="p-4 text-left text-nowrap">Weight</th>
            <th className="p-4 text-left text-nowrap">HS Code</th>
            <th className="p-4 text-left text-nowrap">Discussion</th>
            <th className="p-4 text-left text-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <>
              <tr key={product.id} className="border-t">
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
                <td className="p-4 text-nowrap">
                  <div className="border rounded-full px-4 py-1">
                    {product.hsCode}
                  </div>
                </td>
                <td className="p-4 text-nowrap">
                  <button
                    type="button"
                    className={"hover:bg-[#F3F3F3] rounded-full p-2 " + (activeDiscussion === product.id ? "bg-[#F3F3F3]" : "")}
                    onClick={() =>
                      setActiveDiscussion(
                        activeDiscussion === product.id ? null : product.id
                      )
                    }
                  >
                    <DiscussionIcon className="w-6 h-6" /> 
                    {/* {product.discussions.length} */}
                  </button>
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
              {activeDiscussion === product.id && (
                <tr key={product.name} className="border-t">
                  <td colSpan={7} className="p-4 bg-[#f3f3f3]">
                    {product.discussions.map((discussion, index) => (
                      <div key={index} className="mb-2 bg-white p-2 px-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <strong>{discussion.author}</strong> -{" "}
                          <span className="text-sm text-gray-500">
                            {discussion.date}
                          </span>
                        </div>
                        <p className="text-sm mt-2 font-normal">{discussion.message}</p>
                      </div>
                    ))}
                    <div className="mt-4 flex gap-2 border-2 px-2 py-1 rounded-lg focus-within:border-blue-500">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        className="bg-light-blue text-white px-4 py-2 rounded-full"
                        onClick={() => {
                          if (newComment.trim()) {
                            product.discussions.push({
                              author: "You (Admin)",
                              message: newComment,
                              date: new Date().toLocaleDateString(),
                            });
                            setNewComment("");
                          }
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Discussion;
