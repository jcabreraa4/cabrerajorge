export const chefs = ['OpenAI', 'Google', 'Mistral'];

export const models = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    chef: 'OpenAI',
    chefSlug: 'openai',
    providers: ['openai', 'azure'],
    useTools: true,
    webSearch: false
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    chef: 'Google',
    chefSlug: 'google',
    providers: ['google'],
    useTools: false,
    webSearch: true
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large Latest',
    chef: 'Mistral',
    chefSlug: 'mistral',
    providers: ['mistral', 'azure'],
    useTools: true,
    webSearch: false
  },
  {
    id: 'magistral-medium-2506',
    name: 'Mistral Thinking',
    chef: 'Mistral',
    chefSlug: 'mistral',
    providers: ['mistral', 'azure'],
    useTools: true,
    webSearch: false
  }
] as const;

export type ModelId = (typeof models)[number]['id'];
