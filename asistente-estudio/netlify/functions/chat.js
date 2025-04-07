const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { mensaje } = JSON.parse(event.body);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Sos un asistente académico experto. Tu tarea es entender el problema académico del usuario, detectar la materia y nivel educativo, y generar un plan de estudio profesional y real. Si falta información, hacé preguntas como: ¿Qué materia es? ¿Estás en secundaria o universidad?",
        },
        {
          role: "user",
          content: mensaje,
        },
      ],
    });

    const respuesta = completion.data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta }),
    };
  } catch (error) {
    console.error("Error en función chat:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al contactar con OpenAI." }),
    };
  }
};