import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaGlobe, FaUsers, FaPalette, FaLandmark } from "react-icons/fa";

const cultureItems = [
  { icon: <FaGlobe />, title: "Diversity", description: "Embracing a variety of backgrounds and perspectives." },
  { icon: <FaUsers />, title: "Community", description: "Fostering connections and meaningful relationships." },
  { icon: <FaPalette />, title: "Art & Expression", description: "Encouraging creativity and artistic endeavors." },
  { icon: <FaLandmark />, title: "Heritage", description: "Honoring traditions and historical roots." }
];

const CultureSection = () => {
  return (
    <section className="py-10 bg-gray-100 text-center">
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Culture
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {cultureItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="p-6 rounded-2xl shadow-lg bg-white flex flex-col items-center">
              <div className="text-4xl text-blue-500 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          Learn More
        </Button>
      </motion.div>
    </section>
  );
};

export default CultureSection;