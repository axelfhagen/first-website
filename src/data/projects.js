/**
 * Shown under "Projects" on the home page, in this order (a 2×2 grid).
 * Keep `description` to a sentence or two. `stat` is optional and only for numbers we actually measured.
 */
export const projects = [
  {
    id: 'ais',
    title: 'AIS Forecaster',
    context: { en: 'NTNU · 2024', no: 'NTNU · 2024' },
    description: {
      en: 'Where will a cargo ship be in five days? Group Kaggle project on AIS tracks from 689 vessels.',
      no: 'Hvor er et lasteskip om fem dager? Kaggle-prosjekt i gruppe, med AIS-spor fra 689 skip.',
    },
    tech: 'Python, LightGBM, pandas',
    url: 'https://github.com/axelfhagen/AIS-forecast',
  },
  {
    id: 'plant',
    title: 'Plant Classifier',
    context: { en: 'PoliMi · 2023', no: 'PoliMi · 2023' },
    description: {
      en: 'Healthy or sick, from a 96×96 photo. Step one was deleting all the pictures of Shrek from the dataset.',
      no: 'Frisk eller syk, ut fra et bilde på 96×96 piksler. Første steg var å slette alle bildene av Shrek fra datasettet.',
    },
    stat: { value: '81%', label: { en: 'accuracy', no: 'treffsikkerhet' } },
    tech: 'Python, TensorFlow',
    url: 'https://github.com/axelfhagen/CNN-plant-health-classifier',
  },
  {
    id: 'lstm',
    title: 'LSTM Timeseries',
    context: { en: 'PoliMi · 2023', no: 'PoliMi · 2023' },
    description: {
      en: 'Forecasting the next 18 values of 48,000 time series with deep learning.',
      no: 'Forutsier de neste 18 verdiene i 48 000 tidsserier med dyp læring.',
    },
    stat: { value: '−52%', label: { en: 'error vs. baseline', no: 'feil mot baseline' } },
    tech: 'Python, TensorFlow',
    url: 'https://github.com/axelfhagen/LSTM-timeseries-forecasting',
  },
  {
    id: 'website',
    title: 'This website',
    context: { en: 'Ongoing', no: 'Pågår' },
    description: {
      en: 'Portfolio and plog, with a photo pipeline and the WebGL blobs in the background.',
      no: 'Portefølje og plog, med en bildepipeline og WebGL-klattene i bakgrunnen.',
    },
    tech: 'React, Vite, WebGL',
    url: 'https://github.com/axelfhagen/first-website',
  },
];
