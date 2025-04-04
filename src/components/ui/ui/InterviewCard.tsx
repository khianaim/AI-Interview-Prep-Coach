import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from '../button';
import Link from 'next/link';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.actions';

const InterviewCard = ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
  const [feedback, setFeedback] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  // Fetch feedback asynchronously using useEffect
  useEffect(() => {
    const fetchFeedback = async () => {
      if (userId && id) {
        const feedbackData = await getFeedbackByInterviewId({ interviewId: id, userId });
        setFeedback(feedbackData);
      }
    };

    fetchFeedback();
  }, [id, userId]);

  useEffect(() => {
    setImageSrc(getRandomInterviewCover());
  }, []);

  return (
    <div className="card-border w-full sm:w-[360px] min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-black">
            <p className="badge-text">{normalizedType}</p>
          </div>

          {imageSrc && ( // Only render image once state is set
            <Image 
              src={imageSrc} 
              alt="cover image" 
              width={90} 
              height={90} 
              className="rounded-full object-fit size-[70px]" 
            />
          )}

          <h3 className="mt-5 capitalize text-black">{role} Interview</h3>

          <div className="flex flex-row gap-2 mt-3 ">
            <div className="flex flex-row">
              <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
            </div>
            <p className='text-black'>{formattedDate}</p>
          </div>

          <div className="flex flex-row gap-2 items-cente ">
            <Image src="/star.svg" alt="star" width={22} height={22} />
            <p className='text-black'>{feedback?.totalScore || '---'}/100</p>
          </div>
        </div>

        <p className="line-clamp-2 -mt-5 text-black">
          {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to ace your next one."}
        </p>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

           <button
            className="w-fit bg-black text-white rounded-full font-bold px-5 cursor-pointer min-h-10 transition-all duration-300 animate-glowing"
            style={{
              animation: "glowing 1.5s ease-in-out infinite",
            }}
          >
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
              {feedback ? 'Check Feedback' : 'View Interview'}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
