const SearchBar = () => {
  return (
    <div className="
      flex items-center gap-2 py-[1px] px-[2px]
      border-2 border-gray-300 rounded-xl 
      bg-white transition-all duration-300
      hover:border-blue-500 hover:shadow-md
      focus-within:border-blue-500 focus-within:shadow-md
    ">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-blue-500"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
        />
      </svg>

      <input 
        type="text" 
        placeholder="Search from table" 
        className="
          flex-1 border-none bg-transparent outline-none text-sm
          text-gray-700 placeholder-gray-400 
          focus:placeholder-gray-300
        "
      />
    </div>
  )
}

export default SearchBar;
