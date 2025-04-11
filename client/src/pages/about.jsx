import React from "react";
import Title from "../components/Partial/Title";
import { assets } from "../Assets/ObjFile";

function About() {
  return (
    <div>
      <div className="text-3xl text-center pt-8 ">
        <Title
          text1={"About Numisora – "}
          text2={"Your Trusted Online Coin Shop"}
        />
        <br /> <br />
        <div className="flex-1 h-[1px] bg-gray-300" />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.aboutus}
          alt="about us img"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <b className="text-gray-800">
            Preserving History, One Coin at a Time
          </b>
          <p>
            {/* TODO: text here */}
            Welcome to Numisora, your premier destination for rare and
            collectible coins with numismatic value. Whether you're a passionate
            collector, an investor, or someone looking to explore the
            fascinating world of historic currency, our carefully curated
            selection offers something special for every enthusiast.
          </p>
          <p>
            {/* TODO: text here */}
            With a keen focus on authenticity, quality, and historical
            significance, we provide a seamless shopping experience where every
            coin tells a story.
          </p>
          <b className="text-gray-800">Our business</b>
          <p>
            {/* TODO: text here */}
            We specialize in coins dating back to the 1700s and beyond, offering
            historical and investment-grade pieces that have stood the test of
            time. Each coin in our collection is professionally authenticated
            and graded, ensuring that you receive only genuine, high-quality
            pieces.
          </p>
        </div>
      </div>
      <hr /> <br />
      <div className="text-3xl py-4 flex items-center space-x-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
        <div className="flex-1 h-[1px] bg-gray-300" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 mb-20">
        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Authenticity Guaranteed:
          </h3>
          <p className="text-gray-600">
            Every coin in our collection is verified for authenticity, ensuring
            you receive genuine, high-quality pieces
          </p>
        </div>

        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Exclusive Selection:
          </h3>
          <p className="text-gray-600">
            We specialize in coins minted after the 1700s, offering rare finds
            that hold both historical and investment value.
          </p>
        </div>

        <div className="p-20">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Expert Guidance:
          </h3>
          <p className="text-gray-600">
            Our team of coin specialists is here to help you build or expand
            your collection with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
