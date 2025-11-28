// FoodWise AI Service - Expert Templates
class FoodWiseAI {
    constructor() {
        this.apiKey = AI_CONFIG.API_KEY;
        this.apiUrl = AI_CONFIG.API_URL;
    }

    // 1️⃣ FOOD QUANTITY PREDICTION
    async predictFoodQuantity(formData) {
        const prompt = `You are an expert event food quantity planner with 20+ years of catering experience. 
Your job is to calculate the exact quantity of food needed for an event based on limited user inputs. 
Always give:
- Total food quantity required
- Dish-wise breakdown for starters, main course, desserts
- Quantity in kg/liters/pieces
- Minimal wastage and high accuracy
- A short explanation for the user

Avoid unnecessary text. Stay practical and industry-specific.

USER PAYLOAD:
Event Details:
- Event Type: ${formData.eventType}
- Meal Type: ${formData.mealType}
- Number of Guests: ${formData.guestCount}
- Cuisine Type: ${formData.cuisineType}
- Veg / Non-Veg Ratio: ${formData.vegNonVeg}
- Menu Summary: ${formData.menuSummary}
- Serving Style: ${formData.servingStyle}
- Expected Attendance Rate: ${formData.attendanceRate}%

MODEL OUTPUT FORMAT:
Give me the response in the following JSON format:

{
  "summary": "Short summary here",
  "total_food_required": "X kg total approx",
  "dish_wise_prediction": {
      "starters": [
          {"item": "Veg Starter 1", "quantity": "X kg"},
          {"item": "Non Veg Starter 1", "quantity": "Y kg"}
      ],
      "main_course": [
          {"item": "Main Dish 1", "quantity": "X kg"},
          {"item": "Main Dish 2", "quantity": "Y kg"}
      ],
      "desserts": [
          {"item": "Dessert 1", "quantity": "X liters/kg"}
      ]
  },
  "notes": "Any assumptions or tips here"
}`;

        return await this.callAI(prompt);
    }

    // 2️⃣ RECIPE GENERATOR
    async generateSmartRecipe(formData) {
        const prompt = `You are a professional chef specializing in leftover-based cooking and food waste reduction. 
Your job is to create tasty, safe, easy-to-follow recipes using the ingredients the user has.
Always:
- Maximize leftover usage
- Keep food safety in mind (based on cooked age)
- Keep instructions simple and practical
- Give alternatives if needed

Output must never be generic.

USER PAYLOAD:
Ingredients Available: ${formData.ingredientList}
State of Food (Raw/Cooked): ${formData.foodState}
Cuisine Preference: ${formData.cuisinePreference}
Diet Type: ${formData.dietType}
Servings Needed: ${formData.servingsNeeded}
Time Available: ${formData.timeAvailable} minutes

MODEL OUTPUT FORMAT:
Provide the answer in the following JSON output:

{
  "recipe_name": "Name here",
  "servings": ${formData.servingsNeeded},
  "ingredients_needed": [
      {"item": "...", "quantity": "..."}
  ],
  "steps": [
      "Step 1...",
      "Step 2...",
      "Step 3..."
  ],
  "leftover_usage_percentage": "X%",
  "alternatives": [
      "Alternative 1",
      "Alternative 2"
  ],
  "tips": "Food safety + chef tips"
}`;

        return await this.callAI(prompt);
    }

    // 3️⃣ FOOD WASTE ADVICE
    async getFoodWasteAdvice(formData) {
        const prompt = `You are a food waste expert for FoodWise India. Provide personalized, actionable advice about reducing food waste. 
Focus on practical, implementable solutions based on the user's specific situation.

USER CONTEXT:
- Food Waste Challenge: ${formData.wasteChallenge}
- User Role: ${formData.userRole}
- Kitchen Scale: ${formData.kitchenScale}
- Commonly Wasted Foods: ${formData.wastedFoods}
- Budget Level: ${formData.budgetLevel}

RESPONSE REQUIREMENTS:
RESPONSE REQUIREMENTS:
- Provide 3-5 specific, actionable strategies
- Include cost-effective solutions based on budget if necessary
- Consider Indian context and available resources
- Address the specific wasted foods mentioned
- Include storage tips and prevention methods if needed
- Keep it practical and easy to implement
- Limit the response to about 150–350 words. Be concise and avoid long paragraphs.


Format the response in clear, bullet-point style with emojis for better readability.`;

        return await this.callAI(prompt);
    }

    // CORE API CALL
// CORE API CALL
    // CORE API CALL (Groq · Llama)
    async callAI(prompt) {
        try {
            console.log('🤖 Sending request to Groq Llama...');

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",

                    messages: [
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
                throw new Error('Invalid API response format');
            }

            return data.choices[0].message.content;

        } catch (error) {
            console.error('🤖 AI Service Error:', error);
            return `🚫 AI service is currently unavailable. Please try again later.\n\nError: ${error.message}`;
        }
    }



    // Parse JSON response safely
    parseJSONResponse(responseText) {
        try {
            // Extract JSON from response if it's wrapped in text
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(responseText);
        } catch (error) {
            console.warn('Failed to parse JSON, returning raw text');
            return { raw_response: responseText };
        }
    }
}

// Create global instance
const foodWiseAI = new FoodWiseAI();