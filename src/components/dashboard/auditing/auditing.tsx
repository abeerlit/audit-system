import CardViewIcon from '@/components/icons/dashboard/auditing/cardview-icon';
import TableViewIcon from '@/components/icons/dashboard/auditing/tableview-icon';
import FlagIcon from '@/components/icons/dashboard/auditing/flag-icon';
import SkipIcon from '@/components/icons/dashboard/auditing/skip-icon';
import EditIcon from '@/components/icons/dashboard/users/edit-icon';
import AcceptIcon from '@/components/icons/dashboard/auditing/accept-icon';
import Image from 'next/image';
import {  useState, useMemo } from 'react';
import image from '@/images/mock-photo.jpg';
import DropdownIcon from '@/components/icons/dashboard/auditing/dropdown-icon';
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { addAuditingItems, AuditingItems } from '@/store/slices/auditingItemsSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import Modal from '@/components/modal';
import CheckIcon from '@/components/icons/dashboard/auditing/check-icon';
import { User } from '@/store/slices/userSlice';
import ChaptersFilter from '../ChaptersFilter';
import chaptersTable from "../../../../chaptersTable.json"
const Auditing = () => {
  const url = new URL(window.location.href); // or use a string URL
  const chapterNo = url.searchParams.get('chapter_no');
  console.log(chapterNo, 'chapterNo in auditing');
  
  const dispatch = useDispatch();
  const userData: User = useSelector((state: RootState) => state.user);

  const searchTest: string = useSelector((state: RootState) => state?.auditingItems[0]?.searchTest || "");

  const [view, setView] = useState<'table' | 'card'>('card');
  const [selectedChapters, setSelectedChapters] = useState({ chapter_no: 0, chapter_name: 'All Item' });
  const [chapterNames] = useState<any[]>([{ chapter_no: 0, chapter_name: 'All Item' },...chaptersTable]);

  const [auditAction, setAuditAction] = useState<
    'new' | 'accept' | 'skip' | 'edit' | 'flag'
  >('new');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auditingData: AuditingItems[] = useSelector(
    (state: RootState) => state.auditingItems
  );

  const filteredAuditingData = useMemo(() => {
    console.log(chapterNo, 'chapterNo in params');
    
    if (chapterNo) {
      return auditingData.filter((item: any) =>
        item?.chapter_id === Number(chapterNo)
      );
    }
    if (searchTest) {
      return auditingData.filter((item: any) =>
        item.item_name.toLowerCase().includes(searchTest.toLowerCase()) ||
        item.search_sentence.toLowerCase().includes(searchTest.toLowerCase()) ||
        item.original_hs_code?.toString().includes(searchTest.toString()) ||
        item.broker_hs_code?.toString().includes(searchTest.toString()) ||
        item.expert_hs_code?.toString().includes(searchTest.toString())
      );
    }
    if (selectedChapters?.chapter_no === 0) {
      return auditingData;
    }
    return auditingData.filter(item =>
      item?.chapter_id === selectedChapters?.chapter_no
    );
  }, [auditingData, selectedChapters.chapter_no, searchTest,chapterNo]);



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
      setAuditAction(action);
      const updatedAuditingData = filteredAuditingData.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            status: action,
          };
        }
        return item;
      });
      dispatch(addAuditingItems(updatedAuditingData));
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
 
 

  return (
    <div className="">
      <div className='flex justify-end gap-4 mb-4'>

        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="px-3 py-2 ms-auto flex items-center font-semibold rounded-full border bg-white text-auth-purple group relative"
          >
            {view === 'table' ? (
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
                onClick={() => setView('table')}
                className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap"
              >
                Table View
              </div>
              <div
                onClick={() => setView('card')}
                className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap border-t border-gray-300"
              >
                Card View
              </div>
            </div>
          </button>
        </div>
        {(userData.role === "broker" || userData.role === "expert") &&
          ChaptersFilter( selectedChapters, setSelectedChapters,chapterNames )
          }

      </div>

      {filteredAuditingData.length === 0 ? (
        <div className="text-center text-auth-purple text-xl italic leading-[100px]">
          Nothing to show
        </div>
      ) : (
        <>
          {view === 'table' ? (
            <div className="overflow-auto rounded-2xl text-gray-600">
              <table className="bg-white table-auto w-full">
                <thead className="bg-light-blue text-white">
                  <tr>
                    <th className="p-4 text-left text-nowrap">Description</th>
                    <th className="p-4 text-left text-nowrap">Image</th>
                    <th className="p-4 text-left text-nowrap">Price</th>
                    <th className="p-4 text-left text-nowrap">Weight</th>
                    <th className="p-4 text-left text-nowrap">HS Code</th>
                    <th className="p-4 text-left text-nowrap">Status</th>
                    <th className="p-4 text-left text-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditingData?.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-100 border-t">
                      <td className="p-4 text-nowrap"> {product.item_name.length > 20
                        ? product.item_name.substring(0, 20) + '...'
                        : product.item_name}</td>
                      <td className="p-4 text-nowrap">
                        <Image
                          src={
                            product?.item_image?.includes('http')
                              ? product?.item_image
                              : image
                          }
                          alt={
                            product?.item_image?.includes('http')
                              ? String(product?.item_name)
                              : 'Mock Image'
                          }
                          className="min-w-40 h-20 rounded-xl border"
                          width={100}
                          height={100}
                        />
                      </td>
                      <td className="p-4 text-nowrap">
                        {product?.item_price ? product?.item_price : 'No Price'}
                      </td>
                      <td className="p-4 text-nowrap">
                        {product?.item_weight ? product?.item_weight : 'No Weight'}
                      </td>
                      <td className="p-4 text-nowrap">
                        {product?.original_hs_code
                          ? product?.original_hs_code
                          : 'No HS Code'}
                      </td>
                      <td className="p-4 text-nowrap flex  items-end ">
                        <div className={`rounded-[40px] text-[12px] font-bold text-white px-[10px] py-[4px] ${product.status === 'accept'
                          ? 'bg-green-500'
                          : product?.status === 'skip'
                            ? 'bg-gray-500'
                            : product?.status === 'edit'
                              ? 'bg-yellow-500'
                              : product?.status === 'flag'
                                ? 'bg-red-500'
                                : 'bg-[#2AB3E7]'
                          }`}>
                          {product?.status?.charAt(0).toUpperCase() + product?.status?.slice(1)}
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
                                onClick={() =>
                                  handleAuditAction('accept', product?.id)
                                }
                                className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                              >
                                <AcceptIcon />
                                <p> Accept</p>
                              </li>
                              {(userData.role == "admin" || userData.role == "broker") && (
                                <li
                                  onClick={() =>
                                    handleAuditAction('skip', product?.id)
                                  }
                                  className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                  <SkipIcon />
                                  <p>Skip</p>
                                </li>
                              )}
                              <li
                                onClick={() =>
                                  handleAuditAction('edit', product?.id)
                                }
                                className=" flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                              >
                                <EditIcon />
                                <p>Edit</p>
                              </li>
                              {(userData.role == "admin" || userData.role == "broker") && (

                                <li
                                  onClick={() =>
                                    handleAuditAction('flag', product?.id)
                                  }
                                  className="flex gap-1 items-center py-1 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                  <FlagIcon />
                                  <p>Flag Item</p>
                                </li>
                              )}
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
              {filteredAuditingData.map((product: any) => (
                <div key={product.id} className="relative p-4 bg-white rounded-3xl">
                  <Image
                    src={
                      product?.item_image?.includes('http')
                        ? product?.item_image
                        : image
                    }
                    alt={
                      product?.item_image?.includes('http')
                        ? String(product?.search_sentence)
                        : 'Mock Image'
                    }
                    className="w-full h-48 object-cover rounded-2xl border"
                    width={300}
                    height={300}
                  />
                  <p
                    className={`absolute top-[30px] left-[30px] rounded-[40px] text-[12px] font-bold text-white px-[10px] py-[4px] ${product.status === 'accept'
                      ? 'bg-green-500'
                      : product.status === 'skip'
                        ? 'bg-gray-500'
                        : product.status === 'edit'
                          ? 'bg-yellow-500'
                          : product.status === 'flag'
                            ? 'bg-red-500'
                            : 'bg-[#2AB3E7]'
                      }`}
                  >
                    {product?.status?.charAt(0).toUpperCase() + product?.status?.slice(1)}
                  </p>
                  <h2 className="text-auth-purple text-xl text-nowrap truncate w-full pt-4 font-bold">
                    {product?.item_name.length > 20
                      ? product?.item_name.substring(0, 20) + '...'
                      : product?.item_name}
                  </h2>
                  {/* values */}
                  <div className="mt-8 w-full text-auth-purple font-medium  gap-4">
                    <div className='flex justify-between items-center gap-4'>

                      <label className="flex gap-1 flex-col overflow-hidden">
                        Price
                        <input
                          readOnly
                          type="text"
                          className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                          defaultValue={
                            product?.item_price ? product?.item_price : 'No Price'
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
                            product?.item_weight ? product?.item_weight : 'No Weight'
                          }
                        />
                      </label>
                    </div>
                    <div className='flex justify-between items-center gap-4 mt-4'>

                      {userData.role == "expert" && (
                        <label className="flex gap-1 flex-col overflow-hidden">
                          Hs Code
                          <input
                            readOnly
                            type="text"
                            className="border bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                            defaultValue={
                              product?.original_hs_code
                                ? product?.original_hs_code
                                : 'No HS Code'
                            }
                          />
                        </label>)}
                      <label className="flex flex-1 gap-1  flex-col  text-nowrap   ">
                        Edited Hs Code
                        <input
                          readOnly
                          type="text"
                          className="border  bg-gray-100 focus:bg-white focus:outline-none text-gray-400 focus:text-inherit rounded-full px-2 py-1"
                          defaultValue={
                            product?.original_hs_code
                              ? product?.original_hs_code
                              : 'No Edited HS Code'
                          }
                        />
                      </label>
                    </div>
                  </div>
                  {/* actions */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAuditAction('accept', product?.id)}
                      className="bg-green-500 text-white p-2 rounded-full px-2 py-1"
                    >
                      Accept
                    </button>
                    {(userData.role == "admin" || userData.role == "broker") && (
                      <button
                        onClick={() => handleAuditAction('skip', product?.id)}
                        className="bg-gray-500 text-white p-2 rounded-full px-2 py-1"
                      >
                        Skip
                      </button>
                    )}
                    <button
                      onClick={() => handleAuditAction('edit', product?.id)}
                      className="bg-yellow-500 text-white p-2 rounded-full px-2 py-1"
                    >
                      Edit
                    </button>
                    {(userData.role == "admin" || userData.role == "broker") && (
                      <button
                        onClick={() => handleAuditAction('flag', product?.id)}
                        className="bg-red-500 text-white p-2 rounded-full px-2 py-1"
                      >
                        Flag Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col items-center justify-center gap-4 mx-[100px] my-[20px]">
          <CheckIcon />
          <h1 className="text-[24px] font-bold text-[#2B3674] text-center">
            Your Item {auditAction}ed <br /> Successfully!{' '}
          </h1>
        </div>
      </Modal>
    </div>
  );
};

export default Auditing;
