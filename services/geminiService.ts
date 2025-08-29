import { GoogleGenAI, FunctionDeclaration } from "@google/genai";
import { QuizPreferences, Perfume } from '../types';

// Define una variable para el cliente de la IA, pero no la inicialices aún.
let genAI: GoogleGenAI | null = null;

// Función para inicializar el cliente SÓLO cuando se necesita.
const initializeGenAI = () => {
  if (genAI) {
    return genAI;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY environment variable not set.");
    // No lances un error que rompa todo, simplemente maneja el fallo.
    throw new Error("La configuración de la API no está completa.");
  }

  genAI = new GoogleGenAI({ apiKey });
  return genAI;
};

// ... tu schema recommendationSchema va aquí ...
const recommendationSchema: FunctionDeclaration = { /* ... */ };

export const findMyScent = async (preferences: QuizPreferences, availablePerfumes: Perfume[]): Promise<string[]> => {
  try {
    // Inicializa el cliente justo antes de usarlo.
    const client = initializeGenAI(); 

    // ... el resto de tu lógica de prompt y llamada a la API va aquí ...
    // usando 'client' en lugar de 'genAI'
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ functionDeclarations: [recommendेशनSchema] }]
    });
    // ...etc.

    // Devuelve una respuesta de prueba por ahora mientras depuramos
    console.log("Llamando a la API con las preferencias:", preferences);
    return Promise.resolve(["D'Orsay", "Nitro", "You"]);

  } catch (error) {
    console.error("Error en findMyScent:", error);
    return [];
  }
};