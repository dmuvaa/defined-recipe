"use client";

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const UseCases = () => {
    const useCases = [
      {
        title: 'Personal Cooking',
        description: 'Use the AI Recipe Generator to create meals based on what you have in your pantry. Save time and reduce food waste by making delicious recipes with the ingredients you already have. This tool can make everyday cooking easier and more enjoyable.'
      },
      {
        title: 'Restaurant Menu Creation',
        description: 'Restaurant chefs can use the AI Recipe Generator to come up with creative dishes, optimize ingredient usage, and ensure that no food goes to waste. It\'s a great tool for menu planning and special event preparations, helping to keep your offerings fresh and innovative.'
      },
      {
        title: 'Cooking Competitions',
        description: 'Participants in cooking competitions can use the AI Recipe Generator to get inspiration and create unique dishes that stand out. It helps in thinking outside the box and impressing the judges with inventive recipes.'
      },
      {
        title: 'Cookbook Writing',
        description: 'Authors and food bloggers can use the AI Recipe Generator to create diverse recipes for their cookbooks. It helps in generating ideas and ensuring a variety of dishes for their readers, making cookbook creation more efficient and fun.'
      },
      {
        title: 'Weekly Meal Planning',
        description: 'For those who like to plan their meals ahead, the AI Recipe Generator can help create meal plans based on the ingredients available. It ensures you have a balanced and varied diet throughout the week, making meal prep a breeze.'
      },
      {
        title: 'Event Catering',
        description: 'Caterers can use the AI Recipe Generator to plan menus for events, ensuring that they make the most of the ingredients they have and reduce waste. It helps in creating impressive and delicious meals for guests, enhancing the overall catering experience.'
      },
      {
        title: 'Culinary Education',
        description: 'Cooking schools and culinary students can use the AI Recipe Generator to learn about ingredient combinations and recipe creation. It\'s a great tool for experimenting and learning new cooking techniques, providing valuable educational insights.'
      }
    ];
  
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover' }}>
        <Header />
        <main className="flex-grow bg-gray-100 bg-opacity-70">
          <section className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-5xl font-bold mb-8 text-gray-800">Use Cases</h1>
            <p className="text-lg text-gray-700 mb-12">
              Discover the various ways our AI Recipe Generator can revolutionize your cooking experience. From personal meal prep to professional catering, see how our tool can make a difference in your culinary adventures.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg bg-opacity-80">
                  <h2 className="text-2xl font-bold mb-4 text-blue-800">{useCase.title}</h2>
                  <p className="text-gray-700">{useCase.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default UseCases;