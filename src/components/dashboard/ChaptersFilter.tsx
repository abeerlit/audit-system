import React from 'react'
import DropdownIcon from '../icons/dashboard/auditing/dropdown-icon'
const ChaptersFilter = ( selectedChapters: any, setSelectedChapters: any, chapterNames: any) => {

console.log(chapterNames, 'chapterNames');

   
    return (
        <div className="flex justify-end mb-4 ">
            <button
                type="button"
                className="max-w-[200px] whitespace-nowrap px-3 py-2 ms-auto flex items-center font-semibold rounded-full  bg-white text-auth-purple group relative"
            >

                <span className="text-sm mr-8">{selectedChapters?.chapter_name?.length > 20
                    ? selectedChapters?.chapter_name.substring(0, 20) + '...'
                    : selectedChapters?.chapter_name?.charAt(0).toUpperCase() + selectedChapters?.chapter_name?.slice(1)}</span>
                <div>

                    <DropdownIcon />
                </div>
                <div className="max-w-[200px] absolute z-10 top-12 left-0 w-full bg-[#ececec] font-normal rounded-xl overflow-scroll shadow-md hidden group-focus:block">

                    {chapterNames?.map((chapter: any) => (
                        <div
                            key={chapter.id}
                            onClick={() => setSelectedChapters(chapter)}
                            className="py-1 px-4 hover:bg-white cursor-pointer text-nowrap text-start"
                        >
                            {chapter?.chapter_name || chapter?.chapterName}
                        </div>
                    ))}
                </div>
            </button>
        </div>
    )
}

export default ChaptersFilter