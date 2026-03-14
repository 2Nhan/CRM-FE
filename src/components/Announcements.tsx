const Announcements = () => {
  return (
    <div className='bg-white rounded-md p-4'>
      {/* HEADER  */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-600">Announcements</h1>
        <span className="text-xs text-gray-300">view all</span>
      </div>
      {/* ANNOUNCEMENTS CONTAINER  */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="rounded-md p-4 bg-lamaSkyLight">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs rounded-md bg-white py-1 px-1 text-gray-400">2025-01-01</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
        <div className="rounded-md p-4 bg-lamaPurpleLight">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs rounded-md bg-white py-1 px-1 text-gray-400">2025-01-01</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
        <div className="rounded-md p-4 bg-lamaYellowLight">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs rounded-md bg-white py-1 px-1 text-gray-400">2025-01-01</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
      </div>
    </div>
  )
}

export default Announcements