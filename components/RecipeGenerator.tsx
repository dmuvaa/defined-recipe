"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

interface Ingredient {
  name: string;
  quantity: string;
}

const RecipeGenerator = () => {
  const [meal, setMeal] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '' }]);
  const [numRecipes, setNumRecipes] = useState(1);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [freeAttempts, setFreeAttempts] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login'); // Redirect to login page if no session is found
      } else {
        // Fetch user subscription status and free attempts from the server or session
        setFreeAttempts(session.user.freeAttempts || 0);
        setIsSubscribed(session.user.isSubscribed || false);
      }
    };

    fetchSession();
  }, [router]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field as keyof Ingredient] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Redirect to login if no session
    const session = await getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    if (!isSubscribed && freeAttempts >= 1) {
      router.push('/subscribe');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meal, ingredients, numRecipes }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setRecipes([]);
      } else {
        setRecipes(data.recipes);
        if (!isSubscribed) {
          setFreeAttempts(freeAttempts + 1); // Update free attempts
        }
      }
    } catch (error: any) {
      setError('An error occurred while generating recipes.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Best Recipe Generator</h1>
        <p className="text-lg text-gray-600">Enter your meal and ingredients to get delicious recipes generated for you!</p>
      </header>

      <main className="flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Meal:</label>
            <input
              type="text"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              placeholder="Enter the meal you want to prepare"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients:</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  required
                  className="flex-grow px-3 py-2 border rounded mr-2"
                />
                <input
                  type="text"
                  placeholder="Quantity (optional)"
                  value={ingredient.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  className="flex-grow px-3 py-2 border rounded mr-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Add Ingredient
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Recipes (1-3):</label>
            <input
              type="number"
              value={numRecipes}
              onChange={(e) => setNumRecipes(Number(e.target.value))}
              min="1"
              max="3"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded">
            Generate Recipes
          </button>
        </form>

        {loading && <p className="text-blue-500 mt-4">Generating Recipe, Kindly Wait...</p>}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {recipes.length > 0 && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Generated Recipes</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white p-4 mb-4 rounded shadow-md">
                <h3 className="text-xl font-bold mb-2">Recipe {index + 1}</h3>
                <pre className="text-gray-700 whitespace-pre-wrap">{recipe}</pre>
              </div>
            ))}
          </div>
        )}

        {!isSubscribed && freeAttempts >= 1 && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Continue</h2>
            <p className="text-lg text-gray-600 mb-4">
              You have exhausted your free recipe generation attempts. Subscribe to access unlimited recipes.
            </p>
            <button onClick={() => router.push('/subscribe')} className="bg-green-500 text-white px-3 py-2 rounded">
              Subscribe
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecipeGenerator;
