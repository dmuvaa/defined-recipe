"use client"

import Header from '../../components/Header';
import Footer from '../../components/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100">
        <section className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">About Us</h1>
          <p className="text-lg text-gray-700 mb-8">
            We are a team of developers and food enthusiasts who are shifting from the old recipe model
            where recipes are prepared without considering what the user has at hand. Our AI Recipe Generator
            ensures you can create delicious meals with the ingredients you already have.
          </p>
          <div className="flex justify-center">
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
              <img src="/team.jpg" alt="Our Team" className="rounded-lg mb-4 w-full h-auto"/>
              <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
              <p className="text-gray-700">
                To revolutionize how people approach cooking by making it more accessible, sustainable, and enjoyable.
                Our AI-driven platform helps reduce food waste and inspires creativity in the kitchen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
