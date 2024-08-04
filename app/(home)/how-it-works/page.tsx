"use client"
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HowItWorks = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100">
        <section className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">How It Works</h1>
          <p className="text-lg text-gray-700 mb-8">
            Discover how our AI Recipe Generator helps you create delicious meals with the ingredients you have at hand. Follow these simple steps to get started!
          </p>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
              <div className="md:w-1/2 p-4">
                <h2 className="text-2xl font-bold mb-2 text-blue-600">Step 1: Enter Your Meal</h2>
                <p className="text-gray-700">
                  Start by entering the meal you want to prepare. Whether it's breakfast, lunch, dinner, or a snack, our AI is ready to help you create something amazing.
                </p>
              </div>
              <div className="md:w-1/2 p-4">
                <img src="/meal-input.jpg" alt="Meal Input" className="rounded-lg w-full h-auto"/>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
              <div className="md:w-1/2 p-4 md:order-2">
                <h2 className="text-2xl font-bold mb-2 text-green-600">Step 2: List Your Ingredients</h2>
                <p className="text-gray-700">
                  Provide the ingredients you have on hand. You can specify quantities if you like, but it's not necessary. Our AI will take what you have and suggest recipes accordingly.
                </p>
              </div>
              <div className="md:w-1/2 p-4 md:order-1">
                <img src="/ingredients.jpg" alt="Ingredients" className="rounded-lg w-full h-auto"/>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
              <div className="md:w-1/2 p-4">
                <h2 className="text-2xl font-bold mb-2 text-red-600">Step 3: Choose Number of Recipes</h2>
                <p className="text-gray-700">
                  Decide how many recipe suggestions you want. You can get up to three different recipes to choose from, giving you the flexibility to pick the one that suits your taste and mood.
                </p>
              </div>
              <div className="md:w-1/2 p-4">
                <img src="/recipe-selection.jpg" alt="Recipe Selection" className="rounded-lg w-full h-auto"/>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
              <div className="md:w-1/2 p-4 md:order-2">
                <h2 className="text-2xl font-bold mb-2 text-purple-600">Step 4: Generate and Cook</h2>
                <p className="text-gray-700">
                  Hit the generate button and let our AI work its magic. You'll get delicious recipes tailored to your ingredients. Follow the easy-to-understand instructions and enjoy your meal!
                </p>
              </div>
              <div className="md:w-1/2 p-4 md:order-1">
                <img src="/cooking.jpg" alt="Cooking" className="rounded-lg w-full h-auto"/>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
