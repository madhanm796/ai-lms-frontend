import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import firstPlace from '../../assets/images/1st.png';
import secondPlace from '../../assets/images/2nd.png';
import thirdPlace from '../../assets/images/3rd.png';

const PodiumItem = ({ user, rank }) => {

  if (!user) return <div className="w-24"></div>; // Placeholder if missing

  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  user = {
    ...user, image: (
      isFirst ? firstPlace :
        isSecond ? secondPlace :
          isThird ? thirdPlace :
            undefined)
  };

  return (
    <div
      title={user.full_name}
      className={`
        flex flex-col items-center justify-center  rounded-xl w-40 text-black
        ${isFirst
          ? 'bg-linear-to-b from-purple-500 to-fuchsia-600 text-white h-40'
          : isSecond ? 'bg-white border-2 border-gray-50 text-gray-800 h-40' : 'bg-white text-gray-800 h-40 border-2 border-gray-50'
        }
      `}
    >

      {/* Crown Icon (Only for 1st) */}

      {/* Avatar */}
      <div className="relative mb-2">
        <img
          src={user.image}
          alt={user.full_name}
          className={`
            rounded-lg object-cover 
            ${isFirst ? 'w-12 h-12 ' : 'w-12 h-12 '}
          `}
        />
        {/* Rank Badge */}
        <div className={`
          absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
          ${isFirst ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}
        `}>
          {rank}
        </div>
      </div>

      {/* Text Info */}
      <h3 className={`font-bold mt-2 text-[0.8rem]`}>
        {user.full_name?.length < 10 ? user.full_name : user.full_name.substring(0, 10)}
      </h3>
      <p className={`text-xs font-medium ${!isFirst ? 'text-black' : 'text-white'}`}>
        {user.xp} points
      </p>
    </div>
  );
};

const LeaderboardPodium = ({ topUsers }) => {
  // Ensure we have 3 slots filled
  const users = [...topUsers, null, null, null];

  return (
    <div className="w-full max-w-md mx-auto mt-12 px-4">
      {/* Flex container aligned to bottom (items-end) 
        This ensures 2nd & 3rd place sit at the bottom, while 1st place stands tall.
      */}
      <div className="flex items-end justify-center gap-4">

        {/* Rank 2 (Left) */}
        <div className="w-1/3 flex justify-center">
          <PodiumItem user={users[1]} rank={2} />
        </div>

        {/* Rank 1 (Center) */}
        {/* -mb-6 pulls it down slightly or allows overlap if needed, 
            but here height difference does the work */}
        <div className="w-1/3 flex justify-center pb-8">
          <PodiumItem user={users[0]} rank={1} />
        </div>

        {/* Rank 3 (Right) */}
        <div className="w-1/3 flex justify-center">
          <PodiumItem user={users[2]} rank={3} />
        </div>

      </div>
    </div>
  );
};

export default LeaderboardPodium;