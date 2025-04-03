"use client";
import { motion, Variants } from "framer-motion";
import Button from "@/components/Button";
import { FILTERS_FOR_LESSONS } from "@/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface PocoCards {
  image: string;
  name: string;
  id: string;
  species: string;
  gender: string;
  api: string;
}

const cardVariants: Variants = {
  offscreen: {
    rotate: -15,
    scale: 0.9,
    opacity: 0.5,
  },
  onscreen: {
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.9,
    },
  },
};

const Cards = ({ image, name, id, species, gender }: PocoCards) => {
  return (
    <div
      className="flex flex-col w-full min-h-[500px] bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 border-[6px] border-yellow-200 \
      rounded-xl p-6 font-semibold text-white shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
      id={name[0].toUpperCase()}
    >
      <div className="text-xl mb-2 text-center">{name}</div>
      <div className="text-center mb-4">Species: {species}</div>
      <div className="mx-auto">
        <Image
          src={image}
          alt={`${name}'s image`}
          width={300}
          height={200}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex justify-between mt-4">
        <span>Gender:</span>
        <span>{gender}</span>
      </div>
      <div className="border-b-2 border-blue-400 my-4" />
      <div className="flex justify-between items-center">
        <span>ID: {id}</span>
        <Button title="Select" variant="white" />
      </div>
    </div>
  );
};

const Tutors = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const handleLetterClick = (letter: string) => {
    const match = data.find((character) => character.name[0].toUpperCase() === letter);
    if (match) {
      setMessage("");
      const element = document.getElementById(letter);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setMessage(`No characters found starting with '${letter}'`);
    }
  };

  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/rick/api/character");
        const jsonData = await response.json();
        const limited = jsonData.results.slice(0, 10);
        setData(limited);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="karakterler" className="container mx-auto px-4 md:px-20 my-10">
      {/* A-Z Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className="w-10 h-10 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-700 transition"
          >
            {letter}
          </button>
        ))}
      </div>

      {message && (
        <div className="text-center text-red-500 font-medium mb-6">
          {message}
        </div>
      )}

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Karakter İsmi Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[300px] h-12 px-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-400 shadow-md"
        />
      </div>

      {/* Cards */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
          {filteredData.map((character) => (
            <motion.div
              key={character.id}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={cardVariants}
              className="relative"
            >
              <Cards
                image={character.image}
                name={character.name}
                id={character.id}
                species={character.species}
                gender={character.gender}
                api={character.url}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-lg font-semibold mt-10">
          😢 No characters found...
        </div>
      )}
    </section>
  );
};

export default Tutors;
