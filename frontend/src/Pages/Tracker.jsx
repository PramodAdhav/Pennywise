import { Button } from '../components/ui/TrackButton';

export default function Track() {
  return (
    <div className="bg-[#d1cfc0] min-h-screen text-black pt-0 px-10">
      
      {/* Message Section */}
      <div className="px-8">
        <blockquote className="instrument-serif-regular mt-1 border-l-2 border-black pl-4 text-2xl text-left">
          The amount entered is considered in rupees by default. If no date is selected, today’s date will be 
          used automatically. Please choose an appropriate category from the dropdown menu before submitting your 
          expense.
        </blockquote>
      </div>

      {/* Input Card */}
      <div className="max-w-full h-[100px] bg-[#1f1f1f] text-white rounded-lg flex items-center px-4 space-x-4 shadow-md mt-8">
        
        {/* Date Picker */}
        <input
          type="date"
          className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none"
        />

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Amount"
          className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none w-52"
        />

        {/* Category Dropdown */}
        <select
          className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none w-52"
        >
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>

        {/* Note Input */}
        <input
          type="text"
          placeholder="Note"
          className="bg-[#2b2b2b] text-white px-3 py-3 rounded-md outline-none flex-1"
        />
      </div>
      <Button className="w-40 text-black font-bold instrument-serif-regular text-2xl mt-9 hover:bg-[brown] transition-all">Submit</Button>
    </div>
  );
}
