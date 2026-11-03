/** Shown under "Projects" on the home page, in this order. */
export const projects = [
  {
    id: 'ais',
    title: 'AIS Forecaster',
    description: {
      en: 'Predicting the position of cargo ships using AIS data.',
      no: 'Predikerer posisjonen til lasteskip ved hjelp av AIS-data.',
    },
    tech: 'Python, scikit-learn, pandas',
    url: 'https://github.com/axelfhagen/AIS-forecast',
  },
  {
    id: 'plant',
    title: 'Plant Classifier',
    description: {
      en: 'Classifying healthy and unhealthy plants with computer vision.',
      no: 'Klassifiserer friske og syke planter med computer vision.',
    },
    tech: 'Python, TensorFlow, Kaggle',
    url: 'https://github.com/axelfhagen/CNN-plant-health-classifier',
  },
  {
    id: 'lstm',
    title: 'LSTM Timeseries',
    description: {
      en: 'Predicting future values with deep learning.',
      no: 'Predikerer fremtidige verdier med dyp læring.',
    },
    tech: 'Python, TensorFlow, NumPy',
    url: 'https://github.com/axelfhagen/LSTM-timeseries-forecasting',
  },
  {
    id: 'website',
    title: 'This website',
    description: {
      en: 'Portfolio and plog. The photos are resized at build time so they load fast.',
      no: 'Portefølje og plog. Bildene skaleres ned når siden bygges, så de laster raskt.',
    },
    tech: 'React, Vite, sharp',
    url: 'https://github.com/axelfhagen/first-website',
  },
];
