import { useState } from "react";
import { calculateSplit } from "../components/splitLogic";
import { toast } from "sonner";

const Biller = () => {
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [members, setMembers] = useState([]);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishes, setDishes] = useState([]);
  const [totals, setTotals] = useState([]);

  const addMember = () => {
    if (!nameInput.trim()) return;
    if (members.length >= 20) return toast.error("Max 20 members.");
    setMembers([...members, nameInput.trim()]);
    setNameInput("");
  };

  const addDish = () => {
    const price = parseFloat(dishPrice);
    if (!dishName.trim() || isNaN(price) || price <= 0) return;
    setDishes([...dishes, { name: dishName.trim(), price, sharedBy: [] }]);
    setDishName("");
    setDishPrice("");
  };

  const toggleShare = (dIdx, mIdx) => {
    const updated = [...dishes];
    updated[dIdx].sharedBy = updated[dIdx].sharedBy.includes(mIdx)
      ? updated[dIdx].sharedBy.filter((i) => i !== mIdx)
      : [...updated[dIdx].sharedBy, mIdx];
    setDishes(updated);
  };

  const handleCalculate = () => {
    if (dishes.some((d) => d.sharedBy.length === 0)) {
      return toast.error("Every dish must have at least one person.");
    }
    setTotals(calculateSplit(members, dishes));
    setStep(4);
  };

  const resetApp = () => {
    setStep(1);
    setMembers([]);
    setDishes([]);
    setTotals([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-black rounded-lg shadow-md">
      <h1 className="text-2xl text-black text-center font-bold mb-4">BILL SPLITTER</h1>

      {step === 1 && (
  <div className="space-y-4">
    <h2 className="font-semibold text-black">1. ENTER NAMES</h2>
    
    <input 
      className="border border-black rounded-md text-black p-2 w-full outline-none focus:ring-0" 
      value={nameInput} 
      onChange={(e) => setNameInput(e.target.value)} 
      placeholder="Enter name" 
    />
    
    <div className="flex justify-center">
      <button 
        className="bg-black border font-bold rounded-md text-white px-6 py-2 cursor-pointer" 
        onClick={addMember}
      >
        Add
      </button>
    </div>

    <div className="flex flex-wrap gap-2">
      {members.map((m, i) => (
        <span 
          key={i} 
          className="bg-red-500 border border-black text-black font-bold px-2 py-1 rounded cursor-pointer hover:bg-red-600 transition-colors"
          onClick={() => setMembers(members.filter((_, index) => index !== i))}
        >
          {m} ✕
        </span>
      ))}
    </div>

    <div className="flex justify-center">
      {members.length >= 2 ? (
        <button 
          className="bg-green-600 border text-black px-8 py-2 rounded-md cursor-pointer" 
          onClick={() => setStep(2)}
        >
          Next
        </button>
      ) : (
        <button 
          className="bg-green-600 border rounded-md text-black px-8 py-2 cursor-pointer" 
          onClick={() => toast.error("Add at least 2 members.")}
        >
          Next
        </button>
      )}
    </div>
  </div>
)}

      {step === 2 && (
  <div className="space-y-4">
    <h2 className="font-semibold text-black">2. Add items</h2>
    
    {/* Inputs with outline-none to prevent focus glow */}
    <input 
      className="border border-black rounded-md text-black p-2 w-full outline-none focus:ring-0" 
      value={dishName} 
      onChange={(e) => setDishName(e.target.value)} 
      placeholder="Dish name" 
    />
    <input 
      className="border border-black rounded-md text-black p-2 w-full outline-none focus:ring-0" 
      type="number" 
      value={dishPrice} 
      onChange={(e) => setDishPrice(e.target.value)} 
      placeholder="Price" 
    />

    {/* Centered Add Dish button with fit-content width */}
    <div className="flex justify-center">
      <button 
        className="bg-black border font-bold rounded-md text-white px-6 py-2 w-fit cursor-pointer" 
        onClick={addDish}
      >
        Add Dish
      </button>
    </div>

    {dishes.map((d, i) => (
      <div key={i} className="text-black">
        {d.name} - ₹{d.price}
      </div>
    ))}

    {/* Centered Next button */}
    <div className="flex justify-center">
      {dishes.length > 0 && (
        <button 
          className="bg-green-600 text-white px-8 py-2 rounded-md cursor-pointer" 
          onClick={() => setStep(3)}
        >
          Next
        </button>
      )}
    </div>
  </div>
)}
      {step === 3 && (
  <div className="space-y-4">
    <h2 className="font-semibold text-black">3. Select who shared each dish</h2>
    {dishes.map((dish, dIdx) => (
      <div key={dIdx} className="border-b border-black pb-2">
        <strong className="text-black">{dish.name}</strong>
        <div className="flex gap-2 mt-2 flex-wrap">
          {members.map((member, mIdx) => (
            <div key={mIdx} onClick={() => toggleShare(dIdx, mIdx)} className={`cursor-pointer w-10 h-10 text-black rounded-full flex items-center justify-center ${dish.sharedBy.includes(mIdx) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              {member.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    ))}
    
    <div className="flex justify-center">
      <button 
        className="bg-black border rounded-md text-white px-6 py-2 cursor-pointer" 
        onClick={handleCalculate}
      >
        Calculate Split
      </button>
    </div>
  </div>
)}

      {step === 4 && (
  <div className="space-y-4">
    <h2 className="text-xl text-black font-bold text-center">Split Result</h2>
    
    <table className="w-full text-black border-collapse border border-black ">
      <thead>
        <tr className="">
          <th className="border border-black p-2">Name</th>
          <th className="border border-black p-2">Dishes had</th>
          <th className="border border-black p-2">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, mIdx) => {
          const sharedDishes = dishes
            .filter((dish) => dish.sharedBy.includes(mIdx))
            .map((dish) => dish.name)
            .join(", ");

          return (
            <tr key={mIdx}>
              <td className="border border-black p-2 text-center">{member}</td>
              <td className="border border-black p-2 text-center">{sharedDishes}</td>
              <td className="border border-black p-2 text-center">{totals[mIdx]?.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <p className="text-red-500 text-sm text-center">⚠ Take a screenshot. Data is not saved.</p>
    
    {/* Wrapped in a flex div to center the button */}
    <div className="flex justify-center">
      <button 
        className="bg-black text-white font-bold border rounded-md px-6 py-2 cursor-pointer" 
        onClick={resetApp}
      >
        Start Over
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Biller;
