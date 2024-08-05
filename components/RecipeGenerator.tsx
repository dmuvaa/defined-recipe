"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Ingredient {
  name: string;
  quantity: string;
}

interface User {
  id: string;
  freeAttempts: number;
  isSubscribed: boolean;
}

const RecipeGenerator = () => {
  const [meal, setMeal] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '' }]);
  const [numRecipes, setNumRecipes] = useState(1);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [freeAttempts, setFreeAttempts] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect to login page if no user is found
      } else {
        // Fetch user subscription status and free attempts
        const { data, error } = await supabase
          .from('users')
          .select('freeAttempts, isSubscribed')
          .eq('id', user.id)
          .single();

        if (error) {
          setError('Failed to fetch user data.');
        } else if (data) {
          setFreeAttempts(data.freeAttempts);
          setIsSubscribed(data.isSubscribed);
        }
      }
    };

    fetchUserData();
  }, [router, supabase]);

  const handleInputChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateAttempts = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError || !user) {
        console.error('Failed to retrieve user:', userError?.message);
        setError('Failed to retrieve user. Please try again later.');
        return;
      }
  
      const { error } = await supabase
        .from('users')
        .update({ freeAttempts: freeAttempts - 1 })
        .eq('id', user.id);
  
      if (error) {
        console.error('Failed to update attempts:', error.message);
        setError('Failed to update attempts. Please try again later.');
      } else {
        setFreeAttempts(freeAttempts - 1);
      }
    } catch (error: any) {
      console.error('Error updating attempts:', error.message);
      setError('Failed to update attempts. Please try again later.');
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSubscribed && freeAttempts <= 0) {
      setError('You have no free attempts left. Please subscribe to continue.');
      return;
    }

    setLoading(true);
    setError(null);
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

        // Attempt to update the free attempts
        if (!isSubscribed) {
          await updateAttempts();
        }
      }
    } catch (error: any) {
      console.error('An error occurred while generating recipes:', error.message);
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
        <p className="text-lg text-gray-600">
          Enter your meal and ingredients to get delicious recipes generated for you!
        </p>
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

        {!isSubscribed && freeAttempts <= 0 && (
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
