
import React from 'react';
import { motion } from 'framer-motion';
import AboutContainer from './home/about/AboutContainer';

const About = () => {
  return (
    <motion.section
      id="about"
      className="py-24 bg-elvis-dark text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AboutContainer />
    </motion.section>
  );
};

export default About;
