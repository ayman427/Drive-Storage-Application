import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white py-24 px-6 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Secure & Accessible <br /> Cloud Storage
          </motion.h1>
          <p className="text-lg md:text-2xl mb-8 max-w-md text-gray-200">
            Experience seamless and secure cloud storage solutions with
            high-speed access and easy file management.
          </p>
          <Link to="/drive">
            <Button className="bg-white text-indigo-800 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <motion.img
            src="src/assets/server-cloud-data-storage-concept-solution-web-database-backup-computer-infrastructure-technology-cloudscape-digital-online-service-global-network.png"
            alt="Cloud Storage"
            className="w-full h-auto rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
