"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InterviewCard from "@/components/ui/ui/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.actions";

export default function Page() {
  const [user, setUser] = useState(null);
  const [userInterviews, setUserInterviews] = useState([]);
  const [latestInterviews, setLatestInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getCurrentUser();
      console.log('Fetched User Data:', userData); // Check user data here
  
      if (!userData) {
        router.push("/sign"); // Redirect if not authenticated
        return;
      }
  
      setUser(userData);
  
      // Fetch interviews concurrently
      const [interviews, latest] = await Promise.all([
        getInterviewsByUserId(userData.id),
        getLatestInterviews({ userId: userData.id }),
      ]);
  
      setUserInterviews(interviews);
      setLatestInterviews(latest);
      setLoading(false);
    };
  
    fetchData();
  }, [router]);

  return (
    <>
       <section className="flex flex-col gap-6">
       <div>
        <h2>Your Interviews</h2>
      </div>
        <div className="interviews-section">
          {userInterviews.length ? (
            <>
              <div className="flex flex-wrap gap-4">
                {userInterviews.map((interview) => (
                  <InterviewCard {...interview} key={interview.id} />
                ))}
              </div>
            </>
          ) : (
            <p>You haven't taken any interviews yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2>New Interviews</h2>
        </div>
        <></>
        <div className="flex flex-wrap gap-4 justify-start">
          {latestInterviews.length ? (
            latestInterviews.map((interview) => <InterviewCard {...interview} key={interview.id} />)
          ) : (
            <p>There are no new interviews available.</p>
          )}
        </div>
      </section>
    </>
  );
}
