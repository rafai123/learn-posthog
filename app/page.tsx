"use client";
// import CTAButton from "@/components/CTAButton";
// import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function Home() {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  
  const utm_source = searchParams.get("utm_source")
  const utm_medium = searchParams.get("utm_medium")
  const utm_campaign = searchParams.get("utm_campaign")
  const utm_term = searchParams.get("utm_term")

  useEffect(() => {
    const trackAdVisit = () => {

      if (utm_source || utm_medium || utm_campaign || utm_term) {
        // from ad
        // posthog.register({
        //   utm_source: utm_source || "unknown",
        //   utm_medium: utm_medium || "unknown",
        //   utm_campaign: utm_campaign || "unknown",
        //   utm_term: utm_term || "unknown",
        //   visitor_type: "ad"
        // })
        // posthog.capture("Ad Visit", {
          //   visitor_type: "ad"
          // })
          posthog.capture('$pageview', {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
        });
        } else {
        // from organic
        posthog.register({visitor_type: "normal"})
        posthog.capture("Normal Visit")
      }
    }

    trackAdVisit()
  }, [pathName, searchParams, utm_source, utm_medium, utm_campaign, utm_term])

  const handleCheckout = (price: number) => {
    const prompt = window.confirm(`Are you sure you want to checkout this course for $${price}?`)
    console.log(prompt)
    if (!prompt) { 
      alert("You have canceled the checkout process.")
      return false
    }

    posthog.capture('Purchase Completed', {
      revenue: price, // nominal pembelian
      utm_source: utm_source || 'unknown',
      utm_medium: utm_medium || 'unknown',
      utm_campaign: utm_campaign || 'unknown',
      utm_term: utm_term || 'unknown',
  });

  console.log('Purchase Completed', {
      revenue: price, // nominal pembelian
      utm_source: utm_source || 'unknown',
      utm_medium: utm_medium || 'unknown',
      utm_campaign: utm_campaign || 'unknown',
      utm_term: utm_term || 'unknown',
  });

    // posthog.capture("Course Purchase", {
    //   price: price,
    //   purchase_type: posthog.get_property("visitor_type") || 'normal'
    // })
    alert("Thank you for purchasing this course!")
  }

  type coursesType = {
    name: string;
    color: string;
    description: string;
    price: number;
  }[]

  const courses: coursesType = [
    {
      name: "Learn Git",
      color: "#e53e3e",
      description: "Learn Git with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 10
    },
    {
      name: "Learn TypeScript",
      color: "#4299e1",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 15
    },
    {
      name: "Learn Javascript",
      color: "#ecc94b",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 20
    },
    {
      name: "Learn PHP",
      color: "#9f7aea",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 25
    },
    {
      name: "Learn Terminal",
      color: "#000000",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 30
    },
    {
      name: "Learn React",
      color: "#4299e1",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 35
    },
    {
      name: "Learn Next.js",
      color: "#4a5568",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 40
    },
    {
      name: "Learn Tailwind",
      color: "#90cdf4",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 45
    },
    {
      name: "Learn CSS",
      color: "#63b3ed",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 50
    },
    {
      name: "Learn HTML",
      color: "#bee3f8",
      description: "Learn TypeScript with this powerful course, Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, minima.",
      price: 55
    },
  ]

  return (
    <>
      <header className="flex justify-between items-center sticky px-7 py-2 max-w-4xl mx-auto">
        <div>
          <Link href={"/"} className="font-semibold text-3xl">
            Simple Course
          </Link>
        </div>
        <div className="flex gap-5 font-semibold">
          <Link className="hover:bg-yellow-500 hover:shadow px-3 rounded py-2" href="/courses">
            Courses
          </Link>
          <Link className="hover:bg-yellow-500 hover:shadow px-3 rounded py-2" href="/about">
            About
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl mt-3 md:px-6 flex">
        <div id="wrapper-courses" className="flex flex-wrap justify-around items-center gap-4 w-full">

          {courses.map((course, index) => (
            <div key={index} className={`shadow-lg border rounded-lg w-[16rem] px-4 py-2 flex flex-col gap-3`}>
              <h1 className="font-semibold text-lg">{course.name}</h1>
              <div style={{background: course.color}} 
              className={`flex text-center items-center justify-center rounded-lg w-11/12 mx-auto h-40`}>
                <p className="text-lg text-white">this is {course.name} logo</p>
              </div>
              <p className="text-justify">{course.description}</p>
              <button onClick={() => handleCheckout(course.price)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 shadow rounded-lg">Checkout This Course ${course.price}</button>
            </div>
          ))}
          
        </div>
      </main>
    </>
  );
}
