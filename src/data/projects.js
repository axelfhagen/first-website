/** Shown in "Selected work" on the home page, in this order. */
export const projects = [
  {
    id: 'ais',
    title: { en: 'AIS Forecaster', no: 'AIS-prognoser' },
    description: {
      en: 'Predicting the positions of cargo ships from AIS data.',
      no: 'Predikerer posisjonen til lasteskip ved hjelp av AIS-data.',
    },
    tech: ['Python', 'scikit-learn', 'pandas'],
    url: 'https://github.com/axelfhagen/AIS-forecast',
  },
  {
    id: 'plant',
    title: { en: 'Plant Health Classifier', no: 'Plantehelse-klassifisering' },
    description: {
      en: 'A CNN that tells healthy plants from sick ones.',
      no: 'Et CNN som skiller friske planter fra syke.',
    },
    tech: ['Python', 'TensorFlow', 'Kaggle'],
    url: 'https://github.com/axelfhagen/CNN-plant-health-classifier',
  },
  {
    id: 'lstm',
    title: { en: 'LSTM Time Series', no: 'LSTM-tidsserier' },
    description: {
      en: 'Forecasting future values with recurrent neural networks.',
      no: 'Prognoser for fremtidige verdier med rekurrente nevrale nett.',
    },
    tech: ['Python', 'TensorFlow', 'NumPy'],
    url: 'https://github.com/axelfhagen/LSTM-timeseries-forecasting',
  },
  {
    id: 'website',
    title: { en: 'This website', no: 'Denne nettsiden' },
    description: {
      en: 'Portfolio and photo log, with a build-time image pipeline.',
      no: 'Portefølje og fotologg, med bildebehandling ved bygging.',
    },
    tech: ['React', 'Vite', 'sharp'],
    url: 'https://github.com/axelfhagen/first-website',
  },
];
