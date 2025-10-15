import { TextGenerateEffect } from "@/components/ui/TextAnimation";
import { Link } from 'react-router-dom';
import FooterCard from '../Footer';
import {Button} from '../components/ui/TrackButton';
export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-[#d1cfc0] text-white pt-24 px-8">
      <h1 className="instrument-serif-regular-italic text-7xl font-bold mb-6 text-[black]">
        
        <TextGenerateEffect
  words="Find peace in tracking daily expenses"
  duration={0.3}
  staggerDelay={0.1}
  filter={true}
/>
      </h1>
      <p className="instrument-serif-regular-italic text-4xl text-[black]">
        <TextGenerateEffect
  words="Track, Visualize and much more..."
  duration={0.3}
  staggerDelay={0.1}
  filter={true}
/></p>
    <Link to="/Track">
    <Button className="w-40 text-black instrument-serif-regular text-xl mt-9">Start Tracking</Button>
    </Link>
    <FooterCard/>
      
    </div>
    </>
  );
}
