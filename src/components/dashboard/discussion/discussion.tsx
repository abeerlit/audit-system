import React, { useState } from "react";
import Image from "next/image";
import image from "@/images/mock-photo.jpg";
import DiscussionIcon from "@/components/icons/dashboard/discussion-icon";
import { useSelector } from "react-redux";
import { AuditingItems } from "@/store/slices/auditingItemsSlice";
import { RootState } from "@/store/store";

const Discussion = () => {
  const [activeDiscussion, setActiveDiscussion] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const auditingData: AuditingItems[] = useSelector(
    (state: RootState) => state.auditingItems
  );

  if (!auditingData.length) {
    return (
      <div className="text-center text-auth-purple text-xl italic leading-[100px]">
        Nothing to show
      </div>
    );
  }

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
          {auditingData.map((product) => (
            <>
              <tr key={product.id} className="border-t">
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
                        : "No Image"
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
                <td className="p-4 text-nowrap">
                  <button
                    type="button"
                    className={
                      "hover:bg-[#F3F3F3] rounded-full p-2 " +
                      (activeDiscussion === product.id ? "bg-[#F3F3F3]" : "")
                    }
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
                <tr key={product.item_price} className="border-t">
                  <td colSpan={7} className="p-4 bg-[#f3f3f3]">
                    {[].map((discussion, index) => (
                      <div
                        key={index}
                        className="mb-2 bg-white p-2 px-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <strong>{discussion}</strong>
                          <span className="text-sm text-gray-500">
                            {discussion}
                          </span>
                        </div>
                        <p className="text-sm mt-2 font-normal">
                          {discussion}
                        </p>
                      </div>
                    ))}
                    <div className="mt-4 flex gap-2 border-2 px-2 py-1 rounded-lg focus-within:border-blue-500">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value.trim())}
                        placeholder="Add a comment"
                        className="w-full bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        className="bg-light-blue text-white px-4 py-2 rounded-full"
                        onClick={() => {
                          if (newComment.trim()) {
                            // Array.push({
                            //   author: "You (Admin)",
                            //   message: newComment,
                            //   date: new Date().toLocaleDateString(),
                            // });
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
