import CountChart from '@/components/CountChart';
import { UserCard } from '@/components/UserCard';
import AttendanceChart from '@/components/AttendanceChart';
import FinanceChart from '@/components/FinanceChart';
import EventCalendar from '@/components/EventCalendar';
import Announcements from '@/components/Announcements';

const AdminPage = () => {
  return (
    <div className='md:flex-row flex-col p-4 gap-4 flex'>
      {/* LEFT SIDE - admin dashboard*/}
      <div className='w-full lg:w-2/3 flex-col gap-8 flex'>
        <div className="flex justify-between flex-wrap gap-4">
          <UserCard type={"student"} />
          <UserCard type={"teacher"} />
          <UserCard type={"parent"} />
          <UserCard type={"staff"} />
        </div>
        {/* MIDDLE SIDE  */}
        <div className='flex-col lg:flex-row flex gap-4'>
          {/* CHART BAR  */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          <div className='w-full lg:w-2/3 h-[450px]'> 
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM SIDE  */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT SIDE - admin dashboard*/}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage