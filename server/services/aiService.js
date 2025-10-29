const { Configuration, OpenAIApi } = require('openai');

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_KEY;
  if (!apiKey) {
    return null;
  }
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
};

const sampleCommentary = [
  'A tense battle in midfield sets the tempo early on.',
  'What a strike! The crowd erupts as the ball hits the top corner.',
  'The defense is under immense pressure as the attacks keep coming.',
  'A tactical masterclass on display from both managers today.',
  'The captain rallies the team with an inspiring display of leadership.'
];

const generateCommentary = async (context) => {
  const openai = getOpenAIClient();
  if (!openai) {
    return sampleCommentary.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a football commentator who provides energetic match summaries.'
        },
        {
          role: 'user',
          content: `Provide a short list of highlight phrases for the following match context: ${context}`
        }
      ],
      max_tokens: 120
    });

    const text = completion.choices?.[0]?.message?.content || '';
    return text.split(/\n|-/).map((line) => line.trim()).filter(Boolean).slice(0, 5);
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return sampleCommentary.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
};

module.exports = {
  generateCommentary
};
