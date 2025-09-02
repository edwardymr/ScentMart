import { type QuizPreferences, type Perfume } from '../types';

// La URL del endpoint de la API REST de Gemini. No la cambies.
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

// Lee la API Key una sola vez desde las variables de entorno de Vite.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// El esquema de la función se define como un objeto JSON simple.
const recommendationTools = [{
  functionDeclarations: [{
    name: "get_perfume_recommendations",
    description: "Provides a list of recommended perfume names based on user preferences.",
    parameters: {
      type: "OBJECT",
      properties: {
        recommendations: {
          type: "ARRAY",
          items: { type: "STRING", description: "El nombre exacto de un perfume." }
        }
      },
      required: ["recommendations"]
    }
  }]
}];

export const findMyScent = async (preferences: QuizPreferences, availablePerfumes: Perfume[]): Promise<string[]> => {
  // Comprobamos la clave justo antes de hacer la llamada.
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY environment variable not set.");
    // Lanzamos un error claro si la clave no está configurada.
    throw new Error("La configuración de la API no está completa.");
  }

  const perfumeDataForPrompt = availablePerfumes.map(p => ({
    name: p.name,
    description: p.details?.description,
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
    2.  Compara estas preferencias con la descripción y familia olfativa de cada perfume.
    3.  Selecciona un máximo de 3 perfumes que mejor se adapten.
    4.  Llama a la función 'get_perfume_recommendations' con un array JSON que contenga los nombres exactos de los perfumes seleccionados.
  `;

  try {
    // Usamos 'fetch', la herramienta estándar del navegador para hacer llamadas a APIs.
    const response = await fetch(`${API_URL}${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // El cuerpo de la solicitud se estructura como un objeto JSON.
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: recommendationTools,
      }),
    });

    if (!response.ok) {
      // Si la respuesta de la API es un error (ej. 400, 500), lo capturamos.
      const errorData = await response.json();
      console.error("Error from Gemini API:", errorData);
      throw new Error(`Error de la API: ${errorData.error.message}`);
    }

    const data = await response.json();
    
    // Extraemos la llamada a la función de la estructura de respuesta de la API REST.
    const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (functionCall?.name === 'get_perfume_recommendations' && functionCall.args.recommendations) {
      const recommendations = functionCall.args.recommendations as string[];
      if (Array.isArray(recommendations)) {
        return recommendations;
      }
    }

    console.error("La respuesta de la API no llamó a la función esperada o el formato era inválido.", data);
    return []; // Devuelve un array vacío si no se encuentra una recomendación válida.

  } catch (error) {
    console.error("Error en findMyScent durante la llamada fetch:", error);
    return []; // Devuelve un array vacío en caso de cualquier error.
  }
};