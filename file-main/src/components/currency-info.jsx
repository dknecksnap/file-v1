import React, { useState, useEffect } from 'react';

// Mapping of currency codes to Wikipedia page titles
const currencyNameMap = {
  AUD: 'Australian_dollar',
  BGN: 'Bulgarian_lev',
  BRL: 'Brazilian_real',
  CAD: 'Canadian_dollar',
  CHF: 'Swiss_franc',
  CNY: 'Renminbi',
  CZK: 'Czech_koruna',
  DKK: 'Danish_krone',
  EUR: 'Euro',
  GBP: 'Pound_sterling',
  HKD: 'Hong_Kong_dollar',
  HRK: 'Croatian_kuna',
  HUF: 'Hungarian_forint',
  IDR: 'Indonesian_rupiah',
  ILS: 'Israeli_new_shekel',
  INR: 'Indian_rupee',
  ISK: 'Icelandic_króna',
  JPY: 'Japanese_yen',
  KRW: 'South_Korean_won',
  MXN: 'Mexican_peso',
  MYR: 'Malaysian_ringgit',
  NOK: 'Norwegian_krone',
  NZD: 'New_Zealand_dollar',
  PHP: 'Philippine_peso',
  PLN: 'Polish_złoty',
  RON: 'Romanian_leu',
  RUB: 'Russian_ruble',
  SEK: 'Swedish_krona',
  SGD: 'Singapore_dollar',
  THB: 'Thai_baht',
  TRY: 'Turkish_lira',
  USD: 'United_States_dollar',
  ZAR: 'South_African_rand',
};

const CurrencyInfo = ({ currencyCode }) => {
  const [currencyInfo, setCurrencyInfo] = useState('');

  useEffect(() => {
    const fetchCurrencyInfo = async () => {
      try {
        // Use the currency code to get the full currency name from the mapping
        const fullCurrencyName = currencyNameMap[currencyCode] || currencyCode;

        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${fullCurrencyName}&origin=*`
        );
        const data = await response.json();
        // Extract the page content from the response
        const pageId = Object.keys(data.query.pages)[0];
        const extract = data.query.pages[pageId].extract;
        setCurrencyInfo(extract);
      } catch (error) {
        console.error('Error fetching currency information:', error);
      }
    };

    if (currencyCode) {
      fetchCurrencyInfo();
    }
  }, [currencyCode]);

  return (
    <div>
      <h3>About {currencyCode}</h3>
      <p dangerouslySetInnerHTML={{ __html: currencyInfo }} />
    </div>
  );
};

export default CurrencyInfo;
