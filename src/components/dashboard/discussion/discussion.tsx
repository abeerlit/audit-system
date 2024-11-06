import React, { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import image from "@/images/mock-photo.jpg";
import DiscussionIcon from "@/components/icons/dashboard/discussion-icon";
import { useSelector } from "react-redux";
import { AuditingItems } from "@/store/slices/auditingItemsSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "@/store/slices/userSlice";
import moment from "moment";
import FlagIcon from '@/components/icons/dashboard/auditing/flag-icon';
import SkipIcon from '@/components/icons/dashboard/auditing/skip-icon';
import EditIcon from '@/components/icons/dashboard/users/edit-icon';
import AcceptIcon from '@/components/icons/dashboard/auditing/accept-icon';
import Modal from "@/components/modal";
import CheckIcon from "@/components/icons/dashboard/auditing/check-icon";
const Discussion = () => {
  const [activeDiscussion, setActiveDiscussion] = useState<number | null>(null);
  const [auditAction, setAuditAction] = useState<'new' | 'accept' | 'skip' | 'edit' | 'flag'>('new');

  const [newComment, setNewComment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auditingData: AuditingItems[] = useSelector(
    (state: RootState) => state.auditingItems
  );
  const [comments, setComments] = useState<any[]>([]);
  const userData: User = useSelector(
    (state: RootState) => state.user
  );

  const handlePostComment = async () => {
    try {
      toast.loading("Posting comment...");
      setNewComment("");
      const response = await axios.post(`/api/user/chapterItems/comments`, {
        user_id: userData.id,
        chapter_item_id: activeDiscussion,
        content: newComment,
      });
      toast.dismiss();
      console.log("handlePostComment response", response.data.comment);
      setComments((prev) => [...prev, response.data.comment]);
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  const handleAuditAction = async (
    action: 'new' | 'accept' | 'skip' | 'edit' | 'flag',
    productId: number
  ) => {
    try {
      toast.loading('Adding Action...');
      const response = await axios.post(
        `/api/user/chapterItems?itemId=${productId}`,
        {
          action: action,
        }
      );
      toast.dismiss();
      console.log('handleAuditAction response', response.data.comment);
      setAuditAction(action)
      // toast.success('Action updated successfully');
      setIsModalOpen(true);
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Something went wrong!');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };
  const fetchComments = async () => {
    try {
      toast.loading("Fetching comments...");
      const response = await axios.get(`/api/user/chapterItems/comments?chapter_item_id=${activeDiscussion}`);
      console.log("fetchComments response", response.data.comments);
      setComments(response.data.comments);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (activeDiscussion) {
      fetchComments();
    }
  }, [activeDiscussion]);

  if (auditingData[0]?.id == -1 || auditingData.length === 0) {
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
            <Fragment key={product.id}>
              <tr className="border-t">
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
                    onClick={() => {
                      if (activeDiscussion === product.id) {
                        setActiveDiscussion(null);
                        setNewComment("");
                      } else if (activeDiscussion !== product.id) {
                        setActiveDiscussion(product.id);
                        setComments([]);
                        setNewComment("");
                      }
                    }}
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
                            onClick={() =>
                              handleAuditAction('accept', product.id)
                            }
                            className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            <AcceptIcon />
                            <p> Accept</p>
                          </li>
                          <li
                            onClick={() =>
                              handleAuditAction('skip', product.id)
                            }
                            className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            <SkipIcon />
                            <p>Skip</p>
                          </li>
                          <li
                            onClick={() =>
                              handleAuditAction('edit', product.id)
                            }
                            className=" flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            <EditIcon />
                            <p>Edit</p>
                          </li>
                          <li
                            onClick={() =>
                              handleAuditAction('flag', product.id)
                            }
                            className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                          >
                            <FlagIcon />
                            <p>Flag Item</p>
                          </li>
                        </ul>
                    </div>
                  </button>
                </td>
              </tr>
              {activeDiscussion === product.id && (
                <tr key={product.item_price} className="border-t">
                  <td colSpan={7} className="p-4 bg-[#f3f3f3]">
                    {comments?.length === 0 ? (
                      <div className="text-center text-auth-purple">
                        No comments yet
                      </div>
                    ) : (
                      comments?.map((comment, index) => (
                        <div
                          key={index}
                          className="mb-2 bg-white p-2 px-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="capitalize">
                              {comment.user.firstName} {comment.user.lastName} {comment?.user?.id == userData.id ? "- (You)" : ""}
                            </strong>
                            <span className="text-sm text-gray-500">
                              {moment(comment.createdAt).format('DD/MM/YYYY')}
                            </span>
                          </div>
                          <p className="text-sm mt-2 font-normal">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    )}
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
                        disabled={!newComment.trim()}
                        className={`bg-light-blue text-white px-4 py-2 rounded-full
                        ${!newComment.trim() ? "opacity-50" : ""}`}
                        onClick={handlePostComment}
                      >
                        Post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
         <div className='flex flex-col items-center justify-center gap-4 mx-[100px] my-[20px]'>

          <CheckIcon/>
          <h1 className='text-[24px] font-bold text-[#2B3674] text-center'>Your Item {auditAction}ed <br /> Successfully! </h1>
         </div>
        </Modal>
    </div>
  );
};

export default Discussion;
