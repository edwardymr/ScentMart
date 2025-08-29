import { GoogleGenAI, FunctionDeclaration } from "@google/genai";
import { QuizPreferences, Perfume } from '../types'; // Asegúrate de que la ruta a 'types' sea correcta

// --- 1. INICIALIZACIÓN Y VALIDACIÓN DEL CLIENTE DE LA API ---

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please check your GitHub Secrets and workflow configuration.");
}

// CORRECCIÓN #1: Usa 'GoogleGenAI' en lugar de 'GoogleGenerativeAI'
const genAI = new GoogleGenAI({ apiKey });

// --- 2. DEFINICIÓN DE ESQUEMAS Y CONFIGURACIONES ---

const recommendationSchema: FunctionDeclaration = {
  name: "get_perfume_recommendations",
  description: "Provides a list of recommended perfume names based on user preferences.",
  parameters: {
    type: "OBJECT",
    properties: {
      recommendations: {
        type: "ARRAY",
        items: {
          type: "STRING",
          description: "El nombre exacto de un perfume recomendado de la lista proporcionada."
        }
      }
    },
    required: ["recommendations"]
  }
};

// --- 3. FUNCIÓN PRINCIPAL EXPORTABLE ---

export const findMyScent = async (preferences: QuizPreferences, availablePerfumes: Perfume[]): Promise<string[]> => {
  
  const perfumeDataForPrompt = availablePerfumes.map(p => ({
    name: p.name,
    description: p.details?.description,
    olfactoryNotes: p.details?.olfactoryNotes,
    olfactoryFamily: p.olfactoryFamily,
    gender: p.gender,
  }));

  const prompt = `
    Eres un experto perfumista y asesor de fragancias de lujo para "ScentMart Perfumes".
    Tu misión es analizar las preferencias de un cliente y recomendar hasta 3 perfumes de nuestro catálogo en stock que sean la combinación perfecta.

    PREFERENCIAS DEL CLIENTE:
    - Paisaje soñado: ${preferences.landscape}
    - Sensación buscada: ${preferences.sensation}
    - Momento preferido del día: ${preferences.timeOfDay}

    CATÁLOGO DE PERFUMES DISPONIBLES (en formato JSON):
    ${JSON.stringify(perfumeDataForPrompt)}

    INSTRUCCIONES:
    1.  Analiza profundamente las preferencias del cliente.
    2.  Compara estas preferencias con la descripción, notas olfativas, familia y género de cada perfume en el catálogo.
    3.  Selecciona un máximo de 3 perfumes que mejor se adapten.
    4.  Llama a la función 'get_perfume_recommendations' con un array JSON que contenga los nombres exactos (propiedad "name") de los perfumes seleccionados.
  `;

  try {
    // CORRECCIÓN #2: El resto del código ya usa la instancia 'genAI' correctamente
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        tools: [{ functionDeclarations: [recommendationSchema] }]
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    const call = result.response.functionCalls()?.[0];

    if (call?.name === 'get_perfume_recommendations' && call.args.recommendations) {
        const recommendations = call.args.recommendations;
        if (Array.isArray(recommendations) && recommendations.every(item => typeof item === 'string')) {
            return recommendations as string[];
        }
    }
    
    console.error("La respuesta de la API no llamó a la función esperada o el formato era inválido.");
    return [];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return []; 
  }
};