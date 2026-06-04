import { OpenAI } from 'openai';

let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  }
  return openai;
};

export const extractClaimDataFromText = async (ocrText) => {
  try {
    if (!ocrText || ocrText.trim().length === 0) {
      throw new Error('OCR text is empty');
    }

    const systemPrompt = `You are an expert insurance claim document analyst. Extract claim information from the provided OCR text. Return ONLY valid JSON without any markdown formatting or code blocks. If a field is not found in the text, use null for that field.`;

    const userPrompt = `Extract the following information from this medical document text and return ONLY a JSON object:

${ocrText}

Return a JSON object with exactly these fields (no additional fields):
{
  "patient_name": "string or null",
  "doctor_name": "string or null",
  "doctor_registration": "string or null",
  "diagnosis": "string or null",
  "medicines": ["array of strings or empty array"],
  "tests": ["array of strings or empty array"],
  "treatment_date": "YYYY-MM-DD string or null",
  "claim_amount": "number or null",
  "hospital_name": "string or null"
}`;

    const message = await getOpenAIClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    let responseText = message.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const extractedData = JSON.parse(responseText);

    // Validate required structure
    validateExtractedData(extractedData);

    return extractedData;
  } catch (error) {
    console.error('OpenAI extraction error:', error.message);
    throw new Error(`Failed to extract data: ${error.message}`);
  }
};

const validateExtractedData = (data) => {
  const requiredFields = [
    'patient_name',
    'doctor_name',
    'doctor_registration',
    'diagnosis',
    'medicines',
    'tests',
    'treatment_date',
    'claim_amount',
    'hospital_name'
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required field in extracted data: ${field}`);
    }
  }

  if (!Array.isArray(data.medicines)) {
    throw new Error('medicines must be an array');
  }

  if (!Array.isArray(data.tests)) {
    throw new Error('tests must be an array');
  }

  if (data.claim_amount !== null && typeof data.claim_amount !== 'number') {
    throw new Error('claim_amount must be a number');
  }
};

export default {
  extractClaimDataFromText
};
