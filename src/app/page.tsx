"use client"; // To make it a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action"; // Ensure this is a client-side function
import { motion } from "framer-motion";
import { TextLight } from "@/components/ui/text-light";

const MeetAumi = () => {
  const [user, setUser] = useState(null); // Track user authentication state
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        router.push("/"); // Ensure navigation logic is not blocking hooks
      }
    };
    checkUser();
  }, [router]);

  return (
    <>
      <section className="flex flex-col justify-center items-center -mt-20">
          <TextLight text="AUMI" duration={6}/>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }}
            className="text-lg -mt-40 text-center font-extrabold"
          >
            AI-POWERED INTERVIEW COACH
          </motion.p>

        <section>
        <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                    className="text-lg mt-4 text-center font-light"
                  >
                    Practice interviews in real-time & receive instant feedback
                  </motion.p>
        </section>
              
       
<section className="mt-8">
  <motion.button
    className="w-fit bg-black text-white rounded-full font-bold px-5 cursor-pointer min-h-10 transition-all duration-300 animate-glowing"
    style={{
      animation: "glowing 5s ease-in-out infinite",
    }}
    initial={{ opacity: 0, y: 20 }} // Initial state
    animate={{ opacity: 1, y: 0 }} // Final state
    transition={{ duration: 1, ease: "easeOut", delay: 0 }} // Transition properties
  >
    <Link href="/interviewnosign">Ask Aumi</Link>
  </motion.button>
</section>


      </section>
    </>
  );
};

export default MeetAumi;
