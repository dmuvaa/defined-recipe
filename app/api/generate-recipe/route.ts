// pages/api/generate-recipe.ts
import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Ingredient {
  name: string;
  quantity: string;
}

interface RequestBody {
  meal: string;
  ingredients: Ingredient[];
  numRecipes: number;
}

export async function POST(req: NextRequest) {
  const { meal, ingredients, numRecipes }: RequestBody = await req.json();

  const ingredientList = ingredients.map(i => `${i.quantity ? i.quantity + ' of ' : ''}${i.name}`).join(', ');
  const prompt = `I have the following ingredients: ${ingredientList}. Suggest ${numRecipes} recipes I can make with them.`;

  console.log('Requesting recipes with prompt:', prompt);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4o',
      max_tokens: 1000 * numRecipes,
    });

    console.log('API response:', completion);

    const recipes = completion.choices.map(choice => choice.message.content?.trim());

    return NextResponse.json({ recipes });
  } catch (error: any) {
    console.error('Recipe generation API error:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
